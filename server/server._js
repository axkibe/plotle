/*
| The server-side repository.
|
| Authors: Axel Kittenberger
*/

/*
| Capsule
|
| (to make jshint happy)
*/
( function( ) {

"use strict";

/*
| Turn on checking on server side by default
*/
GLOBAL.CHECK = true;

if( typeof( require ) === 'undefined' )
{
	throw new Error( 'this code requires node!' );
}


/*
| Imports
*/
var
	Jools =
		require( '../shared/jools' ),

	MeshMashine =
		require( '../shared/meshmashine' ),

	meshverse =
		require( '../shared/meshverse' ),

	Path =
		require( '../shared/path' ),

	Resource =
		require( './resource' ),

	Tree =
		require( '../shared/tree' ),

	config =
		require( '../config' ),

	fs =
		require( 'fs' ),

	http =
		require( 'http' ),

	sha1 =
		require( '../shared/sha1' ),

	mongodb =
		require( 'mongodb' ),

	url =
		require( 'url' ),

	zlib =
		require( 'zlib' ),

	uglify =
		config.uglify ?
			require( 'uglify-js' ) :
			null;

/*
| Server
*/
var Server =
	function(_)
{
	// files served
	this.$resources =
		{ };

	// initializes the database
	var db =
	this.$db =
		{ };

	db.server =
		new mongodb.Server(
			config.database.host,
			config.database.port,
			{ }
		);

	db.connector =
		new mongodb.Db(
			config.database.name,
			db.server,
			{
				w :
					1
			}
		);

	// all messages
	this.$messages =
		[ ];

	// all spaces
	this.$spaces =
		{ };

	// a table of all clients waiting for an update
	this.$upsleep =
		{ };

	// next upsleepID
	this.$nextSleep =
		1;

	// next visitors ID
	this.$nextVisitor =
		1000;

	// table of all cached user credentials
	this.$users =
		{ };

	// the list where a user is present
	// user for 'entered' and 'left' messages
	this.$presences =
		{ };

	this.prepareResources(_);

	Jools.log(
		'start',
		'connecting to database',
		config.database.host + ':' + config.database.port,
		config.database.name
	);

	db.connection =
		db.connector.open(_);

	db.users =
		db.connection.collection(
			'users',
		_);

	db.spaces =
		db.connection.collection(
			'spaces',
		_);

	this.checkRepositorySchemaVersion(_);

	this.ensureMeshcraftUser(_);

	this.loadSpaces(_);

	Jools.log(
		'start',
		'starting server @ http://' +
			( config.ip || '*' ) + '/:' + config.port
	);

	var self =
		this;

	http.createServer(
		function( req, res )
		{
			self.requestListener( req, res );
		}
	).listen(
		config.port,
		config.ip,
	_);

	Jools.log(
		'start',
		'server running'
	);
};


/*
| Ensures the repository schema version fits this server.
*/
Server.prototype.checkRepositorySchemaVersion =
	function(_)
{
	Jools.log(
		'start',
		'checking repository schema version'
	);

	var global =
		this.$db.connection.collection(
			'global',
		_);

	var version =
		global.findOne(
			{
				_id :
					'version'
			},
		_);

	if( version )
	{
		if( version.version !== 4 )
		{
			throw new Error(
				'Wrong repository schema version, expected 4, got '+
				version.version
			);
		}

		return;
	}

	// otherwise initializes the database repository

	this.initRepository(_);
};

/**
| Initializes a new repository.
*/
Server.prototype.initRepository =
	function(_)
{
	Jools.log(
		'start',
		'found no repository, initializing a new one'
	);

	var initSpaces =
		[
			'meshcraft:home',
			'meshcraft:sandbox'
		];

	for(
		var s = 0, sZ = initSpaces.length;
		s < sZ;
		s++
	)
	{
		var space =
			initSpaces[ s ];

		Jools.log(
			'start',
			'  initializing space ' + space
		);

		this.$db.spaces.insert(
			{
				_id : space
			},
		_);
	}

	Jools.log(
		'start',
		'  initializing global.version'
	);

	var global =
		this.$db.connection.collection(
			'global',
		_);

	global.insert(
		{
			_id     : 'version',
			version : 4
		},
	_);
};


/*
| Ensures there is the meshcraft (root) user
*/
Server.prototype.ensureMeshcraftUser =
	function (_)
{
	Jools.log(
		'start',
		'ensuring existence of the "meshcraft" user'
	);

	var mUser =
		this.$db.users.findOne(
			{
				_id : 'meshcraft'
			},
		_);

	if( !mUser )
	{
		Jools.log(
			'start',
			'not found! (re)creating the "meshcraft" user'
		);

		var pass =
			Jools.randomPassword(12);

		mUser =
			{
				_id :
					'meshcraft',

				pass :
					Jools.passhash(pass),

				clearPass :
					pass,

				mail :
					''
			};

		this.$db.users.insert(
			mUser,
		_);
	}

	this.$users.meshcraft =
		mUser;

	Jools.log(
		'start',
		'"meshcraft" user\'s clear password is: ',
		mUser.clearPass
	);
};


/*
| loads all spaces and playbacks all changes from the database.
*/
Server.prototype.loadSpaces =
	function(_)
{
	Jools.log(
		'start',
		'loading and replaying all spaces'
	);

	var cursor =
		this.$db.spaces.find(
			{ },
			{ sort: '_id'},
		_);

	for(
		var o = cursor.nextObject(_);
		o !== null;
		o = cursor.nextObject(_)
	)
	{
		this.loadSpace(
			o._id,
		_);
	}
};


/*
| load a spaces and playbacks its changes from the database.
*/
Server.prototype.loadSpace =
	function(
		spaceName,
	_)
{
	Jools.log(
		'start',
		'loading and replaying all "' + spaceName + '"'
	);

	var space =
	this.$spaces[ spaceName ] =
		{
			$changesDB :
				this.$db.connection.collection(
					'changes:' + spaceName,
				_),

			$changes :
				[ ],

			$tree :
				meshverse.grow( 'Space' ),

			$seqZ :
				1
		};

	var cursor =
		space.$changesDB.find(
			{
				// ...
			},
			{
				sort :
					'_id'
			},
		_);

	for(
		var o = cursor.nextObject( _ );
		o !== null;
		o = cursor.nextObject( _ )
	)
	{
		if( o._id !== space.$seqZ )
		{
			throw new Error(
				'sequence mismatch'
			);
		}

		// FIXME there is something quirky, why isn't *this* a "Change"?
		var change =
			{
				cid :
					o.cid,

				chgX :
					null
			};

		if ( !Jools.isArray( o.chgX ) )
		{
			change.chgX =
				new MeshMashine.Change( o.chgX );
		}
		else
		{
			change.chgX =
				new MeshMashine.ChangeRay( o.chgX );
		}

		space.$seqZ++;

		try
		{
			space.$tree =
				change.chgX.changeTree(
					space.$tree,
					meshverse
				).tree;

		}
		catch( e )
		{
			// catch this to get a useful error message at least
			// if things go woo.

			console.log( 'Error playing back changes: ', e );

			throw e;
		}
	}
};


/*
| sends a message
*/
Server.prototype.sendMessage =
	function(
		spaceUser,
		spaceTag,
		user,
		message
	)
{
	this.$messages.push (
		{
			spaceUser :
				spaceUser,

			spaceTag :
				spaceTag,

			user :
				user,

			message :
				message
		}
	);

	var self =
		this;

	process.nextTick(
		function( )
		{
			self.wake(
				spaceUser,
				spaceTag
			);
		}
	);
};


/*
| Creates a message for a space
*/
Server.prototype.cmdMessage =
	function( cmd, _ )
{
	var spaceUser =
		cmd.spaceUser;

	var spaceTag =
		cmd.spaceTag;

	var message =
		cmd.message;

	var username =
		cmd.user;

	var passhash =
		cmd.passhash;

	if( !Jools.is( username ) )
	{
		throw Jools.reject(
			'user missing'
		);
	}

	if( !Jools.is( passhash ) )
	{
		throw Jools.reject(
			'passhash missing'
		);
	}

	if( !Jools.is( spaceUser ) )
	{
		throw Jools.reject(
			'spaceUser missing'
		);
	}

	if( !Jools.is( spaceTag ) )
	{
		throw Jools.reject(
			'spaceTag missing'
		);
	}

	if( !Jools.is( message ) )
	{
		throw Jools.reject(
			'message missing'
		);
	}

	if( this.$users[username].pass !== passhash )
	{
		throw Jools.reject(
			'invalid pass'
		);
	}

	this.sendMessage(
		spaceUser,
		spaceTag,
		username,
		message
	);

	return {
		ok : true
	};
};


/*
| Builds the shells config.js file.
| TODO move \n into join and rework generated code look-alike
*/
Server.prototype.buildShellConfig =
	function( )
{
	var cconfig = [ ];
	var k;

	cconfig.push(
		'var config = {\n',
		'\tdevel   : ', Jools.configSwitch(config.devel, 'shell'), ',\n',
		'\tmaxUndo : ', config.maxUndo, ',\n',
		'\tdebug   : {\n'
	);

	var first =
		true;

	for( k in config.debug )
	{
		var val =
			config.debug[ k ];

		if( !first )
		{
			cconfig.push(',\n');
		}
		else
		{
			first = false;
		}

		cconfig.push(
			'\t\t',
			k,
			' : ',
			Jools.isString( val ) ? "'" : '',
			val,
			Jools.isString( val ) ? "'" : ''
		);
	}

	cconfig.push(
		'\n\t},\n',
		'\tlog : {\n'
	);

	first =
		true;

	for( k in config.log )
	{
		if (!first)
		{
			cconfig.push(',\n');
		}
		else
		{
			first = false;
		}

		cconfig.push(
			'\t\t', k, ' : ',
			Jools.configSwitch(config.log[k], 'shell')
		);
	}

	cconfig.push(
		'\n\t}\n',
		'};\n'
	);

	return cconfig.join( '' );
};


/*
| Registers and prepares the resource.
| also builds the bundle for fast-loading.
*/
Server.prototype.prepareResources =
	function(_)
{
	var r;

	var rlist = [
		'media/favicon.ico',
			'mc',

		'testpad/testpad.js',
			'f',

		'testpad/iface-sym.js',
			'f',

		'shell/fonts/webfont.js',
			'mc',

		'shared/jools.js',
			'fb',

		'shared/sha1.js',
			'fb',

		'shared/meshverse.js',
			'fb',

		'shared/path.js',
			'fb',

		'shared/tree.js',
			'fb',

		'shared/sign.js',
			'fb',

		'shared/change.js',
			'fb',

		'shared/changeray.js',
			'fb',

		'shared/meshmashine.js',
			'fb',

		'shell/euclid/const.js',
			'fb',

		'shell/euclid/compass.js',
			'fb',

		'shell/euclid/point.js',
			'fb',

		'shell/euclid/rect.js',
			'fb',

		'shell/euclid/margin.js',
			'fb',

		'shell/euclid/font.js',
			'fb',

		'shell/euclid/fabric.js',
			'fb',

		'shell/euclid/measure.js',
			'fb',

		'shell/euclid/rect.js',
			'fb',

		'shell/euclid/shape.js',
			'fb',

		'shell/euclid/round-rect.js',
			'fb',

		'shell/euclid/ellipse.js',
			'fb',

		'shell/euclid/line.js',
			'fb',

		'shell/shellverse.js',
			'fb',

		'shell/fontpool.js',
			'fb',

		'shell/style.js',
			'fb',

		'shell/accent.js',
			'fb',

		'shell/theme.js',
			'fb',

		'shell/theme/maindisc.js',
			'fb',

		'shell/theme/createdisc.js',
			'fb',

		'shell/euclid/view.js',
			'fb',

		'shell/curve.js',
			'fb',

		'shell/iface.js',
			'fb',

		'shell/peer.js',
			'fb',

		'shell/stubs.js',
			'fb',

		'shell/disc/icons.js',
			'fb',

		'shell/disc/createdisc.js',
			'fb',

		'shell/disc/disc.js',
			'fb',

		'shell/disc/maindisc.js',
			'fb',

		'shell/action.js',
			'fb',

		'shell/widgets/getstyle.js',
			'fb',

		'shell/widgets/widget.js',
			'fb',

		'shell/widgets/label.js',
			'fb',

		'shell/widgets/button.js',
			'fb',

		'shell/widgets/input.js',
			'fb',

		'shell/widgets/checkbox.js',
			'fb',

		'shell/forms/form.js',
			'fb',

		'shell/forms/login.js',
			'fb',

		'shell/forms/signup.js',
			'fb',

		'shell/forms/space.js',
			'fb',

		'shell/forms/moveto.js',
			'fb',

		'shell/forms/user.js',
			'fb',

		'shell/forms/welcome.js',
			'fb',

		'shell/forms/no-access-to-space.js',
			'fb',

		'shell/forms/non-existing-space.js',
			'fb',

		'shell/visual/base.js',
			'fb',

		'shell/visual/para.js',
			'fb',

		'shell/visual/scrollbar.js',
			'fb',

		'shell/visual/doc.js',
			'fb',

		'shell/visual/item.js',
			'fb',

		'shell/visual/docitem.js',
			'fb',

		'shell/visual/note.js',
			'fb',

		'shell/visual/label.js',
			'fb',

		'shell/visual/relation.js',
			'fb',

		'shell/visual/portal.js',
			'fb',

		'shell/visual/space.js',
			'fb',

		'shell/system.js',
			'fb',

		'shell/caret.js',
			'fb',

		'shell/range.js',
			'fb',

		'shell/bridge.js',
			'fb',

		'shell/greenscreen.js',
			'fb',

		'shell/shell.js',
			'fb',

		'shell/fontloader.js',
			'fb',

		'shell/fonts/dejavu.css',
			'mc',

		'shell/fonts/dejavusans-boldoblique-webfont.eot',
			'mc',

		'shell/fonts/dejavusans-boldoblique-webfont.svg',
			'mc',

		'shell/fonts/dejavusans-boldoblique-webfont.ttf',
			'mc',

		'shell/fonts/dejavusans-boldoblique-webfont.woff',
			'mc',

		'shell/fonts/dejavusans-bold-webfont.eot',
			'mc',

		'shell/fonts/dejavusans-bold-webfont.svg',
			'mc',

		'shell/fonts/dejavusans-bold-webfont.ttf',
			'mc',

		'shell/fonts/dejavusans-bold-webfont.woff',
			'mc',

		'shell/fonts/dejavusans-oblique-webfont.eot',
			'mc',

		'shell/fonts/dejavusans-oblique-webfont.svg',
			'mc',

		'shell/fonts/dejavusans-oblique-webfont.ttf',
			'mc',

		'shell/fonts/dejavusans-oblique-webfont.woff',
			'mc',

		'shell/fonts/dejavusans-webfont.eot',
			'mc',

		'shell/fonts/dejavusans-webfont.svg',
			'mc',

		'shell/fonts/dejavusans-webfont.ttf',
			'mc',

		'shell/fonts/dejavusans-webfont.woff',
			'mc'
	];

	// ressources served in the bundle
	var bundleRessources =
		[ ];

	// creates the Ressources
	for( var a = 0, aZ = rlist.length; a < aZ; a += 2 )
	{
		r =
			new Resource(rlist[a], rlist[a + 1]);

		if( r.opts.bundle )
		{
			bundleRessources.push( r );
		}

		this.$resources[ r.path ] = r;
	}

	var path;

	Jools.log( 'start', 'preparing resources' );

	for( path in this.$resources )
	{
		r = this.$resources[path];

		if(
			r.data !== null ||
			!r.opts.memory
		)
		{
			continue;
		}

		r.data =
			fs.readFile(r.path, _);
	}

	this.$resources['favicon.ico'] =
		this.$resources['media/favicon.ico'];

	var
		cconfig =
			new Resource(
				'shell/config.js',
				'mb'
			);

	bundleRessources.unshift( cconfig );

	this.$resources[ cconfig.path ] =
		cconfig;

	cconfig.data =
		this.buildShellConfig();

	var
		// the bundle itself
		bundle =
			[ ],

		// file listing for devel.html
		devels =
			[ ];

	// loads the to be bundled files
	for( a = 0, aZ = bundleRessources.length; a < aZ; a++ )
	{
		r =
			bundleRessources[a];

		devels.push(
			'<script src="' + r.path + '" type="text/javascript"></script>'
		);

		if( r.data === null )
		{
			bundle.push(
				fs.readFile(
					r.path,
				_)
			);
		}
		else
		{
			bundle.push( r.data );
		}
	}

	bundle =
		bundle.join( '\n' );

	fs.writeFile(
		'bundle.js',
		bundle,
	_);


	// uglifies the bundle if configured so
	if( config.uglify )
	{
		var
			ast =
				uglify.parse(
					bundle,
					{
						filename :
							'bundle.js'
					}
				);

		ast.figure_out_scope( );

		var
			compressor =
				uglify.Compressor(
					{
							/*
						dead_code :
							true,
							*/

						global_defs :
						{
							'CHECK' : false
						}
					}
				),

		ast =
			ast.transform( compressor );

		ast.compute_char_frequency( );

		ast.mangle_names( );

		bundle =
			ast.print_to_string( { } );
	}

	// calculates the hash for the bundle
	var bsha1 =
		sha1.sha1hex( bundle );

	// registers the bundle as ressource
	var br = new Resource(
		'meshcraft-' + bsha1 + '.js',
		'mc'
	);

	br.data = bundle;

	this.$resources[ br.path ] =
		br;

	Jools.log( 'start', 'bundle:', bsha1 );

	// Prepends the CHECK flag after
	// the bundle has been created.
	cconfig.data =
		'var CHECK = true;\n' +
		cconfig.data;

	// the devel.html file
	if(
		config.devel === 'shell' ||
		config.devel === 'both'
	)
	{
		var devel =
			new Resource(
				'shell/devel.html',
				'm'
			);

		devel.data =
			fs.readFile(
				'shell/devel.html',
			_) + '';

		devel.data =
			devel.data.replace(
				/<!--DEVELPACK.*>/,
				devels.join( '\n' )
			);

		if( config.debug.weinre )
		{
			devel.data =
				devel.data.replace(
					/<!--WEINRE.*>/,
					'<script src="http://' +
						config.debug.weinre +
						'/target/target-script-min.js"></script>'
				);
		}

		this.$resources[ 'devel.html' ] =
			devel;
	}

	// the index.html file
	var main =
		new Resource(
			'shell/meshcraft.html',
			'm'
		);

	main.data =
		fs.readFile(
			'shell/meshcraft.html',
		_) + '';

	main.data =
		main.data.replace(
			/<!--COPACK.*>/,
			'<script src="' + br.path + '" type="text/javascript"></script>'
		);

	this.$resources[ 'meshcraft.html' ] =
	this.$resources[ 'index.html' ] =
	this.$resources[ '' ] =
		main;

	// the testpad html file
	var testpad =
		new Resource(
			'testpad/testpad.html',
			'f'
		);

	this.$resources[ 'testpad.html' ] =
		testpad;

	// prepares the zipped versions
	for( path in this.$resources )
	{
		r =
			this.$resources[path];

		if( !r.opts.memory )
		{
			continue;
		}

		r.gzip =
			zlib.gzip(
				r.data,
			_);
	}

	Jools.log( 'start', 'uncompressed bundle size is ', br.data.length );
	Jools.log( 'start', '  compressed bundle size is ', br.gzip.length );
};


/*
| Executes an alter command.
*/
Server.prototype.cmdAlter =
	function(
		cmd,
	_)
{
	var time =
		cmd.time;

	var chgX =
		cmd.chgX;

	var cid =
		cmd.cid;

	var spaceUser =
		cmd.spaceUser;

	var spaceTag =
		cmd.spaceTag;

	var username =
		cmd.user;

	var passhash =
		cmd.passhash;

	if( !Jools.is( username ) )
	{
		throw Jools.reject( 'user missing' );
	}

	if( this.$users[username].pass !== passhash )
	{
		throw Jools.reject( 'invalid pass' );
	}

	if( !Jools.is( spaceUser ) )
	{
		throw Jools.reject( 'spaceUser missing' );
	}

	if( !Jools.is( spaceTag ) )
	{
		throw Jools.reject( 'spaceTag missing' );
	}

	if(
		this.testAccess(
			username,
			spaceUser,
			spaceTag
		) !== 'rw'
	)
	{
		throw Jools.reject( 'no access' );
	}

	if( !Jools.is( time ) )
	{
		throw Jools.reject( 'time missing' );
	}

	if( !Jools.is( chgX ) )
	{
		throw Jools.reject( 'chgX missing' );
	}

	if( !Jools.is( cid ) )
	{
		throw Jools.reject( 'cid missing' );
	}

	var spaceName =
		spaceUser + ':' + spaceTag;

	var space =
		this.$spaces[ spaceName ];

	if( !Jools.is( space ) )
	{
		throw Jools.reject( 'unknown space' );
	}

	var changes =
		space.$changes;

	var seqZ =
		space.$seqZ;

	if( time === -1 )
	{
		time = seqZ;
	}

	if( !(time >= 0 && time <= seqZ) )
	{
		throw Jools.reject('invalid time');
	}

	// fits the cmd into data structures
	try {
		// FIXME
		if( Jools.isArray( chgX ) )
		{
			throw new Error('Array chgX not yet supported');
		}

		chgX = new MeshMashine.Change( chgX );

	}
	catch( err )
	{
		throw Jools.reject( 'invalid cmd: ' + err.message );
	}

	// translates the changes if not most recent
	for( var a = time; a < seqZ; a++ )
	{
		chgX = MeshMashine.tfxChgX(
			chgX,
			changes[a].chgX
		);

		if(
			chgX === null ||
			chgX.length === 0
		)
		{
			return {
				ok: true,
				chgX: chgX
			};
		}
	}

	if(
		chgX === null ||
		chgX.length === 0
	)
	{
		return {
			ok   : true,
			chgX : chgX
		};
	}

	// applies the changes
	var
		r =
			chgX.changeTree(
				space.$tree,
				meshverse
			);

	space.$tree =
		r.tree;

	chgX =
		r.chgX;

	changes[ seqZ ] =
		{
			cid  : cmd.cid,
			chgX : chgX
		};

	// saves the change(ray) in the database
	space.$changesDB.insert(
		{
			_id :
				seqZ,

			cid :
				cmd.cid,

			chgX :
				JSON.parse( JSON.stringify( chgX ) ), // FIXME why copy?

			user :
				cmd.user,

			date :
				Date.now()
		},

		function( error, count )
		{
			if( error !== null )
			{
				throw new Error( 'Database fail!' );
			}
		}
	);

	space.$seqZ++;

	var self =
		this;

	process.nextTick(
		function( )
		{
			self.wake( spaceUser, spaceTag );
		}
	);

	return {
		ok   : true,
		chgX : chgX
	};
};


/*
| Executes an auth command.
*/
Server.prototype.cmdAuth =
	function(
		cmd,
	_)
{
	if( !Jools.is( cmd.user ) )
	{
		throw Jools.reject('user missing');
	}

	if( !Jools.is( cmd.passhash ) )
	{
		throw Jools.reject('passhash missing');
	}

	var users = this.$users;

	if( cmd.user === 'visitor' )
	{
		var uid;

		do
		{
			this.$nextVisitor++;

			uid = 'visitor-' + this.$nextVisitor;
		}
		while ( users[uid]);

		users[ uid ] =
			{
				user    : uid,
				pass    : cmd.passhash,
				created : Date.now( ),
				use     : Date.now( )
			};

		return {
			ok :
				true,

			user:
				uid
		};
	}

	if( !users[cmd.user] )
	{
		var val =
			this.$db.users.findOne(
				{ _id : cmd.user},
			_);

		if( val === null )
		{
			return Jools.reject( 'Username unknown' );
		}

		users[cmd.user] =
			val;
	}

	if( users[cmd.user].pass !== cmd.passhash )
	{
		return Jools.reject('Invalid password');
	}

	return {
		ok :
			true,

		user :
			cmd.user
	};
};


/*
| Creates a new space.
*/
Server.prototype.createSpace =
	function(
		spaceUser,
		spaceTag,
	_)
{
	var spaceName =
		spaceUser + ':' + spaceTag;

	var space =
	this.$spaces[ spaceName ] =
		{
			$changesDB :
				this.$db.connection.collection( 'changes:' + spaceName, _),

			$changes :
				[ ],

			$tree :
				meshverse.grow( 'Space' ),

			$seqZ :
				1
		};


	this.$db.spaces.insert(
		{
			_id : spaceName
		},
	_);

	return space;
};


/*
| Executes a register command.
*/
Server.prototype.cmdRegister =
	function(
		cmd,
	_)
{
	var username =
		cmd.user;

	var passhash =
		cmd.passhash;

	var mail =
		cmd.mail;

	var news =
		cmd.news;

	if( !Jools.is( username ) )
	{
		return Jools.reject( 'user missing' );
	}

	if( !Jools.is( passhash ) )
	{
		return Jools.reject( 'passhash missing' );
	}

	if( !Jools.is( mail ) )
	{
		return Jools.reject( 'mail missing' );
	}

	if( !Jools.is( news ) )
	{
		return Jools.reject( 'news missing' );
	}

	if( typeof( news ) !== 'boolean' )
	{
		return Jools.reject( 'news not a boolean' );
	}

	if( username.substr( 0, 7 ) === 'visitor' )
	{
		return Jools.reject( 'Username must not start with "visitor"' );
	}

	if( username.length < 4 )
	{
		throw Jools.reject( 'Username too short, min. 4 characters' );
	}

	var user = this.$db.users.findOne( { _id : username }, _);

	if( user !== null )
	{
		return Jools.reject( 'Username already taken' );
	}

	user = {
		_id  : username,
		pass : passhash,
		mail : mail,
		news : news
	};

	this.$db.users.insert( user, _);

	this.$users[ username ] =
		user;

	this.createSpace(
		username,
		'home',
	_);

	return {
		ok :
			true,

		user :
			username
	};
};


/*
| Refreshes a users presence timeout.
*/
Server.prototype.refreshPresence =
	function(
		user,
		spaceUser,
		spaceTag
	)
{
	var pu =
		this.$presences[ user ];

	if( !pu )
	{
		pu =
		this.$presences[ user ] =
			{
				spaces : { }
			};
	}

	var spaceName =
		spaceUser + ':' + spaceTag;

	var pus =
		pu.spaces[ spaceName ];

	if( !pus )
	{
		pus =
		pu.spaces[ spaceName ] =
			{
				establish : 0,
				timerID : null
			};

		pus.timerID =
			setTimeout(
				this.expirePresence,
				5000,
				this,
				user,
				spaceUser,
				spaceTag
			);

		this.sendMessage(
			spaceUser,
			spaceTag,
			null,
			user + ' entered "' + spaceName + '"'
		);
	}
	else if( pus.references <= 0 )
	{
		if( pus.timerID !== null )
		{
			clearTimeout( pus.timerID );

			pus.timerID =
				null;
		}

		pus.timerID =
			setTimeout(
				this.expirePresence,
				5000,
				this,
				user,
				spaceUser,
				spaceTag
			);
	}
};


/*
| Establishes a longer user presence for an update that goes into sleep
*/
Server.prototype.establishPresence =
	function(
		user,
		spaceUser,
		spaceTag,
		sleepID
	)
{
	var pres =
		this.$presences;

	var pu =
		pres[ user ];

	if( !pu )
	{
		pu =
		pres[user] =
			{
				spaces :
					{ }
			};
	}

	var spaceName =
		spaceUser + ':' + spaceTag;

	var pus =
		pu.spaces[ spaceName ];

	if( !pus )
	{
		pus =
		pu.spaces[ spaceName ] =
			{
				establish :
					1,

				timerID :
					null
			};

		this.sendMessage(
			spaceUser,
			spaceTag,
			null,
			user + ' entered "' + spaceName + '"'
		);
	}
	else
	{
		if( pus.timerID !== null )
		{
			clearTimeout( pus.timerID );

			pus.timerID =
				null;
		}

		pus.establish++;
	}
};


/*
| Destablishes a longer user presence for an update that went out of sleep.
*/
Server.prototype.destablishPresence =
	function(
		user,
		spaceUser,
		spaceTag
	)
{
	var pu =
		this.$presences[ user ];

	var spaceName =
		spaceUser + ':' + spaceTag;

	var pus =
		pu.spaces[ spaceName ];

	pus.establish--;

	if( pus.establish <= 0 )
	{
		if( pus.timerID !== null )
		{
			throw new Error( 'Presence timers mixed up.' );
		}

		pus.timerID =
			setTimeout(
				this.expirePresence,
				5000,
				this,
				user,
				spaceUser,
				spaceTag
			);
	}
};


/*
| Expires a user presence with zero establishments after timeout
*/
Server.prototype.expirePresence =
	function(
		self,
		user,
		spaceUser,
		spaceTag
	)
{
	var spaceName =
		spaceUser + ':' + spaceTag;

	self.sendMessage(
		spaceUser,
		spaceTag,
		null,
		user + ' left "' + spaceName + '"'
	);

	var pu =
		self.$presences[ user ];

	if( pu.spaces[ spaceName ].establish !== 0 )
	{
		throw new Error( 'Something wrong with presences.' );
	}

	delete pu.spaces[ spaceName ];
};


/*
| Gets new changes or waits for them.
*/
Server.prototype.cmdUpdate =
	function(
		cmd,
		res,
	_)
{
	var user =
		cmd.user;

	var passhash =
		cmd.passhash;

	var spaceUser =
		cmd.spaceUser;

	var spaceTag =
		cmd.spaceTag;

	var time =
		cmd.time;

	var mseq =
		cmd.mseq;

	if( !Jools.is(user) )
	{
		throw Jools.reject( 'User missing' );
	}

	if( !Jools.is(passhash) )
	{
		throw Jools.reject( 'Passhash missing' );
	}

	if( this.$users[user].pass !== passhash )
	{
		throw Jools.reject( 'Invalid password' );
	}

	if( !Jools.is( spaceUser ) )
	{
		throw Jools.reject( 'spaceUser missing' );
	}

	if( !Jools.is( spaceTag ) )
	{
		throw Jools.reject( 'spaceTag missing' );
	}

	var
		spaceName =
			spaceUser + ':' + spaceTag,

		space =
			this.$spaces[ spaceName ];

	if( !space )
	{
		throw Jools.reject( 'Unknown space' );
	}

	if ( !( time >= 0 && time <= space.$seqZ ) )
	{
		throw Jools.reject( 'Invalid or missing time: ' + time );
	}

	if( mseq < 0 )
	{
		mseq = this.$messages.length;
	}

	if ( !(mseq <= this.$messages.length) )
	{
		throw Jools.reject(
			'Invalid or missing mseq: ' + mseq
		);
	}

	this.refreshPresence(
		user,
		spaceUser,
		spaceTag
	);

	var asw = this.conveyUpdate(
		time,
		mseq,
		spaceUser,
		spaceTag
	);

	// immediate answer?
	if(
		asw.chgs.length > 0 ||
		asw.msgs.length > 0
	)
	{
		return asw;
	}

	// if not an immediate anwwer, the request is put to sleep
	var sleepID =
		'' + this.$nextSleep++;

	var timerID =
		setTimeout(
			this.expireSleep,
			60000,
			this,
			sleepID
		);

	this.$upsleep[ sleepID ] =
		{
			user :
				user,

			time :
				time,

			mseq :
				mseq,

			timerID :
				timerID,

			res :
				res,

			spaceUser :
				spaceUser,

			spaceTag :
				spaceTag
		};

	res.sleepID =
		sleepID;

	this.establishPresence(
		user,
		spaceUser,
		spaceTag,
		sleepID
	);

	return null;

};


/*
| A sleeping update expired.
*/
Server.prototype.expireSleep =
	function(
		self,
		sleepID
	)
{
	var sleep =
		self.$upsleep[ sleepID ];

	// maybe it just had expired at the same time
	if( !sleep )
	{
		return;
	}

	var spaceName =
		sleep.spaceUser + ':' + sleep.spaceTag;

	var space =
		self.$spaces[ spaceName ];

	var seqZ =
		space.$seqZ;

	delete self.$upsleep[ sleepID ];

	//TODO call it sleep.username
	self.destablishPresence(
		sleep.user,
		sleep.spaceUser,
		sleep.spaceTag
	);

	var asw =
		{
			ok :
				true,

			time :
				sleep.time,

			timeZ :
				seqZ,

			chgs :
				null
		};

	Jools.log( 'ajax', '->', asw );

	var res = sleep.res;

	res.writeHead(
		200,
		{
			'Content-Type' :
				'application/json',

			'Cache-Control' :
				'no-cache',

			'Date' :
				new Date().toUTCString()
		}
	);

	res.end(
		JSON.stringify( asw )
	);

};


/*
| A sleeping update closed prematurely.
*/
Server.prototype.closeSleep =
	function( sleepID )
{
	var sleep = this.$upsleep[ sleepID ];

	// maybe it just had expired at the same time
	if( !sleep )
		{ return; }

	clearTimeout( sleep.timerID );

	delete this.$upsleep[ sleepID ];

	this.destablishPresence(
		sleep.user,
		sleep.spaceUser,
		sleep.spaceTag
	);
};


/*
| Returns a result for an update operation.
*/
Server.prototype.conveyUpdate =
	function(
		time,
		mseq,
		spaceUser,
		spaceTag
	)
{
	var spaceName =
		spaceUser + ':' + spaceTag;

	var space =
		this.$spaces[ spaceName ];

	var changes =
		space.$changes;

	var messages =
		this.$messages;

	var seqZ =
		space.$seqZ;

	var msgZ =
		messages.length;

	var chgA =
		[ ];

	var msgA =
		[ ];

	for( var c = time; c < seqZ; c++ )
	{
		chgA.push( changes[c] );
	}

	for( var m = mseq; m < msgZ; m++ )
	{
		if(
			messages[m].spaceUser !== spaceUser ||
			messages[m].spaceTag !== spaceTag
		)
		{
			continue;
		}

		msgA.push( messages[m] );
	}

	return {
		ok :
			true,

		time :
			time,

		timeZ :
			seqZ,

		chgs :
			chgA,

		msgs :
			msgA,

		mseq :
			mseq,

		mseqZ :
			msgZ
	};
};


/*
| Wakes up any sleeping updates and gives them data if applicatable.
*/
Server.prototype.wake =
	function(
		spaceUser,
		spaceTag
	)
{
	var sleepKeys = Object.keys( this.$upsleep );

	// FIXME cache change lists to answer the same to multiple clients.

	for(var a = 0, aZ = sleepKeys.length; a < aZ; a++)
	{
		var sKey  = sleepKeys[a];
		var sleep = this.$upsleep[sKey];

		if(
			spaceUser !== sleep.spaceUser ||
			spaceTag !== sleep.spaceTag
		)
		{
			continue;
		}

		clearTimeout( sleep.timerID );

		delete this.$upsleep[sKey];

		this.destablishPresence(
			sleep.user,
			sleep.spaceUser,
			sleep.spaceTag
		);

		var asw =
			this.conveyUpdate(
				sleep.time,
				sleep.mseq,
				sleep.spaceUser,
				sleep.spaceTag
			);

		var res =
			sleep.res;

		Jools.log('ajax', '->', asw);

		res.writeHead(200,
			{
				'Content-Type' :
					'application/json',

				'Cache-Control' :
					'no-cache',

				'Date' :
					new Date().toUTCString()
			}
		);

		res.end(JSON.stringify(asw));
	}
};


/*
| Tests if the user has access to a space.
*/
Server.prototype.testAccess =
	function(
		user,
		spaceUser,
		spaceTag
	)
{
	if(
		!Jools.isString( spaceUser ) ||
		!Jools.isString( spaceTag )
	)
	{
		return 'no';
	}

	if( spaceUser == 'meshcraft' )
	{
		switch( spaceTag )
		{
			case 'sandbox' :

				return 'rw';

			case 'home' :

				return user === config.admin ? 'rw' : 'ro';

			default :

				return 'no';
		}
	}

	if( user.substring( 0, 7 ) === 'visitor' )
	{
		return 'no';
	}

	if( user === spaceUser )
	{
		return 'rw';
	}

	return 'no';
};


/*
| Executes a get command.
*/
Server.prototype.cmdGet =
	function(
		cmd,
	_)
{
	var
		time =
			cmd.time,

		user =
			cmd.user,

		passhash =
			cmd.passhash,

		spaceUser =
			cmd.spaceUser,

		spaceTag =
			cmd.spaceTag;

	if( !Jools.is( cmd.user ) )
	{
		throw Jools.reject('user missing');
	}

	if( !Jools.is( cmd.passhash ) )
	{
		throw Jools.reject( 'passhash missing' );
	}

	if(
		!Jools.is( this.$users[ user ] ) ||
		passhash !== this.$users[ user ].pass
	)
	{
		throw Jools.reject( 'wrong user/password' );
	}

	// TODO dont call it "time"
	if( !Jools.is( cmd.time ) )
	{
		throw Jools.reject( 'time missing' );
	}

	if( !Jools.is( cmd.path ) )
	{
		throw Jools.reject( 'path missing' );
	}

	// TODO test spaceUser/Tag

	var spaceName =
		cmd.spaceUser + ':'  + cmd.spaceTag;

	var access =
		this.testAccess(
			cmd.user,
			spaceUser,
			spaceTag
		);

	if( access == 'no' )
	{
		return {
			ok :
				true,

			access :
				access,

			status :
				'no access'
		};
	}

	var space =
		this.$spaces[ spaceName ];

	if( !space )
	{
		if( !cmd.create === true )
		{
			return {
				ok :
					true,

				access :
					access,

				status :
					'nonexistent'
			};
		}
		else
		{
			space =
				this.createSpace(
					spaceUser,
					spaceTag,
				_);
		}
	}

	var
		changes =
			space.$changes,

		seqZ =
			space.$seqZ;

	if( time === -1 )
	{
		time = seqZ;
	}
	else if( !( time >= 0 && time <= seqZ ) )
	{
		throw Jools.reject( 'invalid time' );
	}

	var tree =
		space.$tree;

	// if the requested tree is not the latest, replay it backwards
	for( var a = seqZ - 1; a >= time; a-- )
	{
		var chgX =
			changes[ a ].chgX;

		for( var b = 0; b < chgX.length; b++ )
		{
			tree = chgX
				.get( b )
				.invert( )
				.changeTree(
					tree,
					meshverse
				)
				.tree;
		}
	}

	// returns the path requested
	var node;
	try
	{
		node =
			tree.getPath( new Path( cmd.path ) );
	}
	catch( err )
	{
		throw Jools.reject( 'cannot get path: ' + err.message );
	}

	return {
		ok :
			true,

		status :
			'served',

		access :
			access,

		time :
			time,

		node :
			node
	};
};


/*
| Logs and returns a web error
*/
Server.prototype.webError =
	function(
		res,
		code,
		message
	)
{
	res.writeHead(code, {
		'Content-Type' :
			'text/plain',

		'Cache-Control' :
			'no-cache',

		'Date' :
			new Date().toUTCString()
	});

	message = code+' '+message;

	Jools.log( 'web', 'error', code, message );

	res.end( message );
};


/*
| Checks if the request should be proxied
| Returns true if the proxy applies, false otherwise.
*/
Server.prototype.webRedirect =
	function(
		req,
		res
	)
{
	if( !config.redirect )
	{
		return false;
	}

	var host = req.headers.host;
	var loc  = config.redirect[host];

	if( !loc )
	{
		return false;
	}

	var locp = loc + req.url;

	Jools.log( 'web', 'redirect', '->', locp );

	res.writeHead(307, {
		'Content-Type' :
			'text/plain',

		'Cache-Control' :
			'max-age=86400',

		'Date' :
			new Date().toUTCString(),

		'Location' :
			locp
	});

	res.end( );

	return true;
};


/*
| Listens to http requests
*/
Server.prototype.requestListener =
	function(
		req,
		res
	)
{
	var red = url.parse( req.url );

	if(
		this.webRedirect(
			req,
			res
		)
	)
	{
		return;
	}

	Jools.log( 'web', req.connection.remoteAddress, red.href );

	var pathname =
		red.pathname.replace( /^[\/]+/g, '' );

	if( pathname === 'mm' )
	{
		return this.webAjax( req, red, res );
	}

	var r = this.$resources[ pathname ];
	if (!r)
	{
		this.webError( res, '404 Bad Request' );
		return;
	}

	if (r.data)
	{
		var aenc = r.gzip && req.headers[ 'accept-encoding' ];
		var header = {
			'Content-Type' :
				r.mime,

			'Cache-Control' :
				r.opts.cache ? 'max-age=7884000' : 'no-cache',

			'Date' :
				new Date().toUTCString()
		};

		if (aenc && aenc.indexOf('gzip') >= 0)
		{
			// delivers compressed
			header[ 'Content-Encoding' ] = 'gzip';
			res.writeHead( 200, header );
			res.end( r.gzip, 'binary' );
		}
		else
		{
			// delivers uncompressed
			res.writeHead( 200, header );
			res.end( r.data, r.code );
		}
		return;
	}

	var self =
		this;

	if (
		config.devel !== 'shell' &&
		config.devel !== 'both'
	) {
		this.webError( res, '404 Bad Request' );
	}

	fs.readFile(
		r.path,
		function( err, data )
		{
			if( err )
			{
				self.webError(
					res,
					500,
					'Internal Server Error'
				);

				Jools.log(
					'fail',
					'Missing file: ' + r.path
				);

				return;
			}

			res.writeHead(
				200,
				{
					'Content-Type' :
						r.mime,

					'Cache-Control' :
						r.opts.cache ? 'max-age=7884000' : 'no-cache',

					'Date' :
						new Date().toUTCString()
				}
			);

			// weinre can't cope with strict mode
			// so its disabled when weinre is enabled
			if( config.debug.weinre )
			{
				data =
					('' + data).replace(
						/'use strict'/,
						"'not strict'"
					).replace(
						/"use strict"/,
						'"not strict"'
					);
			}

			res.end(
				data,
				r.code
			);
		}
	);
};


/*
| Handles ajax requests to the MeshMashine.
*/
Server.prototype.webAjax =
	function(
		req,
		red,
		res
	)
{
	var self = this;
	var data = [ ];

	if( req.method !== 'POST' )
	{
		this.webError( res, 400, 'Must use POST' );
		return;
	}

	req.on('close',
		function( )
		{
			if( res.sleepID )
			{
				self.closeSleep( res.sleepID );
			}
		}
	);

	req.on('data',
		function( chunk )
		{
			data.push( chunk );
		}
	);

	var handler = function( )
	{
		var query = data.join( '' );
		var asw, cmd;

		Jools.log( 'ajax', '<-', query );

		try
		{
			cmd = JSON.parse(query);
		}
		catch( err )
		{
			self.webError( res, 400, 'Not valid JSON' );
			return;
		}

		asw = self.ajaxCmd(
			cmd,
			res,
			function( err, asw )
			{
				if (err)
				{
					if (err.ok !== false)
					{
						throw err;
					}
					else
					{
						Jools.log(
							'web',
							'not ok',
							err.message
						);

						asw = {
							ok : false,
							message : err.message
						};
					}
				}

				if( asw === null )
				{
					return;
				}

				Jools.log( 'ajax', '->', asw );

				res.writeHead( 200,
					{
						'Content-Type'  : 'application/json',
						'Cache-Control' : 'no-cache',
						'Date'          : new Date().toUTCString()
					}
				);

				res.end( JSON.stringify( asw ) );
			}
		);
	};

	req.on(
		'end',
		handler
	);

	/*
	req.on( 'end', function( )
		{
			setTimeout( handler, 1880 ); // TODO
		});
	*/
};


/*
| Executes an ajaxCmd
*/
Server.prototype.ajaxCmd = function( cmd, res, _)
{
	switch ( cmd.cmd )
	{
		case 'alter' :
			return this.cmdAlter( cmd, _);

		case 'auth' :
			return this.cmdAuth(  cmd, _);

		case 'get' :
			return this.cmdGet( cmd, _);

		case 'message' :
			return this.cmdMessage( cmd, _);

		case 'register' :
			return this.cmdRegister( cmd, _);

		case 'update' :
			return this.cmdUpdate( cmd, res, _);

		default:
			return Jools.reject('unknown command');
	}
};

new Server(
	function( err ) {
		if( err )
		{
			throw err;
		}
	}
);

} ) ();
