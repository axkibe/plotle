/*
| A scrollbox.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// offset of the scrollbar
		scrollbarYOffset :
		{
			type : '../gleam/point',
			defaultValue : 'require( "../gleam/point" ).zero'
		},

		// designed zone
		zone : { type : '../gleam/rect' },
	};

	def.twig = [ '< ./widget-types' ];
}


} );
