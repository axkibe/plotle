/*
| A central control center for the user interaction of diverse MeshCraft elements
| interlocking with each other, like modes.
|
| FIXME, remove validity checks in releases
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Bridge = null;


/*
| Imports
*/
var Action;
var Jools;
var shell;


/*
| Capsule
*/
( function( ) {

'use strict';


if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Valid modes
*/
var modes =
{

	/*
	| Standard selection, moving stuff around.
	*/
	'Normal' :
		true,

	/*
	| Creating a new item.
	| this.$create is set or null.
	*/
	'Create' :
		true,

	/*
	| Removing items.
	*/
	'Remove' :
		true,

	/*
	| Space view
	*/
	'Space' :
		true,

	/*
	| Logging in
	*/
	'Login' :
		true,

	/*
	| Signing up
	*/
	'SignUp' :
		true,

	/*
	| Help
	*/
	'Help' :
		true

};

///*
//| Valid creates
//*/
//var creates =
//{
//
//	/*
//	| A new note.
//	*/
//	'Note' : true,
//
//	/*
//	| A new label.
//	*/
//	'Label'  : true,
//
//	/*
//	| A new relation
//	*/
//	'Relation' : true,
//
//	/*
//	| A new portal
//	*/
//	'Portal' : true
//
//};


/*
| Constructor.
*/
Bridge = function( )
{

	/*
	| current mode
	*/
	this._$mode = 'Normal';

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
	if( !modes[ mode ] )
	{
		throw new Error( 'invalid mode : ' + mode  );
	}

	return this._$mode === mode;
};



/*
| Changes the mode
*/
Bridge.prototype.changeMode =
	function( mode )
{
	if( !modes[ mode ] )
	{
		throw new Error( 'invalid mode : ' + mode );
	}

	this._$mode = mode;

	shell.$board.getPanel( 'MainDisc' ).poke();
};


/*
| Returns the current action.
*/
Bridge.prototype.action =
	function( )
{
	return this._$action;
};


/*
| Creates an action.
*/
Bridge.prototype.startAction =
	function( )
{
	if( this._$action )
	{
		throw new Error( 'double action' );
	}

	return this._$action = new Action( arguments );

};


/*
| Ends an action.
*/
Bridge.prototype.stopAction =
	function( )
{
	if( !this._$action )
	{
		throw new Error( 'ending no action' );
	}

	this._$action = null;

};


} )( );
