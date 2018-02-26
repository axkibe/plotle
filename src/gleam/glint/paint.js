/*
| A shape in a display.
|
| First the fill is drawn then the border.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the facet to draw the shape with
		facet : { type : '../facet' },

		// the shape to draw
		shape :
		{
			type : tim.typemap( module, '../shape' ).concat( [ '../shapeList' ] )
		}
	};
}


} );

