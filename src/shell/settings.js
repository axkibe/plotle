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
	|
	| Only used if not using opentype.
	*/
	uniFontSize : 0,


	/*
	| If true uses opentype font rendering, if false
	| canvas.fillText()
	*/
	//opentype : true,
	opentype : false,

	/*
	| Maximum size of a glint graphic cache
	| in width * size
	*/
	//glintCacheLimit : 1200000
	//glintCacheLimit : 0
	//FIXME
	glintCacheLimit : Number.POSITIVE_INFINITY
};


if( FREEZE )
{
	Object.freeze( shell_settings );
}


} )( );
