/*
| Runs the joobj generator for a single file
|
| Authors: Axel Kittenberger
*/

/*
| Capsule (to make jshint happy)
*/
(function( ) {
'use strict';


if( typeof( require ) === 'undefined' )
{
	throw new Error(
		'this code requires node!'
	);
}

var
	argv =
		process.argv,

	fs =
		require( 'fs' ),

	vm =
		require( 'vm' ),

	joobjGenerator =
		require( '../server/joobj-generator' ),

	input =
		null,

	idef =
		null,

	output =
		null,

	readOptions =
		{
			encoding :
				'utf8'
		};


if( argv.length !== 3 )
{
	console.log(
		'Usage: ' + argv[ 0 ] + ' JDEF-FILE'
	);

	process.exit( -1 );
}

var
	inFilename =
		argv[ 2 ];

try
{
	input =
		fs.readFileSync(
			inFilename,
			readOptions
		);

	idef =
		vm.runInNewContext(
			input,
			{
				JOOBJ :
					true
			},
			inFilename
		);

	output =
		joobjGenerator( idef );

	var
		outFilename =
			'joobj/'
			+
			inFilename
				.replace( /\//g, '-' )
			+
			'.js';

	fs.writeFileSync(
		outFilename,
		output
	);
}
catch ( e )
{
	console.log(
		e.toString( )
	);

	process.exit( -1 );
}


} )( );
