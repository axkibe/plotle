/*
| Generates the jion of a resource.
|
| Authors: Axel Kittenberger
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
	result,
	sus,
	vm;


config = require( '../../config' );

formatter = require( '../format/formatter' );

fs = require( 'fs' );

generator = require( '../jion/gen' );

jools = require( '../jools/jools' );

result =
	{
		genjion :
			require( '../result/genjion' )
	};

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
		input,
		inputFileStat,
		joi,
		jion,
		output,
		outputFileStat;

	fs.stat(
		resource.jionSrcPath,
		sus.fork( )
	);

	fs.stat(
		resource.filePath,
		sus.fork( )
	);

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
		||
		!outputFileStat
		||
		inputFileStat.mtime > outputFileStat.mtime;

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
				JION :
					true
			},
			resource.jionSrcPath
		);

	ast = generator.generate( jion, !generate );

	if( generate )
	{
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

	return(
		result.genjion.create(
			'code',
				output,
			'jionID',
				ast.jionID,
			'hasJSON',
				ast.hasJSON
		)
	);
};


} )( );
