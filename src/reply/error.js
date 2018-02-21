/*
| The servers encountered an error with the request.
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
		// the error message
		message : { type : 'string', json : true },
	};

	def.json = 'reply_error';
}


} );

