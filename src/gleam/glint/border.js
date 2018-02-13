/*
| The border of a shape.
*/
'use strict';


tim.define( module, 'gleam_glint_border', ( def, gleam_glint_border ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		facet :
		{
			// the facet to draw the border with
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
