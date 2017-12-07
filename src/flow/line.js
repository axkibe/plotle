/*
| A flow line of tokens.
*/
'use strict';


tim.define( module, 'flow_line', ( def, flow_line ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		offset :
		{
			// offset in text
			type : 'integer'
		},
		y :
		{
			// y position of line
			type : 'number'
		}
	};

	def.list = [ 'flow_token' ];
}


} );
