/*
| A gradient color stop.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// color stop offset ( from 0 to 1 )
		offset : { type : 'number' },

		// color at stop
		color : { type : '../color' }
	};
}


} );
