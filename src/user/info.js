/*
| Extended user info.
*/
'use strict';


tim.define( module, 'user_info', ( def, user_info ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		name :
		{
			// the username
			type : 'string',
		},
		passhash :
		{
			// password hash
			type : 'string'
		},
		mail :
		{
			// the users email address
			type : 'string',
			defaultValue : '""'
		},
		news :
		{
			// if the user checked okay with news emails
			type : [ 'boolean', 'string' ]
		},
		spaceList :
		{
			// if loaded/defined, the spaces the user has
			type : [ 'undefined', 'dynamic_refSpaceList' ]
		}
	};
}


} );
