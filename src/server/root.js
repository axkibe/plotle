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

		spaceBox : require( './space-box' ),

		tools : require( './tools' )
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
| create replacement until root is a JION
*/
prototype.create =
	function( )
{
	var
		a,
		arg,
		aZ,
		replace;

	replace = new server.root( );

	for( arg in this )
	{
		if( this.hasOwnProperty( arg ) )
		{
			replace[ arg ] = this[ arg ];
		}
	}

	for(
		a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		replace[ arguments[ a ] ] = arguments[ a + 1 ];
	}

	root = replace;

	return replace;
};


/*
| Sets up the server.
|*/
prototype.startup =
	function*( )
{
	// the servers inventory
	root.create( 'inventory', server.inventory.create( ) );

	root.create( 'repository', yield* repository.connect( ) );

	root.create(
		// all spaces
		'$spaces', { },

		// a table of all clients waiting for an update
		'$upsleep', { },

		// next upsleepID
		'$nextSleep', 1,

		// next visitors ID
		'$nextVisitor', 1000,

		// table of all cached user credentials
		'$users', { }
	);

	yield* root.prepareInventory( );

	yield* root.loadSpaces( );

	jools.log(
		'start',
		'starting server @ http://' +
			( config.ip || '*' ) + '/:' + config.port
	);

	yield http.createServer(
		function(
			request,
			result
		)
		{
			sus( root.requestListener ).call( root, request, result );
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
		yield root.repository.spaces.find(
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
		yield* root.loadSpace(
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
	function*(
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
		root.$spaces[ spaceRef.fullname ] =
			/*
			server.spaceBox.create(
				'changesDB',
					yield* root.repository.collection(
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
					yield* root.repository.collection(
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
| Builds the shells config.js file.
*/
prototype.buildShellConfig =
	function( )
{
	var
		cconfig,
		first,
		k,
		val;

	cconfig = [ ];

	cconfig.push(
		'var config = {\n',
		'\tdevel   : ',
			config.develShell,
			',\n',
		'\tmaxUndo : ',
			config.maxUndo, ',\n',
		'\tdebug   : {\n'
	);

	first = true;

	for( k in config.debug )
	{
		val = config.debug[ k ];

		if( !first )
		{
			cconfig.push( ',\n' );
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

	first = true;

	for( k in config.log )
	{
		if( !first )
		{
			cconfig.push( ',\n' );
		}
		else
		{
			first = false;
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
	function*( )
{
	var
		a,
		ast,
		aZ,
		bundle,
		bundleFilePath,
		cconfig,
		code,
		codes,
		compressor,
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
			'data', root.buildShellConfig( ),
			'filePath', 'config.js',
			'inBundle', true,
			'inTestPad', true
		);

	root.create(
		'inventory', root.inventory.addResource( cconfig )
	);

	// takes resource from the the roster
	for(
		a = 0, aZ = roster.length;
		a < aZ;
		a++
	)
	{
		resource = roster[ a ];

		if( resource.devel && !config.develShell )
		{
			continue;
		}

		if( resource.hasJion )
		{
			root.create(
				'inventory',
					root.inventory.addResource( resource.asJion )
			);
		}

		root.create(
			'inventory', root.inventory.addResource( resource )
		);
	}

	// Reads in all files to be cached
	inv = root.inventory;

	for(
		a = 0, aZ = inv.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = inv.atRank( a );

		if(
			resource.data
			|| resource.inBundle
			|| resource.devel
			|| resource.isJion
		)
		{
			continue;
		}

		root.create(
			'inventory',
				root.inventory.updateResource(
					resource,
					resource.create(
						'data',
							( yield fs.readFile(
								resource.filePath,
								sus.resume( )
							) )
					)
				)
		);
	}

	// the bundle itself
	bundle = [ ];

	// if uglify is turned off
	// the flags are added before bundle
	// creation, otherwise afterwards
	if( !config.uglify )
	{
		root.prependConfigFlags( );
	}

	jools.log( 'start', 'building bundle' );

	jionIDs = { };

	codes = [ ];

	// loads the files to be bundled
	for(
		a = 0, aZ = root.inventory.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = root.inventory.atRank( a );

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
		a = 0, aZ = root.inventory.ranks.length;
		a < aZ;
		a++
	)
	{
		resource = root.inventory.atRank( a );

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
		root.extraMangle( ast, jionIDs );
	}

	if( config.uglify )
	{
		jools.log( 'start', 'uglifying bundle' );

		ast.figure_out_scope( );

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
	bundleFilePath = 'ideoloom-' + sha1.sha1hex( bundle ) + '.js';

	root.create( 'bundleFilePath', bundleFilePath );

	// registers the bundle as resource
	root.create(
		'inventory',
			root.inventory.addResource(
				server.resource.create(
					'filePath', bundleFilePath,
					'maxage', 'long',
					'data', bundle
				)
			)
	);

	jools.log( 'start', 'bundle:', bundleFilePath );

	// if uglify is turned on
	// the flags are added after bundle
	// creation, otherwise before
	if( config.uglify )
	{
		root.prependConfigFlags( );
	}

	// post processing
	inv = root.inventory;

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
				'invalid postProcessor: ' + resource.postProcessor
			);
		}

		root.inventory =
			root.inventory.updateResource(
				resource,
				resource.create(
					'data',
						postProcessor[ resource.postProcessor ](
							resource.data,
							root.inventory,
							bundleFilePath
						)
				)
			);
	}

	inv = root.inventory;

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

		root.inventory =
			root.inventory.updateResource(
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
		root.inventory.twig[ bundleFilePath ].data.length
	);

	jools.log(
		'start',
		'  compressed bundle size is ',
		root.inventory.twig[ bundleFilePath ].gzip.length
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

	resource = root.inventory.twig[ 'config.js' ];

	root.create(
		'inventory',
			root.inventory.updateResource(
				resource,
				resource.create(
					'data',
						'var JION = false;\n'
						+ 'var CHECK = true;\n'
						+ 'var SERVER = false;\n'
						+ 'var SHELL = true;\n'
						+ resource.data
				)
			)
	);
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
			'property' : 'p',
			'key' : 'p',
			// string values are mangled
			// but do not flag properties missed
			'value' : 's'
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

		if( mangle[ e ] || noMangle[ e ] )
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

		mangle[ at ] = '$$' + server.tools.b64Encode( a );
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
		spaceRef,
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

	spaceRef = req.spaceRef;

	username = req.user;

	passhash = req.passhash;

	if( root.$users[ username ].pass !== passhash  )
	{
		throw jools.reject( 'invalid pass' );
	}

	if( root.testAccess( username, spaceRef ) !== 'rw' )
	{
		throw jools.reject( 'no access' );
	}

	space = root.$spaces[ spaceRef.fullname ];

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

	process.nextTick(
		function( )
		{
			root.wake( spaceRef );
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
	function*(
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

	users = root.$users;

	if( req.user === 'visitor' )
	{
		do
		{
			root.$nextVisitor++;

			uid = 'visitor-' + root.$nextVisitor;
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
			yield root.repository.users.findOne(
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
	root.$spaces[ spaceRef.fullname ] =
		{
			$changesDB :
				yield* root.repository.collection( 'changes:' + spaceRef.fullname ),
			$changes : [ ],
			$tree : visual.space.create( ),
			$seqZ : 1
		};

	yield root.repository.spaces.insert(
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
		yield root.repository.users.findOne(
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

	yield root.repository.users.insert( user, sus.resume( ) );

	root.$users[ username ] = user;

	yield* root.createSpace(
		fabric.spaceRef.create( 'username', username, 'tag', 'home' )
	);

	return { ok : true };
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
		spaceRef,
		user;

	try
	{
		req = request.update.createFromJSON( req );
	}
	catch( err )
	{
		console.log( err.stack );

		return jools.reject( 'command not valid jion' );
	}

	user = req.user;

	passhash = req.passhash;

	spaceRef = req.spaceRef;

	seq = req.seq;

	if( root.$users[user].pass !== passhash )
	{
		throw jools.reject( 'Invalid password' );
	}

	space = root.$spaces[ spaceRef.fullname ];

	if( !space )
	{
		return jools.reject( 'Unknown space' );
	}

	if ( !( seq >= 0 && seq <= space.$seqZ ) )
	{
		return jools.reject( 'Invalid or missing seq: ' + seq );
	}

	asw = root.conveyUpdate( seq, spaceRef );

	// immediate answer?
	if( asw.chgs.length > 0 )
	{
		return asw;
	}

	// if not an immediate anwwer, the request is put to sleep
	sleepID = '' + root.$nextSleep++;

	timerID =
		setTimeout(
			root.expireSleep,
			60000,
			sleepID
		);

	root.$upsleep[ sleepID ] =
		{
			user : user,
			seq : seq,
			timerID : timerID,
			result : result,
			spaceRef : spaceRef
		};

	result.sleepID = sleepID;

	return null;
};


/*
| A sleeping update expired.
*/
prototype.expireSleep =
	function(
		sleepID
	)
{
	var
		asw,
		result,
		seqZ,
		sleep,
		space;

	sleep = root.$upsleep[ sleepID ];

	// maybe it just had expired at the same time
	if( !sleep )
	{
		return;
	}

	space = root.$spaces[ sleep.spaceRef.fullname ];

	seqZ = space.$seqZ;

	delete root.$upsleep[ sleepID ];

	asw =
		{
			ok : true,
			seq : sleep.seq,
			seqZ : seqZ,
			chgs : null
		};

	jools.log( 'ajax', '->', asw );

	result = sleep.result;

	result.writeHead(
		200,
		{
			'Content-Type' : 'application/json',
			'Cache-Control' : 'no-cache',
			'Date' : new Date().toUTCString()
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

	sleep = root.$upsleep[ sleepID ];

	// maybe it just had expired at the same time
	if( !sleep )
	{
		return;
	}

	clearTimeout( sleep.timerID );

	delete root.$upsleep[ sleepID ];
};


/*
| Returns a result for an update operation.
*/
prototype.conveyUpdate =
	function(
		seq,     // ???
		spaceRef // reference of space
	)
{
	var
		space,
		changes,
		seqZ,
		chgA;

	space = root.$spaces[ spaceRef.fullname ];

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
		spaceRef
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

	sleepKeys = Object.keys( root.$upsleep );

	// FIXME cache change lists to answer the same to multiple clients.
	for(
		a = 0, aZ = sleepKeys.length;
		a < aZ;
		a++
	)
	{
		sKey = sleepKeys[a];

		sleep = root.$upsleep[sKey];

		if( !spaceRef.equals( sleep.spaceRef ) )
		{
			continue;
		}

		clearTimeout( sleep.timerID );

		delete root.$upsleep[ sKey ];

		asw = root.conveyUpdate( sleep.seq, sleep.spaceRef );

		result = sleep.result;

		jools.log( 'ajax', '->', asw );

		result.writeHead(
			200,
			{
				'Content-Type' : 'application/json',
				'Cache-Control' : 'no-cache',
				'Date' : new Date().toUTCString()
			}
		);

		result.end( JSON.stringify( asw ) );
	}
};


/*
| Tests if the user has access to a space.
*/
prototype.testAccess =
	function(
		user,
		spaceRef
	)
{
	if( spaceRef.username == 'ideoloom' )
	{
		switch( spaceRef.tag )
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

	if( user === spaceRef.username )
	{
		return 'rw';
	}

	return 'no';
};


/*
| Serves a get request.
*/
prototype.serveRequestAcquire =
	function*(
		req
	)
{
	var
		access,
		passhash,
		space,
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

	user = req.user;

	if(
		root.$users[ user ] === undefined
		||
		passhash !== root.$users[ user ].pass
	)
	{
		throw jools.reject( 'wrong user/password' );
	}

	access = root.testAccess( user, req.spaceRef );

console.log( 'REQ', req.spaceRef );

	if( access === 'no' )
	{
		return {
			ok : true,
			access : access,
			status : 'no access'
		};
	}

	space = root.$spaces[ req.spaceRef.fullname ];

	if( !space )
	{
		if( req.createMissing === true )
		{
			space = yield* root.createSpace( req.spaceRef );
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

			root.webError( result, 403, 'Forbidden' );

			return;
		}
	}

	pathname = red.pathname.replace( /^[\/]+/g, '' );

	if( pathname === 'mm' )
	{
		return root.webAjax( request, red, result );
	}

	resource = root.inventory.twig[ pathname ];

	if( !resource )
	{
		root.webError( result, 404, 'Bad Request' );

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
		root.webError( result, 404, 'Bad Request' );
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
			root.webError( result, 500, 'Internal Server Error' );

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
			root.webError( result, 500, 'Internal Server Error' );

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
				root.inventory,
				root.bundleFilePath
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
		data;

	data = [ ];

	if( request.method !== 'POST' )
	{
		root.webError( result, 400, 'Must use POST' );

		return;
	}

	request.on(
		'close',
		function( )
		{
			if( result.sleepID )
			{
				root.closeSleep( result.sleepID );
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
			root.webError( result, 400, 'Not valid JSON' );

			return;
		}

		try
		{
			asw = yield* root.serveRequest( cmd, result );
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

			return root.serveRequestAlter( req );

		case 'request.auth' :

			return yield* root.serveRequestAuth( req );

		case 'request.acquire' :

			return yield* root.serveRequestAcquire( req );

		case 'request.register' :

			return yield* root.serveRequestRegister( req );

		case 'request.update' :

			return root.serveRequestUpdate( req, result );

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
