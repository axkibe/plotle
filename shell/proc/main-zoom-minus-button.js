/*
|
| Zoom minus button, zooms out.
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
(function( ) {
'use strict';


if( typeof( window ) === 'undefined' )
	{ throw new Error( 'this code needs a browser!' ); }


/*
| Constructor
*/
var MainZoomMinusButton = Proc.MainZoomMinusButton =
	function( twig, panel, inherit, name )
{
	Dash.Button.call( this, twig, panel, inherit, name );
	this.repeating = true;
};

Jools.subclass( MainZoomMinusButton, Dash.Button );


MainZoomMinusButton.prototype.push = function( shift, ctrl )
{
	shell.changeSpaceZoom( -1 );
	return true;
};

})( );
