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
var
	shell =
		null,

	Shell =
		null;

/*
| Imports
*/
var
	Action,
	Bridge,
	Caret,
	Disc,
	Euclid,
	fontPool,
	Forms,
	GreenScreen,
	IFace,
	Jools,
	MeshMashine,
	Peer,
	Range,
	shellverse,
	Sign,
	system,
	theme,
	Visual;


/*
| Capsule
*/
( function() {

'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
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

	var screensize =
	this.screensize =
		shellverse.grow(
			'Point',
			'x',
				fabric.width,
			'y',
				fabric.height
		);

	var forms =
		[
			'Login',
			'MoveTo',
			'NoAccessToSpace',
			'NonExistingSpace',
			'SignUp',
			'Space',
			'User',
			'Welcome'
		];

	this._$forms =
		{ };

	for( var i in forms )
	{
		var
			name =
				forms[ i ];

		this._$forms[ name ] =
			new Forms[ name ](
				'screensize',
					screensize
			);
	}

	this._$disc =
		new Disc.MainDisc(
			null,
			screensize
		);

	this.bridge =
		new Bridge( );

	this._$selection =
		null;

	// greenscreen display if not null
	this._$greenscreen =
		null;

	this._draw( );
};


/*
| Positions the caret.
*/
Shell.prototype.positionCaret =
	function( )
{
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.positionCaret( );
	}
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
		this._$disc.message( user + ': ' + message );
	}
	else
	{
		this._$disc.message( message );
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
		tree,
		chgX
	);

	// TODO move selection to space / forms

	var selection =
		this._$selection;

	if( selection )
	{
		this.setSelection(
			MeshMashine.tfxSign(
				selection.sign1,
				chgX
			),
			MeshMashine.tfxSign(
				selection.sign2,
				chgX
			)
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
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.systemFocus( );
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| The shell lost the systems focus.
*/
Shell.prototype.systemBlur =
	function( )
{
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.systemBlur( );
	}

	if( this.redraw )
	{
		this._draw( );
	}
};


/*
| Blinks the caret (if shown)
*/
Shell.prototype.blink =
	function( )
{
	// tests for font size changes
	var
		w =
			Euclid.Measure.width(
				this._fontWFont,
				'meshcraft$8833'
			);

	if( w !== this._$fontWatch )
	{
		this._$fontWatch =
			w;

		this.knock( );
	}

	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.blink( );
	}
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
	if( this.$hover )
	{
		this.pointingHover(
			this.$hover.p,
			this.$hover.shift,
			this.$hover.ctrl
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
	// TODO remove
	/*
	var forms =
		this._$forms;

	for( var name in forms )
	{
		var form =
			form[ name ];

		form.knock( );
	}

	if( this.$space )
	{
		this.$space.knock( );
	}

	this._$disc.knock( );

	this._draw( );
	*/
};


/*
| Draws the dashboard and the space.
*/
Shell.prototype._draw =
	function( )
{
	var
		fabric =
			this.fabric;

	fabric.reset( );

	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.draw( fabric );
	}

	if( display && display.showDisc )
	{
		this._$disc.draw( fabric );
	}

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
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.click(
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
Shell.prototype._getCurrentDisplay =
	function( )
{
	var
		name =
			this.bridge.mode( );

	if( this._$greenscreen )
	{
		return this._$greenscreen;
	}

	switch( name )
	{
		case 'Create' :
		case 'Normal' :
		case 'Remove' :

			return this.$space;

		case 'Login' :
		case 'MoveTo' :
		case 'NoAccessToSpace' :
		case 'NonExistingSpace' :
		case 'SignUp' :
		case 'Space' :
		case 'User' :
		case 'Welcome' :

			var inherit =
				this._$forms[ name ];

			if(
				!this.screensize.equals(
					inherit.screensize
				)
			)
			{
				this._$forms[ name ] =
					new Forms[ name ](
						'inherit',
							inherit,
						'screensize',
							this.screensize
					);
			}

			return this._$forms[ name ];

		default :

			throw new Error( 'unknown mode: ' + name );
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
	// TODO make an $hover object

	this.$hover =
		Jools.immute({
			p :
				p,

			shift :
				shift,

			ctrl :
				ctrl
		});

	var
		display =
			this._getCurrentDisplay( ),

		cursor = null;

	if( display && display.showDisc )
	{
		cursor =
			this._$disc.pointingHover(
				p,
				shift,
				ctrl
			);
	}


	if( display )
	{
		if( cursor )
		{
			display.pointingHover(
				null,
				shift,
				ctrl
			);
		}
		else
		{
			cursor =
				display.pointingHover(
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
| Switches to a green error screen.
*/
Shell.prototype.greenscreen =
	function( message )
{
	if( !message )
	{
		message =
			'unknown error.';
	}

	if( !this._$greenscreen )
	{
		this._$greenscreen =
			new GreenScreen( message );
	}

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
	var
		pointingState =
			null;

	if( pointingState === null )
	{
		pointingState =
			this._$disc.pointingStart(
				p,
				shift,
				ctrl
			);
	}

	var
		display =
			this._getCurrentDisplay( );

	if(
		pointingState === null &&
		display
	)
	{
		pointingState =
			display.pointingStart(
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
	var
		cursor =
			null,

		display =
			this._getCurrentDisplay( );

	if( display && display.showDisc )
	{
		cursor =
			this._$disc.dragStart(
				p,
				shift,
				ctrl
			);
	}

	if( cursor === null )
	{
		if( display )
		{
			cursor =
				display.dragStart(
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
				this._$disc.dragMove(
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
		this._draw( );
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
	if( this._$greenscreen )
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

			this._$disc.dragStop(
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
	// FIXME disc?

	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.mousewheel(
			p,
			dir,
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
| User is pressing a special key.
*/
Shell.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.specialKey(
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
	// TODO, this has no place here
	this.removeSelection( );

	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.input( text );
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
	var
		screensize =
		this.screensize =
			shellverse.grow(
				'Point',
				'x',
					width,
				'y',
					height
			);

	// TODO only when changed
	this._$disc =
		new Disc.MainDisc(
			this._$disc,
			screensize
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
	this.$user =
		user;

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
			this.$space.spaceUser !== 'meshcraft'
		)
		{
			this.moveToSpace(
				'meshcraft',
				'home',
				false
			);
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

	this.bridge.setUsername( user );

	this._$disc.setUser( user );

	this._$forms.User.setUsername( user );

	this._$forms.Welcome.setUsername( user );

	this._$forms.MoveTo.setUsername( user );
};


/*
| Sets the space zoom factor.
*/
Shell.prototype.setSpaceZoom =
	function(
		zf
	)
{
	this._$disc.setSpaceZoom( zf );
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
	this.peer =
		new Peer(
			new IFace(
				this,
				this
			)
		);

	var
		user =
			window.localStorage.getItem( 'user' ),

		passhash =
			null;

	if( user )
	{
		passhash =
			window.localStorage.getItem( 'passhash' );
	}
	else
	{
		user =
			'visitor';
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
| if name is null, reloads current space.
*/
Shell.prototype.moveToSpace =
	function(
		spaceUser,
		spaceTag,
		create
	)
{
	// TODO make message a function of shell
	this._$disc.message(
		'Moving to ' + spaceUser + ':' + spaceTag + ' ...'
	);

	this.peer.aquireSpace(
		spaceUser,
		spaceTag,
		create,
		this
	);
};


/*
| Receiving a moveTo event
*/
Shell.prototype.onAquireSpace =
	function(
		asw
	)
{
	switch( asw.status ) {

		case 'served' :

			break;

		case 'nonexistent' :

			this._$forms.NonExistingSpace.setSpace(
				asw.spaceUser,
				asw.spaceTag
			);

			shell.bridge.changeMode( 'NonExistingSpace' );

			this.redraw =
				true;

			this.poke( );

			return;

		case 'no access' :

			this._$forms.NoAccessToSpace.setSpace(
				asw.spaceUser,
				asw.spaceTag
			);

			shell.bridge.changeMode( 'NoAccessToSpace' );

			this.redraw =
				true;

			this.poke( );

			return;

		case 'connection fail' :

			this.greenscreen(
				'Connection failed: ' +
				asw.message
			);

			return;

		default :

			this.greenscreen(
				'Unknown aquireSpace() status: ' +
				asw.status + ': ' + asw.message
			);

			return;
	}

	var
		spaceUser =
			asw.spaceUser,

		spaceTag =
			asw.spaceTag,

		tree =
			asw.tree,

		access =
			asw.access;

	this.$space =
		new Visual.Space(
			tree,
			spaceUser,
			spaceTag,
			access
		);

	this.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this._$disc.setSpaceZoom( 0 );

	this._draw( );
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
		this.moveToSpace(
			'meshcraft',
			'home',
			false
		);
	}
};


/*
| Gets the current caret.
*/
Shell.prototype.getCaret =
	function( )
{
	var display =
		this._getCurrentDisplay( );

	return display && display.$caret;
};


/*
| Logs out the current user
*/
Shell.prototype.logout =
	function( )
{
	var self =
		this;

	this.peer.logout(
		function( res )
		{
			if(! res.ok )
			{
				self.greenscreen(
					'Cannot logout: ' + res.message
				);

				return;
			}

			self.setUser(
				res.user,
				res.passhash
			);

			self.moveToSpace(
				'meshcraft',
				'home',
				false
			);

			self.poke( );
		}
	);
};


/*
| Gets the selection.
*/
Shell.prototype.getSelection =
	function( )
{
	return this._$selection;
};


/*
| Sets the selection.
*/
Shell.prototype.setSelection =
	function(
		sign1,
		sign2
	)
{
	if( !sign1 )
	{
		throw new Error( 'sign1 null' );
	}

	if( !sign2 )
	{
		throw new Error( 'sign2 null' );
	}

	var selection =
	this._$selection =
		new Range(
			sign1,
			sign2
		);

	system.setInput(
		selection.innerText(
			this.$space
		)
	);

	return selection;
};

/*
| A space finished loading.
*/
Shell.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	this._$disc.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this._$forms.Space.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this.bridge.changeMode( 'Normal' );
};


/*
| Removes the selection including its contents.
*/
Shell.prototype.removeSelection =
	function( )
{
	var selection =
		this._$selection;

	if( !selection ) {
		return null;
	}

	selection.normalize( this.$space );

	this.deselect();

	this.redraw =
		true;

	this.peer.removeSpan(
		selection.$begin.path,
		selection.$begin.at1,

		selection.$end.path,
		selection.$end.at1
	);

	return null;
};


/*
| Deselects the selection.
*/
Shell.prototype.deselect =
	function( nopoke )
{
	var selection =
		this._$selection;

	if( !selection )
	{
		return;
	}

	// FIXME, use knock instead?
	if( !nopoke )
	{
		this.$space.getSub(
			selection.sign1.path,
			'Item'
		).poke( );
	}

	this._$selection
		= null;

	system.setInput( '' );
};


} )( );
