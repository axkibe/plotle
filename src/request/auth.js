/*
| A client request authentication to be checked,
| or to be assigned a visitor-id.
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
		// user credentials to be authenticated
		userCreds : { type : '../user/creds', json : true },
	};

	def.json = 'request_auth';
}


} );

