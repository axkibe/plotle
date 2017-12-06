/*
| A client request authentication to be checked,
| or to be assigned a visitor-id.
*/
'use strict';


tim.define( module, 'request_auth', ( def, request_auth ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		userCreds :
		{
			// user credentials to be authenticated
			type : 'user_creds',
			json : true,
		}
	};
}


} );
