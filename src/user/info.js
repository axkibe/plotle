/*
| Extended user info.
*/
'use strict';


tim.define( module, ( def, self ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the username
		name : { type : 'string' },

		// password hash
		passhash : { type : 'string' },

		// the users email address
		mail : { type : 'string', defaultValue : '""' },

		// if the user checked okay with news emails
		news : { type : [ 'boolean', 'string' ] },

		// if loaded/defined, the spaces the user has
		spaceList : { type : [ 'undefined', '../dynamic/refSpaceList' ] },
	};
}


} );

