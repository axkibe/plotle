/*
| A disc layout.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// facet of the disc
		facet : { type : '../gleam/facet' },

		// shape of the disc
		shape : { type : '../gleam/ellipse' },

		// designed size
		size : { type : '../gleam/size' },
	};

	def.twig = [ '< ../layout/widget-types', ];
}


} );
