/*
| Draws a shape in a display.
|
| This is first the fill then the border
*/
'use strict';


tim.define( module, 'gleam_glint_paint', ( def, gleam_glint_paint ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		facet :
		{
			// the facet to draw the shape with
			type : 'gleam_facet'
		},
		shape :
		{
			// the shape to draw
			type :
				require( '../typemap-shape' )
				.concat( [ 'gleam_shapeList' ] )
		}
	};
}


} );
