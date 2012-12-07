/*
|
| Right Button on main panel.
| Help.
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

/**
| Capsule
*/
( function( ) {

'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor
*/
var HelpHideButton = Proc.HelpHideButton = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(HelpHideButton, Dash.Button);

HelpHideButton.prototype.push =
	function(
		// shift,
		// ctrl
	)
{
	this.panel.board.setShowHelp( false );
	shell.redraw = true;
};

} )( );
