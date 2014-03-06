/*
| Runs the joobj generator for a single file
|
| Authors: Axel Kittenberger
*/

/*
| Capsule.
*/
(function( ) {
'use strict';


GLOBAL.CHECK =
	true;
GLOBAL.JOOBJ =
	false;
GLOBAL.SERVER =
	true;
GLOBAL.SHELL =
	false;


var
	argv =
		process.argv,
	fs =
		require( 'fs' ),
	vm =
		require( 'vm' ),
	formatter =
		require( '../code/formatter' ),
	generator =
		require( '../joobj/gen2' ),
	file =
		null,
	input =
		null,
	joobj =
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

input =
	fs.readFileSync(
		inFilename,
		readOptions
	);


joobj =
	vm.runInNewContext(
		input,
		{
			JOOBJ :
				true
		},
		inFilename
	);

file =
	generator( joobj );

output =
	formatter.format( file );

/*
var
	outFilename =
		'../joobj/'
		+
		inFilename
			.replace( /\//g, '-' );

fs.writeFileSync(
	outFilename,
	output
);
*/

console.log( output + '' );


} )( );
