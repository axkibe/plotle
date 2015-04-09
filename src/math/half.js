/*
| Simple integral half.
|
| divides by 2 and rounds up
*/


var
	half;


/*
| Capsule
*/
( function( ) {
'use strict';


half =
	function( v )
{
	return Math.round( v / 2 );
};


if( NODE )
{
	GLOBAL.half = half;
}


} )( );
