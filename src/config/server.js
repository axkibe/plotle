/*
| Manages the server config.
|
| To be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// if false to server tells each client is told not to cache http requests.
		// FIXME move to http/s
		cache : { type : 'boolean', defaultValue : 'false' },

		// if true enables checking code on server.
		check : { type : 'boolean', defaultValue : 'true' },

		// if true writes manglemap and sourcemap.
		report : { type : 'boolean', defaultValue : 'false' },

		// if true the server will die on unaccepptable commands
		sensitive : { type : 'boolean', defaultValue : 'false' },

		// server will check for changed resources on every request.
		// FIXME rename
		update : { type : 'boolean', defaultValue : 'true' },
	};
}


} );
