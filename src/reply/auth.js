/*
| The servers replies to a succesfull clients auth request.
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
		// visitors get their real id here
		userCreds : { type : '../user/creds', json : true },

		// the list of spaces the user has
		userSpaceList :
		{
			type : [ 'undefined', '../dynamic/refSpaceList' ],

			json : true,
		}
	};

	def.json = 'reply_auth';
}


} );

