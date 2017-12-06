/*
| The servers encountered an error with the request.
*/
'use strict';


tim.define( module, 'reply_error', ( def, reply_error ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		message :
		{
			// the error message
			type : 'string',
			json : true
		}
	};
}


} );
