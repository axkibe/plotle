/*
| Composes log messages.
*/


var
	log_compose,
	log_inspect;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	log_inspect = require( './inspect' );
}


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
	function(
		a
	)
{
	const now = new Date( );

	pushpad( a, now.getMonth( ) + 1, '-' );

	pushpad( a, now.getDate( ), ' ' );

	pushpad( a, now.getHours( ), ':' );

	pushpad( a, now.getMinutes( ), ':' );

	pushpad( a, now.getSeconds( ), ' ' );

	return a;
};


/*
| Logs a number of inspected argument
| if category is configured to be logged.
*/
log_compose =
	function(
		category,  // category to log
		args       // arguments array(like)
	)
{
	const a = timestamp( [ ] );

	if( category !== true )
	{
		a.push( '(' );
		a.push( category );
		a.push( ') ' );
	}

	for( let i = 0, il = args.length; i < il; i++ )
	{
		if( i > 0 ) a.push(' ');

		log_inspect( args[ i ], a, 0, [ ] );
	}

	return a.join( '' );
};


if( NODE )
{
	module.exports = log_compose;
}


} )( );
