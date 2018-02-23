/*
| The fill of a shape.
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
		// the facet to draw the fill with
		facet : { type : '../facet' },

		// the shape to draw
		shape :
		{
			type : tim.typemap( module, '../shape' ).concat( [ '../shapeList' ] )
		}
	};
}


} );
