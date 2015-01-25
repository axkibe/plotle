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
	jionNodeGenerator,
	vm;

fs = require( 'fs' );

vm = require( 'vm' );


jionNodeGenerator =
module.exports =
	function(
		module
	)
{
	var
		context,
		inFilename,
		inStat,
		jion,
		outFilename,
		outStat,
		server,
		separator,
		si;

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

	// loads the jion code.

	// runs the jion code with this module context
	// so module.exports match exactly even with
	// circula references
	context = { };

	for( var k in GLOBAL )
	{
		if( !GLOBAL.hasOwnProperty( k ) )
		{
			continue;
		}

		context[ k ] = GLOBAL[ k ];
	}

	context.module = module;

	// currently paths matches of this.require
	// and the jion require places. However
	// this might need some path adapting if things
	// change
	context.require =
		function( path )
		{
			return require( path );
		};

	jion =
	vm.runInNewContext(
		fs.readFileSync( outFilename ) + '',
		context,
		outFilename
	);

	return module.exports;
};


} )( );
