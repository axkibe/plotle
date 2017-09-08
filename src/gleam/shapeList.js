/*
| A list of geometric shapes.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'gleam_shapeList',
		list : require( './typemap-shape' )
	};
}


var
	gleam_shapeList;


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

prototype = gleam_shapeList.prototype;


/*
| Returns a shapeList bordering this shape by
| +/- distance. See gleam_shape.border for further
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

	return( this.create( 'list:init', arr ) );
};


/*
| Returns a transformed shapeList.
*/
prototype.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.reflect !== 'gleam_transform' ) throw new Error( );
/**/}

	var
		a,
		aZ,
		list;

	list = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		list[ a ] = this.get( a ).transform( transform );
	}

	return this.create( 'list:init', list );
};


/*
| Returns true if point is within the shape list.
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
