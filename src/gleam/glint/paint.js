/*
| A shape in a display.
|
| First the fill is drawn then the border.
*/
'use strict';


tim.define( module, ( def, gleam_glint_paint ) => {


if( TIM )
{
	def.attributes =
	{
		// the facet to draw the shape with
		facet : { type : '../facet' },

		// the shape to draw
		shape : { type : [ '< ../shape-types', '../shapeList' ] },
	};
}


/*
| Shortcut.
*/
def.static.createFacetShape =
	function(
		facet,
		shape
	)
{
	return gleam_glint_paint.create( 'facet', facet, 'shape', shape );
};


} );
