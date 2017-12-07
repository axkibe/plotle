/*
| A flow token.
*/
'use strict';


tim.define( module, 'flow_token', ( def, flow_token ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		x :
		{
			// x position
			type : 'number'
		},
		width :
		{
			// width of the token
			type : 'number'
		},
		offset :
		{
			// offset in text
			type : 'integer'
		},
		text :
		{
			// token text
			type : 'string'
		}
	};
}


} );
