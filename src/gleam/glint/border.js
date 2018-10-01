/*
| The border of a shape.
*/
'use strict';


tim.define( module, ( def, gleam_glint_border ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the facet to draw the border with
		facet : { type : '../facet' },

		// the shape to draw
		shape : { type : [ '< ../shape-types', '../shapeList' ] },
	};
}


/*
| Shortcut
*/
def.static.createFS =
	function(
		facet,
		shape
	)
{
	return(
		gleam_glint_border.create(
			'facet', facet,
			'shape', shape
		)
	);
};


} );
