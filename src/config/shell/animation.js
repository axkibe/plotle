/*
| Animation settings.
|
| To be configured via config.js
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// enables/disables animations
		enable : { type : 'boolean', defaultValue : 'true' },

		// milliseconds for zoom animation to all/home.
		zoomAllHomeTime : { type : 'number', defaultValue : '120' },

		// milliseconds for zoom animation in single in or out steps.
		zoomStepTime : { type : 'number', defaultValue : '40' },
	};
}


} );
