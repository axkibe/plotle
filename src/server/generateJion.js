/*
| Generates the jion of a resource.
*/


/*
| Export
*/
var
	server_generateJion;

module.exports =
server_generateJion =
	{ };


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Imports
*/
var
	a,
	config,
	fs,
	jion,
	jionDef,
	jionDefRequire,
	jools,
	myDir,
	result_genjion,
	resume,
	sus,
	vm;

jion = require( 'jion' );

config = require( '../../config' );

fs = require( 'fs' );

jools = require( '../jools/jools' );

result_genjion = require( '../result/genjion' );

sus = require( 'suspend' );

resume = sus.resume;

vm = require( 'vm' );

myDir = module.filename;

for( a = 0; a < 3; a++ )
{
	myDir = myDir.substr( 0, myDir.lastIndexOf( '/' ) );
}

myDir += '/';

jionDefRequire =
	function( inFilename, requireFilename )
{
	return(
		require(
			myDir
			+ inFilename.substr( 0, inFilename.lastIndexOf( '/' ) )
			+ '/'
			+ requireFilename
		)
	);
};

/*
| Runs a generate jion operation.
*/
server_generateJion.run =
	function*(
		resource
	)
{
	var
		at,
		generate,
		global,
		hasJSON,
		input,
		inputFileStat,
		joi,
		output,
		outputFileStat;
	
	fs.stat( resource.jionSrcPath, sus.fork( ) );

	fs.stat( resource.filePath, sus.fork( ) );

	try
	{
		joi = yield sus.join( );

		inputFileStat = joi[ 0 ];

		outputFileStat = joi[ 1 ];
	}
	catch( err )
	{
		inputFileStat =
		outputFileStat =
			undefined;
	}

	// true if the jioncode file needs to created
	generate =
		!inputFileStat
		|| !outputFileStat
		|| inputFileStat.mtime > outputFileStat.mtime;

	jools.log(
		'start',
		(
			generate
			? 'generating '
			: 'loading '
		)
		+ resource.filePath
	);

	input = yield fs.readFile( resource.jionSrcPath, resume( ) );

	global = { JION: true };

	global.GLOBAL = global;

	global.require = jionDefRequire.bind( undefined, resource.jionSrcPath );

	jionDef = vm.runInNewContext( input, global, resource.jionSrcPath );
		
	if( generate )
	{
		output = jion.makeJionCode( jionDef );

		if( !config.noWrite )
		{
			yield fs.writeFile( resource.filePath, output, resume( ) );
		}
	}
	else
	{
		// just reads in the already generated jioncode
		output = ( yield fs.readFile( resource.filePath, resume( ) ) ) + '';
	}

	// FIXME is this needed?
	hasJSON = false;

	if( jionDef.json )
	{
		hasJSON = true;
	}
	else if( jionDef.attributes )
	{
		for( at in jionDef.attributes )
		{
			if( jionDef.attributes[ at ].json )
			{
				hasJSON = true;

				break;
			}
		}
	}

	return(
		result_genjion.create(
			'jionID', jionDef.id,
			'hasJSON', hasJSON,
			'code', output
		)
	);
};


} )( );
