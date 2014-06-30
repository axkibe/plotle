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
	Euclid,
	fontPool,
	Forms,
	Gruga,
	IFace,
	Mark,
	MeshMashine,
	Path,
	Peer,
	Sign,
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
		Euclid.Fabric.Create(
			'canvas',
				canvas
		);

	Euclid.Measure.init( canvas );

	this._fontWFont = fontPool.get( 20, 'la' );

	this._$fontWatch =
		Euclid.Measure.width(
			this._fontWFont,
			'meshcraft$8833'
		);

	this.fabric = fabric;

	this.username = null;

	this.$space = null;

	this.$action = Action.None.Create( );

	this._$mode = 'Normal';

	// currently hovered thing
	this._$hover = Path.empty;

	view =
	this.$view =
		Euclid.View.Create(
			'pan',
				Euclid.Point.zero,
			'fact',
				0,
			'width',
				fabric.width,
			'height',
				fabric.height
		);

	this._$formJockey =
		Forms.Jockey.Create(
			'hover',
				Path.empty,
			'mark',
				Mark.Vacant.Create( ),
			'path',
				Path.empty.append( 'forms' ),
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
		Discs.Jockey.Create(
			'access',
				'',
			'action',
				Action.None.Create( ),
			'hover',
				Path.empty,
			'mark',
				Mark.Vacant.Create( ),
			'mode',
				this._$mode,
			'path',
				Path.empty.append( 'discs' ),
			'view',
				view,
			'twig:add',
			'MainDisc',
				Gruga.MainDisc,
			'twig:add',
			'CreateDisc',
				Gruga.CreateDisc
		);

	this.mark = Mark.Vacant.Create( );

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
| Peer received a message.
*/
Shell.prototype.message =
	function(
		// space,
		// user,
		// message
	)
{
	// FIXME
};


/*
| Changes the mode.
*/
Shell.prototype.setMode =
	function(
		mode
	)
{
	if( CHECK )
	{
		if( !_modes[ mode ] )
		{
			throw new Error(
				'invalid mode : ' + mode
			);
		}
	}

	this._$mode =
		mode;

	this._$discJockey =
		this._$discJockey.Create(
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
				return (
					this._getCurrentDisplay( ).attentionCenter
				);
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
/**/	if( !action || !Action.isAction( action.reflect ) )
/**/	{
/**/		throw new Error(
/**/			'invalid action'
/**/		);
/**/	}
/**/}

	this.$action =
		action;

	this._$discJockey =
		this._$discJockey.Create(
			'action',
				action
		);

	this._$redraw =
		true;
};


/*
| MeshMashine is reporting updates.
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

	switch( mark.reflect )
	{
		case 'Caret' :

			item = space.twig[ mark.path.get( 2 ) ];

			if( item === undefined )
			{
				// the item holding the caret was removed
				mark = Mark.Vacant.Create( );
			}
			else
			{
				sign =
					MeshMashine.tfxSign(
						new Sign(
							{
								path :
									mark.path.chop( ),
								at1 :
									mark.at
							}
						),
						chgX
					);

				// FIXME
				//   keeping retainx might not be correct
				//   in some cases
				mark =
					Mark.Caret.Create(
						'path',
							sign.path.prepend( 'space' ),
						'at',
							sign.at1,
						'retainx',
							mark.retainx
					);
			}

			break;

		case 'Item' :

			item = space.twig[ mark.path.get( 2 ) ];

			if( item === undefined )
			{
				// the item holding the caret was removed
				mark = Mark.Vacant.Create( );
			}

			break;

		case 'Range' :

			item = space.twig[ mark.bPath.get( 2 ) ];

			// tests if the owning item was removed
			if( item === undefined )
			{
				mark = Mark.Vacant.Create( );
			}
			else
			{
				bSign =
					MeshMashine.tfxSign(
						new Sign(
							{
								path :
									mark.bPath.chop( ),
								at1 :
									mark.bAt
							}
						),
						chgX
					),

				eSign =
					MeshMashine.tfxSign(
						new Sign(
							{
								path :
									mark.ePath.chop( ),
								at1 :
									mark.eAt
							}
						),
						chgX
					);

				// tests if the range collapsed to a simple caret.
				if(
					bSign.path.equals( eSign.path ) &&
					bSign.at1 === eSign.at1
				)
				{
					mark =
						Mark.Caret.Create(
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
						Mark.Range.Create(
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

	// FIXME let the iface do the real stuff
	this.$space =
		space.Create(
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
		this._$discJockey.Create(
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
	switch( this.mark.reflect )
	{
		case 'Caret' :

			this.setMark(
				this.mark.Create(
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
			if( CHECK )
			{
				if( reply.reflect !== 'HoverReply' )
				{
					throw new Error( 'invalid reply' );
				}
			}

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
/**/			reply.reflect !== 'HoverReply'
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
		throw new Error(
			CHECK && 'no action on dragMove'
		);
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
		throw new Error(
			CHECK && 'no action on dragStop'
		);
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
		this.$space.Create(
			'mark',
				mark
		);

	this._$formJockey =
		this._$formJockey.Create(
			'mark',
				mark
		);

	this._$discJockey =
		this._$discJockey.Create(
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
		this._$discJockey.Create(
			// FIXME make concernsHover
			'hover',
				path.isEmpty || path.get( 0 ) !== 'discs' ?
					Path.empty
					:
					path
		);

	this._$formJockey =
		this._$formJockey.Create(
			'hover',
				// FIXME make a concernsHover
				path.isEmpty || path.get( 0 ) !== 'forms' ?
					Path.empty
					:
					path
		);

	this.$space =
		this.$space.Create(
			'hover',
				path.isEmpty || path.get( 0 ) !== 'space' ?
					Path.empty
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
		this.$view.Create(
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
	this.peer.setUser(
		username,
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
		this._$discJockey.Create(
			'username',
				username
		);

	this._$formJockey =
		this._$formJockey.Create(
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
			this.$space.Create(
				'view',
					view
			);
	}

	this._$discJockey =
		this._$discJockey.Create(
			'view',
				view
		);

	this._$formJockey =
		this._$formJockey.Create(
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
		passhash,
		username;

	this.peer = new Peer( new IFace( ) );

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

	this.peer.auth(
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
	/*
	message(
		'Moving to ' + spaceUser + ':' + spaceTag + ' ...'
	);
	*/

	this.peer.aquireSpace(
		spaceUser,
		spaceTag,
		create
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
					.append( 'nonSpaceUser' ),
					asw.spaceUser
			);

			shell.setPath(
				shell._$formJockey.twig.NonExistingSpace.path
					.append( 'nonSpaceTag' ),
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
				this._$formJockey.Create(
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
		asw.space.Create(
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag,
			'access',
				access,
			'hover',
				Path.empty,
			'mark',
				Mark.Vacant.Create( ),
			'path',
				Path.empty.append( 'space' ),
			'view',
				Euclid.View.Create(
					'fact',
						0,
					'height',
						this.fabric.height,
					'pan',
						Euclid.Point.zero,
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
| answer to on 'auth' operation.
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
			this.peer.auth(
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

	this.peer.auth(
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
		this._$discJockey.Create(
			'access',
				access,
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag
		);

	this._$formJockey =
		this._$formJockey.Create(
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag
		);

	shell.setMode( 'Normal' );
};


} )( );
