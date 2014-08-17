/*
| The users shell.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	shell,
	Shell;

shell =
Shell =
	null;

/*
| Imports
*/
var
	Action,
	Discs,
	euclid,
	fontPool,
	Forms,
	Gruga,
	jion,
	Mark,
	Net,
	Peer,
	system,
	swatch;


/*
| Capsule
*/
( function() {
'use strict';


/*
| Valid modes
*/
var
	_modes;

/**/if( CHECK )
/**/{
/**/	_modes =
/**/		Object.freeze( {
/**/			// Creating a new item.
/**/			'Create' :
/**/				true,
/**/			// Help.
/**/			'Help' :
/**/				true,
/**/			// Logging in.
/**/			'Login' :
/**/				true,
/**/			// Moveing To another space.
/**/			'MoveTo' :
/**/				true,
/**/			// Standard selection, moving stuff around.
/**/			'Normal' :
/**/				true,
/**/			// User does not have access to a space.
/**/			'NoAccessToSpace' :
/**/				true,
/**/			// Space does not exist,
/**/			// but user is allowed to create it.
/**/			'NonExistingSpace' :
/**/				true,
/**/			// Signing up
/**/			'SignUp' :
/**/				true,
/**/			// Space view
/**/			'Space' :
/**/				true,
/**/			// User view
/**/			'User' :
/**/				true,
/**/			// Welcome view
/**/			'Welcome' :
/**/				true
/**/		} );
/**/}


/*
| Constructor.
*/
Shell =
	function(
		fabric
	)
{
	var
		canvas,
		view;

/**/if( CHECK )
/**/{
/**/	if( shell !== null )
/**/	{
/**/		throw new Error(
/**/			'Singleton not single'
/**/		);
/**/	}
/**/}

	shell = this;

	canvas = document.createElement( 'canvas' );

	swatch =
		euclid.fabric.create(
			'canvas',
				canvas
		);

	euclid.measure.init( canvas );

	this._fontWFont = fontPool.get( 20, 'la' );

	this._$fontWatch =
		euclid.measure.width(
			this._fontWFont,
			'ArchLoom$8833'
		);

	this.fabric = fabric;

	this.username = null;

	this.$space = null;

	this.$action = Action.None.create( );

	this._$mode = 'Normal';

	// currently hovered thing
	this._$hover = jion.path.empty;

	view =
	this.$view =
		euclid.View.create(
			'pan',
				euclid.point.zero,
			'fact',
				0,
			'width',
				fabric.width,
			'height',
				fabric.height
		);

	this._$formJockey =
		Forms.Jockey.create(
			'hover',
				jion.path.empty,
			'mark',
				Mark.Vacant.create( ),
			'path',
				jion.path.empty
				.Append( 'forms' ),
			'view',
				view,
			'twig:add',
			'Login',
				Gruga.Login,
			'twig:add',
			'MoveTo',
				Gruga.MoveTo,
			'twig:add',
			'NoAccessToSpace',
				Gruga.NoAccessToSpace,
			'twig:add',
			'NonExistingSpace',
				Gruga.NonExistingSpace,
			'twig:add',
			'SignUp',
				Gruga.SignUp,
			'twig:add',
			'Space',
				Gruga.Space,
			'twig:add',
			'User',
				Gruga.User,
			'twig:add',
			'Welcome',
				Gruga.Welcome
		);

	this._$discJockey =
		Discs.Jockey.create(
			'access',
				'',
			'action',
				Action.None.create( ),
			'hover',
				jion.path.empty,
			'mark',
				Mark.Vacant.create( ),
			'mode',
				this._$mode,
			'path',
				jion.path.empty
				.Append( 'discs' ),
			'view',
				view,
			'twig:add',
			'MainDisc',
				Gruga.MainDisc,
			'twig:add',
			'CreateDisc',
				Gruga.CreateDisc
		);

	this.mark = Mark.Vacant.create( );

	// remembers an aquired visitor user name and passhash
	// so when logging out from a real user the previous
	// visitor is regained.
	this._$visitUser = null;

	this._$visitPasshash = null;

	this._draw( );
};


/*
| FIXME, workaround until $space is gone
*/
Object.defineProperty(
	Shell.prototype,
	'space',
	{
		get :
			function( )
			{
				return this.$space;
			}
	}
);


/*
| FIXME, workaround until $action is gone
*/
Object.defineProperty(
	Shell.prototype,
	'action',
	{
		get :
			function( )
			{
				return this.$action;
			}
	}
);


/*
| Changes the mode.
*/
Shell.prototype.setMode =
	function(
		mode
	)
{
/**/if( CHECK )
/**/{
/**/	if( !_modes[ mode ] )
/**/	{
/**/		throw new Error(
/**/			'invalid mode : ' + mode
/**/		);
/**/	}
/**/}

	this._$mode =
		mode;

	this._$discJockey =
		this._$discJockey.create(
			'mode',
				mode
		);

	this._$redraw =
		true;
};


/*
| Returns the attention center.
|
| That is the horiziontal offset of the caret.
|
| Used for example on the iPad so
| the caret is scrolled into view
| when the keyboard is visible.
*/
Object.defineProperty(
	Shell.prototype,
	'attentionCenter',
	{
		get :
			function( )
			{
				var
					display;

				display = this._getCurrentDisplay( );

				return display && display.attentionCenter;
			}
	}
);


/*
| Sets the current action.
*/
Shell.prototype.setAction =
	function(
		action
	)
{

/**/if ( CHECK )
/**/{
/**/	if( !action || !Action.isAction( action.reflex ) )
/**/	{
/**/		throw new Error(
/**/			'invalid action'
/**/		);
/**/	}
/**/}

	this.$action =
		action;

	this._$discJockey =
		this._$discJockey.create(
			'action',
				action
		);

	this._$redraw =
		true;
};


/*
| The link is reporting updates.
*/
Shell.prototype.update =
	function(
		space,
		chgX
	)
{
	var
		bSign,
		eSign,
		mark,
		sign,
		item;

	mark = this.space.mark;

	switch( mark.reflex )
	{
		case 'mark.caret' :

			item = space.twig[ mark.path.get( 2 ) ];

			if( item === undefined )
			{
				// the item holding the caret was removed
				mark = Mark.Vacant.create( );
			}
			else
			{
				sign =
					chgX.transformSign(
						jion.sign.create(
							'path',
								mark.path.Chop( ),
							'at1',
								mark.at
						)
					);

				// FIXME
				//   keeping retainx might not be correct
				//   in some cases
				mark =
					Mark.Caret.create(
						'path',
							sign.path.prepend( 'space' ),
						'at',
							sign.at1,
						'retainx',
							mark.retainx
					);
			}

			break;

		case 'mark.item' :

			item = space.twig[ mark.path.get( 2 ) ];

			if( item === undefined )
			{
				// the item holding the caret was removed
				mark = Mark.Vacant.create( );
			}

			break;

		case 'mark.range' :

			item = space.twig[ mark.bPath.get( 2 ) ];

			// tests if the owning item was removed
			if( item === undefined )
			{
				mark = Mark.Vacant.create( );
			}
			else
			{
				bSign =
					chgX.transformSign(
						jion.sign.create(
							'path',
								mark.bPath.Chop( ),
							'at1',
								mark.bAt
						)
					);

				eSign =
					chgX.transformSign(
						jion.sign.create(
							'path',
								mark.ePath.Chop( ),
							'at1',
								mark.eAt
						)
					);

				// tests if the range collapsed to a simple caret.
				if(
					bSign.path.equals( eSign.path ) &&
					bSign.at1 === eSign.at1
				)
				{
					mark =
						Mark.Caret.create(
							'path',
								bSign.path.prepend( 'space' ),
							'at',
								bSign.at1,
							'retainx',
								mark.retainx
						);
				}
				else
				{
					mark =
						Mark.Range.create(
							'doc',
								item.doc,
							'bPath',
								bSign.path.prepend( 'space' ),
							'bAt',
								bSign.at1,
							'ePath',
								eSign.path.prepend( 'space' ),
							'eAt',
								eSign.at1,
							'retainx',
								mark.retainx
						);
				}
			}

			break;

	}

	// FIXME let the link do the real stuff
	this.$space =
		space.create(
			'spaceUser',
				this.$space.spaceUser,
			'spaceTag',
				this.$space.spaceTag,
			'access',
				this.$space.access,
			'hover',
				this.$space.hover,
			'mark',
				mark,
			'path',
				this.$space.path,
			'view',
				this.$space.view
		);

	this._$discJockey =
		this._$discJockey.create(
			'mark',
				mark
		);

	this._draw( );
};


/*
| The shell got or lost the systems focus.
*/
Shell.prototype.setFocus =
	function(
		focus
	)
{
	switch( this.mark.reflex )
	{
		case 'mark.caret' :

			this.setMark(
				this.mark.create(
					'focus',
						focus
				)
			);

			break;
	}

	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| Draws everything.
*/
Shell.prototype._draw =
	function( )
{
	var
		display,
		fabric;

	fabric = this.fabric;

	fabric.clear( );

	display = this._getCurrentDisplay( );

	if( display )
	{
		display.draw( fabric );
	}

	if( display && display.showDisc )
	{
		this._$discJockey.draw( fabric );
	}

	this._$redraw =
		false;
};


/*
| User clicked.
*/
Shell.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		click,
		display;

	display = this._getCurrentDisplay( ),

	click =
		this._$discJockey.click(
			p,
			shift,
			ctrl
		);

	if( click === null )
	{
		if( display )
		{
			display.click(
				p,
				shift,
				ctrl
			);
		}
	}


	if( this._$redraw )
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
		name;

	name = this._$mode;

	switch( name )
	{
		case 'Create' :
		case 'Normal' :

			return this.$space;

		case 'Login' :
		case 'MoveTo' :
		case 'NoAccessToSpace' :
		case 'NonExistingSpace' :
		case 'SignUp' :
		case 'Space' :
		case 'User' :
		case 'Welcome' :

			return (
				this._$formJockey.get( name )
			);

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
	var
		display =
			this._getCurrentDisplay( ),

		reply =
			null;

	if( display && display.showDisc )
	{
		reply =
			this._$discJockey.pointingHover(
				p,
				shift,
				ctrl
			);

		if( reply )
		{
/**/		if( CHECK )
/**/		{
/**/			if( reply.reflex !== 'reply.hover' )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			shell._setHover( reply.path );

			if( this._$redraw )
			{
				this._draw( );
			}

			return reply.cursor;
		}
	}


	if( display )
	{
		reply =
			display.pointingHover(
				p,
				shift,
				ctrl
			);

/**/	if( CHECK )
/**/	{
/**/		if(
/**/			!reply
/**/			||
/**/			reply.reflex !== 'reply.hover'
/**/		)
/**/		{
/**/			throw new Error(
/**/				'invalid reply'
/**/			);
/**/		}
/**/	}

		shell._setHover( reply.path );

		if( this._$redraw )
		{
			this._draw( );
		}

		return reply.cursor;
	}

	if( this._$redraw )
	{
		this._draw( );
	}

	return 'default';
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
		bubble,
		display;

	bubble =
		null;
	display =
		this._getCurrentDisplay( );

	if( display && display.showDisc )
	{
		bubble =
			this._$discJockey.dragStart(
				p,
				shift,
				ctrl
			);
	}

	if( bubble === null )
	{
		if( display )
		{
			bubble =
				display.dragStart(
					p,
					shift,
					ctrl
				);
		}
	}

	if( this._$redraw )
	{
		this._draw( );
	}
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
	var
		action,
		cursor,
		display;

	action =
		this.action;

	if( !action )
	{
		throw new Error( );
	}

	cursor =
		null;
	display =
		this._getCurrentDisplay( );

	if( display )
	{
		cursor =
			display.dragMove(
				p,
				shift,
				ctrl
			);
	}

	if( this._$redraw )
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
	var
		action =
			this.action;

	if( !action )
	{
		throw new Error( );
	}

	var
		display =
			this._getCurrentDisplay( );

	if( display )
	{
		display.dragStop(
			p,
			shift,
			ctrl
		);
	}

	if( this._$redraw )
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

	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| Returns true if the iPad ought to display
| the virtual keyboard
*/
Shell.prototype.suggestingKeyboard =
	function( )
{
	return this.mark.hasCaret;
};


/*
| Sets the user's mark.
*/
Shell.prototype.setMark =
	function(
		mark
	)
{
	system.setInput( mark.clipboard );

	this.mark =
		mark;

	this.$space =
		this.$space.create(
			'mark',
				mark
		);

	this._$formJockey =
		this._$formJockey.create(
			'mark',
				mark
		);

	this._$discJockey =
		this._$discJockey.create(
			'mark',
				mark
		);

	this._$redraw =
		true;
};


/*
| Cycles focus in a form.
*/
Shell.prototype.cycleFormFocus =
	function(
		name,
		dir
	)
{
	this._$formJockey.cycleFocus(
		name,
		dir
	);
};


/*
| A button has been pushed.
*/
Shell.prototype.pushButton =
	function( path )
{
	switch( path.get( 0 ) )
	{
		case 'discs' :

			return this._$discJockey.pushButton(
				path,
				false,
				false
			);

		case 'forms' :

			return this._$formJockey.pushButton(
				path,
				false,
				false
			);

		default :

			throw new Error( 'invalid path' );
	}
};


/*
| Sets a hovered component.
*/
Shell.prototype._setHover =
	function(
		path
	)
{
	if( this._$hover.equals( path ) )
	{
		return;
	}

	this._$discJockey =
		this._$discJockey.create(
			// FIXME make concernsHover
			'hover',
				path.isEmpty || path.get( 0 ) !== 'discs' ?
					jion.path.empty
					:
					path
		);

	this._$formJockey =
		this._$formJockey.create(
			'hover',
				// FIXME make a concernsHover
				path.isEmpty || path.get( 0 ) !== 'forms' ?
					jion.path.empty
					:
					path
		);

	this.$space =
		this.$space.create(
			'hover',
				path.isEmpty || path.get( 0 ) !== 'space' ?
					jion.path.empty
					:
					path
		);

	this._$hover =
		path;

	shell._$redraw =
		true;
};


/*
| Sets the trait(s) of item(s).
*/
Shell.prototype.setPath =
	function(
		path,
		value
	)
{
	switch( path.get( 0 ) )
	{
		case 'discs' :

			throw new Error( 'FIXME' );

		case 'forms' :

			this._$formJockey =
				this._$formJockey.setPath(
					path,
					value,
					1
				);

			break;

		case 'space' :

			this.$space =
				this.$space.setPath(
					path,
					value,
					1
				);

			break;

		default :

			throw new Error( );
	}

	shell._$redraw =
		true;
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
		display,
		focusItem;

	display = this._getCurrentDisplay( );

	if( display )
	{
		display.specialKey(
			key,
			shift,
			ctrl
		);
	}

	focusItem =
		this.$space.focusedItem( );

	if( focusItem && focusItem.scrollMarkIntoView )
	{
		focusItem.scrollMarkIntoView( );
	}

	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| User entered normal text (one character or more).
*/
Shell.prototype.input =
	function(
		text
	)
{
	var
		display,
		focusItem;

	display = this._getCurrentDisplay( );

	if( display )
	{
		display.input( text );

		focusItem = this.$space.focusedItem( );

		if( focusItem && focusItem.scrollMarkIntoView )
		{
			focusItem.scrollMarkIntoView( );
		}
	}

	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| The window has been resized.
*/
Shell.prototype.resize =
	function(
		fabric
	)
{
	this.fabric =
		fabric;

	this.setView(
		this.$view.create(
			'height',
				fabric.height,
			'width',
				fabric.width
		)
	);

	this._draw( );
};


/*
| Sets the current user
*/
Shell.prototype.setUser =
	function(
		username,
		passhash
	)
{
	this.link =
		this.link.create(
			'username',
				username,
			'passhash',
				passhash
		);

	if( username.substr( 0, 5 ) !== 'visit' )
	{
		window.localStorage.setItem(
			'username',
			username
		);

		window.localStorage.setItem(
			'passhash',
			passhash
		);
	}
	else
	{
		if(
			this.$space
			&&
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
			'username',
			null
		);

		window.localStorage.setItem(
			'passhash',
			null
		);

		this._$visitUser = username;

		this._$visitPasshash = passhash;
	}

	this.username = username;

	this._$discJockey =
		this._$discJockey.create(
			'username',
				username
		);

	this._$formJockey =
		this._$formJockey.create(
			'username',
				username
		);
};


/*
| Sets the current view ( of the space )
*/
Shell.prototype.setView =
	function(
		view
	)
{
	this.$view =
		view;

	if( this.$space )
	{
		this.$space =
			this.$space.create(
				'view',
					view
			);
	}

	this._$discJockey =
		this._$discJockey.create(
			'view',
				view
		);

	this._$formJockey =
		this._$formJockey.create(
			'view',
				view
		);

	this._$redraw =
		true;
};


/*
| Called when loading the website
*/
Shell.prototype.onload =
	function( )
{
	var
		ajaxPath,
		passhash,
		username;

	ajaxPath = jion.path.empty.Append( 'ajax' );

	this.ajax =
		Net.Ajax.create(
			'path',
				ajaxPath,
			'twig:add',
			'command',
				Net.Channel.create(
					'path',
						ajaxPath.Append( 'command' )
				),
			'twig:add',
			'update',
				Net.Channel.create(
					'path',
						ajaxPath.Append( 'update' )
				)
		);

	this.link = Net.Link.create( );

	username = window.localStorage.getItem( 'username' );

	if( username )
	{
		passhash = window.localStorage.getItem( 'passhash' );
	}
	else
	{
		username = 'visitor';

		passhash = null;
	}

	this.link.auth(
		username,
		passhash
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
	this.link.aquireSpace(
		spaceUser,
		spaceTag,
		create
	);
};


/*
| Receiving a moveTo event
|
| FIXME, dont put an asw object here.
*/
Shell.prototype.onAquireSpace =
	function(
		asw
	)
{
	var
		access,
		path,
		spaceTag,
		spaceUser;

	switch( asw.status )
	{
		case 'served' :

			break;

		case 'nonexistent' :

			shell.setPath(
				shell._$formJockey.twig.NonExistingSpace.path
				.Append( 'nonSpaceUser' ),
				asw.spaceUser
			);

			shell.setPath(
				shell._$formJockey.twig.NonExistingSpace.path
				.Append( 'nonSpaceTag' ),
				asw.spaceTag
			);

			shell.setMode( 'NonExistingSpace' );

			this._draw( );

			return;

		case 'no access' :

			// FIXME remove get
			path =
				this._$formJockey.get( 'NoAccessToSpace' ).path;

			this._$formJockey =
				this._$formJockey.create(
					'spaceUser',
						asw.spaceUser,
					'spaceTag',
						asw.spaceTag
				);

			shell.setMode( 'NoAccessToSpace' );

			this._draw( );

			return;

		case 'connection fail' :

			system.failScreen(
				'Connection failed: ' +
				asw.message
			);

			return;

		default :

			system.failScreen(
				'Unknown aquireSpace() status: ' +
				asw.status + ': ' + asw.message
			);

			return;
	}

	spaceUser = asw.spaceUser,

	spaceTag = asw.spaceTag,

	access = asw.access;

	this.$space =
		asw.space.create(
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag,
			'access',
				access,
			'hover',
				jion.path.empty,
			'mark',
				Mark.Vacant.create( ),
			'path',
				jion.path.empty.Append( 'space' ),
			'view',
				euclid.View.create(
					'fact',
						0,
					'height',
						this.fabric.height,
					'pan',
						euclid.point.zero,
					'width',
						this.fabric.width
				)
		);

	this.arrivedAtSpace(
		spaceUser,
		spaceTag,
		access
	);

	this._draw( );
};


/*
| Received an 'auth' reply.
*/
Shell.prototype.onAuth =
	function(
		ok,
		username,
		passhash,
		message
	)
{
	// if in login mode this is a tempted login

	if( this._$mode === 'Login' )
	{
		this._$formJockey.get( 'Login' ).onAuth(
			ok,
			username,
			passhash,
			message
		);

		return;
	}

	// otherwise this is an onload login
	// or logout.

	if( !ok )
	{
		// when logging in with a real user failed
		// takes a visitor instead
		if( username !== 'visitor' )
		{
			Peer.auth(
				'visitor',
				null,
				this
			);

			return;
		}

		// if even that failed, bailing to failScreen
		system.failScreen( message );

		return;
	}

	this.setUser(
		username,
		passhash
	);

	this.moveToSpace(
		'meshcraft',
		'home',
		false
	);
};


/*
| Received a 'register' reply.
*/
Shell.prototype.onRegister =
	function(
		ok,
		username,
		passhash,
		message
	)
{
	// if in login mode this is a tempted login

	if( this._$mode !== 'SignUp' )
	{
		console.log(
			'ignoring a register reply, since out of signup form'
		);

		return;
	}

	this._$formJockey.get( 'SignUp' ).onRegister(
		ok,
		username,
		passhash,
		message
	);

	return;
};


/*
| Logs out the current user
*/
Shell.prototype.logout =
	function( )
{
	if( this._$visitUser )
	{
		this.setUser(
			this._$visitUser,
			this._$visitPasshash
		);

		this.moveToSpace(
			'meshcraft',
			'home',
			false
		);

		return;
	}

	Peer.auth(
		'visitor',
		null
	);
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
	this._$discJockey =
		this._$discJockey.create(
			'access',
				access,
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag
		);

	this._$formJockey =
		this._$formJockey.create(
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag
		);

	shell.setMode( 'Normal' );
};


} )( );
