/*
| Runs the jion generator for a single file
*/

/*
| Capsule.
*/
(function( ) {
'use strict';

GLOBAL.CHECK = true;

GLOBAL.JION = false;

GLOBAL.SERVER = true;

GLOBAL.SHELL = false;

if( typeof( require ) === 'undefined' )
{
	throw new Error(
		'this code requires node!'
	);
}

var
	argv,
	fs,
	vm,
	jionGenerator,
	inFilename,
	input,
	jion,
	output,
	readOptions;

	argv = process.argv,

	fs = require( 'fs' );

	vm = require( 'vm' );

	jionGenerator = require( '../jion/generator' );

	input = null;

	jion = null;

	output = null;

	readOptions =
		{
			encoding : 'utf8'
		};


if( argv.length !== 3 )
{
	console.log(
		'Usage: ' + argv[ 0 ] + ' JDEF-FILE'
	);

	process.exit( -1 );
}

inFilename = argv[ 2 ];

input = fs.readFileSync( inFilename, readOptions );

jion =
	vm.runInNewContext(
		input,
		{
			JION : true
		},
		inFilename
	);

output = jionGenerator( jion );

/*
var
	outFilename =
		'../jion/'
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
