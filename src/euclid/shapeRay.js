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
		ray : require( './typemap-shape' )
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
| Returns a shapeRay bordering this shape by 
| +/- distance. See euclid_shape.border for further 
| explanation.
*/
prototype.border =
	function(
		d // distance to border
	)
{
	var
		a,
		arr,
		aZ;

	arr = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		arr[ a ] = this.get( a ).border( d );
	}

	return( this.create( 'ray:init', arr ) );
};


/*
| Returns a transformed shapeRay.
*/
prototype.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.reflect !== 'euclid_transform' ) throw new Error( );
/**/}

	var
		a,
		aZ,
		ray;

	ray = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		ray[ a ] = this.get( a ).transform( transform );
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
