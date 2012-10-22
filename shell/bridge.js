/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                    ,-,---.         .
                                     '|___/ ,-. . ,-| ,-. ,-.
                                     ,|   \ |   | | | | | |-'
                                    `-^---' '   ' `-^ `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                       `'
 A central control center for the user interaction of diverse MeshCraft elements
 interlocking with each other, like modes.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Bridge = null;


/*
| Imports
*/
var Action;
var Caret;
var Dash;
var Euclid;
var fontPool;
var IFace;
var Jools;
var MeshMashine;
var Peer;
var Range;
var Sign;
var theme;
var Visual;


/*
| Capsule
*/
( function() {

'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
Bridge = function( )
{
	/*
	| $mode can be:
	|
	| 'default':
	|    Standard selection, moving stuff around.
	|
	| 'create' :
	|    Creating a new item.
	|    this.$create is set or null.
	|
	|  ...
	|
	*/
	this._$mode = 'default';

	/*
	| Creating this item:
	|
	| 'note',
	| 'label',
	| 'relation' or
	| 'portal
	*/
	this._$create = null;

	/*
	| an Action object for the current action
	*/
	this._$action = null;
};


/*
| Returns the current mode.
*/
Bridge.prototype.mode =
	function( )
{
	return this._$mode;
};


/*
| Returns true if in 'mode'.
*/
Bridge.prototype.inMode =
	function( mode )
{
	return this._$mode === mode;
};



/*
| Changes the mode
*/
Bridge.prototype.changeMode =
	function( mode )
{
	this._$mode = mode;

	shell.$board.getPanel( 'MainDisc' ).poke();
};


/*
| Returns the current creation.
*/
Bridge.prototype.create =
	function( )
{
	return this._$create;
};


/*
| Returns true if creating 'crate'.
*/
Bridge.prototype.inCreate =
	function( create )
{
	return this._$create === create;
};


/*
| Changes the creation.
*/
Bridge.prototype.changeCreate =
	function( create )
{
	this._$create = create;

	shell.$board.getPanel( 'MainDisc' ).poke();
};


/*
| Returns the current action.
*/
Bridge.prototype.action =
	function( )
{
	return this._$action;
}


/*
| Creates an action.
*/
Bridge.prototype.startAction = function( )
{
	if( this._$action )
		{ throw new Error( 'double action' ); }

	return this._$action = new Action( arguments );

};


/*
| Ends an action.
*/
Bridge.prototype.stopAction = function()
{
	if( !this._$action )
		{ throw new Error( 'ending no action' ); }

	this._$action = null;

};



} )( );
