/*
| maximum integer variable.
*/


var
	math_limit;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Limits value to be between min and max
*/
math_limit =
	function(
		min,
		val,
		max
	)
{
/**/if( CHECK )
/**/{
/**/	if( min > max ) throw new Error( );
/**/}

	if( val < min ) return min;

	if( val > max ) return max;

	return val;
};


if( NODE )
{
	module.exports = math_limit;
}


} )( );
