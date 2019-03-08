/*
| An input field.
*/
'use strict';


tim.define( module, ( def, layout_input ) => {


if( TIM )
{
	def.attributes =
	{
		// style facets
		facets : { type : '../gleam/facetList' },

		// font of the text
		font : { type : '../gleam/font/font' },

		// maximum input length
		maxlen : { type : 'integer' },

		// true for password input
		password : { type : 'boolean', defaultValue : 'false' },

		// designed zone
		zone : { type : '../gleam/rect' },
	};
}


} );
