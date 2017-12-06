/*
| The servers replies to a succesfull clients auth request.
*/
'use strict';


tim.define( module, 'reply_auth', ( def, reply_auth ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		userCreds :
		{
			// visitors get their real id here
			type : 'user_creds',
			json : true,
		},
		userSpaceList :
		{
			// the list of spaces the user has
			type : [ 'undefined', 'dynamic_refSpaceList' ],
			json : true,
		}
	};
}


} );
