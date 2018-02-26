/*
| A client requests updates on dynamics.
|
| The server might hold back the answer until something happens.
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
		// the references to moments in dynamics to get updates for
		moments : { type : '../ref/momentList', json : true },

		// user creds
		userCreds : { type : '../user/creds', json : true, },
	};

	def.json = 'request_update';
}


} );
