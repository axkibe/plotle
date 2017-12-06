/*
| A client wants to acquire a space.
*/
'use strict';


tim.define( module, 'request_acquire', ( def, request_acquire ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		createMissing :
		{
			// if true the space is to be created if missing
			type : 'boolean',
			json : true,
		},
		spaceRef :
		{
			// reference of the space to acquire
			type : 'ref_space',
			json : true,
		},
		userCreds :
		{
			// user requesting the space
			type : 'user_creds',
			json : true,
		}
	};
}


} );
