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
		// https settings
		enabled : { type : 'boolean', defaultValue : 'false' },
	};
}


} );
