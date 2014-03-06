/*
| Runs the joobj generator from node for the
| module that requires this.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';



var
	config =
		require( '../../config' ),
	fs =
		require( 'fs' ),
	vm =
		require( 'vm' ),
	joobjGenerator =
		require( './generator' ),
	Jools =
		require( '../jools/jools' ),
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

var
joobjNodeGenerator =
	function(
		module
	)
{
	var
		server =
			module,
		inFilename,
		si,
		separator =
			'/src/';

	// gets the server module
	while( server.parent )
	{
		server =
			server.parent;
	}

	si =
		server.filename.indexOf( separator );

	if( si < 0 )
	{
		throw new Error(
			'root module has no "' + separator + '" separator'
		);
	}

	inFilename =
		module.filename.substring( si + 1 );

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

	output =
		joobjGenerator( joobj );

	var
		outFilename =
			'joobj/'
			+
			inFilename
				.replace( /\//g, '-' );

	Jools.log(
		'start',
		'generating ' + outFilename
	);

	if( !config.noWrite )
	{
		fs.writeFileSync(
			outFilename,
			output
		);
	}

	return (
		require(
			'../../'
			+
			outFilename.substr( 0, outFilename.length - 3 )
		)
	);
};


module.exports =
	joobjNodeGenerator;


} )( );
