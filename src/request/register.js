/*
| A client requests a new user to be registered.
*/
'use strict';


tim.define( module, 'request_register', ( def, request_register ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		mail :
		{
			// email address of the user, can be empty
			type : 'string',
			json : true
		},
		news :
		{
			// true if the user is okay with the newsletter
			type : 'boolean',
			json : true
		},
		userCreds :
		{
			// user/pass credentials to be registered
			type : 'user_creds',
			json : true
		}
	};
}


} );
