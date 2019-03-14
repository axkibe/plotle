/*
| Start section of a shape.
|
| Used by shape.
*/
'use strict';


tim.define( module, ( def, gleam_shape_start ) => {


const gleam_point = tim.require( '../point' );

const gleam_transform = tim.require( '../transform' );


if( TIM )
{
	def.attributes =
	{
		// starts here
		p : { type : [ '../point' ] }
	};
}


/*
| Shortcut to create a start at p.
*/
def.static.p = p => gleam_shape_start.create( 'p', p );


/*
| Shortcut to create a start at xy.
*/
def.static.xy = ( x, y ) =>
	gleam_shape_start.create( 'p', gleam_point.xy( x, y ) );


/*
| Returns the shape section repositioned to a view.
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

	return this.create( 'p', this.p.transform( transform ) );
};


} );
