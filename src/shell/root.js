/*
| The root of the user shell.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'shell_root',
		attributes :
		{
			access :
			{
				comment : 'access level to current space',
				type : [ 'undefined', 'string' ]
			},
			action :
			{
				comment : 'current action',
				type :
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] ),
				prepare : 'shell_root.prepareAction( action )'
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
				// REMOVE classic support
				comment : 'the display within everything happens',
				type :
					[
						'gleam_display_canvas',
						'gleam_display_pixi'
					]
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
				type : [ 'undefined', 'jion$path' ]
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
					.concat( [ 'undefined' ] )
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
			spaceTransform :
			{
				comment : 'current space transform',
				type : 'euclid_transform'
			},
			spaceVisual :
			{
				comment : 'current space visualisation',
				type : [ 'undefined', 'visual_space' ]
			},
			systemFocus :
			{
				comment : 'shell has system focus',
				type : 'boolean'
			},
			user :
			{
				comment : 'current user',
				type : [ 'undefined', 'user_creds' ]
			},
			view :
			{
				comment : 'current view',
				type : 'euclid_view'
			},
			viewSize :
			{
				comment : 'current view size',
				type : 'euclid_size'
			},
			_transformExponent :
			{
				comment : 'transform zoom as power of 1.1',
				type : 'number',
				defaultValue : '0'
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


var
	action_form,
	action_select,
	change_grow,
	change_join,
	change_ray,
	change_remove,
	change_wrap,
	disc_jockey,
	euclid_connect,
	euclid_transform,
	gleam_display_canvas,
	euclid_measure,
	euclid_point,
	euclid_size,
	euclid_view,
	fabric_doc,
	fabric_para,
	fabric_relation,
	fabric_spaceRef,
	form_jockey,
	gruga_controls,
	gruga_createDisc,
	gruga_loading,
	gruga_login,
	gruga_mainDisc,
	gruga_moveTo,
	gruga_noAccessToSpace,
	gruga_nonExistingSpace,
	gruga_relation,
	gruga_signUp,
	gruga_space,
	gruga_user,
	gruga_welcome,
	jion,
	jion$path,
	jion$pathRay,
	math_limit,
	net_ajax,
	net_channel,
	net_link,
	root,
	session_uid,
	shell_doTracker,
	shell_root,
	shell_settings,
	system,
	swatch,
	user_creds,
	visual_mark_caret,
	visual_space;

root = undefined;


/*
| Capsule
*/
( function() {
'use strict';


var
	loadingSpaceTextPath,
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	jion.this( module, 'source' );

	return;
}




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
| Makes sure the action has not any removed items in them.
| If so the paths are removed from its itemPathsRay.
|
| If no item is left, action is set to undefined.
*/
shell_root.prepareAction =
	function(
		action
	)
{
	var
		p,
		p2,
		path,
		pZ,
		iPaths,
		nPaths;

	if( !action ) return undefined;

	switch( action.reflect )
	{
		case 'action_dragItems' :
		case 'action_resizeItems' :

			iPaths = action.itemPaths;

			if( iPaths )
			{
				for( p = 0, pZ = iPaths.length; p < pZ; p++ )
				{
					path = iPaths.get( p );

					if( !root.getPath( path ) ) break;
				}

				if( p < pZ )
				{
					// there is an item missing!

					nPaths = [ ];

					// first copies over already checked items.

					for( p2 = 0; p2 < p; p2++ )
					{
						nPaths[ p2 ] = iPaths.get( p );
					}

					p++; // the last item was a guaranteed skip

					for( ; p < pZ; p++ )
					{
						path = iPaths.get( p );

						if( !root.getPath( path ) ) continue;

						nPaths[ p2++ ] = path;
					}

					if( p2 === 0 ) return undefined;

					return(
						action.create(
							'itemPaths',
							jion$pathRay.create( 'ray:init', nPaths )
						)
					);
				}

				return action;
			}
	}

	return action;
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
		action,
		ajaxPath,
		canvas,
		dj,
		djPath,
		djTwPath,
		user,
		view,
		viewSize;

/**/if( CHECK )
/**/{
/**/	if( root )
/**/	{
/**/		// singleton
/**/		throw new Error( );
/**/	}
/**/}

	canvas = document.createElement( 'canvas' );

	// FIXME swatch should be part of system

	swatch =
		gleam_display_canvas.createAroundHTMLCanvas(
			canvas,
			'swatch',
			euclid_size.create(
				'height', 10,
				'width', 10
			),
			undefined
		);

	euclid_measure.init( canvas );

	/*
	root._fontWFont = shell_fontPool.get( 20, 'la' );

	root._fontWatch =
		euclid_measure.width( root._fontWFont, 'ideoloom$8833' );
	*/

	view =
		euclid_view.proper.create(
			'height', display.size.height,
			'width', display.size.width
		);

	viewSize =
		euclid_size.create(
			'height', display.size.height,
			'width', display.size.width
		);

	action = action_form.loading;

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
			'action', action,
			'controlTransform', euclid_transform.normal,
			'controlView', view,
			'path', djPath,
			'viewSize', viewSize,
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
		'action', action,
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
		'spaceTransform', euclid_transform.normal,
		'systemFocus', true,
		'view', view,
		'viewSize', display.size,
		'disc', dj,
		'form', shell_root._createFormJockey( viewSize ),
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
		spaceFabric,
		spaceRef,
		spaceTransform,
		user,
		view,
		viewSize;


	// sets drawn false
	if( !this.lookAlike( inherit ) )
	{
		this._drawn = false;
	}

	access = this.access;

	action = this.action;

	mark = this.mark;

	view = this.view;

	viewSize = this.viewSize;

	spaceTransform = this.spaceTransform;

	hover = this.hover;

	user = this.user;

	spaceRef = this.spaceRef;

	spaceFabric = this.spaceFabric;

/**/if( CHECK )
/**/{
/**/	if( hover && hover.isEmpty ) throw new Error( );
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
		mark = mark.create( 'focus', this.systemFocus );
	}

	if( !spaceFabric ) this.spaceVisual = undefined;

	// skips recreating children when no need
	if(
		!inherit
		|| access !== inherit.access
		|| action !== inherit.action
		|| hover !== inherit.hover
		|| mark !== inherit.mark
		|| user !== inherit.user
		|| view !== inherit.view
		|| spaceTransform !== inherit.spaceTransform
		|| spaceFabric !== inherit.spaceFabric
		|| viewSize !== inherit.viewSize
	)
	{
		if( spaceFabric )
		{
			this.spaceVisual =
				( this.spaceVisual || visual_space )
				.create(
					'access', access,
					'action', action,
					'fabric', spaceFabric,
					'hover', hover,
					'mark', mark,
					'transform', spaceTransform,
					'view', view,
					'viewSize', viewSize
				);
		}

		this.form =
			this.form.create(
				'hover', hover,
				'mark', mark,
				'spaceRef', spaceRef,
				'transform', euclid_transform.normal,
				'user', user,
				'viewSize', viewSize
			);

		this.disc =
			this.disc.create(
				'access', access,
				'action', action,
				'controlTransform',
					euclid_transform.create(
						'zoom',
							Math.min(
							  viewSize.height / gruga_controls.designSize.height,
							  1
							),
						'offset', euclid_point.zero
					),
				'controlView',
					view.create(
						'zoom',
							Math.min(
							  view.height / gruga_controls.designSize.height,
							  1
							),
						'pan', euclid_point.zero
					),
				'hover', hover,
				'mark', mark,
				'spaceRef', spaceRef,
				'user', user,
				'viewSize', viewSize
			);
	}

	this.link = this.link.create( 'user', user );

	root = this;

	if( inherit && mark !== inherit.mark )
	{
		root._markLostNotifications( root.mark, inherit.mark );
	}
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

	if( a1.reflect === 'change_ray' )
	{
		changeRay = a1;
	}
	else if( Array.isArray( a1 ) )
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

				screen = root._currentScreen;

				return screen && screen.attentionCenter;
			}
	}
);


/*
| Changed the views zoom factor
| and pans it, so p stays in the same spot.
|
| new pan (p1) calculates as:
|
| FIXME rename to changeSpaceTransform
|
| A: py = y0 * z1 + p0
| B: py = y0 * z0 + p1
|
| A: py / z1 = y0 + p1 / z1
| B: py / z0 = y0 + p0 / z0
|
| A - B: py / z1 - py / z0 = p1 / z1 - p0 / z0
|
| -> p1 = ( py * (1 / z1 - 1 / z0 ) + p0 / z0 ) * z1
*/
prototype.changeView =
	function(
		de,  // difference of view zoom exponent
		p    // point to keep constant
	)
{
	var
		e,
		e1,
		pan,
		st,
		view,
		x,
		y,
		zoom;

	view = this.view;

	st = this.spaceTransform;

	pan = view.pan;

	if( de === 0 )
	{
		e1 = 0;
	}
	else
	{
		e1 =
			math_limit(
				shell_settings.zoomMin,
				this._transformExponent + de,
				shell_settings.zoomMax
			);
	}

	zoom = Math.pow( 1.1, e1 );

	x = ( ( p.x - pan.x ) / view.zoom );

	y = ( ( p.y - pan.y ) / view.zoom );

	e = ( 1 / zoom - 1 / view.zoom );

	return(
		this.create(
			'_transformExponent', e1,
			'view',
				view.create(
					'pan',
						euclid_point.create(
							'x', ( p.x * e + pan.x / view.zoom ) * zoom,
							'y', ( p.y * e + pan.y / view.zoom ) * zoom
						),
					'zoom', zoom
				),
			'spaceTransform',
				st.create(
					'offset',
						euclid_point.create(
							'x', ( p.x * e + pan.x / st.zoom ) * zoom,
							'y', ( p.y * e + pan.y / st.zoom ) * zoom
						),
					'zoom', zoom
				)
		)
	);
};


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
		bubble,
		screen;

	screen = root._currentScreen;

	bubble = root.disc.click( p, shift, ctrl );

	// if bubble === false do not bubble
	if( bubble !== undefined ) return bubble;

	return screen.click( p, shift, ctrl );
};


/*
| Returns the what the clipboard should hold.
*/
jion.lazyValue(
	prototype,
	'clipboard',
	function( )
{
	var
		mark;

	mark = this.mark;

	return mark ? mark.clipboard : '';
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

	mark = this.mark;

	if( mark.retainx !== undefined )
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

	screen = root._currentScreen;

	if( screen ) screen.dragMove( p, shift, ctrl );
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

	screen = root._currentScreen;

	if( screen && screen.showDisc )
	{
		bubble = root.disc.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

	if( screen ) return screen.dragStart( p, shift, ctrl );
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

	screen = root._currentScreen;

	if( screen ) screen.dragStop( p, shift, ctrl );
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

	screen = root._currentScreen;

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

	screen = root._currentScreen;

	if( screen && screen.showDisc )
	{
		bubble = root.disc.mousewheel( p, dir, shift, ctrl );

		if( bubble ) return bubble;
	}

	if( screen ) screen.mousewheel( p, dir, shift, ctrl );
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

	root.create(
		'action', action_form.loading,
		'fallbackSpaceRef', this.spaceRef,
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

	screen = root._currentScreen;

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
		'action',
			root.spaceVisual ? undefined : action_form.loading
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
		action,
		result,
		screen;

	screen = root._currentScreen;

	if( key === 'shift' )
	{
		action = this.action;

		if( !action )
		{
			root.create( 'action', action_select.create( ) );
		}

		return true;
	}

	if( screen )
	{
		result = screen.specialKey( key, shift, ctrl );
	}

	if( root.spaceVisual ) root.spaceVisual.scrollMarkIntoView( );

	return result;
};


/*
| User is releasing a special key.
*/
prototype.releaseSpecialKey =
	function(
		key
//		shift,
//		ctrl
	)
{
	var
		action;

	if( key !== 'shift' ) return;

	action = this.action;

	if(
		action
		&& action.reflect === 'action_select'
		&& !action.startPoint
	)
	{
		root.create( 'action', undefined );
	}
};


/*
| Returns true if the iPad ought to showy
| the virtual keyboard
*/
prototype.suggestingKeyboard =
	function( )
{
	return this.mark && this.mark.hasCaret;
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

	mark = this.mark;

	if( !mark ) return;

	switch( mark.reflect )
	{
		case 'visual_mark_range' :

			mark = mark.createTransformed(
				changes,
				root.spaceFabric.getPath( mark.docPath.chop )
			);

			break;


		default :

			mark = mark.createTransformed( changes );

			break;
	}

	root.create( 'mark', mark );
};


/*
| The window has been resized.
*/
prototype.resize =
	function(
		width,  // FIXME give an euclid_size jion
		height
	)
{
	var
		view,
		viewSize;

	view =
		root.view.create(
			'width', width,
			'height', height
		);

	viewSize =
		euclid_size.create(
			'height', height,
			'width', width
		);

	root.create(
		'display',
			this.display.create(
				'view', view,
				'size', viewSize
			),
		'view', view,
		'viewSize', viewSize
	);
};


/*
| Receiving a moveTo event
*/
prototype.onAcquireSpace =
	function(
		request,
		reply
	)
{
	var
		access,
		action;

	if( reply.reflect === 'reply_error' )
	{
		system.failScreen( 'Error on acquire space: ' + reply.message );

		return;
	}

	switch( reply.status )
	{
		case 'served' :

			break;

		case 'nonexistent' :

			root.setPath(
				root.form.get( 'nonExistingSpace' ).path
					.append( 'nonSpaceRef' ),
				request.spaceRef
			);

			if( root.fallbackSpaceRef )
			{
				root.moveToSpace( root.fallbackSpaceRef, false );
			}

			root.create( 'action', action_form.nonExistingSpace );

			return;

		case 'no access' :

			root.setPath(
				root.form.get( 'noAccessToSpace' ).path
					.append( 'nonSpaceRef' ),
				request.spaceRef
			);

			if( root.fallbackSpaceRef )
			{
				root.moveToSpace( root.fallbackSpaceRef, false );
			}

			root.create( 'action', action_form.noAccessToSpace );

			return;

		default :

			system.failScreen( 'Unknown acquireSpace( ) status' );

			return;
	}

	access = reply.access;

	action = root.action;

	root.create(
		'access', access,
		'action',
			(
				action
				&& action.reflect === 'action_form'
				&& action.formName === 'loading'
			)
			? undefined
			: pass,
		'mark', undefined,
		'spaceFabric', reply.space,
		'spaceRef', request.spaceRef,
		'view',
			euclid_view.proper.create(
				'height', this.viewSize.height,
				'width', this.viewSize.width
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
	var
		action;

	action = root.action;

	// if in login form this is a tempted login
	if(
		action
		&& action.reflect === 'action_form'
		&& action.formName === 'login'
	)
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
		request,
		reply
	)
{
	var
		action;

	action = root.action;

	// if not in signup form this came out of band.
	if(
		!action
		|| action.reflect !== 'action_form'
		|| action.formName !== 'signUp'
	)
	{
/**/	if( CHECK )
/**/	{
/**/		console.log(
/**/			'ignoring a register reply, since out of signup form'
/**/		);
/**/	}

		return;
	}

	root.form.get( 'signUp' ).onRegister( request, reply );
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
		backMark,
		changes,
		frontMark,
		k1,
		k2,
		pivot,
		r,
		r1,
		r2,
		text,
		ve;

	frontMark = range.frontMark;

	backMark = range.backMark;

/**/if( CHECK )
/**/{
/**/	if(
/**/		frontMark.path.get( -1 ) !== 'text'
/**/		|| backMark.path.get( -1 ) !== 'text'
/**/		|| frontMark.path.get( 0 ) !== 'spaceVisual'
/**/		|| backMark.path.get( 0 ) !== 'spaceVisual'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if ( frontMark.path.equals( backMark.path ) )
	{
		root.alter(
			change_remove.create(
				'path', frontMark.path.chop,
				'at1', frontMark.at,
				'at2', backMark.at,
				'val',
					root.spaceFabric.getPath( frontMark.path.chop )
					.substring( frontMark.at, backMark.at )
			)
		);

		return;
	}

	changes = [ ];

	k1 = frontMark.path.get( -2 );

	k2 = backMark.path.get( -2 );

	pivot =
		root.spaceFabric.getPath(
			frontMark.path.chop.shorten.shorten.shorten
		);

	r1 = pivot.rankOf( k1 );

	r2 = pivot.rankOf( k2 );

	text =
		root.spaceFabric.getPath(
			frontMark.path.chop
		);

	for(
		r = r1;
		r < r2;
		r++
	)
	{
		ve = pivot.atRank( r + 1 );

		changes.push(
			change_join.create(
				'path', frontMark.path.chop,
				'path2', ve.textPath.chop,
				'at1', text.length
			)
		);

		text += ve.text;
	}

	text =
		text.substring(
			frontMark.at,
			text.length - ve.text.length + backMark.at
		);

	changes.push(
		change_remove.create(
			'path', frontMark.path.chop,
			'at1', frontMark.at,
			'at2', frontMark.at + text.length,
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
		line,
		key,
		pnw,
		val;

	line =
		euclid_connect.line(
			item1.silhoutte,
			item2.silhoutte
		);

	pnw = line.pc.sub( gruga_relation.spawnOffset );

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
| This is either a fabric space or a form
*/
jion.lazyValue(
	prototype,
	'_currentScreen',
	function( )
{
	var
		action;

	action = root.action;

	switch( action && action.reflect )
	{
		case undefined :
		case 'action_create' :
		case 'action_createGeneric' :
		case 'action_createRelation' :
		case 'action_dragItems' :
		case 'action_pan' :
		case 'action_resizeItems' :
		case 'action_select' :
		case 'action_scrolly' :

			return root.spaceVisual;

		case 'action_form' :

			return root.form.get( action.formName );

		default : throw new Error( );
	}
}
);


/*
| Draws everything.
*/
prototype.draw =
	function( )
{
	var
		disc,
		glint,
		display,
		screen;

/**/if( CHECK )
/**/{
/**/	if( this !== root ) throw new Error( );
/**/}

	if( root._drawn ) return;

	display = root.display;

	glint = display.glint;

	screen = root._currentScreen;

	glint = glint.create( 'twine:set+', screen.glint );

	if( screen.showDisc )
	{
		disc = root.disc;

		glint = glint.create( 'twine:set+', disc.glint );
	}
	else
	{
		if( glint.get( 'disc' ) )
		{
			glint = glint.create( 'twig:remove', 'disc' );
		}
	}

	display = display.create( 'glint', glint );

	display.render( );

	root =
		root.create(
			'display', display,
			'_drawn', true
		);
};


/*
| Creates the form jockey.
*/
shell_root._createFormJockey =
	function(
		viewSize
	)
{
	var
		a,
		aZ,
		form,
		forms,
		jockey,
		key,
		keys,
		name,
		w,
		widget,
		wZ;

	forms =
		{
			loading : gruga_loading,
			login : gruga_login,
			moveTo : gruga_moveTo,
			noAccessToSpace : gruga_noAccessToSpace,
			nonExistingSpace : gruga_nonExistingSpace,
			signUp : gruga_signUp,
			space : gruga_space,
			user : gruga_user,
			welcome : gruga_welcome
		};

	for( name in forms )
	{
		form = forms[ name ];

		for( w = 0, wZ = form.length; w < wZ; w++ )
		{
			key = form.getKey( w );

			widget = form.get( key );

			if( widget.isAbstract )
			{
				form =
					form.abstract(
						'twig:set',
						key,
						widget.create(
							'transform', euclid_transform.normal
						)
					);
			}
		}

		forms[ name ] = form;
	}

	jockey =
		form_jockey.create(
			'path', jion$path.empty.append( 'form' ),
			'transform', euclid_transform.normal,
			'viewSize', viewSize
		);

	keys = Object.keys( forms );

	// FIXME do a twig:init instead
	for( a = 0, aZ = keys.length; a < aZ; a++ )
	{
		key = keys[ a ];

		jockey =
			jockey.create(
				'twig:add',
				key,
				forms[ key ].create(
					'transform', euclid_transform.normal,
					'viewSize', viewSize
				)
			);
	}

	return jockey;
};


/*
| Sends out update/check notifications when an item
| is no longer in the user marked.
*/
prototype._markLostNotifications =
	function(
		nMark,  // new mark
		oMark   // old mark
	)
{
	var
		a,
		aZ,
		item,
		nip,
		oip,
		op;

	if( !oMark ) return;

	oip = oMark.itemPaths;

	if( !oip ) return;

	nip = nMark && nMark.itemPaths;

	for( a = 0, aZ = oip.length; a < aZ; a++ )
	{
		op = oip.get( a );

		if( nip && nip.contains( op ) ) continue;

		item = root.getPath( op );

		if( !item ) continue;

		item.markLost( );
	}

};


} )( );
