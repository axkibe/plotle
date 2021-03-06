/*
| Manages the server config.
|
| To be configured via config.js
*/
'use strict';


tim.define( module, ( def, server_config_root ) => {


if( TIM )
{
	def.attributes =
	{
		// the admin user
		admin : { type : [ 'null', 'string' ], defaultValue : 'null' },

		// database settings
		database :
		{
			type : './database/main',
			defaultValue : 'require( "./database/main" ).create( )'
		},

		// https settings
		https : { type : './https', defaultValue : 'require( "./https" ).create( )' },

		// network settings
		network : { type : './network', defaultValue : 'require( "./network" ).create( )' },

		// server settings
		server : { type : './server', defaultValue : 'require( "./server" ).create( )' },

		// shell setting
		shell : { type : './shell', defaultValue : 'require( "./shell" ).create( )' },
	};
}


} );
