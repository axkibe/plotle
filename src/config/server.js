/*
| Manages the server config.
|
| This is to be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// if false to server tells each client is told not to cache http requests.
		cache : { type : 'boolean', defaultValue : 'false' },

		// if true enables checking code on server.
		check : { type : 'boolean', defaultValue : 'true' },

		// enable freeze checking on server.
		freeze : { type : 'boolean', defaultValue : 'false' },

		// if true writes manglemap and sourcemap.
		report : { type : 'boolean', defaultValue : 'false' },

		// if true the server will die on unaccepptable commands
		sensitive : { type : 'boolean', defaultValue : 'false' },

		// server will check for changed resources on every request.
		update : { type : 'boolean', defaultValue : 'true' },
	};
}


} );
