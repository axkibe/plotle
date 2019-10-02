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
		// the main server
		main :
		{
			type : './network/main',
			defaultValue : 'require( "./network/main" ).create( )'
		},

		// a redirect server (for port 80 to https)
		redirect :
		{
			type : './network/redirect',
			defaultValue : 'require( "./network/redirect" ).create( )'
		},

		// listens on this ip (default all)
		listen : { type: [ 'string', 'null' ], defaultValue : 'null' },
	};
}


} );
