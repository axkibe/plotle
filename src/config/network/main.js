/*
| The main(default) server.
|
| To be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// http or https?
		protocol : { type : 'string', defaultValue : '"http"' },

		// port to listen on
		// 0 defaults to 8833 when http and 443 when https
		port : { type : 'integer', defaultValue : '0' },
	};
}


} );
