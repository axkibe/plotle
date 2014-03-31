/*
| Generates the joobj of a resource for the shell.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	GenerateJoobj =
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
	config =
		require( '../../config' ),
	fs =
		require( 'fs' ),
	Formatter =
		require( '../format/formatter' ),
	Generator =
		require( '../joobj/genv2' ),
	Jools =
		require( '../jools/jools' ),
	sus =
		require( 'suspend' ),
	vm =
		require( 'vm' );


/*
| Runs a generate joobj operation.
*/
GenerateJoobj.run =
	function*(
		resource
	)
{
	var
		ast,
		input,
		inputFileStat,
		joobj,
		output,
		outputFileStat;

	fs.stat(
		resource.joobjSrcPath,
		sus.fork( )
	);

	fs.stat(
		resource.filePath,
		sus.fork( )
	);

	try
	{
		var
			joi =
				yield sus.join( );

		inputFileStat =
			joi[ 0 ];

		outputFileStat =
			joi[ 1 ];
	}
	catch( err )
	{
		inputFileStat =
		outputFileStat =
			null;
	}

	if(
		!inputFileStat
		||
		!outputFileStat
		||
		inputFileStat.mtime > outputFileStat.mtime
	)
	{
		Jools.log(
			'start',
			'generating ' +
				resource.aliases[ 0 ]
		);

		input =
			yield fs.readFile(
				resource.joobjSrcPath,
				sus.resume( )
			);

		joobj =
			vm.runInNewContext(
				input,
				{
					JOOBJ :
						true
				},
				resource.joobjSrcPath
			);

		ast =
			Generator.generate( joobj );

		output =
			Formatter.format( ast );

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
		// just read in the already generated Joobj
		output =
			(
				yield fs.readFile(
					resource.filePath,
					sus.resume( )
				)
			) + '';
	}

	return output;
};


module.exports =
	GenerateJoobj;


} )( );
