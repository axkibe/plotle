/*
| Shell global settings.
*/


var
	shell_fontPool,
	shell_settings;

/*
| Capsule
*/
( function( ) {
'use strict';

/*
| The default fonts
*/
shell_fontPool.setDefaultFonts(
	'DejaVuSans,sans-serif',
	'DejaVuSansBold,sans-serif'
);


shell_settings =
{
	/*
	| Factor to add to the bottom of font height
	*/
	bottombox : 0.25,

	/*
	| Zooming settings.
	*/
	zoomBase : 1.1,

	zoomMin : -15,

	zoomMax : 15
};


if( FREEZE )
{
	Object.freeze( shell_settings );
}


} )( );
