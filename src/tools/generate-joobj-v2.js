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


GLOBAL.APP =
	'genjoobj';
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
	Formatter =
		require( '../format/formatter' ),
	Generator =
		require( '../joobj/genv2' ),
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
	Generator.generate( joobj );

output =
	Formatter.format( file );

var
	outFilename =
		'jv2.js';
		/*
		'../joobj/'
		+
		inFilename
			.replace( /\//g, '-' );
		*/

fs.writeFileSync(
	outFilename,
	output
);

console.log( output + '' );


} )( );
