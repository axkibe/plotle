/*
| The main(default) server.
|
| This is to be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// http or https? default, nothing so error if not configured
		protocol : { type : [ 'undefined', 'string' ] },

		// port to listen on
		// 0 defaults to 8833 when http and 443 when https
		port : { type : 'integer', defaultValue : '0' },
	};
}


} );
