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
	| If true uses opentype font rendering, if false
	| canvas.fillText()
	*/
	opentype : true,
	//opentype : false,

	/*
	| Maximum numbers of words in the opentype render cache.
	| Only applicable if opentype is true
	*/
	textCacheSize : 10000,

	/*
	| Maximum size of a glint graphic cache
	| in width * size
	*/
	//glintCacheLimit : 1200000
	glintCacheLimit : Number.POSITIVE_INFINITY,
};


if( FREEZE )
{
	Object.freeze( shell_settings );
}


} )( );
