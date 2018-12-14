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
		// the /devel.html access
		devel :
		{
			type : './shell/devel',
			defaultValue : 'require( "./shell/devel" ).create( )'
		},

		// the / or /index.html access
		bundle :
		{
			type : './shell/bundle',
			defaultValue : 'require( "./shell/bundle" ).create( )'
		},

		// if set uses a weinre debugging server
		weinre : { type : [ 'string', 'null' ], defaultValue : 'null' },
	};
}


} );
