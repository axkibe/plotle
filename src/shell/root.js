/*
| The root of the user shell.
*/

var
	change_grow,
	change_join,
	change_ray,
	change_remove,
	change_wrap,
	disc_jockey,
	euclid_arrow,
	euclid_display,
	euclid_measure,
	euclid_point,
	euclid_view,
	fabric_doc,
	fabric_para,
	fabric_relation,
	fabric_spaceRef,
	form_jockey,
	gruga_createDisc,
	gruga_loading,
	gruga_login,
	gruga_mainDisc,
	gruga_moveTo,
	gruga_noAccessToSpace,
	gruga_nonExistingSpace,
	gruga_signUp,
	gruga_space,
	gruga_user,
	gruga_welcome,
	jion$path,
	net_ajax,
	net_channel,
	net_link,
	root,
	session_uid,
	shell_doTracker,
	shell_root,
	system,
	swatch,
	theme,
	user_creds,
	visual_mark_caret,
	visual_space;

root = undefined;



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
		id : 'shell_root',
		attributes :
		{
			access :
			{
				comment : 'access level to current space',
				type : [ 'undefined', 'string' ],
				assign : '_access'
			},
			action :
			{
				comment : 'current action',
				type :
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] ),
				prepare : 'shell_root.prepareAction( action, spaceFabric )',
				assign : '_action'
			},
			ajax :
			{
				comment : 'the ajax communication',
				type : 'net_ajax'
			},
			disc :
			{
				comment : 'the master of discs',
				type : 'disc_jockey'
			},
			display :
			{
				comment : 'the display within everything happens',
				type : 'euclid_display'
			},
			doTracker :
			{
				comment : 'the un/re/do tracker',
				type : 'shell_doTracker'
			},
			fallbackSpaceRef :
			{
				comment : 'fallback to this space if loading another failed.',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			form :
			{
				comment : 'the master of forms',
				type : 'form_jockey'
			},
			hover :
			{
				comment : 'current hovered item',
				type : [ 'undefined', 'jion$path' ],
				assign : '_hover'
			},
			link :
			{
				comment : 'the link to the server',
				type : 'net_link'
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] ),
				assign : '_mark'
			},
			mode :
			{
				comment : 'current mode',
				type : 'string',
				assign : '_mode'
			},
			spaceFabric :
			{
				comment : 'current space data',
				type : [ 'undefined', 'fabric_space' ]
			},
			spaceRef :
			{
				comment : 'reference to current space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			spaceVisual :
			{
				comment : 'current space visualisation',
				type : [ 'undefined', 'visual_space' ]
			},
			systemFocus :
			{
				comment : 'shell has system focus',
				type : 'boolean',
				assign : '_systemFocus'
			},
			user :
			{
				comment : 'current user',
				type : [ 'undefined', 'user_creds' ]
			},
			view :
			{
				comment : 'current view',
				type : 'euclid_view',
				assign : '_view'
			},
			_drawn :
			{
				comment : 'this root has been drawn on display',
				type : 'boolean'
			},
			_visitor :
			{
				comment :
					// remembers an acquired visitor user name and
					// passhash so when logging out from a real user
					// the previous visitor id is regained.
					'last acquired visitor credentials',
				type : [ 'undefined', 'user_creds' ]
			}
		},
		init : [ 'inherit' ],
		alike :
		{
			lookAlike :
			{
				ignores :
				{
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
*/
var
	loadingSpaceTextPath,
	modes,
	prototype;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


/**/if( CHECK )
/**/{
/**/	modes =
/**/		{
/**/			// Creating a new item.
/**/			'create' : true,
/**/
/**/			// Loading a space.
/**/			'loading' : true,
/**/
/**/			// Logging in.
/**/			'login' : true,
/**/
/**/			// Moveing To another space.
/**/			'moveTo' : true,
/**/
/**/			// Standard selection, moving stuff around.
/**/			'normal' : true,
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


prototype = shell_root.prototype;

loadingSpaceTextPath =
	jion$path.empty
	.append( 'form' )
	.append( 'twig' )
	.append( 'loading' )
	.append( 'twig' )
	.append( 'spaceText' )
	.append( 'text' );


/*
| Prepares the current action.
|
| Makes sure the action has not been invalidated by
| a space update. In that case it is set undefined.
*/
shell_root.prepareAction =
	function(
		action,
		space
	)
{
	if( !space || !action )
	{
		return undefined;
	}

	switch( action.reflect )
	{
		case 'action_itemDrag' :
		case 'action_itemResize' :

			return(
				root.getPath( action.itemPath )
				? action
				: undefined
			);

		default : return action;
	}
};


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
		dj,
		djPath,
		djTwPath,
		mode,
		user,
		view;

/**/if( CHECK )
/**/{
/**/	if( root )
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

	mode = 'loading';

	ajaxPath = jion$path.empty.append( 'ajax' );

	user = user_creds.createFromLocalStorage( );

	if( !user )
	{
		user = user_creds.createVisitor( );
	}

	djPath = jion$path.empty.append( 'disc' );

	djTwPath = djPath.append( 'twig' );

	dj =
		disc_jockey.create(
			'mode', mode,
			'path', djPath,
			'view', view,
			'twig:add', 'mainDisc',
				gruga_mainDisc.abstract(
					'path', djTwPath.append( 'mainDisc' )
				),
			'twig:add', 'createDisc',
				gruga_createDisc.abstract(
					'path', djTwPath.append( 'createDisc' )
				)
		);

	shell_root.create(
		'ajax',
			net_ajax.create(
				'path', ajaxPath,
				'twig:add', 'command',
					net_channel.create( 'path', ajaxPath.append( 'command' ) ),
				'twig:add', 'update',
					net_channel.create( 'path', ajaxPath.append( 'update' ) )
			),
		'display', display,
		'doTracker', shell_doTracker.create( ),
		'link', net_link.create( ),
		'mode', mode,
		'systemFocus', true,
		'view', view,
		'disc', dj,
		'form',
			form_jockey.create(
				'hover', undefined,
				'path', jion$path.empty.append( 'form' ),
				'view', view,
				'twig:add', 'loading', gruga_loading,
				'twig:add', 'login', gruga_login,
				'twig:add', 'moveTo', gruga_moveTo,
				'twig:add', 'noAccessToSpace', gruga_noAccessToSpace,
				'twig:add', 'nonExistingSpace', gruga_nonExistingSpace,
				'twig:add', 'signUp', gruga_signUp,
				'twig:add', 'space', gruga_space,
				'twig:add', 'user', gruga_user,
				'twig:add', 'welcome', gruga_welcome
			),
		'_drawn', false
	);

	root.link.auth( user );
};


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	var
		access,
		action,
		hover,
		mark,
		mode,
		spaceRef,
		user,
		view;

	// sets drawn false
	if( !this.lookAlike( inherit ) )
	{
		this._drawn = false;
	}

	access = this._access;

	action = this._action;

	mark = this._mark;

	view = this._view;

	hover = this._hover;

	user = this.user;

	mode = this._mode;

	spaceRef = this.spaceRef;

/**/if( CHECK )
/**/{
/**/	if( !modes[ mode ] )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( mode === 'loading' && this.screen )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		( mode === 'normal' || mode === 'create' )
/**/		&& !this.spaceFabric
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( hover && hover.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		user
		&& ( !inherit || !user.equals( inherit.user ) )
	)
	{
		if( !user.isVisitor )
		{
			user.saveToLocalStorage( );
		}
		else
		{
			if(
				root.spaceRef
				&& root.spaceRef.username !== 'ideoloom'
			)
			{
				root.moveToSpace( fabric_spaceRef.ideoloomHome, false );
			}

			user_creds.clearLocalStorage( );

			this._visitor = user;
		}
	}

	if( mark && mark.reflect === 'visual_mark_caret' )
	{
		mark = mark.create( 'focus', this._systemFocus );
	}

	if( !this.spaceFabric ) this.spaceVisual = undefined;

	// skips recreating children when no need
	if(
		!inherit
		|| access !== inherit._access
		|| action !== inherit._action
		|| hover !== inherit._hover
		|| mark !== inherit._mark
		|| mode !== inherit.mode
		|| user !== inherit.user
		|| view !== inherit._view
	)
	{
		if( this.spaceFabric )
		{
			this.spaceVisual =
				( this.spaceVisual || visual_space )
				.create(
					'access', access,
					'action', action,
					'fabric', this.spaceFabric,
					'hover', hover,
					'mark', mark,
					'view', view
				);
		}

		this.form =
			this.form.create(
				'hover', hover,
				'mark', mark,
				'spaceRef', spaceRef,
				'user', user,
				'view', view
			);

		this.disc =
			this.disc.create(
				'access', access,
				'action', action,
				'hover', hover,
				'mark', mark,
				'mode', mode,
				'spaceRef', spaceRef,
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
prototype.alter =
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
			'cid', session_uid( ),
			'changeRay', changeRay
		);

	root.link.alter( changeWrap );

	root.doTracker.track( changeWrap );
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
	prototype,
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
prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		result,
		screen;

	screen = root._currentScreen( );

	result = root.disc.click( p, shift, ctrl );

	if( !result && screen ) screen.click( p, shift, ctrl );
};


/*
| Returns the what the clipboard should hold.
*/
Object.defineProperty(
	prototype,
	'clipboard',
	{
		get :
			function( )
			{
				var
					mark;

				mark = this._mark;

				return mark ? mark.clipboard : '';
			}
	}
);


/*
| Clears the carets retainx info.
*/
prototype.clearRetainX =
	function( )
{
	var
		mark;

	mark = this._mark;

	// FIXME also clearRetainX for ranges
	if(
		mark.reflect === 'visual_mark_caret'
		&& mark.retainx !== undefined
	)
	{
		this.create( 'mark', mark.create( 'retainx', undefined ) );
	}
};


/*
| Cycles focus in a form.
*/
prototype.cycleFormFocus =
	function(
		name,
		dir
	)
{
	root.form.cycleFocus( name, dir );
};


/*
| Moving during an operation with the mouse button held down.
*/
prototype.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		screen;

	screen = root._currentScreen( );

	if( screen )
	{
		return screen.dragMove( p, shift, ctrl );
	}

	return;
};




/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		bubble,
		screen;

	screen = root._currentScreen( );

	if( screen && screen.showDisc )
	{
		bubble = root.disc.dragStart( p, shift, ctrl );

		if( bubble ) return bubble;
	}

	if( screen )
	{
		return screen.dragStart( p, shift, ctrl );
	}
};


/*
| Stops an operation with the mouse button held down.
*/
prototype.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		screen;

	screen = root._currentScreen( );

	if( screen )
	{
		screen.dragStop( p, shift, ctrl );
	}
};


/*
| User entered normal text (one character or more).
*/
prototype.input =
	function(
		text
	)
{
	var
		screen;

	screen = root._currentScreen( );

	if( screen )
	{
		screen.input( text );

		if( root.spaceVisual ) root.spaceVisual.scrollMarkIntoView( );
	}
};


/*
| Logs out the current user
*/
prototype.logout =
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
prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	var
		bubble,
		screen;

	screen = root._currentScreen( );

	if( screen && screen.showDisc )
	{
		bubble = root.disc.mousewheel( p, dir, shift, ctrl );

		if( bubble ) return bubble;
	}

	if( screen )
	{
		screen.mousewheel( p, dir, shift, ctrl );
	}
};


/*
| Moves to space with the name name.
|
| if spaceRef is undefined reloads current space
*/
prototype.moveToSpace =
	function(
		spaceRef,     // reference of type fabric_spaceRef
		createMissing // if true, non-existing spaces are to be created
	)
{
	var
		mode;

	mode = root._mode;

	root.create(
		'fallbackSpaceRef', this.spaceRef,
		'mode',
			mode === 'normal' || mode === 'create'
			? 'loading'
			: pass,
		'spaceFabric', undefined
	);

	// FUTURE move setPath into creator
	root.setPath( loadingSpaceTextPath, spaceRef.fullname );

	root.link.acquireSpace( spaceRef, createMissing );
};


/*
| User is hovering his/her pointing device ( mouse move )
*/
prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		result,
		screen;

	screen = root._currentScreen( );

	if( screen && screen.showDisc )
	{
		result = root.disc.pointingHover( p, shift, ctrl );

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
/**/		if( result.reflect !== 'result_hover' )
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
| A button has been pushed.
*/
prototype.pushButton =
	function( path )
{
	switch( path.get( 0 ) )
	{
		case 'disc' :

			return root.disc.pushButton( path, false, false );

		case 'form' :

			return root.form.pushButton( path, false, false );

		default :

			throw new Error( 'invalid path' );
	}
};


/*
| Shows the "home" screen.
|
| When a space is loaded, this is space/normal
| otherwise it is the loading screen.
*/
prototype.showHome =
	function( )
{
	root.create(
		'action', undefined,
		'mode', root.spaceVisual ? 'normal' : 'loading'
	);
};


/*
| User is pressing a special key.
*/
prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		screen;

	screen = root._currentScreen( );

	if( screen ) screen.specialKey( key, shift, ctrl );

	if( root.spaceVisual ) root.spaceVisual.scrollMarkIntoView( );
};



/*
| Returns true if the iPad ought to showy
| the virtual keyboard
*/
prototype.suggestingKeyboard =
	function( )
{
	return this._mark && this._mark.hasCaret;
};


/*
| The link is reporting updates.
*/
prototype.update =
	function(
		changes
	)
{
	var
		mark;

	if( !this._mark ) return;

	mark = this._mark.createTransformed( changes );

	if( mark.reflect === 'visual_mark_range' )
	{
		// FUTURE remove doc from range
		mark =
			mark.create(
				'doc',
					root.spaceFabric.getPath(
						mark.itemPath.chop.append( 'doc' )
					)
			);
	}

	root.create( 'mark', mark );
};


/*
| The window has been resized.
*/
prototype.resize =
	function(
		display
	)
{
	root.create(
		'display', display,
		'view',
			root._view.create(
				'height', display.height,
				'width', display.width
			)
	);
};


/*
| Receiving a moveTo event
*/
prototype.onAcquireSpace =
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
				root.form.get( 'nonExistingSpace' ).path
					.append( 'nonSpaceRef' ),
				spaceRef
			);

			if( root.fallbackSpaceRef )
			{
				root.moveToSpace( root.fallbackSpaceRef, false );
			}

			root.create( 'mode', 'nonExistingSpace' );

			return;

		case 'no access' :

			root.create( 'mode', 'noAccessToSpace' );

			if( root.fallbackSpaceRef )
			{
				root.moveToSpace( root.fallbackSpaceRef, false );
			}

			return;

		default :

			system.failScreen( 'Unknown acquireSpace( ) status' );

			return;
	}

	access = reply.access;

	root.create(
		'access', access,
		'mark', undefined,
		'mode',
			root._mode === 'loading'
			? 'normal'
			: pass,
		'spaceFabric', reply.space,
		'spaceRef', spaceRef,
		'view',
			euclid_view.create(
				'fact', 0,
				'height', root.display.height,
				'pan', euclid_point.zero,
				'width', root.display.width
			)
	);
};


/*
| Received an 'auth' reply.
*/
prototype.onAuth =
	function(
		request,
		reply
	)
{
	// if in login mode this is a tempted login

	if( root._mode === 'login' )
	{
		root.form.get( 'login' ).onAuth( request, reply );

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
prototype.onRegister =
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

	root.form.get( 'signUp' ).onRegister( ok, user, message );

	return;
};


/*
| Removes a text spawning over several entities.
*/
prototype.removeRange =
	function(
		range
	)
{
	var
		back,
		changes,
		front,
		k1,
		k2,
		pivot,
		r,
		r1,
		r2,
		text,
		ve;

	front = range.front;

	back = range.back;

/**/if( CHECK )
/**/{
/**/	if(
/**/		front.path.get( -1 ) !== 'text'
/**/		|| back.path.get( -1 ) !== 'text'
/**/		|| front.path.get( 0 ) !== 'spaceVisual'
/**/		|| back.path.get( 0 ) !== 'spaceVisual'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if ( front.path.equals( back.path ) )
	{
		root.alter(
			change_remove.create(
				'path', front.path.chop,
				'at1', front.at,
				'at2', back.at,
				'val',
					root.spaceFabric.getPath( front.path.chop )
					.substring( front.at, back.at )
			)
		);

		return;
	}

	changes = [ ];

	k1 = front.path.get( -2 );

	k2 = back.path.get( -2 );

	pivot = root.spaceFabric.getPath( front.path.chop.shorten.shorten.shorten );

	r1 = pivot.rankOf( k1 );

	r2 = pivot.rankOf( k2 );

	text = root.spaceFabric.getPath( front.path.chop );

	for(
		r = r1;
		r < r2;
		r++
	)
	{
		ve = pivot.atRank( r + 1 );

		changes.push(
			change_join.create(
				'path', front.path.chop,
				'path2', ve.textPath.chop,
				'at1', text.length
			)
		);

		text += ve.text;
	}

	text =
		text.substring(
			front.at,
			text.length - ve.text.length + back.at
		);

	changes.push(
		change_remove.create(
			'path', front.path.chop,
			'at1', front.at,
			'at2', front.at + text.length,
			'val', text
		)
	);

	root.alter( changes );
};


/*
| Creates a new relation by specifing its relates.
*/
prototype.spawnRelation =
	function(
		item1,
		item2
	)
{
	var
		arrow,
		key,
		pnw,
		val;

	arrow =
		euclid_arrow.connect(
			item1.silhoutte, 'normal',
			item2.silhoutte, 'normal'
		);

	pnw = arrow.pc.sub( theme.relation.spawnOffset );

	val =
		fabric_relation.create(
			'pnw', pnw,
			'doc',
				fabric_doc.create(
					'twig:add', '1',
					fabric_para.create( 'text', 'relates to' )
				),
			'fontsize', 20,
			'item1key', item1.path.get( -1 ),
			'item2key', item2.path.get( -1 )
		);

	key = session_uid( );

	root.alter(
		change_grow.create(
			'val', val,
			'path', jion$path.empty.append( 'twig' ).append( key ),
			'rank', 0
		)
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path', root.spaceVisual.get( key ).doc.atRank( 0 ).textPath,
				'at', 0
			)
	);
};




/*
| Returns current screen
|
| FIXME make this a lazyValue
|
| This is either a fabric space or a form
*/
prototype._currentScreen =
	function( )
{
	var
		name;

	name = root._mode;

	switch( name )
	{
		case 'create' :
		case 'normal' :

			return root.spaceVisual;

		case 'login' :
		case 'loading' :
		case 'moveTo' :
		case 'noAccessToSpace' :
		case 'nonExistingSpace' :
		case 'signUp' :
		case 'space' :
		case 'user' :
		case 'welcome' :

			return root.form.get( name );

		default :

			throw new Error( 'unknown mode: ' + name );
	}
};


/*
| Draws everything.
*/
prototype.draw =
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

	screen.draw( display );

	if( screen.showDisc ) root.disc.draw( display );

	root = root.create( '_drawn', true );
};


} )( );
