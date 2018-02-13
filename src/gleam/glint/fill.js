/*
| The fill of a shape.
*/
'use strict';


tim.define( module, 'gleam_glint_fill', ( def, gleam_glint_fill ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		facet :
		{
			// the facet to draw the fill with
			type : 'gleam_facet'
		},
		shape :
		{
			// the shape to draw
			type :
				tim.typemap( module, '../shape' )
				.concat( [ '../shapeList' ] )
		}
	};
}


} );
