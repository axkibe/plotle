/*
| Simple integral half.
|
| divides by 2 and rounds up
*/


var
	math_half;


/*
| Capsule
*/
( function( ) {
'use strict';


math_half =
	function( v )
{
	return Math.round( v / 2 );
};


if( NODE )
{
	module.exports = math_half;
}


} )( );
