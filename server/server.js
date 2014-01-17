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
| Turn on checking on server side by default.
*/
GLOBAL.CHECK =
	true;

if( typeof( require ) === 'undefined' )
{
	throw new Error(
		'this code requires node!'
	);
}


/*
| Imports
*/
var
	suspend =
		require( 'suspend' ),

	resume =
		suspend.resume,

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

	config =
		require( '../config' ),

	fs =
		require( 'fs' ),

	http =
		require( 'http' ),

	joobjGenerator =
		require( './joobj-generator' ),

	mongodb =
		require( 'mongodb' ),

	sha1 =
		require( '../shared/sha1' ),

	url =
		require( 'url' ),

	vm =
		require( 'vm' ),

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
	function( )
{
	// pass
};


/*
| Sets up the server.
|*/
Server.prototype.startup =
	function*( )
{
	// files served
	this.$resources =
		{ };

	// initializes the database
	var
		db =
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

	yield* this.prepareResources( );

	Jools.log(
		'start',
		'connecting to database',
		config.database.host + ':' + config.database.port,
		config.database.name
	);

	db.connection =
		yield db.connector.open( resume( ) );

	db.users =
		yield db.connection.collection( 'users', resume( ) );

	db.spaces =
		yield db.connection.collection( 'spaces', resume( ) );

	yield* this.checkRepositorySchemaVersion( );

	yield* this.ensureMeshcraftUser( );

	yield* this.loadSpaces( );

	Jools.log(
		'start',
		'starting server @ http://' +
			( config.ip || '*' ) + '/:' + config.port
	);

	var
		self =
			this;

	var
		requestListener =
			function*( req, res )
			{
				yield* self.requestListener( req, res );
			};

	yield http.createServer(
		function( req, res )
		{
			suspend( requestListener )( req, res );
		}
	).listen(
		config.port,
		config.ip,
		resume( )
	);

	Jools.log(
		'start',
		'server running'
	);
};


/*
| Ensures the repository schema version fits this server.
*/
Server.prototype.checkRepositorySchemaVersion =
	function* ( )
{
	Jools.log(
		'start',
		'checking repository schema version'
	);

	var
		global =
			yield this.$db.connection.collection(
				'global',
				resume( )
			),

		version =
			yield global.findOne(
				{
					_id :
						'version'
				},
				resume( )
			);

	if( version )
	{
		if( version.version !== 4 )
		{
			throw new Error(
				'Wrong repository schema version, expected 4, got ' +
				version.version
			);
		}

		return;
	}

	// otherwise initializes the database repository

	yield* this.initRepository( );
};

/**
| Initializes a new repository.
*/
Server.prototype.initRepository =
	function*( )
{
	Jools.log(
		'start',
		'found no repository, initializing a new one'
	);

	var
		initSpaces =
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
		var
			space =
				initSpaces[ s ];

		Jools.log(
			'start',
			'  initializing space ' + space
		);

		yield this.$db.spaces.insert(
			{
				_id : space
			},
			resume( )
		);
	}

	Jools.log(
		'start',
		'  initializing global.version'
	);

	var
		global =
			yield this.$db.connection.collection(
				'global',
				resume( )
			);

	yield global.insert(
		{
			_id     : 'version',
			version : 4
		},
		resume( )
	);
};


/*
| Ensures there is the meshcraft (root) user
*/
Server.prototype.ensureMeshcraftUser =
	function* ( )
{
	Jools.log(
		'start',
		'ensuring existence of the "meshcraft" user'
	);

	var
		mUser =
			yield this.$db.users.findOne(
				{
					_id : 'meshcraft'
				},
				resume( )
			);

	if( !mUser )
	{
		Jools.log(
			'start',
			'not found! (re)creating the "meshcraft" user'
		);

		var
			pass =
				Jools.randomPassword( 12 );

		mUser =
			{
				_id :
					'meshcraft',

				pass :
					Jools.passhash( pass ),

				clearPass :
					pass,

				mail :
					''
			};

		yield this.$db.users.insert(
			mUser,
			resume( )
		);
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
	function*( )
{
	Jools.log(
		'start',
		'loading and replaying all spaces'
	);

	var
		cursor =
			yield this.$db.spaces.find(
				{ },
				{ sort: '_id'},
				resume( )
			);

	for(
		var o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		yield* this.loadSpace( o._id );
	}
};


/*
| load a spaces and playbacks its changes from the database.
*/
Server.prototype.loadSpace =
	function* (
		spaceName
	)
{
	Jools.log(
		'start',
		'loading and replaying all "' + spaceName + '"'
	);

	var space =
	this.$spaces[ spaceName ] =
		{
			$changesDB :
				yield this.$db.connection.collection(
					'changes:' + spaceName,
					resume( )
				),

			$changes :
				[ ],

			$tree :
				meshverse.grow( 'Space' ),

			$seqZ :
				1
		};

	var
		cursor =
			yield space.$changesDB.find(
				{
					// ...
				},
				{
					sort :
						'_id'
				},
				resume( )
			);

	for(
		var o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
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

//		XXX
//		try{
			space.$tree =
				change.chgX.changeTree(
					space.$tree,
					meshverse
				).tree;
//		}
//		catch( err )
//		{
//			console.log( 'error playing back changes' );
//
//			throw err;
//		}
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

	var
		self =
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
	function( cmd )
{
	var
		spaceUser =
			cmd.spaceUser,

		spaceTag =
			cmd.spaceTag,

		message =
			cmd.message,

		username =
			cmd.user,

		passhash =
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
*/
Server.prototype.buildShellConfig =
	function( )
{
	var
		cconfig =
			[ ],

		k;

	cconfig.push(
		'var config = {\n',
		'\tdevel   : ',
			Jools.configSwitch( config.devel, 'shell' ),
			',\n',
		'\tmaxUndo : ',
			config.maxUndo, ',\n',
		'\tdebug   : {\n'
	);

	var
		first =
			true;

	for( k in config.debug )
	{
		var
			val =
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
		if( !first )
		{
			cconfig.push( ',\n' );
		}
		else
		{
			first =
				false;
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
	function* ( )
{
	var
		r,

		rlist =
			[
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

				'shared/euclid/point.js',
					'fbj',

				'shared/euclid/rect.js',
					'fbj',

				'shell/euclid/margin.js',
					'fb',

				'shell/euclid/font.js',
					'fb',

				'shell/euclid/fabric.js',
					'fb',

				'shell/euclid/measure.js',
					'fb',

				'shell/euclid/shape.js',
					'fb',

				'shell/euclid/round-rect.js',
					'fb',

				'shell/euclid/ellipse.js',
					'fb',

				'shell/euclid/line.js',
					'fb',

				'shell/euclid/curve.js',
					'fb',

				'shell/shellverse.js',
					'fb',

				'shell/fontpool.js',
					'fb',

				'shell/style.js',
					'fb',

				'shell/accent.js',
					'fb',

				'shell/traitset.js',
					'fb',

				'shell/theme.js',
					'fb',

				'shell/design/maindisc.js',
					'fb',

				'shell/design/createdisc.js',
					'fb',

				'shell/design/login-form.js',
					'fb',

				'shell/design/moveto-form.js',
					'fb',

				'shell/design/no-access-to-space-form.js',
					'fb',

				'shell/design/non-existing-space-form.js',
					'fb',

				'shell/design/signup-form.js',
					'fb',

				'shell/design/space-form.js',
					'fb',

				'shell/design/user-form.js',
					'fb',

				'shell/design/welcome-form.js',
					'fb',

				'shell/euclid/view.js',
					'fb',

				'shell/iface.js',
					'fb',

				'shell/peer.js',
					'fb',

				'shell/stubs.js',
					'fb',

				'shell/discs/icons.js',
					'fb',

				'shell/discs/disc.js',
					'fb',

				'shell/discs/createdisc.js',
					'fb',

				'shell/discs/maindisc.js',
					'fb',

				'shell/discs/jockey.js',
					'fb',

				'shell/hover-reply.js',
					'fbj',

				'shell/widgets/widget.js',
					'fb',

				'shell/widgets/getstyle.js',
					'fb',

				'shell/widgets/button.js',
					'fb',

				'shell/widgets/input.js',
					'fb',

				'shell/widgets/checkbox.js',
					'fb',

				'shell/widgets/label.js',
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

				'shell/forms/jockey.js',
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

				'shell/mark/mark.js',
					'fbj',

				'shell/mark/caret.js',
					'fbj',

				'shell/mark/item.js',
					'fbj',

				'shell/mark/range.js',
					'fbj',

				'shell/mark/vacant.js',
					'fbj',

				'shell/mark/widget.js',
					'fbj',

				'shell/action/action.js',
					'fbj',

				'shell/action/none.js',
					'fbj',

				'shell/action/create-generic.js',
					'fbj',

				'shell/action/create-relation.js',
					'fbj',

				'shell/action/item-drag.js',
					'fbj',

				'shell/action/item-resize.js',
					'fbj',

				'shell/action/pan.js',
					'fbj',

				'shell/action/scrolly.js',
					'fbj',

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

	// resources served in the bundle
	var
		rBundle =
			[ ];

	// creates the resources
	for(
		var a = 0, aZ = rlist.length;
		a < aZ;
		a += 2
	)
	{
		r =
			new Resource(
				rlist[ a ],
				rlist[ a + 1 ]
			);

		if( r.opts.bundle )
		{
			rBundle.push( r );
		}

		if( this.$resources[ r.alias ] )
		{
			throw new Error(
				'double resource: ' +
					r.alias +
					' ( ' + r.path + ' ) '
			);
		}

		if( r.opts.joobj )
		{
			this.$resources[ r.joobjAlias ] =
				r;
		}

		this.$resources[ r.alias ] =
			r;
	}

	var
		alias;

	Jools.log(
		'start',
		'preparing resources'
	);

	/*
	| Reads in all files to be cached
	| in memory
	*/
	for( alias in this.$resources )
	{
		r =
			this.$resources[ alias ];

		if(
			r.data !== null
			||
			!r.opts.memory
		)
		{
			continue;
		}

		r.data =
			yield fs.readFile(
				r.path,
				resume( )
			);
	}

	// alternative alias for favicon
	this.$resources[ 'favicon.ico' ] =
		this.$resources[ 'media/favicon.ico' ];

	// autogenerator the shell config as resource
	var
		cconfig =
			new Resource(
				'shell/config.js',
				'mb'
			);

	// puts the config on top of the rBundle
	rBundle.unshift( cconfig );

	this.$resources[ cconfig.alias ] =
		cconfig;

	cconfig.data =
		this.buildShellConfig( );

	var
		// the bundle itself
		bundle =
			[ ],

		// file listing for devel.html
		devels =
			[ ];

	// loads the files to be bundled
	for(
		a = 0, aZ = rBundle.length;
		a < aZ;
		a++
	)
	{
		r =
			rBundle[ a ];

		if( r.opts.joobj )
		{
			devels.push(
				'<script src="' +
					r.joobjAlias +
					'" type="text/javascript"></script>'
			);

			bundle.push(
				yield* this.generateJoobj( r )
			);
		}

		devels.push(
			'<script src="' +
				r.alias +
				'" type="text/javascript"></script>'
		);

		if( r.data === null )
		{
			bundle.push(
				yield fs.readFile(
					r.path,
					resume( )
				)
			);
		}
		else
		{
			bundle.push(
				r.data
			);
		}
	}

	bundle =
		bundle.join( '\n' );

	//writes the bundle( for debugging )
	//yield fs.writeFile(
	//	'bundle.js',
	//	bundle,
	//  resume( )
	//);


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
						dead_code :
							true,

						global_defs :
						{
							'CHECK' :
								false
						}
					}
				);

		ast =
			ast.transform( compressor );

		ast.compute_char_frequency( );

		ast.mangle_names( );

		bundle =
			ast.print_to_string( { } );
	}

	// calculates the hash for the bundle
	var
		bsha1 =
			sha1.sha1hex( bundle ),

		// registers the bundle as resource
		br =
			new Resource(
				'meshcraft-' + bsha1 + '.js',
				'mc'
			);

	br.data =
		bundle;

	this.$resources[ br.alias ] =
		br;

	Jools.log(
		'start',
		'bundle:',
		bsha1
	);

	// Prepends the CHECK and JOOBJ flags after
	// the bundle has been created.
	cconfig.data =
		'var JOOBJ = false;\n' +
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
			(yield fs.readFile(
				'shell/devel.html',
				resume( )
			)) + '';

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
	var
		main =
			new Resource(
				'shell/meshcraft.html',
				'm'
			);

	main.data =
		( yield fs.readFile(
			'shell/meshcraft.html',
			resume( )
		) ) + '';

	main.data =
		main.data.replace(
			/<!--COPACK.*>/,
			'<script src="' + br.alias + '" type="text/javascript"></script>'
		);

	this.$resources[ 'meshcraft.html' ] =
	this.$resources[ 'index.html' ] =
	this.$resources[ '' ] =
		main;

	// the testpad html file
	var
		testpad =
			new Resource(
				'testpad/testpad.html',
				'f'
			);

	this.$resources[ 'testpad.html' ] =
		testpad;

	// prepares the zipped versions
	for( alias in this.$resources )
	{
		r =
			this.$resources[ alias ];

		if( !r.opts.memory )
		{
			continue;
		}

		r.gzip =
			yield zlib.gzip(
				r.data,
				resume( )
			);
	}

	Jools.log(
		'start',
		'uncompressed bundle size is ',
		br.data.length
	);

	Jools.log(
		'start',
		'  compressed bundle size is ',
		br.gzip.length
	);
};


/*
| Executes an alter command.
*/
Server.prototype.cmdAlter =
	function(
		cmd
	)
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

	var
		spaceName =
			spaceUser + ':' + spaceTag;

	var
		space =
			this.$spaces[ spaceName ];

	if( !Jools.is( space ) )
	{
		throw Jools.reject( 'unknown space' );
	}

	var
		changes =
			space.$changes;

	var
		seqZ =
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
			throw new Error(
				'Array chgX not yet supported'
			);
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
			cid :
				cmd.cid,

			chgX :
				chgX
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

		function(
			error
			// count
		)
		{
			if( error !== null )
			{
				throw new Error( 'Database fail!' );
			}
		}
	);

	space.$seqZ++;

	var
		self =
			this;

	process.nextTick(
		function( )
		{
			self.wake( spaceUser, spaceTag );
		}
	);

	return {
		ok :
			true,

		chgX :
			chgX
	};
};


/*
| Executes an auth command.
*/
Server.prototype.cmdAuth =
	function* (
		cmd
	)
{
	if( !Jools.is( cmd.user ) )
	{
		throw Jools.reject( 'user missing' );
	}

	if( !Jools.is( cmd.passhash ) )
	{
		throw Jools.reject( 'passhash missing' );
	}

	var
		users =
			this.$users;

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
				user :
					uid,

				pass :
					cmd.passhash,

				created :
					Date.now( ),

				use :
					Date.now( )
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
		var
			val =
				yield this.$db.users.findOne(
					{ _id : cmd.user },
					resume( )
				);

		if( val === null )
		{
			return Jools.reject( 'Username unknown' );
		}

		users[ cmd.user ] =
			val;
	}

	if( users[cmd.user].pass !== cmd.passhash )
	{
		return Jools.reject( 'Invalid password' );
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
	function* (
		spaceUser,
		spaceTag
	)
{
	var
		spaceName =
			spaceUser + ':' + spaceTag;

	var space =
	this.$spaces[ spaceName ] =
		{
			$changesDB :
				yield this.$db.connection.collection(
					'changes:' + spaceName,
					resume( )
				),

			$changes :
				[ ],

			$tree :
				meshverse.grow( 'Space' ),

			$seqZ :
				1
		};


	yield this.$db.spaces.insert(
		{
			_id : spaceName
		},
		resume( )
	);

	return space;
};


/*
| Executes a register command.
*/
Server.prototype.cmdRegister =
	function* (
		cmd
	)
{
	var
		username =
			cmd.user;

	var
		passhash =
			cmd.passhash;

	var
		mail =
			cmd.mail;

	var
		news =
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

	var
		user =
			yield this.$db.users.findOne(
				{ _id : username },
				resume( )
			);

	if( user !== null )
	{
		return Jools.reject( 'Username already taken' );
	}

	user = {
		_id :
			username,

		pass :
			passhash,

		mail :
			mail,

		news :
			news
	};

	yield this.$db.users.insert(
		user,
		resume( )
	);

	this.$users[ username ] =
		user;

	yield* this.createSpace(
		username,
		'home'
	);

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
	var
		pu =
			this.$presences[ user ];

	if( !pu )
	{
		pu =
		this.$presences[ user ] =
			{
				spaces : { }
			};
	}

	var
		spaceName =
			spaceUser + ':' + spaceTag,

		pus =
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
		spaceTag
		// sleepID
	)
{
	var
		pres =
			this.$presences,

		pu =
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

	var
		spaceName =
			spaceUser + ':' + spaceTag,

		pus =
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
	var
		pu =
			this.$presences[ user ],

		spaceName =
			spaceUser + ':' + spaceTag,

		pus =
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
	var
		spaceName =
			spaceUser + ':' + spaceTag;

	self.sendMessage(
		spaceUser,
		spaceTag,
		null,
		user + ' left "' + spaceName + '"'
	);

	var
		pu =
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
	function (
		cmd,
		res
	)
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

	if(
		!Jools.isInteger( mseq )
		||
		mseq > this.$messages.length
	)
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

		Jools.log( 'ajax', '->', asw );

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
	function* (
		cmd
	)
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

	var
		spaceName =
			cmd.spaceUser + ':'  + cmd.spaceTag,

		access =
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

	var
		space =
			this.$spaces[ spaceName ];

	if( !space )
	{
		if( cmd.create === true )
		{
			space =
				yield* this.createSpace(
					spaceUser,
					spaceTag
				);
		}
		else
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
	var
		node;

	try
	{
		node =
			tree.getPath(
				Path.create(
					'array',
					cmd.path
				)
			);
	}
	catch( err )
	{
		throw Jools.reject(
			'cannot get path: ' + err.message
		);
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
| iGenerates the Joobj for a resource
*/
Server.prototype.generateJoobj =
	function*(
		r
	)
{
	var
		data =
			yield fs.readFile(
				r.path,
				resume( )
			),

		joobj =
			vm.runInNewContext(
				data,
				{
					JOOBJ :
						true
				},
				r.path
			);

	data =
		joobjGenerator( joobj );

	// updates the generated file
	yield fs.writeFile(
		'joobj/' +
		r.alias,
		data,
		resume( )
	);

	return data;
};


/*
| Listens to http requests
*/
Server.prototype.requestListener =
	function*(
		req,
		res
	)
{
	var
		red =
			url.parse( req.url );

	if(
		this.webRedirect(
			req,
			res
		)
	)
	{
		return;
	}

	Jools.log(
		'web',
		req.connection.remoteAddress,
		red.href
	);

	var
		pathname =
			red.pathname.replace( /^[\/]+/g, '' );

	if( pathname === 'mm' )
	{
		return this.webAjax( req, red, res );
	}

	var
		r =
			this.$resources[ pathname ];

	if( !r )
	{
		this.webError(
			res,
			'404 Bad Request'
		);

		return;
	}

	if( r.data )
	{
		var
			aenc =
				r.gzip && req.headers[ 'accept-encoding' ],

			header =
				{
					'Content-Type' :
						r.mime,

					'Cache-Control' :
						r.opts.cache ? 'max-age=7884000' : 'no-cache',

					'Date' :
						new Date().toUTCString()
				};

		if( aenc && aenc.indexOf( 'gzip' ) >= 0 )
		{
			// delivers compressed
			header[ 'Content-Encoding' ] =
				'gzip';

			res.writeHead(
				200,
				header
			);

			res.end(
				r.gzip,
				'binary'
			);
		}
		else
		{
			// delivers uncompressed
			res.writeHead(
				200,
				header
			);

			res.end(
				r.data,
				r.code
			);
		}
		return;
	}

	if (
		config.devel !== 'shell' &&
		config.devel !== 'both'
	) {
		this.webError(
			res,
			'404 Bad Request'
		);
	}

	var
		data;

	// if the joobj is requested generate that one from the file
	if(
		pathname.substr( 0, 'joobj-'.length ) === 'joobj-'
	)
	{
		try{
			data =
				yield* this.generateJoobj( r );
		}
		catch( e )
		{
			this.webError(
				res,
				500,
				'Internal Server Error'
			);

			Jools.log(
				'fail',
				'Error generating Joobj: ' + e.toString( )
			);

			return;
		}
	}
	else
	{
		try {
			data =
				yield fs.readFile(
					r.path,
					resume( )
				);
		}
		catch( e )
		{
			this.webError(
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
			( '' + data ).replace(
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
	var
		self =
			this,

		data =
			[ ];

	if( req.method !== 'POST' )
	{
		this.webError(
			res,
			400,
			'Must use POST'
		);

		return;
	}

	req.on(
		'close',
		function( )
		{
			if( res.sleepID )
			{
				self.closeSleep( res.sleepID );
			}
		}
	);

	req.on(
		'data',
		function( chunk )
		{
			data.push( chunk );
		}
	);

	var
		handler =
			function*( )
		{
			var
				query =
					data.join( '' ),

				asw,
				cmd;

			Jools.log( 'ajax', '<-', query );

			try
			{
				cmd = JSON.parse( query );
			}
			catch( err )
			{
				self.webError(
					res,
					400,
					'Not valid JSON'
				);

				return;
			}

			try
			{
				asw =
					yield* self.ajaxCmd( cmd, res );
			}
			catch( err )
			{
				if( err.ok !== false )
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

	req.on(
		'end',
		function( )
		{
			suspend( handler )( );
		}
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
Server.prototype.ajaxCmd =
	function*( cmd, res )
{
	switch ( cmd.cmd )
	{
		case 'alter' :
			return this.cmdAlter( cmd );

		case 'auth' :
			return yield* this.cmdAuth(  cmd );

		case 'get' :
			return yield* this.cmdGet( cmd );

		case 'message' :
			return this.cmdMessage( cmd );

		case 'register' :
			return yield* this.cmdRegister( cmd );

		case 'update' :
			return this.cmdUpdate( cmd, res );

		default:
			return Jools.reject('unknown command');
	}
};

var run =
	function*( )
{
	var
		server =
			new Server( );

	yield* server.startup( );
};

suspend( run )( );

} ) ();
