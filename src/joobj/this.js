/*
| Runs the joobj generator from node for the
| module that requires this.
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
		mod
	)
{
	var
		server =
			mod,

		serverName =
			'src/server/server.js',

		inFilename,

		serverDir;


	// gets the server module
	while( server.parent )
	{
		server =
			server.parent;
	}

	if(
		server.filename.substring(
			server.filename.length - serverName.length
		) !== serverName
	)
	{
		throw new Error(
			'root module is not called "' + serverName + '"'
		);
	}

	// the server directory
	serverDir =
		server.filename.substring(
			0, server.filename.length - serverName.length
		);

	inFilename =
		mod.filename.substring( serverDir.length );

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

	fs.writeFileSync(
		outFilename,
		output
	);

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
