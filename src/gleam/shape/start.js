/*
| Start section of a shape.
|
| Used by shape.
*/
'use strict';


// FIXME
var
	gleam_point;


tim.define( module, 'gleam_shape_start', ( def, gleam_shape_start ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		p :
		{
			// start here
			type : [ 'gleam_point' ]
		}
	};
}


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


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
def.func.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.reflect !== 'gleam_transform' ) throw new Error( );
/**/}

	return this.create( 'p', this.p.transform( transform ) );
};


} );
