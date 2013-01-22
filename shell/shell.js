/*
| The users shell.
|
| The shell consists of the disc, dashboard and the visual space.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var shell =
	null;

var Shell =
	null;


/*
| Imports
*/
var Action;
var Bridge;
var Caret;
var Disc;
var Euclid;
var fontPool;
var Forms;
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
Shell =
	function(
		fabric
	)
{
	if( shell !== null )
	{
		throw new Error( 'Singleton not single' );
	}

	shell =
		this;

	Euclid.Measure.init( );

	this._fontWFont =
		fontPool.get( 20, 'la' );

	this._$fontWatch =
		Euclid.Measure.width(
			this._fontWFont,
			'meshcraft$8833'
		);

	this.fabric =
		fabric;

	// TODO mark as private
	this.$space =
		null;

	this.$forms =
		{
			login :
				new Forms.Login()
		};

	// TODO mark as private
	this.$disc =
		new Disc.MainDisc(
			null,
			new Euclid.Point(
				fabric.width,
				fabric.height
			)
		);

	// TODO remove
	Jools.keyNonGrata( this, '$caret' );

	this.bridge =
		new Bridge( );

	this.selection =
		new Range( );

	// true at greenscreen frowny
	this.green =
		false;

	// sets the caret to shown if the document has focus
	// if it is unknown, assumes shown
	/*
	TODO tis needed?
	if(
		!document.hasFocus ||
		document.hasFocus( )
	)
	{
		this.$caret.show( );
	}
	*/

	this._draw( );
};


/*
| Positions the caret.
*/
Shell.prototype.positionCaret =
	function( )
{
	this.getCurrentDisplay( ).positionCaret( );
};

/*
| Peer received a message.
*/
Shell.prototype.messageRCV =
	function(
		space,
		user,
		message
	)
{
	if( user )
	{
		this.$disc.message( user + ': ' + message );
	}
	else
	{
		this.$disc.message( message );
	}

	this.poke( );
};


/*
| MeshMashine is reporting updates.
*/
Shell.prototype.update =
	function(
		tree,
		chgX
	)
{
	this.$space.update(
		tree.root,
		chgX
	);


	// TODO move selection to space / forms

	var selection =
		this.selection;

	if( selection.active )
	{
		selection.sign1 =
			MeshMashine.tfxSign(
				selection.sign1,
				chgX
			);

		selection.sign2 =
			MeshMashine.tfxSign(
				selection.sign2,
				chgX
			);
	}

	this._draw( );
};


/*
| The shell got the systems focus.
*/
Shell.prototype.systemFocus =
	function( )
{
	if( this.green )
	{
		return;
	}

	this.getCurrentDisplay( ).systemFocus( );
};


/*
| The shell lost the systems focus.
*/
Shell.prototype.systemBlur =
	function( )
{
	if( this.green )
	{
		return;
	}

	this.getCurrentDisplay( ).systemBlur( );
};


/*
| Blinks the caret (if shown)
*/
Shell.prototype.blink =
	function( )
{
	if( this.green )
	{
		return;
	}

	// tests for font size changes
	var w =
		Euclid.Measure.width(
			this._fontWFont,
			'meshcraft$8833'
		);

	if( w !== this._$fontWatch )
	{
		// console.log( 'fontchange detected' );
		this._$fontWatch =
			w;

		this.knock( );
	}

	this.getCurrentDisplay( ).blink( );
};


/*
| Lets the shell check if it should redraw.
|
| Used by async handlers.
*/
Shell.prototype.poke =
	function( )
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
| Force-clears all caches.
*/
Shell.prototype.knock =
	function( )
{
	if( this.green )
	{
		return;
	}

	// TODO knock forms?

	if( this.$space )
	{
		this.$space.knock( );
	}

	this.$disc.knock( );

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
	fabric.moveTo(
		pos.x - 100,
		pos.y
	);

	fabric.lineTo(
		pos.x,
		pos.y - 30
	);

	fabric.lineTo(
		pos.x + 100,
		pos.y
	);

	fabric.moveTo(
		pos.x - 100,
		pos.y - 130
	);

	fabric.lineTo(
		pos.x - 50,
		pos.y - 140
	);

	fabric.moveTo(
		pos.x + 100,
		pos.y - 130
	);

	fabric.lineTo(
		pos.x + 50,
		pos.y - 140
	);
};


/*
| Draws the green screen
*/
Shell.prototype._drawGreenScreen =
	function(
		fabric
	)
{
	var ce =
		fabric.getCenter( );

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

	fabric.paintText(
		'text',
			this.green,
		'p',
			ce,
		'font',
			fontPool.get(
				26,
				'cm'
			)
	);

	fabric.paintText(
		'text',
			'Please refresh the page to reconnect.',
		'xy',
			ce.x,
			ce.y + 50,
		'font',
			fontPool.get(
				20,
				'cm'
			)
	);
};


/*
| Draws the dashboard and the space.
*/
Shell.prototype._draw =
	function( )
{
	var fabric =
		this.fabric;

	fabric.reset( );

	if( this.green )
	{
		this._drawGreenScreen( fabric );

		return;
	}

	switch( this.bridge.mode( ) )
	{
		case 'Login' :

			this.$forms.login.draw( fabric );

			break;

		default :

			if( this.$space )
			{
				this.$space.draw( fabric );
			}

			break;
	}


	this.$disc.draw( fabric );

	this.redraw =
		false;
};


/*
| User clicked
*/
Shell.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	if( this.green )
	{
		return;
	}

	var current =
		this.getCurrentDisplay( );

	if( current )
	{
		current.click(
			p,
			shift,
			ctrl
		);
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| Returns current display
|
| This is either a visual space or a form
*/
Shell.prototype.getCurrentDisplay =
	function( )
{
	switch( this.bridge.mode( ) )
	{
		case 'Login' :

			return this.$forms.login;

		default :

			return this.$space;
	}
};

/*
| User is hovering his/her point ( mouse move )
*/
Shell.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	if( this.green )
	{
		return;
	}

	this.$hoverP =
		p;

	this.$hoverShift =
		shift;

	this.$hoverCtrl =
		ctrl;

	var cursor = null;


	if( cursor )
	{
		this.$disc.pointingHover(
			null,
			shift,
			ctrl
		);
	}
	else
	{
		cursor =
			this.$disc.pointingHover(
				p,
				shift,
				ctrl
			);
	}

	var current =
		this.getCurrentDisplay( );


	if( current )
	{
		if( cursor )
		{
			current.pointingHover(
				null,
				shift,
				ctrl
			);
		}
		else
		{
			cursor =
				current.pointingHover(
					p,
					shift,
					ctrl
				);
		}
	}

	// FIXME this should be called $redraw

	if( this.redraw )
	{
		this._draw( );
	}

	return cursor;
};


/*
| Changes the shell to a green error screen.
*/
Shell.prototype.greenscreen =
	function( message )
{
	if( this.green )
	{
		return;
	}

	if( !message )
	{
		message =
			'unknown error.';
	}

	this.green =
		message;

	this._draw( );
};


/*
| Pointing device starts pointing
| ( mouse down, touch start )
|
| Returns the pointing state code,
| wheter this is a click/drag or yet undecided.
*/
Shell.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	if( this.green )
	{
		return false;
	}

	var pointingState =
		null;

	if( pointingState === null )
	{
		pointingState =
			this.$disc.pointingStart(
				p,
				shift,
				ctrl
			);
	}

	var current =
		this.getCurrentDisplay( );

	if(
		pointingState === null &&
		current
	)
	{
		pointingState =
			current.pointingStart(
				p,
				shift,
				ctrl
			);
	}

	if( this.redraw )
	{
		this._draw( );
	}

	return pointingState || false;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
Shell.prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	if( this.green )
	{
		return;
	}

	var cursor =
		this.$disc.dragStart(
			p,
			shift,
			ctrl
		);

	if( cursor === null )
	{
		var current =
			this.getCurrentDisplay( );

		if( current )
		{
			cursor =
				current.dragStart(
					p,
					shift,
					ctrl
				);
		}
	}

	if( this.redraw )
	{
		this._draw( );
	}

	return cursor;
};


/*
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	if( this.green )
	{
		return;
	}

	var action =
		this.bridge.action( );

	if( !action )
	{
		throw new Error( 'no action on dragMove' );
	}

	var cursor =
		null;

	switch( action.section )
	{
		case 'board' :

			cursor =
				this.$disc.dragMove(
					p,
					shift,
					ctrl
				);

			break;

		case 'space' :

			if( this.$space )
			{
				cursor =
					this.$space.dragMove(
						p,
						shift,
						ctrl
					);
			}

			break;
	}

	if( this.redraw )
	{
		this._draw();
	}

	return cursor;
};


/*
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	if( this.green )
	{
		return;
	}

	var action =
		this.bridge.action( );

	if( !action )
	{
		throw new Error( 'no action on dragStop' );
	}

	switch( action.section )
	{
		case 'board' :

			this.$disc.dragStop(
				p,
				shift,
				ctrl
			);

			break;

		case 'space' :

			if( this.$space )
			{
				this.$space.dragStop(
					p,
					shift,
					ctrl
				);
			}

			break;

		default :

			throw new Error( 'unknown action.section' );
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| Mouse wheel is being turned.
*/
Shell.prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	if (this.green)
	{
		return;
	}

	// disc?

	var current =
		this.getCurrentDisplay( );

	if( current )
	{
		current.mousewheel(
			p,
			dir,
			shift,
			ctrl
		);
	}

	if( this.redraw )
	{
		this._draw();
	}
};


/*
| User is pressing a special key.
*/
Shell.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	// TODO make the green screen a "Display".

	if( this.green )
	{
		return;
	}

	var current = this.getCurrentDisplay( );

	if( current )
	{
		current.specialKey(
			key,
			shift,
			ctrl
		);
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| User entered normal text (one character or more).
*/
Shell.prototype.input =
	function( text )
{
	if( this.green )
	{
		return;
	}


	if( this.selection.active )
	{
		this.selection.remove( );
	}

	var current =
		this.getCurrentDisplay( );

	if( current ) {
		current.input( text );
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| The window has been resized.
*/
Shell.prototype.resize =
	function(
		width,
		height
	)
{
	this.$disc =
		new Disc.MainDisc(
			this.$disc,
			new Euclid.Point(
				width,
				height
			)
		);

	this._draw( );
};


/*
| Sets the current user
*/
Shell.prototype.setUser =
	function(
		user,
		passhash
	)
{
	this.$user = user;

	this.peer.setUser(
		user,
		passhash
	);

	if( user.substr( 0, 5 ) !== 'visit' )
	{
		window.localStorage.setItem(
			'user',
			user
		);

		window.localStorage.setItem(
			'passhash',
			passhash
		);
	}
	else
	{
		if(
			this.$space &&
			this.$space.spacename.substr(0, 9) !== 'meshcraft'
		)
		{
			this.moveToSpace('meshcraft:home');
		}

		window.localStorage.setItem(
			'user',
			null
		);

		window.localStorage.setItem(
			'passhash',
			null
		);
	}

	this.$disc.poke( );
};


/*
| Sets the space zoom factor.
*/
Shell.prototype.setSpaceZoom =
	function(
		zf
	)
{
	this.$disc.setSpaceZoom( zf );
};


/*
| Changes the space zoom factor (around center)
*/
Shell.prototype.changeSpaceZoom =
	function(
		df
	)
{
	if( !this.$space )
	{
		return;
	}

	this.$space.changeZoom( df );
};


/*
| Called when loading the website
*/
Shell.prototype.onload =
	function( )
{
	this.peer = new Peer(
		new IFace(
			this,
			this
		)
	);

	var user =
		window.localStorage.getItem( 'user' );

	var passhash =
		null;

	if( user )
	{
		passhash =
			window.localStorage.getItem( 'passhash' );
	}
	else
	{
		user = 'visitor';
	}

	this.peer.auth(
		user,
		passhash,
		this
	);
};


/*
| Moves to space with the name name.
|
| if spaceName is null, reloads current space.
*/
Shell.prototype.moveToSpace =
	function(
		name
	)
{
	var self = this;

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
		self.$disc.message(
			'Moving to "' + name + '" ...'
		);
	}

	self.$disc.setCurSpace(
		'',
		''
	);

	this.peer.aquireSpace(
		name,
		function( err, val )
		{
			if( err !== null )
			{
				self.greenscreen( 'Cannot aquire space: ' + err.message );
				return;
			}

			if( val.name !== name )
			{
				throw new Error( 'server served wrong space!' );
			}

			var tree = val.tree;

			self.$space = new Visual.Space(
				tree.root,
				name,
				val.access
			);

			self.$disc.setCurSpace(
				name,
				val.access
			);

			self.$disc.setSpaceZoom( 0 );

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

	this.setUser(
		res.user,
		res.passhash
	);

	if( !this.$space )
	{
		this.moveToSpace( 'meshcraft:home' );
	}
};


/*
| Gets the current caret.
*/
Shell.prototype.getCaret =
	function( )
{
	return this.getCurrentDisplay( ).$caret;
};


} )( );
