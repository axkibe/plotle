/*
| The /devel.html access.
|
| To be configured via config.js
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
		failScreen : { type : 'boolean', defaultValue : 'false' },
	};
}


} );
