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
		// enables beautifying of minified code
		// only applicable with minify
		beautify : { type : 'boolean', defaultValue : 'false' },

		// enables checking
		check : { type : 'boolean', defaultValue : 'false' },

		// if enabled this access is provided
		enable : { type : 'boolean', defaultValue : 'true' },

		// enables sourceMap
		// only applicable with minify
		sourceMap : { type : 'boolean', defaultValue : 'true' },

		// enables the failScreen
		failScreen : { type : 'boolean', defaultValue : 'true' },

		// enables freeze checking
		freeze : { type : 'boolean', defaultValue : 'false' },

		// enables minifying
		minify : { type : 'boolean', defaultValue : 'true' },
	};
}


} );
