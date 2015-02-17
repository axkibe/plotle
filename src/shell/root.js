/*
| The root of the user shell.
*/

var
	change_wrap,
	change_ray,
	disc_jockey,
	euclid_display,
	euclid_measure,
	euclid_point,
	euclid_view,
	fabric_spaceRef,
	form_jockey,
	gruga_createDisc,
	gruga_login,
	gruga_mainDisc,
	gruga_moveTo,
	gruga_noAccessToSpace,
	gruga_nonExistingSpace,
	gruga_signUp,
	gruga_space,
	gruga_user,
	gruga_welcome,
	jion_path,
	jools,
	net_ajax,
	net_channel,
	net_link,
	root,
	shell_doTracker,
	shell_root,
	system,
	swatch,
	user_creds,

root = null;



/*
| Capsule
*/
( function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'shell_root',
		attributes :
			{
				action :
					{
						comment :
							'current action',
						type :
							'->action',
						allowsNull :
							true
						// FIXME assign _action
					},
				display :
					{
						comment :
							'the display within everything happens',
						type :
							'euclid_display'
					},
				hover :
					{
						comment :
							'current hovered item',
						type :
							'jion_path',
						allowsNull :
							true,
						assign :
							'_hover'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'->mark',
						assign :
							'_mark',
						allowsNull :
							true
					},
				mode :
					{
						comment :
							'current mode',
						type :
							'string',
						assign :
							'_mode',
					},
				space :
					{
						comment :
							'current space',
						type :
							'fabric_space',
						allowsNull :
							true
					},
				user :
					{
						comment :
							'current user',
						type :
							'user_creds',
						allowsNull :
							true
					},
				view :
					{
						comment :
							'current view',
						type :
							'euclid_view'
					},
				_formJockey :
					{
						comment :
							'the master of forms',
						type :
							'form_jockey'
					},
				_discJockey :
					{
						comment :
							'the master of discs',
						type :
							'disc_jockey'
					},
				_visitor :
					{
						comment :
							// remembers an acquired visitor user name and
							// passhash so when logging out from a real user
							// the previous visitor id is regained.
							'last acquired visitor credentials',
						type :
							'user_creds',
						allowsNull :
							true
					},
				ajax :
					{
						comment :
							'the ajax communication',
						type :
							'net_ajax'
					},
				link :
					{
						comment :
							'the link to the server',
						type :
							'net_link'
					},
				doTracker :
					{
						comment :
							'the un/re/do tracker',
						type :
							'shell_doTracker'
					},
				_drawn :
					{
						comment :
							'this root has been drawn on display',
						type :
							'boolean',
					}
			},
		init :
			[ 'inherit' ],
		alike :
			{
				lookAlike :
					{
						ignores : {
							'ajax' : true,
							'link' : true,
							'_drawn' : true
						}
					}
			}
	};
}

/*
| Valid modes
|
| FUTURE lowercase all
*/
var
	modes;

/**/if( CHECK )
/**/{
/**/	modes =
/**/		{
/**/			// Creating a new item.
/**/			'Create' : true,
/**/
/**/			// Help.
/**/			'Help' : true,
/**/
/**/			// Logging in.
/**/			'login' : true,
/**/
/**/			// Moveing To another space.
/**/			'moveTo' : true,
/**/
/**/			// Standard selection, moving stuff around.
/**/			'Normal' : true,
/**/
/**/			// User does not have access to a space.
/**/			'noAccessToSpace' : true,
/**/
/**/			// space does not exist,
/**/			// but user is allowed to create it.
/**/			'nonExistingSpace' : true,
/**/
/**/			// Signing up
/**/			'signUp' : true,
/**/
/**/			// space view
/**/			'space' : true,
/**/
/**/			// user view
/**/			'user' : true,
/**/
/**/			// welcome view
/**/			'welcome' : true
/**/		};
/**/}
/**/
/**/if( FREEZE )
/**/{
/**/	Object.freeze( modes );
/**/}


/*
| Startup of shell.
*/
shell_root.startup =
	function(
		display
	)
{
	var
		ajaxPath,
		canvas,
		mode,
		user,
		view;

/**/if( CHECK )
/**/{
/**/	if( root !== null )
/**/	{
/**/		// singleton
/**/		throw new Error( );
/**/	}
/**/}

	canvas = document.createElement( 'canvas' );

	swatch = euclid_display.createAroundHTMLCanvas( canvas );

	euclid_measure.init( canvas );

	/*
	root._fontWFont = shell_fontPool.get( 20, 'la' );

	root._fontWatch =
		euclid_measure.width( root._fontWFont, 'ideoloom$8833' );
	*/

	view =
		euclid_view.create(
			'pan', euclid_point.zero,
			'fact', 0,
			'width', display.width,
			'height', display.height
		);

	mode = 'Normal',

	ajaxPath = jion_path.empty.append( 'ajax' );

	user = user_creds.createFromLocalStorage( );

	if( !user )
	{
		user =
			user_creds.create(
				'name', 'visitor',
				'passhash', jools.uid( )
			);
	}

	shell_root.create(
		'display', display,
		'mark', null,
		'user', null,
		'space', null,
		'action', null,
		'mode', mode,
		'hover', jion_path.empty,
		'view', view,
		'_drawn', false,
		'_formJockey',
			form_jockey.create(
				'hover', jion_path.empty,
				'mark', null,
				'path', jion_path.empty.append( 'form' ),
				'view', view,
				'twig:add', 'login', gruga_login,
				'twig:add', 'moveTo', gruga_moveTo,
				'twig:add', 'noAccessToSpace', gruga_noAccessToSpace,
				'twig:add', 'nonExistingSpace', gruga_nonExistingSpace,
				'twig:add', 'signUp', gruga_signUp,
				'twig:add', 'space', gruga_space,
				'twig:add', 'user', gruga_user,
				'twig:add', 'welcome', gruga_welcome
			),
		'_discJockey',
			disc_jockey.create(
				'access', '',
				'action', null,
				'hover', jion_path.empty,
				'mark', null,
				'mode', mode,
				'path', jion_path.empty.append( 'disc' ),
				'view', view,
				'twig:add', 'mainDisc', gruga_mainDisc,
				'twig:add', 'createDisc', gruga_createDisc
			),
		'_visitor', null,
		'ajax',
			net_ajax.create(
				'path', ajaxPath,
				'twig:add', 'command',
					net_channel.create(
						'path', ajaxPath.append( 'command' )
					),
				'twig:add', 'update',
					net_channel.create(
						'path', ajaxPath.append( 'update' )
					)
			),
		'link', net_link.create( ),
		'doTracker', shell_doTracker.create( )
	);

	root.link.auth( user );
};


/*
| Initializer.
*/
shell_root.prototype._init =
	function(
		inherit
	)
{
	var
		action,
		hpath,
		mark,
		mode,
		user,
		view;

	// sets drawn false
	if( !this.lookAlike( inherit ) )
	{
		this._drawn = false;
	}

	action = this.action;

	mark = this._mark;

	view = this.view;

	hpath = this._hover;

	user = this.user;

	mode = this._mode;

/**/if( CHECK )
/**/{
/**/	if( !modes[ mode ] )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	system.setInput( mark ? mark.clipboard : '' );

	if(
		this.user
		&& ( !inherit || !this.user.equals( inherit.user ) )
	)
	{
		if( !user.isVisitor )
		{
			user.saveToLocalStorage( );
		}
		else
		{
			if(
				root.space
				&& root.space.ref.username !== 'ideoloom'
			)
			{
				root.moveToSpace( fabric_spaceRef.ideoloomHome, false );
			}

			user_creds.clearLocalStorage( );

			root.create( '_visitor', user );
		}
	}

	// skips recreating childs when no need
	if(
		!inherit
		|| hpath !== inherit._hover
		|| mark !== inherit._mark
		|| mode !== inherit.mode
		|| user !== inherit.user
		|| view !== inherit.view
	)
	{
		if( this.space )
		{
			this.space =
				this.space.create(
					'hover',
						hpath.isEmpty || hpath.get( 0 ) !== 'space'
						? jion_path.empty
						: hpath,
					'mark', mark,
					'view', view
				);
		}

		this._formJockey =
			this._formJockey.create(
				'hover',
					hpath.isEmpty || hpath.get( 0 ) !== 'form'
					? jion_path.empty
					: hpath,
				'mark', mark,
				'user', user,
				'view', view
			);

		this._discJockey =
			this._discJockey.create(
				'action', action,
				'hover',
					hpath.isEmpty || hpath.get( 0 ) !== 'disc'
					? jion_path.empty
					: hpath,
				'mark', mark,
				'mode', mode,
				'user', user,
				'view', view
			);
	}

	this.link = this.link.create( 'user', user );

	root = this;
};


/*
| Alters the tree.
|
| Feeds the doTracker.
*/
shell_root.prototype.alter =
	function(
		a1 // change, several changes or array of changes
		// // ...
	)
{
	var
		changeRay,
		changeWrap;

	if( Array.isArray( a1 ) )
	{
		changeRay = change_ray.create( 'ray:init', a1 );
	}
	else
	{
		changeRay =
			change_ray.create(
				'ray:init',
				Array.prototype.slice.apply( arguments )
			);
	}

	changeWrap =
		change_wrap.create(
			'cid', jools.uid( ),
			'changeRay', changeRay
		);

	root.link.alter( changeWrap );

	root.doTracker.track( changeWrap );
};


/*
| A space finished loading.
*/
shell_root.prototype.arrivedAtSpace =
	function(
		spaceRef,
		access
	)
{
	root.create(
		'mode', 'Normal',
		'_discJockey',
			root._discJockey.create(
				'access', access,
				'spaceRef', spaceRef
			),
		'_formJockey',
			root._formJockey.create( 'spaceRef', spaceRef )
	);
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
	shell_root.prototype,
	'attentionCenter',
	{
		get :
			function( )
			{
				var
					screen;

				screen = root._currentScreen( );

				return screen && screen.attentionCenter;
			}
	}
);


/*
| User clicked.
*/
shell_root.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		click,
		screen;

	screen = root._currentScreen( ),

	click =
		root._discJockey.click(
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
};


/*
| The shell got or lost the systems focus.
|
| FIXME rename setSystemFocus
|
| FIXME move into _init
*/
shell_root.prototype.setFocus =
	function(
		focus
	)
{
	if( root._mark )
	{
		switch( root._mark.reflect )
		{
			case 'mark_caret' :

				root.create(
					'mark',
					root._mark.create( 'focus', focus )
				);

			break;
		}
	}
};


/*
| Cycles focus in a form.
*/
shell_root.prototype.cycleFormFocus =
	function(
		name,
		dir
	)
{
	root._formJockey.cycleFocus( name, dir );
};




/*
| User is hovering his/her pointing device ( mouse move )
*/
shell_root.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		result,
		screen;

	screen = root._currentScreen( ),

	result = null;

	if( screen && screen.showDisc )
	{
		result = root._discJockey.pointingHover( p, shift, ctrl );

		if( result )
		{
/**/		if( CHECK )
/**/		{
/**/			if( result.reflect !== 'result_hover' )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			root.create( 'hover', result.path );

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
/**/			|| result.reflect !== 'result_hover'
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		root.create( 'hover', result.path );

		return result.cursor;
	}

	return 'default';
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
shell_root.prototype.dragStart =
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

	screen = root._currentScreen( );

	if( screen && screen.showDisc )
	{
		bubble = root._discJockey.dragStart( p, shift, ctrl );
	}

	if( bubble === null )
	{
		if( screen )
		{
			bubble = screen.dragStart( p, shift, ctrl );
		}
	}
};


/*
| Moving during an operation with the mouse button held down.
*/
shell_root.prototype.dragMove =
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

	action = root.action;

	cursor = null;

	screen = root._currentScreen( );

	if( screen )
	{
		cursor = screen.dragMove( p, shift, ctrl );
	}

	return cursor;
};


/*
| Stops an operation with the mouse button held down.
*/
shell_root.prototype.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		action,
		screen;

	action = root.action;

	screen = root._currentScreen( );

	if( screen )
	{
		screen.dragStop( p, shift, ctrl );
	}
};


/*
| Logs out the current user
*/
shell_root.prototype.logout =
	function( )
{
	if( root._visitor )
	{
		root.create( 'user', root._visitor );

		root.moveToSpace( fabric_spaceRef.ideoloomHome, false );

		return;
	}

	root.link.auth( user_creds.createVisitor( ) );
};


/*
| Mouse wheel is being turned.
*/
shell_root.prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	// FUTURE disc

	var
		screen;

	screen = root._currentScreen( );

	if( screen )
	{
		screen.mousewheel( p, dir, shift, ctrl );
	}
};


/*
| Sets the trait(s) of item(s).
*/
shell_root.prototype.setPath =
	function(
		path,
		value
	)
{
	switch( path.get( 0 ) )
	{
		case 'disc' :

			throw new Error( 'FUTURE' );

		case 'form' :

			root.create(
				'_formJockey', root._formJockey.setPath( path, value, 1 )
			);

			break;

		case 'space' :

			root.create( 'space', root.space.setPath( path, value, 1 ) );

			break;

		default :

			throw new Error( );
	}
};


/*
| User is pressing a special key.
*/
shell_root.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		focusItem,
		screen;

	screen = root._currentScreen( );

	if( screen )
	{
		screen.specialKey( key, shift, ctrl );
	}

	focusItem = root.space.focusedItem( );

	if( focusItem && focusItem.scrollMarkIntoView )
	{
		focusItem.scrollMarkIntoView( );
	}
};



/*
| Returns true if the iPad ought to showy
| the virtual keyboard
*/
shell_root.prototype.suggestingKeyboard =
	function( )
{
	return( root._mark !== null && root._mark.hasCaret );
};



/*
| A button has been pushed.
*/
shell_root.prototype.pushButton =
	function( path )
{
	switch( path.get( 0 ) )
	{
		case 'disc' :

			return root._discJockey.pushButton(
				path,
				false,
				false
			);

		case 'form' :

			return root._formJockey.pushButton(
				path,
				false,
				false
			);

		default :

			throw new Error( 'invalid path' );
	}
};


/*
| The link is reporting updates.
*/
shell_root.prototype.update =
	function(
		space,
		changes
	)
{
	var
		mark;

	mark = root.space.mark;

	switch( mark && mark.reflect )
	{
		case null :

			break;

		case 'mark_caret' :
		case 'mark_item' :
		case 'mark_range' :

			if( mark.path.get( 0 ) === 'space' )
			{
				mark = changes.transform( mark );
			}

			break;
	}

	root.create(
		'space', space.create( 'mark', mark ),
		'_discJockey', root._discJockey.create( 'mark', mark ),
		'mark', mark
	);
};


/*
| User entered normal text (one character or more).
*/
shell_root.prototype.input =
	function(
		text
	)
{
	var
		focusItem,
		screen;

	screen = root._currentScreen( );

	if( screen )
	{
		screen.input( text );

		focusItem = root.space.focusedItem( );

		if( focusItem && focusItem.scrollMarkIntoView )
		{
			focusItem.scrollMarkIntoView( );
		}
	}
};


/*
| The window has been resized.
*/
shell_root.prototype.resize =
	function(
		display
	)
{
	root.create(
		'display', display,
		'view',
			root.view.create(
				'height', display.height,
				'width', display.width
			)
	);
};


/*
| Moves to space with the name name.
|
| if spaceRef is null reloads current space
*/
shell_root.prototype.moveToSpace =
	function(
		spaceRef,     // reference of type fabric_spaceRef
		createMissing // if true, non-existing spaces are to be
		//            // created
	)
{
	root.link.acquireSpace( spaceRef, createMissing );
};


/*
| Receiving a moveTo event
*/
shell_root.prototype.onAcquireSpace =
	function(
		spaceRef,
		reply
	)
{
	var
		access;

	switch( reply.status )
	{
		case 'served' :

			break;

		case 'nonexistent' :

			root.setPath(
				root._formJockey.twig.nonExistingSpace.path
					.append( 'nonSpaceRef' ),
				spaceRef
			);

			root.create( 'mode', 'nonExistingSpace' );

			return;

		case 'no access' :

			// FIXME move spaceRef handing into _init
			root.create(
				'mode', 'noAccessToSpace',
				'_formJockey',
					root._formJockey.create( 'spaceRef', spaceRef )
			);

			return;

		default :

			system.failScreen( 'Unknown acquireSpace( ) status' );

			return;
	}

	access = reply.access;

	root.create(
		'space',
			reply.space.create(
				// FUTURE have the server already set this at JSON level
				'access', access,
				'hover', jion_path.empty,
				'mark', null,
				'path', jion_path.empty.append( 'space' ),
				'ref', spaceRef,
				'view',
					euclid_view.create(
						'fact', 0,
						'height', root.display.height,
						'pan', euclid_point.zero,
						'width', root.display.width
					)
			)
	);

	root.arrivedAtSpace( spaceRef, access );
};


/*
| Received an 'auth' reply.
*/
shell_root.prototype.onAuth =
	function(
		request,
		reply
	)
{
	// if in login mode this is a tempted login

	if( root._mode === 'login' )
	{
		root._formJockey.get( 'login' ).onAuth( request, reply );

		return;
	}

	// otherwise this is an onload login
	// or logout.

	if( reply.reflect !== 'reply_auth' )
	{
		// when logging in with a real user failed
		// takes a visitor instead
		if( !request.user.isVisitor )
		{
			root.link.auth( user_creds.createVisitor( ) );

			return;
		}

		// if even that failed, bailing to failScreen
		system.failScreen( reply.message );

		return;
	}

	root.create( 'user', reply.user );

	root.moveToSpace( fabric_spaceRef.ideoloomHome, false );
};


/*
| Received a 'register' reply.
*/
shell_root.prototype.onRegister =
	function(
		ok,
		user,
		message
	)
{
	// if in login mode this is a tempted login

	if( root._mode !== 'signUp' )
	{
/**/	if( CHECK )
/**/	{
/**/		console.log(
/**/			'ignoring a register reply, since out of signup form'
/**/		);
/**/	}

		return;
	}

	root._formJockey.get( 'signUp' ).onRegister( ok, user, message );

	return;
};


/*
| Returns current screen
|
| This is either a fabric space or a form
*/
shell_root.prototype._currentScreen =
	function( )
{
	var
		name;

	name = root._mode;

	switch( name )
	{
		case 'Create' :
		case 'Normal' :

			return root.space;

		case 'login' :
		case 'moveTo' :
		case 'noAccessToSpace' :
		case 'nonExistingSpace' :
		case 'signUp' :
		case 'space' :
		case 'user' :
		case 'welcome' :

			return root._formJockey.get( name );

		default :

			throw new Error( 'unknown mode: ' + name );
	}
};


/*
| Draws everything.
*/
shell_root.prototype.draw =
	function( )
{
	var
		display,
		screen;

/**/if( CHECK )
/**/{
/**/	if( this !== root )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( root._drawn )
	{
		return;
	}

	display = root.display;

	display.clear( );

	screen = root._currentScreen( );

	if( screen )
	{
		screen.draw( display );
	}

	if( screen && screen.showDisc )
	{
		root._discJockey.draw( display );
	}

	root = root.create( '_drawn', true );
};


} )( );
