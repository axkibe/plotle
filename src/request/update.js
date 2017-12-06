/*
| A client requests updates on dynamics.
|
| The server might hold back the answer until something happens.
*/
'use strict';


tim.define( module, 'request_update', ( def, request_update ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		moments :
		{
			// the references to moments in dynamics to get updates for
			type : 'ref_momentList',
			json : true,
		},
		userCreds :
		{
			// user creds
			type : 'user_creds',
			json : true,
		}
	};
}


} );
