/*
| Manages the database pouchdb instace.
|
| To be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// if true enables the pouchdb server
		enable : { type : 'boolean', defaultValue : 'true' },

		// host to bind to
		host : { type : 'string', defaultValue : '"localhost"' },

		// repository directory
		dir : { type : 'string', defaultValue : '"./repository/"' },

		// port to listen to
		port : { type : 'number', defaultValue : '8834' },
	};
}


} );
