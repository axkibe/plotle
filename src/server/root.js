/*
| The root of the server.
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
GLOBAL.APP = 'server';

// does not load jion code if out of date.
GLOBAL.FORCE_JION_LOADING = false;

// the name the runtime created jions are stored
// under
GLOBAL.SHELLAPP = 'shell';

// server keeps checking on by default
GLOBAL.CHECK = true;

// this is not a jion creation
GLOBAL.JION = false;

// server is a server
GLOBAL.SERVER = true;

// and not a shell
GLOBAL.SHELL = false;


var
	ccot,
	config,
	db_version,
	fabric,
	fs,
	generateJion,
	http,
	isString,
	jion,
	jools,
	maxAge,
	mongodb,
	prototype,
	postProcessor,
	request,
	repository,
	roster,
	server,
	sha1,
	sus,
	uglify,
	url,
	util,
	visual,
	zlib;

db_version = 8;

config = require( '../../config' );

fs = require( 'fs' );

generateJion = require( './generate-jion' );

http = require( 'http' );

ccot =
	{
		change : require( '../ccot/change' ),

		changeRay : require( '../ccot/change-ray' ),

		changeWrap : require( '../ccot/change-wrap' ),

		changeWrapRay : require( '../ccot/change-wrap-ray' ),
	};

jion =
	{
		path :
			require( '../jion/path' ),
	};

jools = require( '../jools/jools' );

isString = jools.isString;

maxAge = require( './max-age' );

mongodb = require( 'mongodb' );

postProcessor = require( './post-processor' );

repository = require( '../database/repository' );

request =
	{
		acquire : require( '../request/acquire' ),

		alter : require( '../request/alter' ),

		auth : require( '../request/auth' ),

		register : require( '../request/register' ),

		update : require( '../request/update' )
	};

roster = require( './roster' );

server =
	{
		inventory : require( './inventory' ),

		resource : require( './resource' ),

		spaceBox : require( './space-box' )
	};

sha1 = require( '../jools/sha1' );

sus = require( 'suspend' );

uglify = require( 'uglify-js' );

url = require( 'url' );

util = require( 'util' );

fabric =
	{
		spaceRef : require( '../fabric/space-ref' )
	};

visual =
	{
		space : require( '../visual/space' )
	};

zlib = require( 'zlib' );


/*
| Constructor.
*/
server.root =
	function( )
	{
		// pass
	};


prototype = server.root.prototype;


/*
| Sets up the server.
|*/
prototype.startup =
	function*( )
{
	var
		requestListener,
		self;

	self = this;

	// the servers inventory
	this.inventory = server.inventory.create( );

	this.repository = yield* repository.connect( );

	// all messages
	this.$messages = [ ];

	// all spaces
	this.$spaces = { };

	// a table of all clients waiting for an update
	this.$upsleep = { };

	// next upsleepID
	this.$nextSleep = 1;

	// next visitors ID
	this.$nextVisitor = 1000;

	// table of all cached user credentials
	this.$users = { };

	// the list where a user is present
	// user for 'entered' and 'left' messages
	this.$presences = { };

	yield* this.prepareInventory( );

	yield* this.loadSpaces( );

	jools.log(
		'start',
		'starting server @ http://' +
			( config.ip || '*' ) + '/:' + config.port
	);

	// FIXME this might go simpler
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
			sus( requestListener )( request, result );
		}
	).listen(
		config.port,
		config.ip,
		sus.resume( )
	);

	jools.log( 'start', 'server running' );
};


/*
| loads all spaces and playbacks all changes from the database.
*/
prototype.loadSpaces =
	function*( )
{
	var
		cursor;

	jools.log( 'start', 'loading and replaying all spaces' );

	cursor =
		yield this.repository.spaces.find(
			{ },
			{ sort: '_id' },
			sus.resume( )
		);

	for(
		var o = yield cursor.nextObject( sus.resume( ) );
		o !== null;
		o = yield cursor.nextObject( sus.resume( ) )
	)
	{
		yield* this.loadSpace(
			fabric.spaceRef.create(
				'username', o.username,
				'tag', o.tag
			)
		);
	}
};


/*
| loads a spaces and playbacks its changes from the database.
*/
prototype.loadSpace =
	function* (
		spaceRef
	)
{
	var
		change,
		cursor,
		o,
		space;

	jools.log(
		'start',
		'loading and replaying all "' + spaceRef.fullname + '"'
	);

	space =
		this.$spaces[ spaceRef.fullname ] =
			/*
			server.spaceBox.create(
				'changesDB',
					yield* this.repository.collection(
						'changes:' + spaceRef.fullname
					),
				'changes', [ ],
				'fabric', visual.space.create( ),
				'seqZ',
					1
			);
			*/
			{
				ref : spaceRef,
				$changesDB :
					yield* this.repository.collection(
						'changes:' + spaceRef.fullname
					),
				$changes : [ ],
				$tree : visual.space.create( ),
				$seqZ : 1
			};

	cursor =
		yield space.$changesDB.find(
			{ },
			{ sort : '_id' },
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

		// FIXME there is something quirky, why isn't *this* a "change"?
		change =
			{
				cid : o.cid,
				chgX : null
			};

		if ( !Array.isArray( o.chgX ) )
		{
			o.type = 'change'; // FUTURE this is a hack XXX

			change.chgX = ccot.change.createFromJSON( o.chgX );
		}
		else
		{
			change.chgX = ccot.changeRay.createFromJSON( o.chgX );
		}

		space.$seqZ++;

		space.$tree = change.chgX.changeTree( space.$tree ).tree;
	}
};


/*
| sends a message
*/
/*
prototype.sendMessage =
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
*/


/*
| Builds the shells config.js file.
*/
prototype.buildShellConfig =
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
			isString( val ) ? "'" : '',
			val,
			isString( val ) ? "'" : ''
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
prototype.prepareInventory =
	function* ( )
{
	var
		a,
		ast,
		aZ,
		bundleFilePath,
		cconfig,
		code,
		codes,
		gjr,
		inv,
		jionIDs,
		resource,
		sourceMap,
		stream;

	jools.log( 'start', 'preparing inventory' );

	// autogenerates the shell config as resource
	cconfig =
		server.resource.create(
			'data', this.buildShellConfig( ),
			'filePath', 'config.js',
			'inBundle', true,
			'inTestPad', true
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

		if( resource.hasJion )
		{
			this.inventory =
				this.inventory.addResource( resource.asJion );
		}

		this.inventory =
			this.inventory.addResource( resource );
	}

	// Reads in all files to be cached
	inv = this.inventory;

	for(
		a = 0, aZ = inv.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = inv.atRank( a );

		if(
			resource.data
			||
			resource.inBundle
			||
			resource.devel
			||
			resource.isJion
		)
		{
			continue;
		}

		this.inventory =
			this.inventory.updateResource(
				resource,
				resource.create(
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

	jools.log( 'start', 'building bundle' );

	jionIDs = { };

	codes = [ ];

	// loads the files to be bundled
	for(
		a = 0, aZ = this.inventory.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = this.inventory.atRank( a );

		if( !resource.inBundle )
		{
			continue;
		}

		if( resource.isJion )
		{
			gjr = yield* generateJion.run( resource );

			jionIDs[ gjr.jionID ] = gjr.hasJSON;

			code = gjr.code;
		}
		else
		{
			if( !resource.data )
			{
				code =
					(
						yield fs.readFile(
							resource.filePath,
							sus.resume( )
						)
					)
					+
					'';
			}
			else
			{
				code = resource.data;
			}
		}

		codes[ a ] = code;
	}

	jools.log( 'start', 'parsing bundle' );

	for(
		a = 0, aZ = this.inventory.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = this.inventory.atRank( a );

		if( !resource.inBundle )
		{
			continue;
		}

		try{
			ast =
				uglify.parse(
					codes[ a ],
					{
						filename : resource.filePath,
						strict : true,
						toplevel : ast
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
		this.extraMangle( ast, jionIDs );
	}

	if( config.uglify )
	{
		jools.log( 'start', 'uglifying bundle' );

		ast.figure_out_scope( );

		var
			compressor =
				uglify.Compressor(
					{
						dead_code : true,
						hoist_vars : true,
						warnings : false,
						negate_iife : true,
						global_defs :
						{
							'CHECK' : config.shellCheck,
							'JION' : false,
							'SERVER' : false,
							'SHELL' : true,
						}
					}
				);

		ast = ast.transform( compressor );

		ast.figure_out_scope( );

		ast.compute_char_frequency( );

		ast.mangle_names(
			{
				toplevel : true,
				except : [ 'WebFont' ]
			}
		);
	}

	sourceMap = uglify.SourceMap( { } );

	stream =
		uglify.OutputStream(
			{
				beautify : config.beautify,
				source_map: sourceMap
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
		'ideoloom-' + sha1.sha1hex( bundle ) + '.js';

	// registers the bundle as resource
	this.inventory =
		this.inventory.addResource(
			server.resource.create(
				'filePath', bundleFilePath,
				'maxage', 'long',
				'data', bundle
			)
		);

	jools.log( 'start', 'bundle:', bundleFilePath );

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
		a = 0, aZ = inv.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = inv.atRank( a );

		if(
			!resource.postProcessor
			||
			!resource.data
		)
		{
			continue;
		}

		if( !postProcessor[ resource.postProcessor ] )
		{
			throw new Error(
				'invalid postProcessor: ' +
					resource.postProcessor
			);
		}

		this.inventory =
			this.inventory.updateResource(
				resource,
				resource.create(
					'data',
						postProcessor[ resource.postProcessor ](
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
		a = 0, aZ = inv.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = inv.atRank( a );

		if( resource.inBundle || resource.devel )
		{
			continue;
		}

		this.inventory =
			this.inventory.updateResource(
				resource,
				resource.create(
					'gzip',
						yield zlib.gzip(
							resource.data,
							sus.resume( )
						)
				)
			);
	}

	jools.log(
		'start',
		'uncompressed bundle size is ',
		this.inventory.twig[ bundleFilePath ].data.length
	);

	jools.log(
		'start',
		'  compressed bundle size is ',
		this.inventory.twig[ bundleFilePath ].gzip.length
	);
};


/*
| Prepends the flags to cconfig
| Used by development.
*/
prototype.prependConfigFlags =
	function( )
{
	var
		resource;

	resource = this.inventory.twig[ 'config.js' ];

	this.inventory =
		this.inventory.updateResource(
			resource,
			resource.create(
				'data',
					'var JION = false;\n' +
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
prototype.extraMangle =
	function(
		ast,
		jionIDs
	)
{
	var
		a,
		// ast properties mangled
		astProps,
		aZ,
		at,
		e,
		jionID,
		// associative of all mangles
		mangle,
		// mangle definitions:
		// a file that looks like this
		// ". value"  <-- this will be mangled
		// "> value"  <-- this will not be mangled
		mangleDefs,
		// an array of all mangles
		mangleList,
		// unknown properties / keys
		// that are missed in both lists
		missed,
		// associative of all no-mangles
		noMangle,
		// associative of all mangles not used
		useMangle,
		// associative of all no-mangles not used
		useNoMangle;

	missed = { };

	mangleDefs =
		(
			fs.readFileSync(
				'./mangle.txt'
			) + ''
		).split( '\n' );

	mangle = { };

	noMangle = { };

	useMangle = { };

	useNoMangle = { };

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
		at = mangleDefs[ a ];

		e = at.substring( 2 );

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

				mangle[ e ] = true;

				break;

			case '>' :

				noMangle[ e ] = true;

				break;
		}

	}

	// also mangles the jionIDs
	for( jionID in jionIDs )
	{
		if(
			// only mangle those not used in json
			jionIDs[ jionID ] === false
			&&
			!noMangle[ jionID ]
		)
		{
			mangle[ jionID ] = true;
		}
	}

	mangleList = Object.keys( mangle ).sort( );

	// allots all mangles a value
	for(
		a = 0, aZ = mangleList.length;
		a < aZ;
		a++
	)
	{
		at = mangleList[ a ];

		mangle[ at ] = '$$' + b64Count( a );
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
		useMangle[ a ] = true;
	}

	for( a in noMangle )
	{
		useNoMangle[ a ] = true;
	}

	// walks the syntax tree
	ast.walk( new uglify.TreeWalker(
		function( node )
		{
			var k, p;

			for( k in astProps )
			{
				p = node[ k ];

				if( p !== undefined )
				{
					break;
				}
			}

			if( !k )
			{
				return false;
			}

			if( !isString( node[ k ] ) )
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

				node[ k ] = mangle[ p ];

				return false;
			}

			// if this is a property it is marked as missed
			if( astProps[ k ] === 'p' )
			{
				missed[ p ] = true;
			}

			return false;
		}
	));

	// turns check lists into arrays and sorts them
	missed = Object.keys( missed ).sort( );

	useMangle = Object.keys( useMangle ).sort( );

	useNoMangle = Object.keys( useNoMangle ).sort( );

	if( missed.length > 0 )
	{
		console.log(
			'extraMangle missed '
			+ missed.length
			+ ' properties: ',
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
| Serves an alter request.
*/
prototype.serveRequestAlter =
	function(
		req
	)
{
	var
		a,
		changes,
		changeWrapRay,
		chgX,
		cid,
		passhash,
		result,
		seq,
		seqZ,
		space,
		spaceName,
		spaceUser,
		spaceTag,
		username;

	try
	{
		req = request.alter.createFromJSON( req );
	}
	catch( err )
	{
		return jools.reject( 'command not valid jion' );
	}

	seq = req.seq;

	changeWrapRay = req.changeWrapRay;

	spaceUser = req.spaceUser;

	spaceTag = req.spaceTag;

	username = req.user;

	passhash = req.passhash;

	if( this.$users[ username ].pass !== passhash )
	{
		throw jools.reject( 'invalid pass' );
	}

	if(
		this.testAccess( username, spaceUser, spaceTag ) !== 'rw'
	)
	{
		throw jools.reject( 'no access' );
	}

	spaceName = spaceUser + ':' + spaceTag;

	space = this.$spaces[ spaceName ];

	changes = space.$changes;

	seqZ = space.$seqZ;

	if( seq === -1 )
	{
		seq = seqZ;
	}

	if( seq < 0 || seq > seqZ )
	{
		throw jools.reject( 'invalid seq' );
	}


	if( changeWrapRay.length !== 1 )
	{
		throw jools.reject( 'FIXME changeWrapRay.length must be 1' );
	}

	cid = changeWrapRay.get( 0 ).cid;

	chgX = changeWrapRay.get( 0 ).chgX;

	// translates the changes if not most recent
	for( a = seq; a < seqZ; a++ )
	{
		chgX = changes[ a ].chgX.transform( chgX );

		if(
			chgX === null
			||
			chgX.length === 0
		)
		{
			return {
				ok : true,
				chgX : chgX
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
			ok : true,
			chgX : chgX
		};
	}

	// applies the changes
	result = chgX.changeTree( space.$tree );

	space.$tree = result.tree;

	chgX = result.chgX;

	changes[ seqZ ] =
		{
			cid : cid,
			chgX : chgX
		};

	// saves the change(ray) in the database
	space.$changesDB.insert(
		{
			_id : seqZ,
			cid : cid,
			chgX : JSON.parse( JSON.stringify( chgX ) ), // needs to rid info.
			user : req.user,
			date : Date.now( )
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
		self;

	self = this;

	process.nextTick(
		function( )
		{
			self.wake( spaceUser, spaceTag );
		}
	);

	return {
		ok : true,
		chgX : chgX
	};
};


/*
| Serves an auth request.
*/
prototype.serveRequestAuth =
	function* (
		req
	)
{
	var
		uid,
		users,
		val;

	try
	{
		req = request.auth.createFromJSON( req );
	}
	catch( err )
	{
		console.log( err.stack );

		return jools.reject( 'command not valid jion' );
	}

	users = this.$users;

	if( req.user === 'visitor' )
	{
		do
		{
			this.$nextVisitor++;

			uid = 'visitor-' + this.$nextVisitor;
		}
		while( users[ uid ] );

		users[ uid ] =
			{
				user : uid,
				pass : req.passhash,
				created : Date.now( ),
				use : Date.now( )
			};

		return {
			ok : true,
			user : uid
		};
	}

	if( !users[ req.user ] )
	{
		val =
			yield this.repository.users.findOne(
				{ _id : req.user },
				sus.resume( )
			);

		if( val === null )
		{
			return jools.reject( 'Username unknown' );
		}

		users[ req.user ] = val;
	}

	if( users[ req.user ].pass !== req.passhash )
	{
		return jools.reject( 'Invalid password' );
	}

	return {
		ok : true,
		user : req.user
	};
};


/*
| Creates a new space.
*/
prototype.createSpace =
	function*(
		spaceRef
	)
{
	var
		space;

/**/if( CHECK )
/**/{
/**/	if( spaceRef.reflect !== 'fabric.spaceRef' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	space =
	this.$spaces[ spaceRef.fullname ] =
		{
			$changesDB :
				yield* this.repository.collection( 'changes:' + spaceRef.fullname ),
			$changes : [ ],
			$tree : visual.space.create( ),
			$seqZ : 1
		};

	yield this.repository.spaces.insert(
		{
			_id : spaceRef.fullname,
			username: spaceRef.username,
			tag : spaceRef.tag
		},
		sus.resume( )
	);

	return space;
};


/*
| Serves a register request.
*/
prototype.serveRequestRegister =
	function*(
		req
	)
{
	var
		username,
		passhash,
		mail,
		news,
		user;

	try
	{
		req = request.register.createFromJSON( req );
	}
	catch( err )
	{
		console.log( err.stack );

		return jools.reject( 'command not valid jion' );
	}


	username = req.user;

	passhash = req.passhash;

	mail = req.mail;

	news = req.news;

	if( username.substr( 0, 7 ) === 'visitor' )
	{
		return jools.reject( 'Username must not start with "visitor"' );
	}

	if( username.length < 4 )
	{
		return jools.reject( 'Username too short, min. 4 characters' );
	}

	user =
		yield this.repository.users.findOne(
			{ _id : username },
			sus.resume( )
		);

	if( user !== null )
	{
		return jools.reject( 'Username already taken' );
	}

	user = {
		_id : username,
		pass : passhash,
		mail : mail,
		news : news
	};

	yield this.repository.users.insert( user, sus.resume( ) );

	this.$users[ username ] = user;

	yield* this.createSpace(
		fabric.spaceRef.create( 'username', username, 'tag', 'home' )
	);

	return { ok : true };
};


/*
| Refreshes a users presence timeout.
*/
prototype.refreshPresence =
	function(
		user,
		spaceUser,
		spaceTag
	)
{
	var
		pu,
		pus,
		spaceName;

	pu = this.$presences[ user ];

	if( !pu )
	{
		pu =
		this.$presences[ user ] =
			{
				spaces : { }
			};
	}

	spaceName = spaceUser + ':' + spaceTag,

	pus = pu.spaces[ spaceName ];

	if( !pus )
	{
		pus =
		pu.spaces[ spaceName ] =
			{
				establish :
					0,
				timerID :
					null
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

		/*
		this.sendMessage(
			spaceUser,
			spaceTag,
			null,
			user + ' entered "' + spaceName + '"'
		);
		*/
	}
	else if( pus.references <= 0 )
	{
		if( pus.timerID !== null )
		{
			clearTimeout( pus.timerID );

			pus.timerID = null;
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
prototype.establishPresence =
	function(
		user,
		spaceUser,
		spaceTag
		// sleepID
	)
{
	var
		pres,
		pu,
		pus,
		spaceName;

	pres = this.$presences,

	pu = pres[ user ];

	if( !pu )
	{
		pu =
		pres[user] =
			{
				spaces :
					{ }
			};
	}

	spaceName = spaceUser + ':' + spaceTag,

	pus = pu.spaces[ spaceName ];

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

		/*
		this.sendMessage(
			spaceUser,
			spaceTag,
			null,
			user + ' entered "' + spaceName + '"'
		);
		*/
	}
	else
	{
		if( pus.timerID !== null )
		{
			clearTimeout( pus.timerID );

			pus.timerID = null;
		}

		pus.establish++;
	}
};


/*
| Destablishes a longer user presence for an update that went out of sleep.
*/
prototype.destablishPresence =
	function(
		user,
		spaceUser,
		spaceTag
	)
{
	var
		pu,
		pus,
		spaceName;

	pu = this.$presences[ user ],

	spaceName = spaceUser + ':' + spaceTag,

	pus = pu.spaces[ spaceName ];

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
prototype.expirePresence =
	function(
		self,
		user,
		spaceUser,
		spaceTag
	)
{
	var
		pu,
		spaceName;

	spaceName = spaceUser + ':' + spaceTag;

	/*
	self.sendMessage(
		spaceUser,
		spaceTag,
		null,
		user + ' left "' + spaceName + '"'
	);
	*/

	pu = self.$presences[ user ];

	if( pu.spaces[ spaceName ].establish !== 0 )
	{
		throw new Error( 'Something wrong with presences.' );
	}

	delete pu.spaces[ spaceName ];
};


/*
| Gets new changes or waits for them.
*/
prototype.serveRequestUpdate =
	function (
		req,
		result
	)
{
	var
		asw,
		passhash,
		seq,
		sleepID,
		timerID,
		space,
		spaceName,
		spaceUser,
		spaceTag,
		user;

	user = req.user;

	passhash = req.passhash;

	spaceUser = req.spaceUser;

	spaceTag = req.spaceTag;

	seq = req.seq;

	if( this.$users[user].pass !== passhash )
	{
		throw jools.reject( 'Invalid password' );
	}

	spaceName = spaceUser + ':' + spaceTag,

	space = this.$spaces[ spaceName ];

	if( !space )
	{
		return jools.reject( 'Unknown space' );
	}

	if ( !( seq >= 0 && seq <= space.$seqZ ) )
	{
		return jools.reject( 'Invalid or missing seq: ' + seq );
	}

	this.refreshPresence( user, spaceUser, spaceTag );

	asw = this.conveyUpdate( seq, spaceUser, spaceTag );

	// immediate answer?
	if( asw.chgs.length > 0 )
	{
		return asw;
	}

	// if not an immediate anwwer, the request is put to sleep
	sleepID = '' + this.$nextSleep++;

	timerID =
		setTimeout(
			this.expireSleep,
			60000,
			this,
			sleepID
		);

	this.$upsleep[ sleepID ] =
		{
			user : user,
			seq : seq,
			timerID : timerID,
			result : result,
			spaceUser : spaceUser,
			spaceTag : spaceTag
		};

	result.sleepID = sleepID;

	this.establishPresence( user, spaceUser, spaceTag, sleepID );

	return null;
};


/*
| A sleeping update expired.
*/
prototype.expireSleep =
	function(
		self,
		sleepID
	)
{
	var
		asw,
		result,
		seqZ,
		sleep,
		space,
		spaceName;

	sleep = self.$upsleep[ sleepID ];

	// maybe it just had expired at the same time
	if( !sleep )
	{
		return;
	}

	spaceName = sleep.spaceUser + ':' + sleep.spaceTag;

	space = self.$spaces[ spaceName ];

	seqZ = space.$seqZ;

	delete self.$upsleep[ sleepID ];

	//FIXME call it sleep.username
	self.destablishPresence(
		sleep.user,
		sleep.spaceUser,
		sleep.spaceTag
	);

	asw =
		{
			ok :
				true,
			seq :
				sleep.seq,
			seqZ :
				seqZ,
			chgs :
				null
		};

	jools.log( 'ajax', '->', asw );

	result = sleep.result;

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
prototype.closeSleep =
	function(
		sleepID
	)
{
	var sleep;

	sleep = this.$upsleep[ sleepID ];

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
prototype.conveyUpdate =
	function(
		seq,
		spaceUser,
		spaceTag
	)
{
	var
		spaceName,
		space,
		changes,
		seqZ,
		chgA;

	spaceName = spaceUser + ':' + spaceTag;

	space = this.$spaces[ spaceName ];

	changes = space.$changes;

	seqZ = space.$seqZ;

	chgA = [ ];

	for( var c = seq; c < seqZ; c++ )
	{
		chgA.push( changes[c] );
	}

	return {
		ok : true,
		seq : seq,
		seqZ : seqZ,
		chgs : chgA
	};
};


/*
| Wakes up any sleeping updates and gives them data if applicatable.
*/
prototype.wake =
	function(
		spaceUser,
		spaceTag
	)
{
	var
		a,
		asw,
		aZ,
		result,
		sKey,
		sleep,
		sleepKeys;

	sleepKeys = Object.keys( this.$upsleep );

	// FIXME cache change lists to answer the same to multiple clients.

	for(
		a = 0, aZ = sleepKeys.length;
		a < aZ;
		a++
	)
	{
		sKey = sleepKeys[a];

		sleep = this.$upsleep[sKey];

		if(
			spaceUser !== sleep.spaceUser ||
			spaceTag !== sleep.spaceTag
		)
		{
			continue;
		}

		clearTimeout( sleep.timerID );

		delete this.$upsleep[ sKey ];

		this.destablishPresence(
			sleep.user,
			sleep.spaceUser,
			sleep.spaceTag
		);

		asw =
			this.conveyUpdate(
				sleep.seq,
				sleep.spaceUser,
				sleep.spaceTag
			);

		result = sleep.result;

		jools.log( 'ajax', '->', asw );

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

		result.end( JSON.stringify( asw ) );
	}
};


/*
| Tests if the user has access to a space.
|
| FIXME hand a Spaceref object
*/
prototype.testAccess =
	function(
		user,
		spaceUser,
		spaceTag
	)
{
	if(
		!isString( spaceUser )
		||
		!isString( spaceTag )
	)
	{
		return 'no';
	}

	if( spaceUser == 'ideoloom' )
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
| Serves a get request.
*/
prototype.serveRequestAcquire =
	function* (
		req
	)
{
	var
		access,
		passhash,
		space,
		spaceRef,
		user;

	try
	{
		req = request.acquire.createFromJSON( req );
	}
	catch( err )
	{
		console.log( err.stack );

		return jools.reject( 'command not valid jion' );
	}

	passhash = req.passhash;

	spaceRef = req.space;

	user = req.user;

	if(
		this.$users[ user ] === undefined
		||
		passhash !== this.$users[ user ].pass
	)
	{
		throw jools.reject( 'wrong user/password' );
	}

	access = this.testAccess( user, spaceRef.username, spaceRef.tag );

	if( access === 'no' )
	{
		return {
			ok : true,
			access : access,
			status : 'no access'
		};
	}

	space = this.$spaces[ spaceRef.fullname ];

	if( !space )
	{
		if( req.createMissing === true )
		{
			space = yield* this.createSpace( spaceRef );
		}
		else
		{
			return {
				ok : true,
				access : access,
				status : 'nonexistent'
			};
		}
	}

	return {
		ok : true,
		status : 'served',
		access : access,
		seq : space.$seqZ,
		node : space.$tree
	};
};


/*
| Logs and returns a web error
*/
prototype.webError =
	function(
		result,
		code,
		message
	)
{
	result.writeHead(
		code,
		{
			'Content-Type' : 'text/plain',
			'Cache-Control' : 'no-cache',
			'Date' : new Date().toUTCString()
		}
	);

	message = code + ' ' + message;

	jools.log( 'web', 'error', code, message );

	result.end( message );
};


/*
| Listens to http requests
*/
prototype.requestListener =
	function*(
		request,
		result
	)
{
	var
		aenc,
		data,
		header,
		gjr,
		pathname,
		resource,
		red;

	red = url.parse( request.url );

	jools.log( 'web', request.connection.remoteAddress, red.href );

	if( config.whiteList )
	{
		if( !config.whiteList[ request.connection.remoteAddress ] )
		{
			jools.log( 'web', request.connection.remoteAddress, 'not in whitelist!' );

			this.webError( result, 403, 'Forbidden' );

			return;
		}
	}

	pathname = red.pathname.replace( /^[\/]+/g, '' );

	if( pathname === 'mm' )
	{
		return this.webAjax( request, red, result );
	}

	resource = this.inventory.twig[ pathname ];

	if( !resource )
	{
		this.webError( result, 404, 'Bad Request' );

		return;
	}

	if( resource.data )
	{
		aenc =
			resource.gzip
			&&
			request.headers[ 'accept-encoding' ],

		header =
			{
				'Content-Type' :
					resource.mime,
				'Cache-Control' :
					maxAge.map( resource.maxage ),
				'Date' :
					new Date().toUTCString()
			};

		if( aenc && aenc.indexOf( 'gzip' ) >= 0 )
		{
			// delivers compressed
			header[ 'Content-Encoding' ] = 'gzip';

			result.writeHead( 200, header );

			result.end( resource.gzip, 'binary' );
		}
		else
		{
			// delivers uncompressed
			result.writeHead( 200, header );

			result.end( resource.data, resource.coding );
		}

		return;
	}

	if( !config.develShell )
	{
		this.webError( result, 404, 'Bad Request' );
	}

	// if the jion is requested generate that one from the file
	if( resource.isJion )
	{
		try{
			gjr = yield* generateJion.run( resource );

			data = gjr.code;
		}
		catch( e )
		{
			this.webError( result, 500, 'Internal Server Error' );

			jools.log(
				'fail',
				'Error generating Jion: ' + e.toString( )
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
			this.webError( result, 500, 'Internal Server Error' );

			jools.log(
				'fail',
				'Missing file: ' + resource.filePath
			);

			return;
		}
	}

	if( resource.postProcessor )
	{
		if( !postProcessor[ resource.postProcessor ] )
		{
			throw new Error(
				'invalid postProcessor: ' +
					resource.postProcessor
			);
		}

		data =
			postProcessor[ resource.postProcessor ](
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

	result.end( data, resource.coding );
};


/*
| Handles ajax requests.
*/
prototype.webAjax =
	function(
		request,
		red,
		result
	)
{
	var
		handler,
		self,
		data;

	self = this;

	data = [ ];

	if( request.method !== 'POST' )
	{
		this.webError( result, 400, 'Must use POST' );

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

	handler =
		function*( )
	{
		var
			asw,
			cmd,
			query;

		query = data.join( '' ),


		jools.log( 'ajax', '<-', query );

		try
		{
			cmd = JSON.parse( query );
		}
		catch( err )
		{
			self.webError( result, 400, 'Not valid JSON' );

			return;
		}

		try
		{
			asw = yield* self.serveRequest( cmd, result );
		}
		catch( err )
		{
			if( err.ok !== false )
			{
				throw err;
			}
			else
			{
				jools.log(
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

		jools.log( 'ajax', '->', asw );

		result.writeHead( 200,
			{
				'Content-Type' : 'application/json',
				'Cache-Control' : 'no-cache',
				'Date' : new Date().toUTCString()
			}
		);

		result.end( JSON.stringify( asw ) );
	};

	request.on(
		'end',
		function( )
		{
			sus( handler )( );
		}
	);

	/*
	request.on(
		'end',
		function( )
		{
			setTimeout(
				function( )
				{
					sus( handler )( );
				},
				1880
			);
		}
	);
	*/
};


/*
| Serves an serveRequest
*/
prototype.serveRequest =
	function*(
		req,
		result
	)
{
	switch( req.type )
	{
		case 'request.alter' :

			return this.serveRequestAlter( req );

		case 'request.auth' :

			return yield* this.serveRequestAuth( req );

		case 'request.acquire' :

			return yield* this.serveRequestAcquire( req );

		case 'request.register' :

			return yield* this.serveRequestRegister( req );

		case 'request.update' :

			return this.serveRequestUpdate( req, result );

		default :

			return jools.reject( 'unknown command' );
	}
};


sus(
	function*( )
{
	GLOBAL.root = new server.root( );

	yield* GLOBAL.root.startup( );
}
)( );


} )( );
