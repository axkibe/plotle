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
		// animation settings
		animation :
		{
			type : './shell/animation',
			defaultValue : 'require( "./shell/animation" ).create( )'
		},

		// the / or /index.html access
		bundle :
		{
			type : './shell/bundle',
			defaultValue : 'require( "./shell/bundle" ).create( )'
		},

		// the /devel.html access
		devel :
		{
			type : './shell/devel',
			defaultValue : 'require( "./shell/devel" ).create( )'
		},
	};
}


} );
