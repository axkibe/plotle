/*
| The root of the user shell.
*/
'use strict';


// FIXME
var
	action_dragItems,
	action_resizeItems,
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
	math_limit,
	net_ajax,
	net_channel,
	net_link,
	ref_space,
	result_hover,
	reply_auth,
	reply_error,
	root,
	session_uid,
	shell_doTracker,
	shell_settings,
	show_create,
	show_form,
	show_normal,
	show_zoom,
	system,
	user_creds,
	visual_mark_caret,
	visual_mark_range,
	visual_space;

root = undefined;


tim.define( module, 'shell_root', ( def, shell_root ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		access :
		{
			// access level to current space
			type : [ 'undefined', 'string' ]
		},
		action :
		{
			// current action
			type :
				require( '../action/typemap' )
				.concat( [ 'undefined' ] ),
			prepare : 'shell_root.prepareAction( action )'
		},
		ajax :
		{
			// the ajax communication
			type : 'net_ajax'
		},
		animation :
		{
			// the animations
			type : 'animation_root'
		},
		disc :
		{
			// the discs
			type : 'disc_root'
		},
		display :
		{
			// the display within everything happens
			type : 'gleam_display_canvas'
		},
		doTracker :
		{
			// the un/re/do tracker
			type : 'shell_doTracker'
		},
		fallbackSpaceRef :
		{
			// fallback to this space if loading another failed
			type : [ 'undefined', 'ref_space' ]
		},
		form :
		{
			// the forms
			type : 'form_root'
		},
		hover :
		{
			// current hovered item
			type : [ 'undefined', 'tim$path' ]
		},
		link :
		{
			// the link to the server
			type : 'net_link'
		},
		mark :
		{
			// the users mark
			type :
				require( '../visual/mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		show :
		{
			// currently form/disc shown
			type : require ( '../show/typemap' )
		},
		spaceFabric :
		{
			// current space data
			type : [ 'undefined', 'fabric_space' ]
		},
		spaceRef :
		{
			// reference to current space
			type : [ 'undefined', 'ref_space' ]
		},
		spaceTransform :
		{
			// current space transform
			type : 'gleam_transform'
		},
		spaceVisual :
		{
			// current space visualisation
			type : [ 'undefined', 'visual_space' ]
		},
		systemFocus :
		{
			// shell has system focus
			type : 'boolean'
		},
		userCreds :
		{
			// current user credentials
			type : [ 'undefined', 'user_creds' ]
		},
		userSpaceList :
		{
			// the list of space references the user has
			type : [ 'undefined', 'ref_spaceList' ]
		},
		viewSize :
		{
			// current view size
			type : 'gleam_size'
		},
		_transformExponent :
		{
			// transform zoom as power of 1.1
			type : 'number',
			defaultValue : '0'
		},
		_drawn :
		{
			// this root has been drawn on display
			type : 'boolean'
		},
		_visitorCreds :
		{
			// remembers an acquired visitor user name and
			// passhash so when logging out from a real user
			// the previous visitor id is regained.
			// last acquired visitor credentials
			type : [ 'undefined', 'user_creds' ]
		}
	};

	def.init = [ 'inherit' ];

	def.alike =
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
	};
}


const loadingSpaceTextPath =
	tim.path.empty
	.append( 'form' )
	.append( 'twig' )
	.append( 'loading' )
	.append( 'twig' )
	.append( 'spaceText' )
	.append( 'text' );


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Prepares the current action.
|
| Makes sure the action has not any removed items in them.
| If so the paths are removed from its itemPathsList.
|
| If no item is left, action is set to undefined.
*/
def.static.prepareAction =
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

	switch( action.timtype )
	{
		case action_dragItems :
		case action_resizeItems :

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
							tim.pathList.create( 'list:init', nPaths )
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
def.static.startup =
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
/**/	// singleton
/**/	if( root ) throw new Error( );
/**/}

	canvas = document.createElement( 'canvas' );

	viewSize =
		gleam_size.create(
			'height', display.size.height,
			'width', display.size.width
		);

	show = show_form.loading;

	ajaxPath = tim.path.empty.append( 'ajax' );

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
| Creates the disc root.
*/
def.static._createDiscRoot =
	function(
		viewSize,
		show
	)
{
	const path = tim.path.empty.append( 'disc' );

	const twPath = path.append( 'twig' );

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
def.static._createFormRoot =
	function(
		viewSize
	)
{
	const forms =
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

	for( let name in forms )
	{
		let form = forms[ name ];

		for( let w = 0, wZ = form.length; w < wZ; w++ )
		{
			const key = form.getKey( w );

			const widget = form.get( key );

			if( widget.isAbstract )
			{
				form =
					form.abstract(
						'twig:set',
						key,
						widget.create( 'transform', gleam_transform.normal )
					);
			}
		}

		forms[ name ] = form;
	}

	let formRoot =
		form_root.create(
			'path', tim.path.empty.append( 'form' ),
			'viewSize', viewSize
		);

	const keys = Object.keys( forms );

	// FUTURE do a twig:init instead
	for( let a = 0, aZ = keys.length; a < aZ; a++ )
	{
		const key = keys[ a ];

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
| Initializer.
*/
def.func._init =
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

	if( mark && mark.timtype === visual_mark_caret )
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

		this.form =
			this.form.create(
				'action', action,
				'hover', hover,
				'mark', mark,
				'spaceRef', spaceRef,
				'user', userCreds,
				'userSpaceList', userSpaceList,
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


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Returns the attention center.
|
| That is the horiziontal offset of the caret.
|
| Used for example on the iPad so
| the caret is scrolled into view
| when the keyboard is visible.
*/
def.lazy.attentionCenter =
	function( )
{
	var
		screen;

	screen = root._currentScreen;

	return screen && screen.attentionCenter;
};


/*
| Returns the what the clipboard should hold.
*/
def.lazy.clipboard =
	function( )
{
	const mark = this.mark;

	return mark ? mark.clipboard : '';
};


/*
| Returns current screen
|
| This is either a fabric space or a form
*/
def.lazy._currentScreen =
	function( )
{
	const show = this.show;

	switch( show.timtype )
	{
		case show_create :
		case show_normal :
		case show_zoom :

			return root.spaceVisual;

		case show_form :

			return root.form.get( show.formName );

		default : throw new Error( );
	}
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Alters the tree.
|
| Feeds the doTracker.
*/
def.func.alter =
	function(
		a1 // change, several changes or array of changes
		// // ...
	)
{
	let changeList;

	if( a1.timtype === change_list )
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

	const changeWrap =
		change_wrap.create(
			'cid', session_uid( ),
			'changeList', changeList
		);

	root.link.alter( changeWrap );

	root.doTracker.track( changeWrap );
};


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
def.func.changeSpaceTransformPoint =
	function(
		de,  // difference of view zoom exponent
		p    // point to keep constant
	)
{
	const st = this.spaceTransform;

	const offset = st.offset;

	const e1 =
		math_limit(
			shell_settings.zoomMin,
			this._transformExponent + de,
			shell_settings.zoomMax
		);

	const zoom = Math.pow( 1.1, e1 );

	const h = 1 / st.zoom - 1 / zoom;

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
def.func.changeSpaceTransformCenter =
	function(
		dir    // direction of zoom change (+/- 1)
	)
{
	root.changeSpaceTransformPoint( dir, root.viewSize.pc );
};


/*
| Changed the views so that all items of current space are visible.
*/
def.func.changeSpaceTransformAll =
	function( )
{
	const space = root.spaceVisual;

	const rZ = space.length;

	if( rZ === 0 ) return;

	let item = space.atRank( 0 );

	let pos = item.pos || item.zone.pos;

	let wx = pos.x;

	let ny = pos.y;

	let ex = wx + item.zone.width;

	let sy = ny + item.zone.height;

	for( let r = 1; r < rZ; r++ )
	{
		item = space.atRank( r );

		pos = item.pos || item.zone.pos;

		if( pos.x < wx ) wx = pos.x;

		if( pos.y < ny ) ny = pos.y;

		if( pos.x + item.zone.width > ex ) ex = pos.x + item.zone.width;

		if( pos.y + item.zone.height > sy ) sy = pos.y + item.zone.height;
	}

	// center
	const cx = ( ex + wx ) / 2;

	const cy = ( ny + sy ) / 2;

	const discWidth = root.disc.get( 'mainDisc' ).tZone.width;

	const vsx = root.viewSize.width - discWidth;

	const vsy = root.viewSize.height;

	const vsx2 = vsx / 2;

	const vsy2 = vsy / 2;

	const zoomMin = shell_settings.zoomMin;

	let exp;

	let z;

	for( exp = shell_settings.zoomMax; exp > zoomMin; exp-- )
	{
		z = Math.pow( 1.1, exp );

		const extra = 10 / z;

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
def.func.changeSpaceTransformHome =
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
def.func.click =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	const bubble = root.disc.click( p, shift, ctrl );

	// if bubble === false do not bubble
	if( bubble !== undefined ) return bubble;

	return screen.click( p, shift, ctrl );
};


/*
| Clears the carets retainx info.
*/
def.func.clearRetainX =
	function( )
{
	const mark = this.mark;

	if( mark.retainx !== undefined )
	{
		this.create( 'mark', mark.create( 'retainx', undefined ) );
	}
};


/*
| Cycles focus in a form.
*/
def.func.cycleFormFocus =
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
def.func.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( !screen ) return;

	if( screen.showDisc )
	{
		const bubble = root.disc.dragMove( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	screen.dragMove( p, shift, ctrl );
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
def.func.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( !screen ) return;

	if( screen.showDisc )
	{
		const bubble = root.disc.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	screen.dragStart( p, shift, ctrl );
};


/*
| A button has been dragStarted.
*/
def.func.dragStartButton =
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
def.func.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( !screen ) return;

	if( screen.showDisc )
	{
		const bubble = root.disc.dragStop( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	screen.dragStop( p, shift, ctrl );
};


/*
| User entered normal text (one character or more).
*/
def.func.input =
	function(
		text
	)
{
	const screen = root._currentScreen;

	if( screen )
	{
		screen.input( text );

		if( root.spaceVisual ) root.spaceVisual.scrollMarkIntoView( );
	}
};


/*
| Logs out the current user
*/
def.func.logout =
	function( )
{
	// clears the user spaces list
	const link = root.link.create( 'refMomentUserSpaceList', undefined );

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
def.func.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen && screen.showDisc )
	{
		const bubble = root.disc.mousewheel( p, dir, shift, ctrl );

		if( bubble ) return bubble;
	}

	if( screen ) screen.mousewheel( p, dir, shift, ctrl );
};


/*
| Moves to space with the name name.
|
| if spaceRef is undefined reloads current space
*/
def.func.moveToSpace =
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
| User is hovering his/her pointing device.
*/
def.func.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen && screen.showDisc )
	{
		const result = root.disc.pointingHover( p, shift, ctrl );

		if( result )
		{
/**/		if( CHECK )
/**/		{
/**/			if( result.timtype !== result_hover ) throw new Error( );
/**/		}

			root.create( 'hover', result.path );

			return result.cursor;
		}
	}

	if( screen )
	{
		const result = screen.pointingHover( p, shift, ctrl );

/**/	if( CHECK )
/**/	{
/**/		if( result.timtype !== result_hover ) throw new Error( );
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
def.func.probeClickDrag =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen && screen.showDisc )
	{
		const bubble = root.disc.probeClickDrag( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

//	FUTURE
//	if( screen ) screen.probeClickDrag( p, shift, ctrl );

	return 'atween';
};


/*
| A button has been pushed.
*/
def.func.pushButton =
	function(
		path   // path of the button pushed
	)
{
	switch( path.get( 0 ) )
	{
		case 'disc' : return root.disc.pushButton( path, false, false );

		case 'form' : return root.form.pushButton( path, false, false );

		default : throw new Error( 'invalid path' );
	}
};


/*
| Shows the "home" screen.
|
| When a space is loaded, this is space/normal
| otherwise it is the loading screen.
*/
def.func.showHome =
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
def.func.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	if( key === 'shift' )
	{
		const action = this.action;

		if( !action )
		{
			root.create( 'action', action_select.create( ) );
		}

		return true;
	}

	const screen = root._currentScreen;

	const result = screen && screen.specialKey( key, shift, ctrl );

	if( root.spaceVisual ) root.spaceVisual.scrollMarkIntoView( );

	return result;
};


/*
| User is releasing a special key.
*/
def.func.releaseSpecialKey =
	function(
		key
//		shift,
//		ctrl
	)
{
	if( key !== 'shift' ) return;

	const action = this.action;

	if(
		action
		&& action.timtype === action_select
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
def.func.suggestingKeyboard =
	function( )
{
	return this.mark && this.mark.hasCaret;
};


/*
| The link is reporting updates.
*/
def.func.update =
	function(
		changes
	)
{
	let mark = this.mark;

	if( !mark ) return;

	switch( mark.timtype )
	{
		case visual_mark_range :

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
def.func.resize =
	function(
		size    // of type gleam_size
	)
{
	root.create(
		'display', this.display.create( 'size', size ),
		'viewSize', size
	);
};


/*
| Receiving a moveTo event
*/
def.func.onAcquireSpace =
	function(
		request,
		reply
	)
{
	if( reply.timtype === reply_error )
	{
		system.failScreen( 'Error on acquire space: ' + reply.message );

		return;
	}

	switch( reply.status )
	{
		case 'served' : break;

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

	const access = reply.access;

	const show = root.show;

	root.create(
		'access', access,
		'show',
			( show.timtype === show_form && show.formName === 'loading' )
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
def.func.onAuth =
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
					'refMomentUserSpaceList', userSpaceList.refMoment( reply.userCreds.name ),
					'userSpaceList', userSpaceList
				)
		);
	}
	else
	{
		root.create(
			'userSpaceList', undefined,
			'link',
				root.link.create(
					'refMomentUserSpaceList', undefined,
					'userSpaceList', undefined
				)
		);
	}


	show = root.show;

	// if in login form this is a tempted login
	if( show.timtype === show_form && show.formName === 'login' )
	{
		root.form.get( 'login' ).onAuth( reply );

		return;
	}

	// otherwise this is an onload login
	// or logout.

	if( reply.timtype !== reply_auth )
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
def.func.onRegister =
	function(
		request,
		reply
	)
{
	const show = root.show;

	// if not in signup form this came out of band.
	if(
		!show
		|| show.timtype !== show_form
		|| show.formName !== 'signUp'
	)
	{
		console.log( 'ignoring a register reply, since out of signup form' );

		return;
	}

	root.form.get( 'signUp' ).onRegister( request, reply );
};


/*
| Removes a text spawning over several entities.
*/
def.func.removeRange =
	function(
		range
	)
{
	const frontMark = range.frontMark;

	const backMark = range.backMark;

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

	const changes = [ ];

	const k1 = frontMark.path.get( -2 );

	const k2 = backMark.path.get( -2 );

	const pivot =
		root.spaceFabric.getPath(
			frontMark.path.chop.shorten.shorten.shorten
		);

	const r1 = pivot.rankOf( k1 );

	const r2 = pivot.rankOf( k2 );

	let text =
		root.spaceFabric.getPath(
			frontMark.path.chop
		);

	let ve;

	for( let r = r1; r < r2; r++ )
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
def.func.spawnRelation =
	function(
		item1,
		item2
	)
{
	const line = gleam_connect.line( item1.shape, item2.shape );

	const pos = line.pc.sub( gruga_relation.spawnOffset );

	const val =
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

	const key = session_uid( );

	root.alter(
		change_grow.create(
			'val', val,
			'path', tim.path.empty.append( 'twig' ).append( key ),
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
const notAnimationFinish =
	function( )
{
	const action = root.action;

	if( !action ) return;

	if( !action.finishAnimation ) return;

	action.finishAnimation( );
};


/*
| Draws everything.
*/
def.func.draw =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this !== root ) throw new Error( );
/**/}

	if( root._drawn ) return;

	let display = root.display;

	const screen = root._currentScreen;

	const arr = [ screen.glint ];

	if( screen.showDisc )
	{
		const disc = root.disc;

		arr[ 1 ] = disc.glint;
	}

	display =
		display.create(
			'glint', gleam_glint_list.create( 'list:init', arr )
		);

	display.render( );

	root.create(
		'display', display,
		'_drawn', true
	);
};


/*
| Sends out update/check notifications when an item
| is no longer in the user marked.
*/
def.func._markLostNotifications =
	function(
		nMark,  // new mark
		oMark   // old mark
	)
{
	if( !oMark ) return;

	const oip = oMark.itemPaths;

	if( !oip ) return;

	const nip = nMark && nMark.itemPaths;

	for( let a = 0, aZ = oip.length; a < aZ; a++ )
	{
		const op = oip.get( a );

		if( nip && nip.contains( op ) ) continue;

		const item = root.getPath( op );

		if( !item ) continue;

		item.markLost( );
	}
};


/*
| Changes the space transform to transform.
| Possibly with an animation.
*/
def.func._changeTransformTo =
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
					'twig:set+', 'transform', animation_transform.createNow( transform, time )
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


} );
