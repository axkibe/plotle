/*
| Logging utilities.
*/
'use strict';


var config;


tim.define( module, ( def ) => {


if( NODE )
{
	config = require( '../../config' );
}


const util = NODE && require( 'util' );


/*
| Pushes a 2-decimal number on an string-array.
*/
const pushpad =
	function(
		a,   // the array
		n,   // the number to push
		s    // the separator
	)
{
	if( n < 10 ) a.push( '0' );

	a.push( n, s );

	return a;
};


/*
| Creates a timestamp
| which will be returned as joinable array.
*/
const timestamp =
	function( )
{
	const a = [ ];

	const now = new Date( );

	pushpad( a, now.getMonth( ) + 1, '-' );

	pushpad( a, now.getDate( ), ' ' );

	pushpad( a, now.getHours( ), ':' );

	pushpad( a, now.getMinutes( ), ':' );

	pushpad( a, now.getSeconds( ), ' ' );

	return a;
};


/*
| Inspect options.
*/
const inspectOpts = NODE && { depth: null };


/*
| Logs a number of inspected argument
| if category is configured to be logged.
*/
const compose =
	function(
		category,  // category to log
		args       // arguments array(like)
	)
{
	const a = timestamp( );

	if( category !== true )
	{
		a.push( '(' );
		a.push( category );
		a.push( ') ' );
	}

	for( let i = 0, il = args.length; i < il; i++ )
	{
		if( i > 0 ) a.push(' ');

		if( NODE )
		{
			a.push( util.inspect( args[ i ], inspectOpts ) );
		}
		else
		{
			a.push( args[ i ] );
		}
	}

	return a.join( '' );
};


/*
| Logging ajax stuff.
*/
def.static.ajax =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.ajax ) return;

	console.log(
		compose.call( undefined, 'ajax', arguments )
	);
};


/*
| Logging failures.
*/
def.static.fail =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.fail ) return;

	console.log(
		compose.call( undefined, 'fail', arguments )
	);
};


/*
| Logging startup stuff.
*/
def.static.start =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.start ) return;

	console.log(
		compose.call( undefined, 'start', arguments )
	);
};


/*
| Logging warnings.
*/
def.static.warn =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.warn ) return;

	console.log(
		compose.call( undefined, 'warn', arguments )
	);
};


/*
| Logging web stuff.
*/
def.static.web =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.web ) return;

	console.log(
		compose.call( undefined, 'web', arguments )
	);
};


} );

