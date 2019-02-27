/*
| The /devel.html access.
|
| This is to be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// if enabled this access is provided
		enable : { type : 'boolean', defaultValue : 'true' },

		// enables checking
		check : { type : 'boolean', defaultValue : 'true' },

		// enables the failScreen
		failScreen : { type : 'boolean', defaultValue : 'true' },

		// enables freeze checking
		freeze : { type : 'boolean', defaultValue : 'true' },
	};
}


} );
