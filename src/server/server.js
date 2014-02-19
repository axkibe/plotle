/*
| The server-side repository.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Turn on checking on server side by default.
*/
GLOBAL.CHECK =
	true;

GLOBAL.JOOBJ =
	false;

GLOBAL.SERVER =
	true;

GLOBAL.SHELL =
	false;


/*
| Imports
*/
var
	config =
		require( '../../config' ),

	fs =
		require( 'fs' ),

	GenerateJoobj =
		require( './generate-joobj' ),

	http =
		require( 'http' ),

	Inventory =
		require( './inventory' ),

	joobjGenerator =
		require( '../joobj/generator' ),

	Jools =
		require( '../jools/jools' ),

	MaxAge =
		require( './maxage' ),

	MeshMashine =
		require( '../mm/meshmashine' ),

	meshverse =
		require( '../mm/meshverse' ),

	mongodb =
		require( 'mongodb' ),

	Path =
		require( '../mm/path' ),

	Resource =
		require( './resource' ),

	roster =
		require( './roster' ),

	sha1 =
		require( '../jools/sha1' ),

	suspend =
		require( 'suspend' ),

	resume =
		suspend.resume,

	uglify =
		require( 'uglify-js' ),

	url =
		require( 'url' ),

	util =
		require( 'util' ),

	vm =
		require( 'vm' ),

	zlib =
		require( 'zlib' );


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
	// the servers inventory
	this.inventory =
		Inventory.create( );

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

	yield* this.prepareInventory( );

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
			_id :
				'version',
			version :
				4
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
					_id :
						'meshcraft'
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
				new MeshMashine.Change(
					o.chgX.src,
					o.chgX.trg
				);
		}
		else
		{
			change.chgX =
				new MeshMashine.ChangeRay( o.chgX );
		}

		space.$seqZ++;

		space.$tree =
			change.chgX.changeTree(
				space.$tree,
				meshverse
			).tree;
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
| Registers and prepares the inventory.
| also builds the bundle.
*/
Server.prototype.prepareInventory =
	function* ( )
{
	var
		a,
		aZ,
		data,
		r;


	Jools.log( 'start', 'preparing inventory' );

	// autogenerates the shell config as resource
	var
		cconfig =
			Resource.create(
				'aliases',
					[ 'config.js' ],
				'data',
					this.buildShellConfig( ),
				'filepath',
					'config.js',
				'inBundle',
					true
			);

	this.inventory =
		this.inventory.addResource( cconfig );

	// takes resource from the the roster
	for(
		a = 0, aZ = roster.length;
		a < aZ;
		a++
	)
	{
		r =
			roster[ a ];

		if( r.hasJoobj )
		{
			this.inventory =
				this.inventory.addResource( r.asJoobj );
		}

		this.inventory =
			this.inventory.addResource( r );
	}

	// Reads in all files to be cached
	var
		inv =
			this.inventory;

	for(
		a = 0, aZ = inv.list.length;
		a < aZ;
		a++
	)
	{
		r =
			inv.list[ a ];

		if(
			r.data !== null
			||
			r.inBundle
			||
			r.isJoobj
		)
		{
			continue;
		}

		this.inventory =
			this.inventory.updateResource(
				r,
				r.create(
					'data',
						( yield fs.readFile(
							r.filepath,
							resume( )
						) )
				)
			);
	}

	var
		// the bundle itself
		bundle =
			[ ],

		// file listing for devel.html
		devels =
			[ ];

	// if uglify is turned off
	// the flags are added before bundle
	// creation, otherwise afterwards
	if( !config.uglify )
	{
		this.prependConfigFlags( );
	}

	Jools.log( 'start', 'building bundle' );

	var
		ast,
		code,
		res;

	// loads the files to be bundled
	for(
		a = 0, aZ = this.inventory.list.length;
		a < aZ;
		a++
	)
	{
		r =
			this.inventory.list[ a ];

		if( !r.inBundle )
		{
			continue;
		}

		devels.push(
			'<script src="' +
				r.aliases[ 0 ] +
				'" type="text/javascript"></script>'
		);

		if( r.isJoobj )
		{
			code =
				yield GenerateJoobj.run(
					r,
					resume( )
				);
		}
		else
		{
			if( r.data === null )
			{
				code =
					( yield fs.readFile(
						r.filepath,
						resume( )
					) ) + '';
			}
			else
			{
				code =
					r.data;
			}
		}

		try{
			ast =
				uglify.parse(
					code,
					{
						filename :
							r.filepath,
						strict :
							true,
						toplevel :
							ast
					}
				);
		}
		catch ( e )
		{
			console.log(
				'parse error',
				r.filepath,
				'line',
				e.line
			);

			throw e;
		}
	}

	if( config.extraMangle )
	{
		this.extraMangle( ast );
	}

	if( config.uglify )
	{
		Jools.log( 'start', 'uglifying bundle' );

		ast.figure_out_scope( );

		var
			compressor =
				uglify.Compressor(
					{
						dead_code :
							true,
						hoist_vars :
							true,
						warnings :
							false,
						negate_iife :
							true,
						global_defs :
						{
							'CHECK' :
								false,
							'JOOBJ' :
								false,
							'SERVER' :
								false,
							'SHELL' :
								true,
						}
					}
				);

		ast =
			ast.transform( compressor );

		ast.figure_out_scope( );

		ast.compute_char_frequency( );

		ast.mangle_names(
			{
				toplevel :
					true,
				except :
					[ 'WebFont' ]
			}
		);
	}

	var
		sourceMap =
			uglify.SourceMap(
				{
				}
			),

		stream =
			uglify.OutputStream(
				{
					beautify :
						config.beautify,

					source_map:
						sourceMap
				}
			);

	ast.print( stream );

	bundle =
		stream.toString( );

	yield fs.writeFile(
		'source.map',
		sourceMap.toString( ),
		resume( )
	);
	

	// calculates the hash for the bundle
	var
		bundleFilepath =
			'meshcraft-' + sha1.sha1hex( bundle ) + '.js',

		// registers the bundle as resource
		br =
			Resource.create(
				'filepath',
					bundleFilepath,
				'maxage',
					'long',
				'data',
					bundle
			);

	this.inventory =
		this.inventory.addResource( br );

	Jools.log( 'start', 'bundle:', bundleFilepath );

	// if uglify is turned on
	// the flags are added after bundle
	// creation, otherwise before
	if( config.uglify )
	{
		this.prependConfigFlags( );
	}

	// the devel.html file
	res =
		this.inventory.map[ 'devel.html' ];

	if(
		config.devel === 'shell' ||
		config.devel === 'both'
	)
	{
		data =
			res.data + '';

		data =
			data.replace(
				/<!--DEVELPACK.*>/,
				devels.join( '\n' )
			);

		if( config.debug.weinre )
		{
			data =
				data.replace(
					/<!--WEINRE.*>/,
					'<script src="http://' +
						config.debug.weinre +
						'/target/target-script-min.js"></script>'
				);
		}

		this.inventory =
			this.inventory.updateResource(
				res,
				res.create(
					'data',
						data
			)
		);
	}
	else
	{
		this.inventory =
			this.inventory.removeResource( res );
	}

	// the index.html file
	res =
		this.inventory.map[ 'meshcraft.html' ];

	inv =
	this.inventory =
		this.inventory.updateResource(
			res,
			res.create(
				'data',
					(res.data + '').replace(
						/<!--COPACK.*>/,
						'<script src="' +
							br.aliases[ 0 ] +
							'" type="text/javascript"></script>'
					)
			)
		);

	// prepares the zipped versions
	for(
		a = 0, aZ = inv.list.length;
		a < aZ;
		a++
	)
	{
		r =
			inv.list[ a ];

		if( r.inBundle )
		{
			continue;
		}

		this.inventory =
			this.inventory.updateResource(
				r,
				r.create(
					'gzip',
						yield zlib.gzip(
							r.data,
							resume( )
						)
				)
			);
	}

	Jools.log(
		'start',
		'uncompressed bundle size is ',
		this.inventory.map[ bundleFilepath ].data.length
	);

	Jools.log(
		'start',
		'  compressed bundle size is ',
		this.inventory.map[ bundleFilepath ].gzip.length
	);
};


/*
| Prepends the flags to cconfig
| Used by development.
*/
Server.prototype.prependConfigFlags =
	function( )
{
	var
		res =
			this.inventory.map[ 'config.js' ];

	this.inventory =
		this.inventory.updateResource(
			res,
			res.create(
				'data',
					'var JOOBJ = false;\n' +
					'var CHECK = true;\n' +
					'var SERVER = false;\n' +
					'var SHELL = true;\n' +
					res.data
				)
		);
};


// returns a string with a base64 counting
var b64Count =
	function(
		c
	)
{
	var
		mask = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',

		result =
			'';

	do
	{
		result =
			mask[ c & 0x3F ] + result;

		c =
			c >> 6;
	}
	while( c > 0 );

	return result;
};

/*
| Makes additional mangles
*/
Server.prototype.extraMangle =
	function(
		ast
	)
{
	var
		a,
		aZ,
		at,
		e,

		// unknown properties / keys
		// that are missed in both lists
		missed =
			{ },

		// mangle definitions:
		// a file that looks like this
		// ". value"  <-- this will be mangled
		// "> value"  <-- this will not be mangled
		mangleDefs =
			(
				fs.readFileSync(
					'./mangle.txt'
				) + ''
			).split( '\n' ),

		// an array of all mangles
		mangleList,

		// associative of all mangles
		mangle =
			{ },

		// associative of all no-mangles
		noMangle =
			{ },

		// associative of all mangles not used
		useMangle =
			{ },

		// associative of all no-mangles not used
		useNoMangle =
			{ },

		// ast properties mangled
		astProps =
			{
				'property' :
					'p',

				'key' :
					'p',

				// string values are mangled
				// but do not flag properties missed
				'value' :
					's'
			};

	// cuts away empty lines
	while( mangleDefs.indexOf( '' ) >= 0 )
	{
		mangleDefs.splice( mangleDefs.indexOf( '' ), 1 );
	}

	// creates associativs and lists
	for(
		a = 0, aZ = mangleDefs.length;
		a < aZ;
		a++
	)
	{
		at =
			mangleDefs[ a ];

		e =
			at.substring( 2 );

		if(
			e.length === 0 ||
			e.indexOf( ' ' ) >= 0 ||
			at[ 1 ] !== ' ' ||
			( at[ 0 ] !== '.' && at[ 0 ] !== '>' )
		)
		{
			throw new Error(
				'malformed mangle entry "' + at + '"'
			);
		}

		if(
			mangle[ e ] || noMangle[ e ]
		)
		{
			throw new Error(
				'double entry: "' + e + '"'
			);
		}

		switch( at[ 0 ] )
		{
			case '.' :

				mangle[ e ] =
					true;

				break;

			case '>' :

				noMangle[ e ] =
					true;

				break;
		}
	}

	mangleList =
		Object.keys( mangle ).sort( );

	// allots all mangles an value
	for(
		a = 0, aZ = mangleList.length;
		a < aZ;
		a++
	)
	{
		at =
			mangleList[ a ];

		mangle[ at ] =
			'$$' + b64Count( a );
	}

	fs.writeFileSync(
		'manglemap.txt',
		util.inspect( mangle )
	);

	// marks all mangles and no-mangles as unused so far
	for( a in mangle )
	{
		useMangle[ a ] =
			true;
	}

	for( a in noMangle )
	{
		useNoMangle[ a ] =
			true;
	}

	// walks the syntax tree
	ast.walk( new uglify.TreeWalker(
		function( node )
		{
			var k, p;

			for( k in astProps )
			{
				p =
					node[ k ];

				if( p !== undefined )
				{
					break;
				}
			}

			if( !k )
			{
				return false;
			}

			if( !Jools.isString( node[ k ] ) )
			{
				return false;
			}

			// checks if this property will not be mangled
			if( noMangle[ p ] !== undefined )
			{
				delete useNoMangle[ p ];

				return false;
			}

			// checks if this property will be mangled
			if( mangle[ p ] !== undefined )
			{
				delete useMangle[ p ];

				node[ k ] =
					mangle[ p ];

				return false;
			}

			// if this is a property it is marked as missed
			if( astProps[ k ] === 'p' )
			{
				missed[ p ] =
					true;
			}

			return false;
		}
	));

	// turns check lists into arrays and sorts them
	missed =
		Object.keys( missed ).sort( );

	useMangle =
		Object.keys( useMangle ).sort( );

	useNoMangle =
		Object.keys( useNoMangle ).sort( );

	if( missed.length > 0 )
	{
		console.log(
			'extraMangle missed ' +
				missed.length +
				' properties: ',
			missed
		);
	}

	if( useMangle.length > 0 )
	{
		console.log(
			'extraMangle not used mangles: ',
			useMangle
		);
	}

	if( useNoMangle.length > 0 )
	{
		console.log(
			'extraMangle not used no-mangles: ',
			useNoMangle
		);
	}
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

		chgX =
			new MeshMashine.Change( chgX.src, chgX.trg );

	}
	catch( err )
	{
		throw Jools.reject(
			'invalid cmd: ' + err.message
		);
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

	//FIXME call it sleep.username
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

	// FIXME dont call it "time"
	if( !Jools.is( cmd.time ) )
	{
		throw Jools.reject( 'time missing' );
	}

	if( !Jools.is( cmd.path ) )
	{
		throw Jools.reject( 'path missing' );
	}

	// FIXME test spaceUser/Tag

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

	message =
		code + ' ' + message;

	Jools.log( 'web', 'error', code, message );

	res.end( message );
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
			this.inventory.map[ pathname ];

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
						MaxAge.map( r.maxage ),

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
				r.coding
			);
		}
		return;
	}

	if (
		config.devel !== 'shell' &&
		config.devel !== 'both'
	)
	{
		this.webError(
			res,
			'404 Bad Request'
		);
	}

	var
		data;

	// if the joobj is requested generate that one from the file
	if( r.isJoobj )
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
					r.filepath,
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
				'Missing file: ' + r.filepath
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
				MaxAge.map( r.maxage ),

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
		r.coding
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
			setTimeout( handler, 1880 );
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

} )( );
