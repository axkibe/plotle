/*
| A button.
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
		// style facets
		facets : { type : '../gleam/facetList' },

		// font of the text
		font : { type : [ 'undefined', '../gleam/font' ] },

		// icon shape
		iconShape : { type : [ '< ../gleam/shape-types', 'undefined' ] },

		// icon facet
		iconFacet : { type : [ 'undefined', '../gleam/facet' ] },

		// shape of the button
		shape : { type : [ 'string', '../gleam/ellipse' ] },

		// the text written in the button
		text : { type : 'string', defaultValue : '""' },

		// vertical distance of newline
		textNewline : { type : [ 'undefined', 'number' ] },

		// rotation of the text
		textRotation : { type : [ 'undefined', 'number' ] },

		// if false not visibile on start
		visible : { type: 'boolean', defaultValue: 'true' },

		// designed zone
		zone : { type : '../gleam/rect' },
	};
}


} );
