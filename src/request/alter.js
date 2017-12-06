/*
| A client requests the space tree to be altered.
*/
'use strict';


tim.define( module, 'request_alter', ( def, request_alter ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		changeWrapList :
		{
			// the changes to be applied
			type : 'change_wrapList',
			json : true
		},
		refMomentSpace :
		{
			// reference to the space dynamic
			type : 'ref_moment',
			json : true
		},
		userCreds :
		{
			// user requesting the change
			type : 'user_creds',
			json : true
		}
	};
}


} );
