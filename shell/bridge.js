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
var
	Bridge =
		null;


/*
| Imports
*/
var
	Action,
	Jools,
	shell;


/*
| Capsule
*/
( function( ) {

'use strict';


if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Valid modes
*/
var modes =
{
	/*
	| Creating a new item.
	*/
	'Create' :
		true,

	/*
	| Help
	*/
	'Help' :
		true,

	/*
	| Logging in
	*/
	'Login' :
		true,

	/*
	| Goto
	*/
	'MoveTo' :
		true,

	/*
	| Standard selection, moving stuff around.
	*/
	'Normal' :
		true,

	/*
	| User does not have access to a space.
	*/
	'NoAccessToSpace' :
		true,

	/*
	| Space does not exist, but user is allowed to create it.
	*/
	'NonExistingSpace' :
		true,

	/*
	| Removing items.
	*/
	'Remove' :
		true,

	/*
	| Signing up
	*/
	'SignUp' :
		true,

	/*
	| Space view
	*/
	'Space' :
		true,

	/*
	| User view
	*/
	'User' :
		true,

	/*
	| Welcome view
	*/
	'Welcome' :
		true

};


/*
| Constructor.
*/
Bridge = function( )
{

	/*
	| current mode
	*/
	// TODO change to a loading screen as startup
	this._$mode =
		'Normal';

	/*
	| an Action object for the current action
	*/
	this._$action =
		null;
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
	function(
		mode
	)
{
	if( !modes[ mode ] )
	{
		throw new Error(
			'invalid mode : ' + mode
		);
	}

	return this._$mode === mode;
};



/*
| Changes the mode
*/
Bridge.prototype.changeMode =
	function(
		mode
	)
{
	if( !modes[ mode ] )
	{
		throw new Error(
			'invalid mode : ' + mode
		);
	}

	this._$mode =
		mode;

	shell.pokeDisc( );
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
		throw new Error(
			'double action'
		);
	}

	var action =
	this._$action =
		new Action( arguments );

	return action;

};


/*
| Ends an action.
*/
Bridge.prototype.stopAction =
	function( )
{
	if( !this._$action )
	{
		throw new Error(
			'ending no action'
		);
	}

	this._$action =
		null;

};

/*
| Sets the current username.
*/
Bridge.prototype.setUsername =
	function(
		username
	)
{
	this._$username =
		username;
};

/*
| Gets the current username.
*/
Bridge.prototype.getUsername =
	function( )
{
	return this._$username;
};


} )( );
