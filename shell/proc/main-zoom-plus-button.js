/*
|
| Zoom plus button, zooms in.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Proc;
Proc = Proc || {};


/*
| Imports
*/
var Dash;
var Jools;
var shell;


/*
| Capsule
*/
( function( ) {
'use strict';
if( typeof( window ) === 'undefined' )
	{ throw new Error( 'this code needs a browser!' ); }


/*
| Constructor
*/
var MainZoomPlusButton = Proc.MainZoomPlusButton = function( twig, panel, inherit, name )
{
	Dash.Button.call(this, twig, panel, inherit, name);
	this.repeating = true;
};
Jools.subclass( MainZoomPlusButton, Dash.Button );


/*
| Button is being pushed.
*/
MainZoomPlusButton.prototype.push = function( shift, ctrl )
{
	shell.changeSpaceZoom( 1 );
};

})( );
