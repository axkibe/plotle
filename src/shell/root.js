/*
| The root of the user shell.
*/

var
	actions,
	ccot,
	discs,
	euclid,
	fabric,
	forms,
	gruga,
	jion,
	jools,
	marks,
	net,
	root,
	shell,
	system,
	swatch;

shell = shell || { };

root = null;



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
/**/			'login' :
/**/				true,
/**/			// Moveing To another space.
/**/			'moveTo' :
/**/				true,
/**/			// Standard selection, moving stuff around.
/**/			'Normal' :
/**/				true,
/**/			// User does not have access to a space.
/**/			'noAccessToSpace' :
/**/				true,
/**/			// space does not exist,
/**/			// but user is allowed to create it.
/**/			'nonExistingSpace' :
/**/				true,
/**/			// Signing up
/**/			'signUp' :
/**/				true,
/**/			// space view
/**/			'space' :
/**/				true,
/**/			// user view
/**/			'user' :
/**/				true,
/**/			// welcome view
/**/			'welcome' :
/**/				true
/**/		} );
/**/}


/*
| Constructor.
*/
shell.root =
	function(
		display
	)
{
	var
		canvas,
		view;

/**/if( CHECK )
/**/{
/**/	if( root !== null )
/**/	{
/**/		// singleton
/**/		throw new Error( );
/**/	}
/**/}

	root = this;

	canvas = document.createElement( 'canvas' );

	swatch = euclid.display.createAroundHTMLCanvas( canvas );

	euclid.measure.init( canvas );

	/*
	this._fontWFont = fontPool.get( 20, 'la' );

	this._fontWatch =
		euclid.measure.width(
			this._fontWFont,
			'ArchLoom$8833'
		);
	*/

	this.display = display;

	this.username = null;

	this.space = null;

	this.action = null;

	this._mode = 'Normal';

	// path of currently hovered thing
	this._hoverPath = jion.path.empty;

	view =
	this.view =
		euclid.view.create(
			'pan',
				euclid.point.zero,
			'fact',
				0,
			'width',
				display.width,
			'height',
				display.height
		);

	this._formJockey =
		forms.jockey.create(
			'hover',
				jion.path.empty,
			'mark',
				null,
			'path',
				jion.path.empty
				.append( 'forms' ),
			'view',
				view,
			'twig:add',
			'login',
				gruga.login,
			'twig:add',
			'moveTo',
				gruga.moveTo,
			'twig:add',
			'noAccessToSpace',
				gruga.noAccessToSpace,
			'twig:add',
			'nonExistingSpace',
				gruga.nonExistingSpace,
			'twig:add',
			'signUp',
				gruga.signUp,
			'twig:add',
			'space',
				gruga.space,
			'twig:add',
			'user',
				gruga.user,
			'twig:add',
			'welcome',
				gruga.welcome
		);

	this._discJockey =
		discs.jockey.create(
			'access',
				'',
			'action',
				null,
			'hover',
				jion.path.empty,
			'mark',
				null,
			'mode',
				this._mode,
			'path',
				jion.path.empty
				.append( 'discs' ),
			'view',
				view,
			'twig:add',
			'mainDisc',
				gruga.mainDisc,
			'twig:add',
			'createDisc',
				gruga.createDisc
		);

	this.mark = null;

	// remembers an acquired visitor user name and passhash
	// so when logging out from a real user the previous
	// visitor is regained.
	this._$visitUser = null;

	this._$visitPasshash = null;

	this._draw( );
};


var
	proto;

proto = shell.root.prototype,


/*
| Changes the mode.
*/
proto.setMode =
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

	this._mode = mode;

	this._discJockey =
		this._discJockey.create(
			'mode',
				mode
		);

	this._$redraw = true;
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
	proto,
	'attentionCenter',
	{
		get :
			function( )
			{
				var
					screen;

				screen = this._currentScreen( );

				return screen && screen.attentionCenter;
			}
	}
);


/*
| Sets the current action.
*/
proto.setAction =
	function(
		action
	)
{

/**/if ( CHECK )
/**/{
/**/	if(
/**/		action !== null
/**/		&&
/**/		!actions.isAction( action.reflect )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.action = action;

	this._discJockey =
		this._discJockey.create( 'action', action );

	this._$redraw = true;
};


/*
| The link is reporting updates.
*/
proto.update =
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

	switch( mark && mark.reflect )
	{
		case null :

			break;

		case 'marks.caret' :

			item = space.twig[ mark.path.get( 2 ) ];

			if( item === undefined )
			{
				// the item holding the caret was removed
				mark = null;
			}
			else
			{
				sign =
					chgX.transformSign(
						ccot.sign.create(
							'path', mark.path.chop( ),
							'at1', mark.at
						)
					);

				// FIXME
				//   keeping retainx might not be correct
				//   in some cases
				mark =
					marks.caret.create(
						'path', sign.path.prepend( 'space' ),
						'at', sign.at1,
						'retainx', mark.retainx
					);
			}

			break;

		case 'marks.item' :

			item = space.twig[ mark.path.get( 2 ) ];

			if( item === undefined )
			{
				// the item holding the caret was removed
				mark = null;
			}

			break;

		case 'marks.range' :

			item = space.twig[ mark.bPath.get( 2 ) ];

			// tests if the owning item was removed
			if( item === undefined )
			{
				mark = null;
			}
			else
			{
				bSign =
					chgX.transformSign(
						ccot.sign.create(
							'path', mark.bPath.chop( ),
							'at1', mark.bAt
						)
					);

				eSign =
					chgX.transformSign(
						ccot.sign.create(
							'path', mark.ePath.chop( ),
							'at1', mark.eAt
						)
					);

				// tests if the range collapsed to a simple caret.
				if(
					bSign.path.equals( eSign.path ) &&
					bSign.at1 === eSign.at1
				)
				{
					mark =
						marks.caret.create(
							'path', bSign.path.prepend( 'space' ),
							'at', bSign.at1,
							'retainx', mark.retainx
						);
				}
				else
				{
					mark =
						marks.range.create(
							'doc', item.doc,
							'bPath', bSign.path.prepend( 'space' ),
							'bAt', bSign.at1,
							'ePath', eSign.path.prepend( 'space' ),
							'eAt', eSign.at1,
							'retainx', mark.retainx
						);
				}
			}

			break;
	}

	// FIXME let the link do the real stuff
	this.space =
		space.create(
			'spaceUser', this.space.spaceUser,
			'spaceTag', this.space.spaceTag,
			'access', this.space.access,
			'hover', this.space.hover,
			'mark', mark,
			'path', this.space.path,
			'view', this.space.view
		);

	this._discJockey =
		this._discJockey.create( 'mark', mark );

	this.mark = mark;

	this._draw( );
};


/*
| The shell got or lost the systems focus.
|
| FIXME rename setSystemFocus
*/
proto.setFocus =
	function(
		focus
	)
{
	if( this.mark )
	{
		switch( this.mark.reflect )
		{
			case 'marks.caret' :

				this.setMark(
					this.mark.create( 'focus', focus )
				);

			break;
		}
	}

	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| Draws everything.
*/
proto._draw =
	function( )
{
	var
		display,
		screen;

	display = this.display;

	display.clear( );

	screen = this._currentScreen( );

	if( screen )
	{
		screen.draw( display );
	}

	if( screen && screen.showDisc )
	{
		this._discJockey.draw( display );
	}

	this._$redraw = false;
};


/*
| User clicked.
*/
proto.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		click,
		screen;

	screen = this._currentScreen( ),

	click =
		this._discJockey.click(
			p,
			shift,
			ctrl
		);

	if( click === null )
	{
		if( screen )
		{
			screen.click( p, shift, ctrl );
		}
	}


	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| Returns current screen
|
| This is either a fabric space or a form
*/
proto._currentScreen =
	function( )
{
	var
		name;

	name = this._mode;

	switch( name )
	{
		case 'Create' :
		case 'Normal' :

			return this.space;

		case 'login' :
		case 'moveTo' :
		case 'noAccessToSpace' :
		case 'nonExistingSpace' :
		case 'signUp' :
		case 'space' :
		case 'user' :
		case 'welcome' :

			return this._formJockey.get( name );

		default :

			throw new Error( 'unknown mode: ' + name );
	}
};


/*
| User is hovering his/her point ( mouse move )
*/
proto.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		result,
		screen;

	screen = this._currentScreen( ),

	result = null;

	if( screen && screen.showDisc )
	{
		result =
			this._discJockey.pointingHover(
				p,
				shift,
				ctrl
			);

		if( result )
		{
/**/		if( CHECK )
/**/		{
/**/			if( result.reflect !== 'result.hover' )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			root._setHover( result.path );

			if( this._$redraw )
			{
				this._draw( );
			}

			return result.cursor;
		}
	}


	if( screen )
	{
		result = screen.pointingHover( p, shift, ctrl );

/**/	if( CHECK )
/**/	{
/**/		if(
/**/			!result
/**/			||
/**/			result.reflect !== 'result.hover'
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		root._setHover( result.path );

		if( this._$redraw )
		{
			this._draw( );
		}

		return result.cursor;
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
proto.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		bubble,
		screen;

	bubble = null;

	screen = this._currentScreen( );

	if( screen && screen.showDisc )
	{
		bubble = this._discJockey.dragStart( p, shift, ctrl );
	}

	if( bubble === null )
	{
		if( screen )
		{
			bubble = screen.dragStart( p, shift, ctrl );
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
proto.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		action,
		cursor,
		screen;

	action = this.action;

	cursor = null;

	screen = this._currentScreen( );

	if( screen )
	{
		cursor = screen.dragMove( p, shift, ctrl );
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
proto.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		action,
		screen;

	action = this.action;

	screen = this._currentScreen( );

	if( screen )
	{
		screen.dragStop( p, shift, ctrl );
	}

	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| Mouse wheel is being turned.
*/
proto.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	// FIXME disc?

	var
		screen;

	screen = this._currentScreen( );

	if( screen )
	{
		screen.mousewheel( p, dir, shift, ctrl );
	}

	if( this._$redraw )
	{
		this._draw( );
	}
};


/*
| Returns true if the iPad ought to showy
| the virtual keyboard
*/
proto.suggestingKeyboard =
	function( )
{
	return( this.mark !== null && this.mark.hasCaret );
};


/*
| Sets the user's mark.
*/
proto.setMark =
	function(
		mark
	)
{
	system.setInput(
		mark
		? mark.clipboard
		: ''
	);

	this.mark = mark;

	this.space = this.space.create( 'mark', mark );

	this._formJockey = this._formJockey.create( 'mark', mark );

	this._discJockey = this._discJockey.create( 'mark', mark );

	this._$redraw = true;
};


/*
| Cycles focus in a form.
*/
proto.cycleFormFocus =
	function(
		name,
		dir
	)
{
	this._formJockey.cycleFocus( name, dir );
};


/*
| A button has been pushed.
*/
proto.pushButton =
	function( path )
{
	switch( path.get( 0 ) )
	{
		case 'discs' :

			return this._discJockey.pushButton(
				path,
				false,
				false
			);

		case 'forms' :

			return this._formJockey.pushButton(
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
proto._setHover =
	function(
		path
	)
{
	if( this._hoverPath.equals( path ) )
	{
		return;
	}

	this._discJockey =
		this._discJockey.create(
			// FIXME make concernsHover
			'hover',
				path.isEmpty || path.get( 0 ) !== 'discs' ?
					jion.path.empty
					:
					path
		);

	this._formJockey =
		this._formJockey.create(
			'hover',
				// FIXME make a concernsHover
				path.isEmpty || path.get( 0 ) !== 'forms' ?
					jion.path.empty
					:
					path
		);

	this.space =
		this.space.create(
			'hover',
				path.isEmpty || path.get( 0 ) !== 'space' ?
					jion.path.empty
					:
					path
		);

	this._hoverPath = path;

	root._$redraw = true;
};


/*
| Sets the trait(s) of item(s).
*/
proto.setPath =
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

			this._formJockey =
				this._formJockey.setPath(
					path,
					value,
					1
				);

			break;

		case 'space' :

			this.space =
				this.space.setPath(
					path,
					value,
					1
				);

			break;

		default :

			throw new Error( );
	}

	root._$redraw =
		true;
};


/*
| User is pressing a special key.
*/
proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		focusItem,
		screen;

	screen = this._currentScreen( );

	if( screen )
	{
		screen.specialKey( key, shift, ctrl );
	}

	focusItem = this.space.focusedItem( );

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
proto.input =
	function(
		text
	)
{
	var
		focusItem,
		screen;

	screen = this._currentScreen( );

	if( screen )
	{
		screen.input( text );

		focusItem = this.space.focusedItem( );

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
proto.resize =
	function(
		display
	)
{
	this.display = display;

	this.setView(
		this.view.create(
			'height', display.height,
			'width', display.width
		)
	);

	this._draw( );
};


/*
| Sets the current user
*/
proto.setUser =
	function(
		username,
		passhash
	)
{
	this.link =
		this.link.create(
			'username', username,
			'passhash', passhash
		);

	if( username.substr( 0, 5 ) !== 'visit' )
	{
		window.localStorage.setItem( 'username', username );

		window.localStorage.setItem( 'passhash', passhash );
	}
	else
	{
		if(
			this.space
			&&
			this.space.spaceUser !== 'ideoloom'
		)
		{
			this.moveToSpace( fabric.spaceRef.ideoloomHome, false );
		}

		window.localStorage.setItem( 'username', null );

		window.localStorage.setItem( 'passhash', null );

		this._$visitUser = username;

		this._$visitPasshash = passhash;
	}

	this.username = username;

	this._discJockey = this._discJockey.create( 'username', username );

	this._formJockey = this._formJockey.create( 'username', username );
};


/*
| Sets the current view ( of the space )
*/
proto.setView =
	function(
		view
	)
{
	this.view = view;

	if( this.space )
	{
		this.space = this.space.create( 'view', view );
	}

	this._discJockey = this._discJockey.create( 'view', view );

	this._formJockey = this._formJockey.create( 'view', view );

	this._$redraw = true;
};


/*
| Called when loading the website
*/
proto.onload =
	function( )
{
	var
		ajaxPath,
		passhash,
		username;

	ajaxPath = jion.path.empty.append( 'ajax' );

	this.ajax =
		net.ajax.create(
			'path',
				ajaxPath,
			'twig:add',
			'command',
				net.channel.create(
					'path',
						ajaxPath.append( 'command' )
				),
			'twig:add',
			'update',
				net.channel.create(
					'path',
						ajaxPath.append( 'update' )
				)
		);

	this.link = net.link.create( );

	this.doTracker = shell.doTracker.create( );

	username = window.localStorage.getItem( 'username' );

	if( username )
	{
		passhash = window.localStorage.getItem( 'passhash' );
	}
	else
	{
		username = 'visitor';

		passhash = jools.uid( );
	}

	this.link.auth( username, passhash );
};


/*
| Moves to space with the name name.
|
| if spaceRef is null reloads current space
*/
proto.moveToSpace =
	function(
		spaceRef,     // refrence of type fabric.spaceRef
		createMissing // if true, non-existing spaces are to be
		//            // created
	)
{
	this.link.acquireSpace( spaceRef, createMissing );
};


/*
| Receiving a moveTo event
|
| FIXME, dont put an asw object here.
*/
proto.onAcquireSpace =
	function(
		asw
	)
{
	var
		access,
		path;

	switch( asw.status )
	{
		case 'served' :

			break;

		case 'nonexistent' :

			root.setPath(
				root._formJockey.twig.nonExistingSpace.path
					.append( 'nonSpaceRef' ),
				asw.spaceRef
			);

			root.setMode( 'nonExistingSpace' );

			this._draw( );

			return;

		case 'no access' :

			// FIXME remove get
			path = this._formJockey.get( 'noAccessToSpace' ).path;

			// FIXME have it use a spaceRef
			this._formJockey =
				this._formJockey.create(
					'spaceUser', asw.spaceRef.username,
					'spaceTag', asw.spaceRef.tag
				);

			root.setMode( 'noAccessToSpace' );

			this._draw( );

			return;

		case 'connection fail' :

			system.failScreen( 'Connection failed: ' + asw.message );

			return;

		default :

			system.failScreen(
				'Unknown acquireSpace() status: '
				+ asw.status + ': ' + asw.message
			);

			return;
	}

	access = asw.access;

	console.log( 'ASW', asw );

	this.space =
		asw.space.create(
			// FUTURE have the server already set this at JSON level
			'spaceUser', asw.spaceRef.username, // FIXME have it use a ref
			'spaceTag', asw.spaceRef.tag,
			'access', access,
			'hover', jion.path.empty,
			'mark', null,
			'path', jion.path.empty.append( 'space' ),
			'view',
				euclid.view.create(
					'fact', 0,
					'height', this.display.height,
					'pan', euclid.point.zero,
					'width', this.display.width
				)
		);

	// FIXME have it use a spaceRef
	this.arrivedAtSpace( asw.spaceRef.username, asw.spaceRef.tag, access );

	this._draw( );
};


/*
| Received an 'auth' reply.
*/
proto.onAuth =
	function(
		ok,
		username,
		passhash,
		message
	)
{
	// if in login mode this is a tempted login

	if( this._mode === 'login' )
	{
		this._formJockey.get( 'login' ).onAuth(
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
			this.link.auth( 'visitor', jools.uid( ) );

			return;
		}

		// if even that failed, bailing to failScreen
		system.failScreen( message );

		return;
	}

	this.setUser( username, passhash );

	this.moveToSpace( fabric.spaceRef.ideoloomHome, false );
};


/*
| Received a 'register' reply.
*/
proto.onRegister =
	function(
		ok,
		username,
		passhash,
		message
	)
{
	// if in login mode this is a tempted login

	if( this._mode !== 'signUp' )
	{
		console.log(
			'ignoring a register reply, since out of signup form'
		);

		return;
	}

	this._formJockey.get( 'signUp' ).onRegister(
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
proto.logout =
	function( )
{
	if( this._$visitUser )
	{
		this.setUser(
			this._$visitUser,
			this._$visitPasshash
		);

		this.moveToSpace( fabric.spaceRef.ideoloomHome, false );

		return;
	}

	root.link.auth( 'visitor', jools.uid( ) );
};


/*
| A space finished loading.
*/
proto.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	this._discJockey =
		this._discJockey.create(
			'access',
				access,
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag
		);

	this._formJockey =
		this._formJockey.create(
			'spaceUser',
				spaceUser,
			'spaceTag',
				spaceTag
		);

	root.setMode( 'Normal' );
};


} )( );
