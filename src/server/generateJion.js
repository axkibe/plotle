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
	config,
	format_formatter,
	fs,
	generator,
	jools,
	result_genjion,
	sus,
	vm;


config = require( '../../config' );

format_formatter = require( '../format/formatter' );

fs = require( 'fs' );

generator = require( '../jion/generator' );

jools = require( '../jools/jools' );

result_genjion = require( '../result/genjion' );

sus = require( 'suspend' );

vm = require( 'vm' );

/*
| Runs a generate jion operation.
*/
server_generateJion.run =
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
			undefined;
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
		+ resource.aliases.get( 0 )
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

		output = format_formatter.format( ast );

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
		result_genjion.create(
			'jionID', jion.id,
			'hasJSON', hasJSON,
			'code', output
		)
	);
};


} )( );
