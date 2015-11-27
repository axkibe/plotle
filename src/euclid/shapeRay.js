/*
| A ray of geometric shapes.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_shapeRay',
		ray : require( '../typemaps/shape' )
	};
}


var
	euclid_shapeRay;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_shapeRay.prototype;


/*
| Returns the shapeRay repositioned for 'view'.
*/
prototype.inView =
	function(
		view
	)
{
	var
		a,
		aZ,
		ray;

	ray = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		ray[ a ] = this.get( a ).inView( view );
	}

	return this.create( 'ray:init', ray );
};


/*
| Returns true if point is within the shape ray.
*/
prototype.within =
	function(
		p
	)
{
	var
		a,
		aZ;

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		if( this.get( a ).within( p ) ) return true;
	}
	
	return false;
};


})( );
