/*
| A list of geometric shapes.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.list = [ '< ./shape-types' ];
}


const gleam_transform = tim.require( './transform' );


/*
| Returns a shapeList bordering this shape by
| +/- distance. See gleam_shape.border for further
| explanation.
*/
def.proto.border =
	function(
		d // distance to border
	)
{
	const arr = [ ];

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		arr[ a ] = this.get( a ).border( d );
	}

	return( this.create( 'list:init', arr ) );
};


/*
| Returns a transformed shapeList.
*/
def.proto.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
/**/}

	const list = [ ];

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		list[ a ] = this.get( a ).transform( transform );
	}

	return this.create( 'list:init', list );
};


/*
| Returns true if point is within the shape list.
*/
def.proto.within =
	function(
		p
	)
{
	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		if( this.get( a ).within( p ) ) return true;
	}

	return false;
};


} );

