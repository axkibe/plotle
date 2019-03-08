/*
| A font in a layout
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		size : { type : 'number', defaultValue : '12' },

		name : { type : 'string', defaultValue : '"DejaVuSans-Regular"' },
	};
}


} );
