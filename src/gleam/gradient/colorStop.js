/*
| A gradient color stop.
*/
'use strict';


tim.define( module, 'gleam_gradient_colorStop', ( def, gleam_gradient_colorStop ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		offset :
		{
			// color stop offset ( from 0 to 1 )
			type : 'number'
		},
		color :
		{
			// color at stop
			type : 'gleam_color'
		}
	};
}


} );
