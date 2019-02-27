/*
| The / or /index.html access.
|
| This is to be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// enable beautify-ing of uglify-ed code
		beautify : { type : 'boolean', defaultValue : 'false' },

		// enable checking
		check : { type : 'boolean', defaultValue : 'false' },

		// if enabled this access is provided
		enable : { type : 'boolean', defaultValue : 'true' },

		// enable extraMangling
		extraMangle : { type : 'boolean', defaultValue : 'false' },

		// enables the failScreen
		failScreen : { type : 'boolean', defaultValue : 'true' },

		// enable freeze checking
		freeze : { type : 'boolean', defaultValue : 'false' },

		// enable uglify.js minimizing
		uglify : { type : 'boolean', defaultValue : 'true' },
	};
}


} );
