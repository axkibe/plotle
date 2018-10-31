/*
| A client wants to acquire a space.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// if true the space is to be created if missing
		createMissing : { type : 'boolean', json : true },

		// reference of the space to acquire
		spaceRef : { type : '../ref/space', json : true },

		// user requesting the space
		userCreds : { type : '../user/creds', json : true },
	};

	def.json = 'request_acquire';
}


} );
