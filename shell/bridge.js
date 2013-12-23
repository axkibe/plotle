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
| Constructor.
*/
Bridge =
	function( )
{

	/*
	| current mode
	*/
	// FIXME change to a loading screen as startup
	this._$mode =
		'Normal';

	/*
	| an Action object for the current action
	*/
	this._$action =
		null;
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

	var
		action =
		this._$action =
			new Action( arguments );

	// XXX evil knevil
	if( shell._$discJockey )
	{
		shell._$discJockey.setActive( action && action.type );
	}

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

	// XXX evil knevil
	if( shell._$discJockey )
	{
		shell._$discJockey.setActive( null );
	}
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
