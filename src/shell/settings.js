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
	| If false don't do any animations.
	*/
	animation : true,

	/*
	| Milliseconds for zoom animation to all/home.
	*/
	animationZoomAllHomeTime : 300,

	/*
	| Milliseconds for zoom animation in single in or out steps.
	*/
	animationZoomStepTime : 150,

	/*
	| Factor to add to the bottom of font height.
	*/
	bottombox : 0.25,

	/*
	| Zooming settings.
	*/
	zoomBase : 1.1,

	zoomMin : -150,

	zoomMax : 150,

	/*
	| Max. number of undo events queued.
	*/
	maxUndo : 1000,

	/*
	| If true uses opentype font rendering, if false
	| canvas.fillText()
	*/
	opentype : true,
	//opentype : false,

	/*
	| Do not cache the glyph for fonts larger than this.
	| Only applicable if opentype is true
	*/
	glyphCacheLimit : 250,
	//glyphCacheLimit : Number.POSITIVE_INFINITY,

	/*
	| Maximum size of a glint graphic cache
	| in width * size
	*/
	glintCacheLimit : 32767,
	//glintCacheLimit : Number.POSITIVE_INFINITY,


	/*
	| Pixels to scroll on a wheel event
	*/
	textWheelSpeed : 12 * 5,
};


if( FREEZE )
{
	Object.freeze( shell_settings );
}


} )( );
