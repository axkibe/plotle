/*
| Shell global settings.
*/


var
	shell_settings;

/*
| Capsule
*/
( function( ) {
'use strict';


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

	zoomMin : -150,

	zoomMax : 150,

	/*
	| If not zero this font size is as universal base
	| and transformed.
	|
	| If zero the 'css' is set to be the exact used
	| font used.
	*/
	uniFontSize : 0,
};


if( FREEZE )
{
	Object.freeze( shell_settings );
}


} )( );
