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
					require( '../action/typemap' )
					.concat( [ 'undefined' ] ),
				prepare : 'shell_root.prepareAction( action )'
			},
			ajax :
			{
				comment : 'the ajax communication',
				type : 'net_ajax'
			},
			animation :
			{
				comment : 'the animations',
				type : 'animation_root'
			},
			disc :
			{
				comment : 'the discs',
				type : 'disc_root'
			},
			display :
			{
				comment : 'the display within everything happens',
				type : 'gleam_display_canvas'
			},
			doTracker :
			{
				comment : 'the un/re/do tracker',
				type : 'shell_doTracker'
			},
			fallbackSpaceRef :
			{
				comment : 'fallback to this space if loading another failed.',
				type : [ 'undefined', 'ref_space' ]
			},
			form :
			{
				comment : 'the forms',
				type : 'form_root'
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
					require( '../visual/mark/typemap' )
					.concat( [ 'undefined' ] )
			},
			show :
			{
				comment : 'currently form/disc shown',
				type : require ( '../show/typemap' )
			},
			spaceFabric :
			{
				comment : 'current space data',
				type : [ 'undefined', 'fabric_space' ]
			},
			spaceRef :
			{
				comment : 'reference to current space',
				type : [ 'undefined', 'ref_space' ]
			},
			spaceTransform :
			{
				comment : 'current space transform',
				type : 'gleam_transform'
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
			userCreds :
			{
				comment : 'current user credentials',
				type : [ 'undefined', 'user_creds' ]
			},
			userSpaceList :
			{
				comment : 'the list of space references the user has',
				type : [ 'undefined', 'ref_spaceList' ] 
			},
			viewSize :
			{
				comment : 'current view size',
				type : 'gleam_size'
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
			_visitorCreds :
			{
				// remembers an acquired visitor user name and
				// passhash so when logging out from a real user
				// the previous visitor id is regained.
				comment : 'last acquired visitor credentials',
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
	action_select,
	animation_root,
	animation_transform,
	change_grow,
	change_join,
	change_list,
	change_remove,
	change_wrap,
	disc_root,
	gleam_connect,
	gleam_glint_list,
	gleam_measure,
	gleam_point,
	gleam_size,
	gleam_transform,
	fabric_doc,
	fabric_para,
	fabric_relation,
	form_root,
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
	gruga_zoomDisc,
	jion,
	jion$path,
	jion$pathList,
	math_limit,
	net_ajax,
	net_channel,
	net_link,
	ref_space,
	root,
	session_uid,
	shell_doTracker,
	shell_root,
	shell_settings,
	show_form,
	show_normal,
	system,
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
	notAnimationFinish,
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
| If so the paths are removed from its itemPathsList.
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
							jion$pathList.create( 'list:init', nPaths )
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
		ajaxPath,
		canvas,
		show,
		userCreds,
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

	gleam_measure.init( canvas );

	viewSize =
		gleam_size.create(
			'height', display.size.height,
			'width', display.size.width
		);

	show = show_form.loading;

	ajaxPath = jion$path.empty.append( 'ajax' );

	userCreds = user_creds.createFromLocalStorage( );

	if( !userCreds ) userCreds = user_creds.createVisitor( );

	shell_root.create(
		'ajax',
			net_ajax.create(
				'path', ajaxPath,
				'twig:add', 'command',
					net_channel.create( 'path', ajaxPath.append( 'command' ) ),
				'twig:add', 'update',
					net_channel.create( 'path', ajaxPath.append( 'update' ) )
			),
		'animation', animation_root.create( ),
		'display', display,
		'doTracker', shell_doTracker.create( ),
		'link', net_link.create( ),
		'show', show,
		'spaceTransform', gleam_transform.normal,
		'systemFocus', true,
		'viewSize', display.size,
		'disc', shell_root._createDiscRoot( viewSize, show ),
		'form', shell_root._createFormRoot( viewSize ),
		'_drawn', false
	);

	root.link.auth( userCreds );
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
		show,
		spaceFabric,
		spaceRef,
		spaceTransform,
		userCreds,
		userSpaceList,
		viewSize;


	// sets drawn false
	if( !this.lookAlike( inherit ) )
	{
		this._drawn = false;
	}

	access = this.access;

	action = this.action;

	mark = this.mark;

	show = this.show;

	viewSize = this.viewSize;

	spaceTransform = this.spaceTransform;

	hover = this.hover;

	userCreds = this.userCreds;

	userSpaceList = this.userSpaceList;

	spaceRef = this.spaceRef;

	spaceFabric = this.spaceFabric;

/**/if( CHECK )
/**/{
/**/	if( hover && hover.isEmpty ) throw new Error( );
/**/}

	if(
		userCreds
		&& ( !inherit || !userCreds.equals( inherit.userCreds ) )
	)
	{
		if( !userCreds.isVisitor )
		{
			userCreds.saveToLocalStorage( );
		}
		else
		{
			if(
				root.spaceRef
				&& root.spaceRef.username !== 'ideoloom'
			)
			{
				root.moveToSpace( ref_space.ideoloomHome, false );
			}

			user_creds.clearLocalStorage( );

			this._visitorCreds = userCreds;
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
		|| userCreds !== inherit.userCreds
		|| userSpaceList !== inherit.userSpaceList
		|| show !== inherit.show
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
					'viewSize', viewSize
				);
		}

		this.form =
			this.form.create(
				'hover', hover,
				'mark', mark,
				'spaceRef', spaceRef,
				'user', userCreds,
				'userSpaceList', userSpaceList,
				'viewSize', viewSize
			);

		this.disc =
			this.disc.create(
				'access', access,
				'action', action,
				'controlTransform',
					gleam_transform.create(
						'zoom',
							Math.min(
							  viewSize.height / gruga_controls.designSize.height,
							  1
							),
						'offset', gleam_point.zero
					),
				'hover', hover,
				'mark', mark,
				'show', show,
				'spaceRef', spaceRef,
				'user', userCreds,
				'viewSize', viewSize
			);
	}

	this.link = this.link.create( 'userCreds', userCreds );

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
		changeList,
		changeWrap;

	if( a1.reflect === 'change_list' )
	{
		changeList = a1;
	}
	else if( Array.isArray( a1 ) )
	{
		changeList = change_list.create( 'list:init', a1 );
	}
	else
	{
		changeList =
			change_list.create(
				'list:init',
				Array.prototype.slice.apply( arguments )
			);
	}

	changeWrap =
		change_wrap.create(
			'cid', session_uid( ),
			'changeList', changeList
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
| Changes the space transform so p stays in the same spot
| on screen.
|
| new offset (ox1, oy1) calculates as:
|
| A: py = y * z0 + oy0
| B: py = y * z1 + oy1
|
| A: py / z0 = y + oy0 / z0
| B: py / z1 = y + oy1 / z1
|
| A - B: py / z0 - py / z1 = oy0 / z0 - oy1 / z1
|
| -> py * ( 1 / z0 - 1 / z1  ) = oy0 / z0 - oy1 / z1
|
| -> oy1 / z1 = oy0 / z0 - py * ( 1 / z0 - 1 / z1  )
|
| -> oy1 = z1 * ( oy0 / z0 - py * ( 1 / z0 - 1 / z1  ) )
|
*/
prototype.changeSpaceTransformPoint =
	function(
		de,  // difference of view zoom exponent
		p    // point to keep constant
	)
{
	var
		e1,
		h,
		offset,
		st,
		zoom;

	st = this.spaceTransform;

	offset = st.offset;

	e1 =
		math_limit(
			shell_settings.zoomMin,
			this._transformExponent + de,
			shell_settings.zoomMax
		);

	zoom = Math.pow( 1.1, e1 );

	h = 1 / st.zoom - 1 / zoom;

	this._changeTransformTo(
		e1,
		st.create(
			'offset',
				gleam_point.xy(
					( offset.x / st.zoom - p.x * h ) * zoom,
					( offset.y / st.zoom - p.y * h ) * zoom
				),
			'zoom', zoom
		),
		shell_settings.animationZoomStepTime
	);
};


/*
| Changes the zoom factor keeping current center
*/
prototype.changeSpaceTransformCenter =
	function(
		dir    // direction of zoom change (+/- 1)
	)
{
	root.changeSpaceTransformPoint( dir, root.viewSize.pc );
};


/*
| Changed the views so that all items of current space are visible.
*/
prototype.changeSpaceTransformAll =
	function( )
{
	var
		discWidth,
		exp,
		cx,
		cy,
		extra,
		item,
		pos,
		r,
		rZ,
		ex,
		ny,
		sy,
		wx,
		space,
		vsx,
		vsy,
		vsx2,
		vsy2,
		zoomMin,
		z;

	space = root.spaceVisual;

	rZ = space.length;

	if( rZ === 0 ) return;

	item = space.atRank( 0 );

	pos = item.pos || item.zone.pos;

	wx = pos.x;

	ny = pos.y;

	ex = wx + item.zone.width;

	sy = ny + item.zone.height;

	for( r = 1; r < rZ; r++ )
	{
		item = space.atRank( r );

		pos = item.pos || item.zone.pos;

		if( pos.x < wx ) wx = pos.x;

		if( pos.y < ny ) ny = pos.y;

		if( pos.x + item.zone.width > ex ) ex = pos.x + item.zone.width;

		if( pos.y + item.zone.height > sy ) sy = pos.y + item.zone.height;
	}

	// center
	cx = ( ex + wx ) / 2;

	cy = ( ny + sy ) / 2;

	discWidth = root.disc.get( 'mainDisc' ).tZone.width;

	vsx = root.viewSize.width - discWidth;

	vsy = root.viewSize.height;

	vsx2 = vsx / 2;

	vsy2 = vsy / 2;

	zoomMin = shell_settings.zoomMin;
	for( exp = shell_settings.zoomMax; exp > zoomMin; exp-- )
	{
		z = Math.pow( 1.1, exp );

		extra = 10 / z;

		if( ex + extra > cx + vsx2 / z ) continue;

		if( wx - extra < cx - vsx2 / z ) continue;

		if( sy + extra > cy + vsy2 / z ) continue;

		if( ny - extra < cy - vsy2 / z ) continue;

		break;
	}

	root._changeTransformTo(
		exp,
		gleam_transform.create(
			'offset',
				gleam_point.xy(
					vsx2 - cx * z + discWidth,
					vsy2 - cy * z
				),
			'zoom', z
		),
		shell_settings.animationZoomAllHomeTime
	);
};


/*
| Changed the views zoom to 1 and pans to home.
*/
prototype.changeSpaceTransformHome =
	function( )
{
	root._changeTransformTo(
		0,
		gleam_transform.normal,
		shell_settings.animationZoomAllHomeTime
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
		bubble,
		screen;

	screen = root._currentScreen;

	if( !screen ) return;

	if( screen.showDisc )
	{
		bubble = root.disc.dragMove( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	screen.dragMove( p, shift, ctrl );
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

	if( !screen ) return;

	if( screen.showDisc )
	{
		bubble = root.disc.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	screen.dragStart( p, shift, ctrl );
};


/*
| A button has been dragStarted.
*/
prototype.dragStartButton =
	function( path )
{
	switch( path.get( 0 ) )
	{
		case 'disc' :

			return root.disc.dragStartButton( path, false, false );

		case 'form' :

			return root.form.dragStartButton( path, false, false );

		default :

			throw new Error( 'invalid path' );
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
		bubble,
		screen;

	screen = root._currentScreen;

	if( !screen ) return;

	if( screen.showDisc )
	{
		bubble = root.disc.dragStop( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	screen.dragStop( p, shift, ctrl );
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
	var
		link;

	// clears the user spaces list
	link = root.link.create( 'refMomentUserSpaceList', undefined );
	
	if( root._visitorCreds )
	{
		root.create(
			'userCreds', root._visitorCreds,
			'userSpaceList', undefined,
			'link', link
		);

		root.moveToSpace( ref_space.ideoloomHome, false );

		return;
	}
	else
	{
		root.create(
			'userSpaceList', undefined,
			'link', link
		);
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
		spaceRef,     // reference of type ref_space
		createMissing // if true, non-existing spaces are to be created
	)
{

	root.create(
		'fallbackSpaceRef', this.spaceRef,
		'show', show_form.loading,
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
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
prototype.probeClickDrag =
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
		bubble = root.disc.probeClickDrag( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

//	FUTURE
//	if( screen ) screen.probeClickDrag( p, shift, ctrl );

	return 'atween';
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
		'show',
			root.spaceVisual
			? show_normal.create( )
			: show_form.loading
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
		size    // a gleam_size jion
	)
{
	root.create(
		'display',
			this.display.create(
				'size', size
			),
		'viewSize', size
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
		show;

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

			root.create( 'show', show_form.nonExistingSpace );

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

			root.create( 'show', show_form.noAccessToSpace );

			return;

		default :

			system.failScreen( 'Unknown acquireSpace( ) status' );

			return;
	}

	access = reply.access;

	show = root.show;

	root.create(
		'access', access,
		'show',
			( show.reflect === 'show_form' && show.formName === 'loading' )
			? show_normal.create( )
			: pass,
		'mark', undefined,
		'spaceFabric', reply.space,
		'spaceRef', request.spaceRef
	);
};


/*
| Received an 'auth' reply.
*/
prototype.onAuth =
	function(
		wasVisitor,   // if true this was a visitor account requested
		reply
	)
{
	var
		show,
		userSpaceList;

	userSpaceList = reply.userSpaceList;

	if( userSpaceList )
	{
		root.create(
			'userSpaceList', userSpaceList.current,
			'link',
				root.link.create(
					'refMomentUserSpaceList',
					userSpaceList.refMoment( reply.userCreds.name )
				)
		);
	}
	else
	{
		root.create( 'userSpaceList', undefined );
	}


	show = root.show;

	// if in login form this is a tempted login
	if( show.reflect === 'show_form' && show.formName === 'login' )
	{
		root.form.get( 'login' ).onAuth( reply );

		return;
	}

	// otherwise this is an onload login
	// or logout.

	if( reply.reflect !== 'reply_auth' )
	{
		// when logging in with a real user failed
		// take a visitor instead
		if( !wasVisitor )
		{
			root.link.auth( user_creds.createVisitor( ) );

			return;
		}

		// if even that failed, bail to failScreen
		system.failScreen( reply.message );

		return;
	}

	root.create( 'userCreds', reply.userCreds );

	root.moveToSpace( ref_space.ideoloomHome, false );
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
		|| action.reflect !== 'show_form'
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

	for( r = r1; r < r2; r++ )
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
		pos,
		val;

	line = gleam_connect.line( item1.shape, item2.shape );

	pos = line.pc.sub( gruga_relation.spawnOffset );

	val =
		fabric_relation.create(
			'pos', pos,
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
| When animations are turned of, but the action has
| an finishAnimation a time is used instead an this
| is the callback.
*/
notAnimationFinish =
	function( )
{
	var
		action;

	action = root.action;

	if( !action ) return;

	if( !action.finishAnimation ) return;

	action.finishAnimation( );
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
		show;

	show = this.show;

	switch( show.reflect )
	{
		case 'show_create' :
		case 'show_normal' :
		case 'show_zoom' :

			return root.spaceVisual;

		case 'show_form' :

			return root.form.get( show.formName );

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
		arr,
		disc,
		display,
		screen;

/**/if( CHECK )
/**/{
/**/	if( this !== root ) throw new Error( );
/**/}

	if( root._drawn ) return;

	display = root.display;

	screen = root._currentScreen;

	arr = [ screen.glint ];

	if( screen.showDisc )
	{
		disc = root.disc;

		arr[ 1 ] = disc.glint;
	}

	display =
		display.create(
			'glint', gleam_glint_list.create( 'list:init', arr )
		);

	display.render( );

	root =
		root.create(
			'display', display,
			'_drawn', true
		);
};


/*
| Creates the disc root.
*/
shell_root._createDiscRoot =
	function(
		viewSize,
		show
	)
{
	var
		twPath,
		path;

	path = jion$path.empty.append( 'disc' );

	twPath = path.append( 'twig' );

	return(
		disc_root.create(
			'controlTransform', gleam_transform.normal,
			'path', path,
			'show', show,
			'viewSize', viewSize,
			'twig:add', 'mainDisc',
				gruga_mainDisc.abstract(
					'path', twPath.append( 'mainDisc' )
				),
			'twig:add', 'createDisc',
				gruga_createDisc.abstract(
					'path', twPath.append( 'createDisc' )
				),
			'twig:add', 'zoomDisc',
				gruga_zoomDisc.abstract(
					'path', twPath.append( 'zoomDisc' )
				)
		)
	);
};


/*
| Creates the form root.
*/
shell_root._createFormRoot =
	function(
		viewSize
	)
{
	var
		a,
		aZ,
		form,
		formRoot,
		forms,
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
							'transform', gleam_transform.normal
						)
					);
			}
		}

		forms[ name ] = form;
	}

	formRoot =
		form_root.create(
			'path', jion$path.empty.append( 'form' ),
			'viewSize', viewSize
		);

	keys = Object.keys( forms );

	// FUTURE do a twig:init instead
	for( a = 0, aZ = keys.length; a < aZ; a++ )
	{
		key = keys[ a ];

		formRoot =
			formRoot.create(
				'twig:add',
				key,
				forms[ key ].create(
					'viewSize', viewSize
				)
			);
	}

	return formRoot;
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


/*
| Changes the space transform to transform.
| Possibly with an animation.
*/
prototype._changeTransformTo =
	function(
		exp,         // exponent of destination transform
		transform,   // destination transform
		time         // time of animation
	)
{
	if( shell_settings.animation )
	{
		root.create(
			'_transformExponent', exp,
			'animation',
				root.animation.create(
					'twig:set+', 'transform',
						animation_transform.createNow( transform, time )
				)
		);
	}
	else
	{
		root.create(
			'_transformExponent', exp,
			'spaceTransform', transform
		);

		if( root.action.finishAnimation )
		{
			system.setTimer(
				time,
				notAnimationFinish
			);
		}
	}
};


} )( );
