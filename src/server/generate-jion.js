/*
| Generates the jion of a resource.
*/


/*
| Export
*/
var
	generateJion;

module.exports =
generateJion =
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
	config,
	formatter,
	fs,
	generator,
	jools,
	resultGenjion,
	sus,
	vm;


config = require( '../../config' );

formatter = require( '../format/formatter' );

fs = require( 'fs' );

generator = require( '../jion/generator' );

jools = require( '../jools/jools' );

resultGenjion = require( '../result/genjion' );

sus = require( 'suspend' );

vm = require( 'vm' );

/*
| Runs a generate jion operation.
*/
generateJion.run =
	function*(
		resource
	)
{
	var
		ast,
		generate,
		hasJSON,
		input,
		inputFileStat,
		joi,
		jion,
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
			null;
	}

	// true if the jion file needs to created
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
		+
		resource.aliases[ 0 ]
	);

	input =
		yield fs.readFile(
			resource.jionSrcPath,
			sus.resume( )
		);

	jion =
		vm.runInNewContext(
			input,
			{
				JION : true
			},
			resource.jionSrcPath
		);

	if( generate )
	{
		ast = generator.generate( jion );

		output = formatter.format( ast );

		if( !config.noWrite )
		{
			yield fs.writeFile(
				resource.filePath,
				output,
				sus.resume( )
			);
		}
	}
	else
	{
		// just read in the already generated Jion
		output =
			(
				yield fs.readFile(
					resource.filePath,
					sus.resume( )
				)
			)
			+
			'';
	}

	hasJSON = false;

	if( jion.json )
	{
		hasJSON = true;
	}
	else if( jion.attributes )
	{
		for( var at in jion.attributes )
		{
			if( jion.attributes[ at ].json )
			{
				hasJSON = true;

				break;
			}
		}
	}

	return(
		resultGenjion.create(
			'jionID', jion.id,
			'hasJSON', hasJSON,
			'code', output
		)
	);
};


} )( );
