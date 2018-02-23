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
		// the changes to be applied
		changeWrapList : { type : '../change/wrapList', json : true },

		// reference to the space dynamic
		refMomentSpace : { type : '../ref/moment', json : true },

		// user requesting the change
		userCreds : { type : '../user/creds', json : true },
	};

	def.json = 'request_alter';
}


} );

