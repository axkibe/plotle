/*
| Runs the jgen generator for a single file
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

	jgen =
		require( './jgen' ),

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
		argv[ 2 ],

	jDefExt =
		'-jdef.js';

if(
	inFilename.substr(
		inFilename.length - jDefExt.length
	) !== jDefExt
)
{
	console.log(
		'Error: jdef-file must end with "-jdef.js"!'
	);

	process.exit( -1 );
}

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
			{ },
			inFilename
		);

	output =
		jgen( idef );

	var
		outFilename =
			inFilename.substr( 0, inFilename.length - jDefExt.length )
			+
			'-jgen.js';

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
