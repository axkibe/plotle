/*
| The jockey is the master of all discs
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Disc;

Disc =
	Disc || { };


/*
| Imports
*/
var
	Design,
	shell;

/*
| Capsule
*/
( function( ) {
'use strict';


if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor
*/
var Jockey =
Disc.Jockey =
	function(
		inherit,
		screensize
	)
{
	this._$createDisc =
		new Disc.CreateDisc(
			inherit && inherit._$createDisc,
			Design.CreateDisc,
			screensize
		);

	this._$mainDisc =
		new Disc.MainDisc(
			inherit && inherit._$mainDisc,
			Design.MainDisc,
			screensize
		);
};


/*
| Displays a current space
*/
Jockey.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	return (
		this._$mainDisc.arrivedAtSpace(
			spaceUser,
			spaceTag,
			access
		)
	);
};


/*
| Start of a dragging operation.
*/
Jockey.prototype.dragStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


/*
| Draws the disc panel.
*/
Jockey.prototype.draw =
	function(
		fabric
	)
{
	if( shell.bridge.inMode( 'Create' ) )
	{
		this._$createDisc.draw( fabric );
	}

	this._$mainDisc.draw( fabric );
};


/*
| Returns true if point is on the disc panel.
*/
Jockey.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		hover =
			this._$mainDisc.pointingHover(
				p,
				shift,
				ctrl
			);

	if( hover !== null )
	{
		return hover;
	}

	if( shell.bridge.inMode( 'Create' ) )
	{
		return (
			this._$createDisc.pointingHover(
				p,
				shift,
				ctrl
			)
		);
	}

	return null;
};


/*
| Displays a message
*/
Jockey.prototype.message =
	function(
		// message
	)
{
	// nothing
};


/*
| Returns true if point is on this panel.
*/
Jockey.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		start =
			this._$mainDisc.pointingStart(
				p,
				shift,
				ctrl
			);

	if( start !== null )
	{
		return start;
	}

	if( shell.bridge.inMode( 'Create' ) )
	{
		return (
			this._$createDisc.pointingStart(
				p,
				shift,
				ctrl
			)
		);
	}

	return null;
};


/*
| A button of the main disc has been pushed.
*/
Jockey.prototype.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
	var
		discname =
			path.get( 0 );

	switch( discname )
	{
		case 'create' :

			return (
				this._$createDisc.pushButton(
					path,
					shift,
					ctrl
				)
			);

		case 'main' :

			return (
				this._$mainDisc.pushButton(
					path,
					shift,
					ctrl
				)
			);

		default :

			throw new Error(
				'invalid discname: ' + discname
			);
	}
};


/*
| Sets the hovered component.
|
| TODO remove
*/
Jockey.prototype.setHover =
	function(
		path
	)
{
	var
		discname =
			path.get( 0 );

	switch( discname )
	{
		case 'create' :

			return this._$createDisc.setHover( path );

		case 'main' :

			return this._$mainDisc.setHover( path );

		default :

			throw new Error(
				'invalid discname: ' + discname
			);
	}
};


/*
| An action started or stoped or changed
|
| TODO remove
*/
Jockey.prototype.setMode =
	function(
		mode
	)
{
	return this._$mainDisc.setMode( mode );
};


/*
| Displays the current space zoom level
*/
Jockey.prototype.setSpaceZoom =
	function(
		// zf
	)
{
	// nothing
};


/*
| Displays the current user
| Adapts login/logout/signup button
|
| TODO remove
*/
Jockey.prototype.setUser =
	function(
		user
	)
{
	return this._$mainDisc.setUser( user );
};


/*
| TODO remove
*/
Jockey.prototype.setActive =
	function(
		active
	)
{
	return this._$createDisc.setActive( active );
};


} )( );
