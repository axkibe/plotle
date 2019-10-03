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

		// milliseconds after mouse down, dragging starts
		dragTime : { type : 'number', defaultValue : '400' },

		// pixels after mouse down and move, dragging starts
		dragBox : { type : 'number', defaultValue : '10' },


		// zooming settings
		zoomMin : { type : 'number', defaultValue : '-150' },
		zoomMax : { type : 'number', defaultValue : '150' },
	};
}


} );
