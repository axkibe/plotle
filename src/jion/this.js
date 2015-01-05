/*
| Runs the jion generator from node for the
| module that requires this.
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


var
	fs,
	jionNodeGenerator;

fs = require( 'fs' );


jionNodeGenerator =
module.exports =
	function(
		module
	)
{
	var
		server,
		inFilename,
		inStat,
		jion,
		outFilename,
		outStat,
		si,
		separator;

	server = module;

	separator = '/src/';

	if( !APP )
	{
		throw new Error( 'GLOBAL.APP not set' );
	}

	// gets the server module
	while( server.parent )
	{
		server = server.parent;
	}

	si = server.filename.indexOf( separator );

	if( si < 0 )
	{
		si = server.filename.indexOf( '/repl' );
	}

	if( si < 0 )
	{
		throw new Error(
			'root module ("'
			+ server.filename
			+ '") has no "'
			+ separator
			+ '" separator'
		);
	}

	inFilename = module.filename.substring( si + 1 );

	outFilename =
		'jion/'
		+ APP
		+ '/'
		+ inFilename.replace( /\//g, '-' );

	inStat = fs.statSync( inFilename );

	outStat = fs.statSync( outFilename );

	if( inStat.mtime > outStat.mtime )
	{
		if( !FORCE_JION_LOADING )
		{
			throw new Error(
				'Out of date jion: '
				+ inFilename
				+ ' -> '
				+ outFilename
			);
		}
	}

	// requires the jion code.

	jion =
		require(
			'../../'
			+ outFilename.substr( 0, outFilename.length - 3 )
		);

	// bug workaround for circular references
	for( var k in jion )
	{
		if( !jion.hasOwnProperty( k ) )
		{
			continue;
		}

		module.exports[ k ] = jion[ k ];
	}

	module.exports = jion;

	return jion;
};


} )( );
