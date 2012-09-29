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

                                        .---. .       .  .
                                        \___  |-. ,-. |  |
                                            \ | | |-' |  |
                                        `---' ' ' `-' `' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The users shell.

 The shell consists of the dashboard and the visual space.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var shell = null;
var Shell = null;


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
Shell = function( fabric )
{
	if( shell !== null )
	{
		throw new Error( 'Singleton not single' );
	}

	shell = this;

	Euclid.Measure.init( );

	this._fontWFont  = fontPool.get( 20, 'la' );

	this._$fontWatch = Euclid.Measure.width(
		this._fontWFont,
		'meshcraft$8833'
	);

	this.fabric    = fabric;

	this.$space    = null;
	this.$board    = new Dash.Board( );
	this.$caret    = new Caret( null, null, null, false );
	this.$action   = null;

	this._$menu    = null;

	this.selection = new Range( );

	// true at greenscreen frowny
	this.green     = false;

	// sets the caret to shown if the document has focus
	// if it is unknown, asume shown
	if( !document.hasFocus || document.hasFocus( ) )
		{ this.$caret.show( ); }

	this._draw( );
};


/*
| Retracts the focus.
*/
Shell.prototype.dropFocus = function( )
{
	this.setCaret( null, null );
};


/*
| Sets the caret position.
*/
Shell.prototype.setCaret = function( section, sign, retainx )
{
	switch( section )
	{
		case null :
			if( sign !== null )
			{
				throw new Error( 'setCaret section=null, invalid sign' );
			}
			break;

		case 'board' :
		case 'space' :
			switch( sign && sign.constructor )
			{
				case null   :
					break;

				case Sign   :
					break;

				case Object :
					sign = new Sign( sign );
					break;

				default :
					throw new Error(
						'setCaret section=' +
						section +
						', invalid sign'
					);
			}
			break;

		default :
			throw new Error( 'invalid section' );
	}

	var entity;

	if(
		this.$caret.sign &&
		(
			this.$caret.section   !== section   ||
			this.$caret.sign.path !== sign.path
		)
	)
	{
		entity = this._getCaretEntity(
			this.$caret.section,
			this.$caret.sign.path
		);

		if( entity )
			{ entity.knock( ); }
	}

	this.$caret = new Caret(
		section,
		sign,
		Jools.is( retainx ) ? retainx : null,
		this.$caret.$shown
	);

	if( sign )
	{
		entity = this._getCaretEntity(
			section,
			sign.path
		);

		if( entity )
			{ entity.knock(); }

		this.redraw = true;
	}

	return this.$caret;
};


/*
| Returns the first entity a caret can be in
*/
Shell.prototype._getCaretEntity = function( sec, path )
{
	switch( sec )
	{
		case 'board' :
			// FIXME
			// return this.$board.getSub(path, Dash.Component);
			return this.$board.getSub( path );

		case 'space' :
			return this.$space.getSub( path, 'Item' );

		default :
			throw new Error( 'Invalid sec: ' + sec );
	}
};


/*
| Positions the caret
*/
Shell.prototype.positionCaret = function( )
{
	var caret = this.$caret;

	switch( this.$caret.section )
	{
		case null :
			caret.$screenPos = caret.$height = 0;
			return;

		case 'board' :
			this.$board.positionCaret( );
			return;

		case 'space' :
			this.$space.positionCaret( );
			return;

		default :
			throw new Error(
				'invalid section: ' + this.$caret.section
			);
	}
};

/*
| Peer received a message.
*/
Shell.prototype.messageRCV = function( space, user, message )
{
	if( user )
		{ this.$board.message( user + ': ' + message ); }
	else
		{ this.$board.message( message ); }

	this.poke( );
};


/*
| MeshMashine is reporting updates.
*/
Shell.prototype.update = function( tree, chgX )
{
	this.$space.update( tree.root );

	var caret = this.$caret;

	if( caret.sign !== null )
	{
		this.setCaret(
			caret.section,
			MeshMashine.tfxSign( caret.sign, chgX ),
			caret.retainx
		);
	}

	var selection = this.selection;
	if( selection.active )
	{
		selection.sign1 = MeshMashine.tfxSign( selection.sign1, chgX );
		selection.sign2 = MeshMashine.tfxSign( selection.sign2, chgX );
	}

	this._draw( );
};


/*
| The shell got the systems focus.
*/
Shell.prototype.systemFocus = function( )
{
	if( this.green )
		{ return; }

	var caret = this.$caret;
	caret.show( );
	caret.display( );
};


/*
| The shell lost the systems focus.
*/
Shell.prototype.systemBlur = function( )
{
	if( this.green )
		{ return; }

	var caret = this.$caret;
	caret.hide( );
	caret.display( );
};


/*
| Blinks the caret (if shown)
*/
Shell.prototype.blink = function( )
{
	if( this.green )
		{ return; }

	// tests for font size changes
	var w = Euclid.Measure.width( this._fontWFont, 'meshcraft$8833' );

	if( w !== this._$fontWatch )
	{
		// console.log( 'fontchange detected' );
		this._$fontWatch = w;
		this.knock( );
	}

	this.$caret.blink( );
};


/*
| Creates an action.
*/
Shell.prototype.startAction = function( )
{
	if( this.$action )
		{ throw new Error( 'double action' ); }

	return this.$action = new Action( arguments );

};


/*
| Ends an action.
*/
Shell.prototype.stopAction = function()
{
	if( !this.$action )
		{ throw new Error( 'ending no action' ); }

	this.$action = null;

};


/*
| Lets the shell check if it should redraw.
| Used by async handlers.
*/
Shell.prototype.poke = function( )
{
	// actualizes hover context
	if( this.$hoverP )
	{
		this.pointingHover(
			this.$hoverP,
			this.$hoverShift,
			this.$hoverCtrl
		);
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| force-clears all caches.
*/
Shell.prototype.knock = function()
{
	if( this.green )
		{ return; }

	this.$caret.$save      = null;
	this.$caret.$screenPos = null;

	if( this.$space )
		{ this.$space.knock( ); }

	this.$board.knock( );

	if( this._$menu )
		{ this._$menu.knock( ); }

	this._draw( );
};


/*
| Sketches the greenscreen frowny.
*/
Shell.prototype.sketchFrowny =
	function(
		fabric,
		border,
		twist,
		view,
		pos
	)
{
	fabric.moveTo( pos.x - 100, pos.y       );
	fabric.lineTo( pos.x,       pos.y -  30 );
	fabric.lineTo( pos.x + 100, pos.y       );

	fabric.moveTo( pos.x - 100, pos.y - 130 );
	fabric.lineTo( pos.x -  50, pos.y - 140 );

	fabric.moveTo( pos.x + 100, pos.y - 130 );
	fabric.lineTo( pos.x +  50, pos.y - 140 );
};


/*
| Sets the current popup menu.
*/
Shell.prototype.setMenu = function( menu )
{
	if( this._$menu )
	{
		this._$menu.cancel( );
	}

	this._$menu = menu;

	this.redraw = true;
};


/*
| Draws the dashboard and the space.
*/
Shell.prototype._draw = function( )
{
	var fabric = this.fabric;

	fabric.reset( );

	if( this.green )
	{
		var ce = fabric.getCenter( );

		fabric.fillRect(
			'rgb(170, 255, 170)',
			0, 0,
			fabric.width, fabric.height
		);

		fabric.edge(
			[
				{
					border : 0,
					width  : 1,
					color  : 'black'
				}
			],
			this,
			'sketchFrowny',
			Euclid.View.proper,
			ce.add( 0, -80 )
		);

		fabric.fillText(
			this.green,
			ce,
			fontPool.get( 26, 'cm' )
		);

		fabric.fillText(
			'Please refresh the page to reconnect.',
			ce.x,
			ce.y + 50,
			fontPool.get( 20, 'cm' )
		);

		return;
	}

	// remove caret cache.
	this.$caret.$save = null;
	this.$caret.$screenPos = null;

	if( this.$space )
		{ this.$space.draw( ); }

	this.$board.draw( );

	if( this._$menu )
		{ this._$menu.draw( Euclid.View.proper ); }

	this.$caret.display( );

	this.redraw = false;
};


/*
| A mouse click.
*/
Shell.prototype.click = function( p, shift, ctrl )
{
	if( this.green )
		{ return; }

	// FIXME board

	if( this.$space )
		{ this.$space.click( p, shift, ctrl ); }

	if( this.redraw )
		{ this._draw( ); }
};


/*
| User is hovering his/her point ( mouse move )
*/
Shell.prototype.pointingHover = function( p, shift, ctrl )
{
	if( this.green )
		{ return; }

	this.$hoverP     = p;
	this.$hoverShift = shift;
	this.$hoverCtrl  = ctrl;

	var cursor = null;

	if( this._$menu )
	{
		cursor = this._$menu.pointingHover(
			Euclid.View.proper,
			p,
			shift,
			ctrl
		);
	}


	if( cursor )
		{ this.$board.pointingHover( null, shift, ctrl ); }
	else
		{ cursor = this.$board.pointingHover( p, shift, ctrl ); }

	if( this.$space )
	{
		if( cursor )
			{ this.$space.pointingHover( null, shift, ctrl ); }
		else
			{ cursor = this.$space.pointingHover( p, shift, ctrl ); }
	}

	if( this.redraw )
		{ this._draw( ); }

	return cursor;
};


/*
| Changes the shell to a green error screen.
*/
Shell.prototype.greenscreen = function( message )
{
	if( this.green )
		{ return; }

	if( !message )
		{ message = 'unknown error.'; }

	this.green = message;

	this._draw( );
};


/*
| pointing device starts pointing ( mouse down, touch start )
|
| returns the pointing state code, wheter this is a click/drag or yet undecided
*/
Shell.prototype.pointingStart = function( p, shift, ctrl )
{
	if( this.green )
		{ return false; }

	var pointingState = null;

	if( this._$menu )
	{
		pointingState =
			this._$menu.pointingStart(
				Euclid.View.proper,
				p,
				shift,
				ctrl
			);
	}

	if( pointingState === null )
	{
		pointingState = this.$board.pointingStart(
			p,
			shift,
			ctrl
		);
	}

	if( pointingState === null && this.$space )
	{
		pointingState = this.$space.pointingStart(
			p,
			shift,
			ctrl
		);
	}

	if( this.redraw )
		{ this._draw( ); }

	return pointingState || false;
};


/*
| Starts an operation with the mouse button held down.
*/
Shell.prototype.dragstart = function(p, shift, ctrl)
{
	if (this.green)
		{ return; }

	var cursor = this.$board.dragstart(p, shift, ctrl);

	if (cursor === null && this.$space)
		{ cursor = this.$space.dragstart(p, shift, ctrl); }

	if (this.redraw)
		{ this._draw(); }

	return cursor;
};


/*
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragmove = function(p, shift, ctrl)
{
	if (this.green)
		{ return; }

	var $action = this.$action;

	if (!$action)
		{ throw new Error('no action on dragmove'); }

	var cursor = null;

	switch ($action.section)
	{
		case 'board' :
			cursor = this.$board.actionmove(p, shift, ctrl);
			break;

		case 'space' :
			if (this.$space)
				{ cursor = this.$space.actionmove(p, shift, ctrl); }

			break;
	}

	if (this.redraw)
		{ this._draw(); }

	return cursor;
};


/*
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragstop = function(p, shift, ctrl)
{
	if (this.green)
		{ return; }

	var $action = this.$action;

	if (!$action)
		{ throw new Error('no action on dragstop'); }

	switch($action.section) {
		case 'board' :
			this.$board.actionstop(p, shift, ctrl);
			break;

		case 'space' :
			if (this.$space)
				{ this.$space.actionstop(p, shift, ctrl); }
			break;

		default :
			throw new Error('unknown $action.section');
	}

	if (this.redraw)
		{ this._draw(); }
};


/*
| Mouse wheel is being turned.
*/
Shell.prototype.mousewheel = function(p, dir, shift, ctrl)
{
	if (this.green)
		{ return; }

	// board?

	if (this.$space)
		{ this.$space.mousewheel(p, dir, shift, ctrl); }

	if (this.redraw)
		{ this._draw(); }
};


/**
| User pressed a special key.
*/
Shell.prototype.specialKey = function(key, shift, ctrl)
{
	if (this.green)
		{ return; }

	var caret  = this.$caret;

	switch (caret.section) {
		case 'board' :
			this.$board.specialKey(key, shift, ctrl);
			break;

		case null    :
		case 'space' :
			if (this.$space)
				{ this. $space.specialKey(key, shift, ctrl); }
			break;

		default : throw new Error('invalid section');
	}

	if (this.redraw)
		{ this._draw(); }
};


/*
| User entered normal text (one character or more).
*/
Shell.prototype.input = function(text)
{
	if (this.green)
		{ return; }

	if (this.selection.active)
		{ this.selection.remove(); }

	var caret  = this.$caret;

	switch (caret.section)
	{
		case null :
			break;

		case 'board' :
			this.$board.input(text);
			break;

		case 'space' :
			this.$space.input(text);
			break;

		default :
			throw new Error('invalid section');
	}

	if (this.redraw)
		{ this._draw(); }
};


/*
| The window has been resized.
*/
Shell.prototype.resize = function(width, height)
{
	this._draw();
};


/*
| Sets the current user
*/
Shell.prototype.setUser = function(user, passhash)
{
	this.$user = user;
	this.$board.setUser(user);
	this.peer.setUser(user, passhash);

	if (user.substr(0, 5) !== 'visit')
	{
		window.localStorage.setItem('user', user);
		window.localStorage.setItem('passhash', passhash);
	}
	else
	{
		if( this.$space &&
			this.$space.spacename.substr(0, 9) !== 'meshcraft')
		{
			this.moveToSpace('meshcraft:home');
		}

		window.localStorage.setItem('user', null);
		window.localStorage.setItem('passhash', null);
	}
};


/*
| Sets the space zoom factor.
*/
Shell.prototype.setSpaceZoom = function(zf)
{
	this.$board.setSpaceZoom(zf);
};


/*
| Changes the space zoom factor (around center)
*/
Shell.prototype.changeSpaceZoom = function(df)
{
	if (!this.$space)
		{ return; }
	this.$space.changeZoom(df);
};


/*
| Called when loading the website
*/
Shell.prototype.onload =
	function( )
{
	this.peer = new Peer(
		new IFace( this, this )
	);

	var user     = window.localStorage.getItem( 'user' );

	var passhash = null;
	if( user )
		{ passhash = window.localStorage.getItem( 'passhash' ); }
	else
		{ user = 'visitor'; }

	this.peer.auth( user, passhash, this );
};


/*
| Moves to space with the name name.
|
| if spaceName is null, reloads current space.
*/
Shell.prototype.moveToSpace =
	function( name )
{
	var self = this;

	if( this.$caret.section === 'space' )
		{ this.setCaret( null, null ); }

	if( name === null )
	{
		name = self.$space.spacename;

		if(
			this.$user.substr( 0, 5 ) === 'visit' &&
			(
				name !== 'meshcraft:home' &&
				name !== 'meshcraft:sandbox'
			)
		)
		{
			name = 'meshcraft:home';
		}
	}
	else
	{
		self.$board.message( 'Moving to "' + name + '" ...' );
	}

	self.$board.setCurSpace( '', '' );

	this.peer.aquireSpace(
		name,
		function( err, val )
		{
			if( err !== null )
			{
				self.greenscreen( 'Cannot aquire space: ' + err.message );
				return;
			}

			if (val.name !== name)
			{
				throw new Error('server served wrong space!');
			}

			var tree = val.tree;

			self.$space = new Visual.Space(
				tree.root,
				name,
				val.access
			);

			self.$board.setCurSpace(
				name,
				val.access
			);

			self.$board.setSpaceZoom( 0 );

			self._draw( );
		}
	);

};


/*
| answer to on 'auth' operation.
*/
Shell.prototype.onAuth =
	function(
		user,
		passhash,
		res
	)
{
	if( !res.ok )
	{
		// when logging in with a real user failed
		// takes a visitor instead
		if( user !== 'visitor' )
		{
			this.peer.auth(
				'visitor',
				null,
				this
			);

			return;
		}

		// if even that failed, bailing to greenscreen
		this.greenscreen( res.message );
		return;
	}

	this.setUser( res.user, res.passhash );

	if( !this.$space )
	{
		this.moveToSpace( 'meshcraft:home' );
	}
};


} )( );
