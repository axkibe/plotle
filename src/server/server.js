/*
| The server-side repository.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


/*
| Globals.
*/
GLOBAL.APP=
	'server';
GLOBAL.FORCE=
	false;
GLOBAL.SHELLAPP=
	'shell';
GLOBAL.CHECK =
	true;
GLOBAL.JOOBJ =
	false;
GLOBAL.SERVER =
	true;
GLOBAL.SHELL =
	false;

/*
| Constants.
*/
var MESHCRAFT_DB_VERSION = 5;

/*
| Imports.
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
	Jools =
		require( '../jools/jools' ),
	MaxAge =
		require( './max-age' ),
	MeshMashine =
		require( '../mm/meshmashine' ),
	mongodb =
		require( 'mongodb' ),
	Path =
		require( '../mm/path' ),
	PostProcessor =
		require( './post-processor' ),
	Resource =
		require( './resource' ),
	roster =
		require( './roster' ),
	sha1 =
		require( '../jools/sha1' ),
	sus =
		require( 'suspend' ),
	uglify =
		require( 'uglify-js' ),
	url =
		require( 'url' ),
	util =
		require( 'util' ),
	Visual =
		{
			Space :
				require( '../visual/space' )
		},
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
		Inventory.Create( );

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
		yield db.connector.open( sus.resume( ) );

	db.users =
		yield db.connection.collection( 'users', sus.resume( ) );

	db.spaces =
		yield db.connection.collection( 'spaces', sus.resume( ) );

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

	// FIXME this might go simpler
	var
		requestListener =
			function*(
				request,
				result
			)
			{
				yield* self.requestListener(
					request,
					result
				);
			};

	yield http.createServer(
		function(
			request,
			result
		)
		{
			sus( requestListener )(
				request,
				result
			);
		}
	).listen(
		config.port,
		config.ip,
		sus.resume( )
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
				sus.resume( )
			),

		version =
			yield global.findOne(
				{
					_id :
						'version'
				},
				sus.resume( )
			);

	if( version )
	{
		if( version.version !== MESHCRAFT_DB_VERSION )
		{
			throw new Error(
				'Wrong repository schema version, expected '
					+ MESHCRAFT_DB_VERSION +
				', got ' +
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
			sus.resume( )
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
				sus.resume( )
			);

	yield global.insert(
		{
			_id :
				'version',
			version :
				MESHCRAFT_DB_VERSION
		},
		sus.resume( )
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
				sus.resume( )
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
			sus.resume( )
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
				sus.resume( )
			);

	for(
		var o = yield cursor.nextObject( sus.resume( ) );
		o !== null;
		o = yield cursor.nextObject( sus.resume( ) )
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
	var
		change,
		cursor,
		o,
		space;

	Jools.log(
		'start',
		'loading and replaying all "' + spaceName + '"'
	);

	space =
		this.$spaces[ spaceName ] =
			{
				$changesDB :
					yield this.$db.connection.collection(
						'changes:' + spaceName,
						sus.resume( )
					),
				$changes :
					[ ],
				$tree :
					Visual.Space.Create( ),
				$seqZ :
					1
			};

	cursor =
		yield space.$changesDB.find(
			{
				// ...
			},
			{
				sort :
					'_id'
			},
			sus.resume( )
		);

	for(
		o = yield cursor.nextObject( sus.resume( ) );
		o !== null;
		o = yield cursor.nextObject( sus.resume( ) )
	)
	{
		if( o._id !== space.$seqZ )
		{
			throw new Error( 'sequence mismatch' );
		}

		// FIXME there is something quirky, why isn't *this* a "Change"?
		change =
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
				space.$tree
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

	if( username === undefined )
	{
		throw Jools.reject( 'user missing' );
	}

	if( passhash === undefined )
	{
		throw Jools.reject( 'passhash missing' );
	}

	if( spaceUser === undefined )
	{
		throw Jools.reject( 'spaceUser missing' );
	}

	if( spaceTag === undefined )
	{
		throw Jools.reject( 'spaceTag missing' );
	}

	if( message === undefined )
	{
		throw Jools.reject( 'message missing' );
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
			config.develShell,
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
			config.log[k]
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
		bundleFilePath,
		cconfig,
		inv,
		resource;

	Jools.log( 'start', 'preparing inventory' );

	// autogenerates the shell config as resource
	cconfig =
		Resource.Create(
			'data',
				this.buildShellConfig( ),
			'filePath',
				'config.js',
			'inBundle',
				true,
			'inTestPad',
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
		resource =
			roster[ a ];

		if( resource.devel && !config.develShell )
		{
			continue;
		}

		if( resource.hasJoobj )
		{
			this.inventory =
				this.inventory.addResource( resource.asJoobj );
		}

		this.inventory =
			this.inventory.addResource( resource );
	}

	// Reads in all files to be cached
	inv =
		this.inventory;

	for(
		a = 0, aZ = inv.list.length;
		a < aZ;
		a++
	)
	{
		resource =
			inv.list[ a ];

		if(
			resource.data
			||
			resource.inBundle
			||
			resource.devel
			||
			resource.isJoobj
		)
		{
			continue;
		}

		this.inventory =
			this.inventory.updateResource(
				resource,
				resource.Create(
					'data',
						( yield fs.readFile(
							resource.filePath,
							sus.resume( )
						) )
				)
			);
	}

	var
		// the bundle itself
		bundle =
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
		code;

	// loads the files to be bundled
	for(
		a = 0, aZ = this.inventory.list.length;
		a < aZ;
		a++
	)
	{
		resource =
			this.inventory.list[ a ];

		if( !resource.inBundle )
		{
			continue;
		}

		if( resource.isJoobj )
		{
			code =
				yield* GenerateJoobj.run( resource );
		}
		else
		{
			if( !resource.data )
			{
				code =
					( yield fs.readFile(
						resource.filePath,
						sus.resume( )
					) ) + '';
			}
			else
			{
				code =
					resource.data;
			}
		}

		try{
			ast =
				uglify.parse(
					code,
					{
						filename :
							resource.filePath,
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
				resource.filePath,
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

	if( !config.noWrite )
	{
		yield fs.writeFile(
			'report/source.map',
			sourceMap.toString( ),
			sus.resume( )
		);
	}

	// calculates the hash for the bundle
	bundleFilePath =
	this.bundleFilePath =
		'meshcraft-' + sha1.sha1hex( bundle ) + '.js';

	// registers the bundle as resource
	this.inventory =
		this.inventory.addResource(
			Resource.Create(
				'filePath',
					bundleFilePath,
				'maxage',
					'long',
				'data',
					bundle
			)
		);

	Jools.log( 'start', 'bundle:', bundleFilePath );

	// if uglify is turned on
	// the flags are added after bundle
	// creation, otherwise before
	if( config.uglify )
	{
		this.prependConfigFlags( );
	}

	// post processing
	inv =
		this.inventory;

	// loads the files to be bundled
	for(
		a = 0, aZ = inv.list.length;
		a < aZ;
		a++
	)
	{
		resource =
			inv.list[ a ];

		if(
			!resource.postProcessor
			||
			!resource.data
		)
		{
			continue;
		}

		if( !PostProcessor[ resource.postProcessor ] )
		{
			throw new Error(
				'invalid postProcessor: ' +
					resource.postProcessor
			);
		}

		this.inventory =
			this.inventory.updateResource(
				resource,
				resource.Create(
					'data',
						PostProcessor[ resource.postProcessor ](
							resource.data,
							this.inventory,
							bundleFilePath
						)
				)
			);
	}

	inv =
		this.inventory;

	// prepares the zipped versions
	for(
		a = 0, aZ = inv.list.length;
		a < aZ;
		a++
	)
	{
		resource =
			inv.list[ a ];

		if( resource.inBundle || resource.devel )
		{
			continue;
		}

		this.inventory =
			this.inventory.updateResource(
				resource,
				resource.Create(
					'gzip',
						yield zlib.gzip(
							resource.data,
							sus.resume( )
						)
				)
			);
	}

	Jools.log(
		'start',
		'uncompressed bundle size is ',
		this.inventory.map[ bundleFilePath ].data.length
	);

	Jools.log(
		'start',
		'  compressed bundle size is ',
		this.inventory.map[ bundleFilePath ].gzip.length
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
		resource =
			this.inventory.map[ 'config.js' ];

	this.inventory =
		this.inventory.updateResource(
			resource,
			resource.Create(
				'data',
					'var JOOBJ = false;\n' +
					'var CHECK = true;\n' +
					'var SERVER = false;\n' +
					'var SHELL = true;\n' +
					resource.data
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

	if( !config.noWrite )
	{
		fs.writeFileSync(
			'report/manglemap.txt',
			util.inspect( mangle )
		);
	}

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
	// TODO
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

	if( username === undefined )
	{
		throw Jools.reject( 'user missing' );
	}

	if( this.$users[username].pass !== passhash )
	{
		throw Jools.reject( 'invalid pass' );
	}

	if( spaceUser === undefined )
	{
		throw Jools.reject( 'spaceUser missing' );
	}

	if( spaceTag === undefined )
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

	if( time === undefined )
	{
		throw Jools.reject( 'time missing' );
	}

	if( chgX === undefined )
	{
		throw Jools.reject( 'chgX missing' );
	}

	if( cid === undefined )
	{
		throw Jools.reject( 'cid missing' );
	}

	var
		spaceName =
			spaceUser + ':' + spaceTag;

	var
		space =
			this.$spaces[ spaceName ];

	if( space === undefined )
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
			chgX === null
			||
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
		chgX === null
		||
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
		result =
			chgX.changeTree(
				space.$tree
			);

	space.$tree =
		result.tree;

	chgX =
		result.chgX;

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
	if( cmd.user === undefined )
	{
		throw Jools.reject( 'user missing' );
	}

	if( cmd.passhash === undefined )
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
					sus.resume( )
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
| FIXME uppercase
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
					sus.resume( )
				),

			$changes :
				[ ],

			$tree :
				Visual.Space.Create( ),

			$seqZ :
				1
		};


	yield this.$db.spaces.insert(
		{
			_id : spaceName
		},
		sus.resume( )
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
	// TODO 

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

	if( username === undefined )
	{
		return Jools.reject( 'user missing' );
	}

	if( passhash === undefined )
	{
		return Jools.reject( 'passhash missing' );
	}

	if( mail === undefined )
	{
		return Jools.reject( 'mail missing' );
	}

	if( news === undefined )
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
				sus.resume( )
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
		sus.resume( )
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
		result
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

	if( user === undefined )
	{
		throw Jools.reject( 'User missing' );
	}

	if( passhash === undefined )
	{
		throw Jools.reject( 'Passhash missing' );
	}

	if( this.$users[user].pass !== passhash )
	{
		throw Jools.reject( 'Invalid password' );
	}

	if( spaceUser === undefined )
	{
		throw Jools.reject( 'spaceUser missing' );
	}

	if( spaceTag === undefined )
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
			result :
				result,
			spaceUser :
				spaceUser,
			spaceTag :
				spaceTag
		};

	result.sleepID =
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

	var
		result =
			sleep.result;

	result.writeHead(
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

	result.end(
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

		var
			asw =
				this.conveyUpdate(
					sleep.time,
					sleep.mseq,
					sleep.spaceUser,
					sleep.spaceTag
				),

			result =
				sleep.result;

		Jools.log( 'ajax', '->', asw );

		result.writeHead(200,
			{
				'Content-Type' :
					'application/json',
				'Cache-Control' :
					'no-cache',
				'Date' :
					new Date().toUTCString()
			}
		);

		result.end( JSON.stringify( asw ) );
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
		a,
		b,
		access,
		changes,
		chgX,
		node,
		passhash,
		seqZ,
		spaceName,
		spaceTag,
		spaceUser,
		time,
		tree,
		user;

	passhash =
		cmd.passhash;

	spaceTag =
		cmd.spaceTag;

	spaceUser =
		cmd.spaceUser;

	time =
		cmd.time;

	user =
		cmd.user;

	if( !cmd.user )
	{
		throw Jools.reject('user missing');
	}

	if( !cmd.passhash )
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

	spaceName =
		cmd.spaceUser + ':'  + cmd.spaceTag;

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

	tree =
		space.$tree;

	// if the requested tree is not the latest, replay it backwards
	for(
		a = seqZ - 1;
		a >= time;
		a--
	)
	{
		chgX =
			changes[ a ].chgX;

		for(
			b = 0;
			b < chgX.length;
			b++
		)
		{
			tree =
				chgX
				.get( b )
				.invert( )
				.changeTree( tree )
				.tree;
		}
	}

	// returns the path requested

	try
	{
		node =
			tree.getPath(
				Path.Create(
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
		result,
		code,
		message
	)
{
	result.writeHead(
		code,
		{
			'Content-Type' :
				'text/plain',
			'Cache-Control' :
				'no-cache',
			'Date' :
				new Date().toUTCString()
		}
	);

	message =
		code + ' ' + message;

	Jools.log( 'web', 'error', code, message );

	result.end( message );
};


/*
| Listens to http requests
*/
Server.prototype.requestListener =
	function*(
		request,
		result
	)
{
	var
		aenc,
		header,
		pathname,
		resource,
		red;

	red =
		url.parse( request.url );

	Jools.log(
		'web',
		request.connection.remoteAddress,
		red.href
	);

	pathname =
		red.pathname.replace( /^[\/]+/g, '' );

	if( pathname === 'mm' )
	{
		return this.webAjax( request, red, result );
	}

	resource =
		this.inventory.map[ pathname ];

	if( !resource )
	{

		this.webError(
			result,
			'404 Bad Request'
		);

		return;
	}

	if( resource.data )
	{
		aenc =
			resource.gzip && request.headers[ 'accept-encoding' ],

		header =
			{
				'Content-Type' :
					resource.mime,
				'Cache-Control' :
					MaxAge.map( resource.maxage ),
				'Date' :
					new Date().toUTCString()
			};

		if( aenc && aenc.indexOf( 'gzip' ) >= 0 )
		{
			// delivers compressed
			header[ 'Content-Encoding' ] =
				'gzip';

			result.writeHead(
				200,
				header
			);

			result.end(
				resource.gzip,
				'binary'
			);
		}
		else
		{
			// delivers uncompressed
			result.writeHead(
				200,
				header
			);

			result.end(
				resource.data,
				resource.coding
			);
		}

		return;
	}

	if( !config.develShell )
	{
		this.webError(
			result,
			'404 Bad Request'
		);
	}

	var
		data;

	// if the joobj is requested generate that one from the file
	if( resource.isJoobj )
	{
		try{
			data =
				yield* GenerateJoobj.run( resource );
		}
		catch( e )
		{
			this.webError(
				result,
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
					resource.filePath,
					sus.resume( )
				);
		}
		catch( e )
		{
			this.webError(
				result,
				500,
				'Internal Server Error'
			);

			Jools.log(
				'fail',
				'Missing file: ' + resource.filePath
			);

			return;
		}
	}

	if( resource.postProcessor )
	{
		if( !PostProcessor[ resource.postProcessor ] )
		{
			throw new Error(
				'invalid postProcessor: ' +
					resource.postProcessor
			);
		}

		data =
			PostProcessor[ resource.postProcessor ](
				data,
				this.inventory,
				this.bundleFilePath
			);
	}

	result.writeHead(
		200,
		{
			'Content-Type' :
				resource.mime,
			'Cache-Control' :
				'no-cache',
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

	result.end(
		data,
		resource.coding
	);
};


/*
| Handles ajax requests to the MeshMashine.
*/
Server.prototype.webAjax =
	function(
		request,
		red,
		result
	)
{
	var
		self =
			this,

		data =
			[ ];

	if( request.method !== 'POST' )
	{
		this.webError(
			result,
			400,
			'Must use POST'
		);

		return;
	}

	request.on(
		'close',
		function( )
		{
			if( result.sleepID )
			{
				self.closeSleep( result.sleepID );
			}
		}
	);

	request.on(
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
					result,
					400,
					'Not valid JSON'
				);

				return;
			}

			try
			{
				asw =
					yield* self.ajaxCmd( cmd, result );
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

			result.writeHead( 200,
				{
					'Content-Type' :
						'application/json',

					'Cache-Control' :
						'no-cache',

					'Date' :
						new Date().toUTCString()
				}
			);

			result.end(
				JSON.stringify( asw )
			);
		};

	request.on(
		'end',
		function( )
		{
			sus( handler )( );
		}
	);

	/*
	request.on( 'end', function( )
		{
			setTimeout( handler, 1880 );
		});
	*/
};


/*
| Executes an ajaxCmd
*/
Server.prototype.ajaxCmd =
	function*( cmd, result )
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
			return this.cmdUpdate( cmd, result );

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

sus( run )( );

} )( );
