/*
| A client requests a new user to be registered.
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
		// email address of the user, can be empty
		mail : { type : 'string', json : true },

		// true if the user is okay with the newsletter
		news : { type : 'boolean', json : true },

		// user/pass credentials to be registered
		userCreds : { type : '../user/creds', json : true },
	};

	def.json = 'request_register';
}


} );
