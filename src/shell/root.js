/*
| The root of the user shell.
*/
'use strict';


tim.define( module, ( def, shell_root ) => {


if( TIM )
{
	def.attributes =
	{
		// access level to current space
		access : { type : [ 'undefined', 'string' ] },

		// current action
		action : { type : [ '< ../action/types' ] },

		// the ajax communication
		ajax : { type : '../net/ajax' },

		// the discs
		disc : { type : '../disc/root' },

		// the display within everything happens
		display : { type : '../gleam/display/canvas' },

		// the un/re/do tracker
		doTracker : { type : './doTracker' },

		// fallback to this space if loading another failed
		fallbackSpaceRef : { type : [ 'undefined', '../ref/space' ] },

		// the forms
		form : { type : '../form/root' },

		// current hovered item
		hover : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		// the link to the server
		link : { type : '../net/link' },

		// currently form/disc shown
		show : { type : [ '< ../show/types' ] },

		// current space data
		spaceFabric : { type : [ 'undefined', '../fabric/space' ] },

		// reference to current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// current space transform
		spaceTransform : { type : '../gleam/transform' },

		// current space visualisation
		spaceVisual : { type : [ 'undefined', '../visual/space' ] },

		// current user credentials
		userCreds : { type : [ 'undefined', '../user/creds' ] },

		// the list of space references the user has
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ] },

		// current view size
		viewSize : { type : '../gleam/size' },

		// the animations
		_animation : { type : '../animation/root' },

		// the users mark
		_mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// shell has system focus
		_systemFocus : { type : 'boolean' },

		// transform zoom as power of 1.1
		_transformExponent : { type : 'number', defaultValue : '0' },

		// remembers an acquired visitor user name and
		// passhash so when logging out from a real user
		// the previous visitor id is regained.
		// last acquired visitor credentials
		_visitorCreds : { type : [ 'undefined', '../user/creds' ] },
	};

	def.alike =
	{
		lookAlike :
		{
			ignores :
			{
				'ajax' : true,
				'display' : true,
				'link' : true,
			}
		}
	};

	def.global = 'root';
}


const animation_root = require( '../animation/root' );

const animation_transform = require( '../animation/transform' );

const action_dragItems = require( '../action/dragItems' );

const action_none = require( '../action/none' );

const action_resizeItems = require( '../action/resizeItems' );

const action_select = require( '../action/select' );

const change_grow = require( '../change/grow' );

const change_join = require( '../change/join' );

const change_list = require( '../change/list' );

const change_remove = require( '../change/remove' );

const change_wrap = require( '../change/wrap' );

const disc_root = require( '../disc/root' );

const disc_create = require( '../disc/create' );

const disc_main = require( '../disc/main' );

const disc_zoom = require( '../disc/zoom' );

const fabric_doc = require( '../fabric/doc' );

const fabric_para = require( '../fabric/para' );

const fabric_relation = require( '../fabric/relation' );

const form_loading = require( '../form/loading' );

const form_login = require( '../form/login' );

const form_moveTo = require( '../form/moveTo' );

const form_noAccessToSpace = require( '../form/noAccessToSpace' );

const form_nonExistingSpace = require( '../form/nonExistingSpace' );

const form_root = require( '../form/root' );

const form_signUp = require( '../form/signUp' );

const form_space = require( '../form/space' );

const form_user = require( '../form/user' );

const form_welcome = require( '../form/welcome' );

const gleam_connect = require( '../gleam/connect' );

const gleam_display_canvas = require( '../gleam/display/canvas' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_point = require( '../gleam/point' );

const gleam_transform = require( '../gleam/transform' );

const gruga_controls = require( '../gruga/controls' );

const gruga_disc_create = require( '../gruga/disc/create' );

const gruga_loading = require( '../gruga/loading' );

const gruga_login = require( '../gruga/login' );

const gruga_disc_main = require( '../gruga/disc/main' );

const gruga_moveTo = require( '../gruga/moveTo' );

const gruga_noAccessToSpace = require( '../gruga/noAccessToSpace' );

const gruga_nonExistingSpace = require( '../gruga/nonExistingSpace' );

const gruga_relation = require( '../gruga/relation' );

const gruga_signUp = require( '../gruga/signUp' );

const gruga_space = require( '../gruga/space' );

const gruga_user = require( '../gruga/user' );

const gruga_welcome = require( '../gruga/welcome' );

const gruga_disc_zoom = require( '../gruga/disc/zoom' );

const limit = require( '../math/root' ).limit;

const net_ajax = require( '../net/ajax' );

const net_channel = require( '../net/channel' );

const net_link = require( '../net/link' );

const ref_space = require( '../ref/space' );

const result_hover = require( '../result/hover' );

const reply_auth = require( '../reply/auth' );

const reply_error = require( '../reply/error' );

const session_uid = require( '../session/uid' );

const shell_doTracker = require( './doTracker' );

const shell_settings = require( './settings' );

const show_create = require( '../show/create' );

const show_form = require( '../show/form' );

const show_normal = require( '../show/normal' );

const show_zoom = require( '../show/zoom' );

const tim_path = require( 'tim.js/src/path/path' );

const tim_pathList = require( 'tim.js/src/path/list' );

const user_creds = require( '../user/creds' );

const visual_mark_caret = require( '../visual/mark/caret' );

const visual_mark_range = require( '../visual/mark/range' );

const visual_space = require( '../visual/space' );

const widget_factory = require( '../widget/factory' );


const loadingSpaceTextPath =
	tim_path.empty
	.append( 'form' )
	.append( 'twig' )
	.append( 'loading' )
	.append( 'twig' )
	.append( 'spaceText' )
	.append( 'text' );


/*
| When animations are turned off, but the action has
| an finishAnimation a time is used instead an this
| is the callback.
*/
const notAnimationFinish =
	function( )
{
	const action = root.action;

	if( !action.finishAnimation ) return;

	action.finishAnimation( );
};




/*
| Startup of shell.
*/
def.static.startup =
	function(
		display
	)
{
/**/if( CHECK )
/**/{
/**/	// singleton
/**/	if( root ) throw new Error( );
/**/}

	const viewSize = display.size;

	const show = show_form.loading;

	const ajaxPath = tim_path.empty.append( 'ajax' );

	let userCreds = user_creds.createFromLocalStorage( );

	if( !userCreds ) userCreds = user_creds.createVisitor( );

	shell_root.create(
		'action', action_none.create( ),
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
		'show', show,
		'spaceTransform', gleam_transform.normal,
		'viewSize', display.size,
		'disc', shell_root._createDiscRoot( viewSize, show ),
		'form', shell_root._createFormRoot( viewSize ),
		'_animation', animation_root.create( ),
		'_systemFocus', true
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
	const path = tim_path.empty.append( 'disc' );

	const twPath = path.append( 'twig' );

	return(
		disc_root.create(
			'action', action_none.create( ),
			'controlTransform', gleam_transform.normal,
			'path', path,
			'show', show,
			'viewSize', viewSize,
			'twig:add', 'main',
				disc_main.createFromLayout(
					gruga_disc_main.layout,
					twPath.append( 'main' ),
					gleam_transform.normal,
					show,
					viewSize
				),
			'twig:add', 'create',
				disc_create.createFromLayout(
					gruga_disc_create.layout,
					twPath.append( 'create' ),
					gleam_transform.normal,
					show,
					viewSize
				),
			'twig:add', 'zoom',
				disc_zoom.createFromLayout(
					gruga_disc_zoom.layout,
					twPath.append( 'zoom' ),
					gleam_transform.normal,
					show,
					viewSize
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
	const formLayouts =
	{
		loading : [ gruga_loading.layout, form_loading ],
		login : [ gruga_login.layout, form_login ],
		moveTo : [ gruga_moveTo.layout, form_moveTo ],
		noAccessToSpace : [ gruga_noAccessToSpace.layout, form_noAccessToSpace ],
		nonExistingSpace : [ gruga_nonExistingSpace.layout, form_nonExistingSpace ],
		signUp : [ gruga_signUp.layout, form_signUp ],
		space : [ gruga_space.layout, form_space ],
		user : [ gruga_user.layout, form_user ],
		welcome : [ gruga_welcome.layout, form_welcome ],
	};

	let forms = { };

	const formRootPath = tim_path.empty.append( 'form' );

	// FIXME move this from layout creation to form.root

	for( let name in formLayouts )
	{
		const entry = formLayouts[ name ];

		const layout = entry[ 0 ];

		const formPath = formRootPath.append( 'twig' ).append( name );

		const twig = { };

		for( let w = 0, wZ = layout.length; w < wZ; w++ )
		{
			const key = layout.getKey( w );

			const wLayout = layout.get( key );

			const path = formPath.append( 'twig' ).append( key );

			twig[ key ] =
				widget_factory.createFromLayout( wLayout, path, gleam_transform.normal );

		}

		forms[ name ] =
			entry[ 1 ].create(
				'action', action_none.create( ),
				'viewSize', viewSize,
				'twig:init', twig, layout._ranks
			);
	}

	let formRoot =
		form_root.create(
			'action', action_none.create( ),
			'path', formRootPath,
			'viewSize', viewSize
		);

	const keys = Object.keys( forms );

	// FUTURE do a twig:init instead
	for( let a = 0, al = keys.length; a < al; a++ )
	{
		const key = keys[ a ];

		formRoot =
			formRoot.create(
				'twig:add', key,
				forms[ key ].create( 'viewSize', viewSize )
			);
	}

	return formRoot;
};


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		const hover = this.hover;
/**/
/**/		if( hover && hover.isEmpty ) throw new Error( );
/**/	};
/**/}


/*
| Adjusts the current action.
|
| Makes sure the action has not any removed items in them.
| If so the paths are removed from its itemPathsList.
|
| If no item is left, action is set to none.
*/
def.adjust.action =
	function(
		action
	)
{
	switch( action.timtype )
	{
		case action_none : return action;

		case action_dragItems :
		case action_resizeItems :
		{
			const fabric = this.spaceFabric;

			const iPaths = action.itemPaths;

			if( iPaths )
			{
				let p, pl;

				for( p = 0, pl = iPaths.length; p < pl; p++ )
				{
					const path = iPaths.get( p );

					if( path.get( 0 ) === 'spaceVisual' &&
						!fabric.get( path.get( 2 ) )
					) break;
				}

				if( p < pl )
				{
					// there is an item missing!
					const nPaths = [ ];

					// first copies over already checked items.

					let p2;

					for( p2 = 0; p2 < p; p2++ )
					{
						nPaths[ p2 ] = iPaths.get( p2 );
					}

					p++; // the last item was a guaranteed skip

					for( ; p < pl; p++ )
					{
						const path = iPaths.get( p );

						if( path.get( 0 ) === 'spaceVisual' &&
							!fabric.get( path.get( 2 ) )
						) continue;

						nPaths[ p2++ ] = path;
					}

					if( p2 === 0 ) return undefined;

					return(
						action.create(
							'itemPaths', tim_pathList.create( 'list:init', nPaths )
						)
					);
				}

				return action;
			}
		}
	}

	return action;
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
def.lazy.attentionCenter = ( ) =>
	root._currentScreen.attentionCenter;


/*
| Adjusts the disc.
*/
def.adjust.disc =
	function(
		disc
	)
{
	const zoom = Math.min( this.viewSize.height / gruga_controls.designSize.height, 1 );

	const ctransform =
		gleam_transform.create(
			'zoom', zoom,
			'offset', gleam_point.zero
		);

	return(
		disc.create(
			'access', this.access,
			'action', this.action,
			'controlTransform', ctransform,
			'hover', this.hover,
			'mark', this._mark,
			'show', this.show,
			'spaceRef', this.spaceRef,
			'user', this.userCreds,
			'viewSize', this.viewSize
		)
	);
};


/*
| Draws everything.
*/
def.lazy.draw =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this !== root ) throw new Error( );
/**/}

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

	root.create( 'display', display );

	return true;
};


/*
| No need to redraw if this root looks alike it's parent
*/
def.inherit.draw =
	function(
		inherit
	)
{
	return this.lookAlike( inherit );
};


/*
| Adjusts the form root.
*/
def.adjust.form =
	function(
		form
	)
{
	return(
		form.create(
			'action', this.action,
			'hasGrid', this.spaceFabric && this.spaceFabric.hasGrid,
			'hasSnapping', this.spaceFabric && this.spaceFabric.hasSnapping,
			'hover', form_root.concernsHover( this.hover ),
			'mark', form_root.concernsMark( this._mark ),
			'spaceRef', this.spaceRef,
			'user', this.userCreds,
			'userSpaceList', this.userSpaceList,
			'viewSize', this.viewSize
		)
	);
};


/*
| Transforms the space visualisation.
*/
def.adjust.spaceVisual =
	function(
		spaceVisual
	)
{
	const spaceFabric = this.spaceFabric;

	if( !spaceFabric ) return;

	const mark = visual_space.concernsMark( this._mark );

	const hover = visual_space.concernsHover( this.hover );

	return(
		( spaceVisual || visual_space )
		.create(
			'access', this.access,
			'action', this.action,
			'fabric', this.spaceFabric,
			'hover', hover,
			'mark', mark,
			'transform', this.spaceTransform,
			'viewSize', this.viewSize
		)
	);
};


/*
| Returns the what the clipboard should hold.
*/
def.lazy.clipboard =
	function( )
{
	const mark = this._mark;

	return mark ? mark.clipboard : '';
};


/*
| Alters the tree.
|
| Feeds the doTracker.
*/
def.proto.alter =
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
			'cid', session_uid.newUid( ),
			'changeList', changeList
		);

	root.link.alter( changeWrap );

	root.doTracker.track( changeWrap );
};


/*
| Does an animation frame.
*/
def.proto.animationFrame =
	function(
		time // time stamp the animation frame has been fired for
	)
{
	root._animation.frame( time );
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
def.proto.changeSpaceTransformPoint =
	function(
		de,  // difference of view zoom exponent
		p    // point to keep constant
	)
{
	const st = this.spaceTransform;

	const offset = st.offset;

	const e1 =
		limit(
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
def.proto.changeSpaceTransformCenter =
	function(
		dir    // direction of zoom change (+/- 1)
	)
{
	root.changeSpaceTransformPoint( dir, root.viewSize.pc );
};


/*
| Changed the views so that all items of current space are visible.
*/
def.proto.changeSpaceTransformAll =
	function( )
{
	const space = root.spaceVisual;

	const rZ = space.length;

	if( rZ === 0 ) return;

	let item = space.atRank( 0 );

	let zone = item.zone( );

	let pos = item.pos || zone.pos;

	let wx = pos.x;

	let ny = pos.y;

	let ex = wx + zone.width;

	let sy = ny + zone.height;

	for( let r = 1; r < rZ; r++ )
	{
		item = space.atRank( r );

		pos = item.pos;

		if( !pos ) { zone = item.zone( ); pos = zone.pos; }

		if( pos.x < wx ) wx = pos.x;

		if( pos.y < ny ) ny = pos.y;

		if( pos.x + zone.width > ex ) ex = pos.x + zone.width;

		if( pos.y + zone.height > sy ) sy = pos.y + zone.height;
	}

	// center
	const cx = ( ex + wx ) / 2;

	const cy = ( ny + sy ) / 2;

	const discWidth = root.disc.get( 'main' ).tZone.width;

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
def.proto.changeSpaceTransformHome =
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
def.proto.click =
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
def.proto.clearRetainX =
	function( )
{
	const mark = this._mark;

	if( mark.retainx !== undefined )
	{
		this.create( '_mark', mark.create( 'retainx', undefined ) );
	}
};


/*
| Cycles focus in a form.
*/
def.proto.cycleFormFocus =
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
def.proto.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen.showDisc )
	{
		const bubble = root.disc.dragMove( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	root.action.dragMove( p, screen, shift, ctrl );
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
def.proto.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen.showDisc )
	{
		const bubble = root.disc.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	root.action.dragStart( p, screen, shift, ctrl );
};


/*
| A button has been dragStarted.
*/
def.proto.dragStartButton =
	function(
		path
	)
{
	switch( path.get( 0 ) )
	{
		case 'disc' : return root.disc.dragStartButton( path, false, false );

		case 'form' : return root.form.dragStartButton( path, false, false );

		default : throw new Error( 'invalid path' );
	}
};


/*
| Stops an operation with the mouse button held down.
*/
def.proto.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen.showDisc )
	{
		const bubble = root.disc.dragStop( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	root.action.dragStop( p, screen, shift, ctrl );
};


/*
| Finished an animation
*/
def.proto.finishAnimation =
	function(
		name  // animation name
	)
{
	if( !root._animation.get( name ) ) return;

	root.create( '_animation', root._animation.create( 'twig:remove', name ) );

	if( root._animation.length === 0 ) system.stopAnimation( );
};


/*
| User entered normal text (one character or more).
*/
def.proto.input =
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
| Adjusts the link.
*/
def.adjust.link =
	function(
		link
	)
{
	return link.create( 'userCreds', this.userCreds );
};


/*
| Logs out the current user
*/
def.proto.logout =
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

		root.moveToSpace( ref_space.plotleHome, false );

		return;
	}

	// FIXME i don't get it what happens when there are no _visitorCreds

	root.create(
		'userSpaceList', undefined,
		'link', link
	);

	root.link.auth( user_creds.createVisitor( ) );
};


/*
| Mouse wheel is being turned.
*/
def.proto.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen.showDisc )
	{
		const bubble = root.disc.mousewheel( p, dir, shift, ctrl );

		if( bubble ) return bubble;
	}

	return screen.mousewheel( p, dir, shift, ctrl );
};


/*
| Moves to space with the name name.
|
| if spaceRef is undefined reloads current space
*/
def.proto.moveToSpace =
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
| Receiving a moveTo event
*/
def.proto.onAcquireSpace =
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
		'spaceFabric', reply.space,
		'spaceRef', request.spaceRef,
		'_mark', undefined
	);
};


/*
| Received an 'auth' reply.
*/
def.proto.onAuth =
	function(
		wasVisitor,   // if true this was a visitor account requested
		reply
	)
{
	const userSpaceList = reply.userSpaceList;

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


	const show = root.show;

	// if in login form this is an atempted login
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

	let userCreds = reply.userCreds;

	root.create(
		'userCreds', userCreds,
		'_visitorCreds', userCreds.isVisitor ? userCreds : pass
	);

	if( userCreds.isVisitor ) user_creds.clearLocalStorage( );

	root.moveToSpace( ref_space.plotleHome, false );
};


/*
| Received a 'register' reply.
*/
def.proto.onRegister =
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
| User is hovering his/her pointing device.
*/
def.proto.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen.showDisc )
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

	const result = root.action.pointingHover( p, screen, shift, ctrl );

/**/if( CHECK )
/**/{
/**/	if( result.timtype !== result_hover ) throw new Error( );
/**/}

	root.create( 'hover', result.path );

	return result.cursor;
};


/*
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
def.proto.probeClickDrag =
	function(
		p,
		shift,
		ctrl
	)
{
	const screen = root._currentScreen;

	if( screen.showDisc )
	{
		const bubble = root.disc.probeClickDrag( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

//	FUTURE
//	return screen.probeClickDrag( p, shift, ctrl );

	return 'atween';
};


/*
| A button has been pushed.
*/
def.proto.pushButton =
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
| Sets the user mark.
*/
def.proto.setUserMark =
	function(
		mark
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	if( mark && mark.timtype === visual_mark_caret )
	{
		mark = mark.create( 'focus', this._systemFocus );
	}

	const omark = root._mark;

	root.create( '_mark', mark );

	if( !omark ) return;

	const oip = omark.itemPaths;

	if( !oip ) return;

	const nip = mark && mark.itemPaths;

	for( let a = 0, al = oip.length; a < al; a++ )
	{
		const op = oip.get( a );

		if( nip && nip.contains( op ) ) continue;

		const item = root.getPath( op );

		if( item ) item.markLost( );
	}
};


/*
| Shows the "home" screen.
|
| When a space is loaded, this is space/normal
| otherwise it is the loading screen.
*/
def.proto.showHome =
	function( )
{
	root.create(
		'action', action_none.create( ),
		'show',
			root.spaceVisual
			? show_normal.create( )
			: show_form.loading
	);
};


/*
| User is pressing a special key.
*/
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	if( key === 'shift' )
	{
		const action = this.action;

		if( action.timtype === action_none ) root.create( 'action', action_select.create( ) );

		return true;
	}

	const screen = root._currentScreen;

	const result = screen.specialKey( key, shift, ctrl );

	if( root.spaceVisual ) root.spaceVisual.scrollMarkIntoView( );

	return result;
};


/*
| User is releasing a special key.
*/
def.proto.releaseSpecialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	if( key !== 'shift' ) return;

	const action = this.action;

	if( action.timtype === action_select && !action.startPoint )
	{
		root.create( 'action', action_none.create( ) );
	}
};


/*
| Removes a text spawning over several entities.
*/
def.proto.removeRange =
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
| The window has been resized.
*/
def.proto.resize =
	function(
		size    // of type gleam_size
	)
{
	root.create(
		'display', gleam_display_canvas.resize( this.display, size ),
		'viewSize', size
	);
};


/*
| Sets if the shell got the system focus
| (that is display the virtual caret)
*/
def.proto.setSystemFocus =
	function(
		focus
	)
{
	if( this._systemFocus === focus ) return;

	let mark = this._mark;

	if( mark && mark.timtype === visual_mark_caret )
	{
		mark = mark.create( 'focus', focus );
	}
	else
	{
		mark = pass;
	}

	root.create(
		'_systemFocus', focus,
		'_mark', mark
	);
};


/*
| Creates a new relation by specifing its relates.
*/
def.proto.spawnRelation =
	function(
		item1,
		item2
	)
{
	const line = gleam_connect.line( item1.shape( ), item2.shape( ) );

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

	const key = session_uid.newUid( );

	root.alter(
		change_grow.create(
			'val', val,
			'path', tim_path.empty.append( 'twig' ).append( key ),
			'rank', 0
		)
	);

	root.setUserMark(
		visual_mark_caret.pathAt( root.spaceVisual.get( key ).doc.atRank( 0 ).textPath, 0 )
	);
};


/*
| Returns true if the iPad ought to show
| the virtual keyboard
*/
def.proto.suggestingKeyboard =
	function( )
{
	return this._mark && this._mark.hasCaret;
};


/*
| A checkbox has been toggled.
*/
def.proto.toggleCheckbox =
	function(
		path   // path of the button pushed
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 0 ) !== 'form' ) throw new Error( );
/**/}

	root.form.toggleCheckbox( path, false, false );
};


/*
| The link is reporting updates.
*/
def.proto.update =
	function(
		changes
	)
{
	let mark = this._mark;

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

	root.setUserMark( mark );
};


/*
| Changes the space transform to transform.
| Possibly with an animation.
*/
def.proto._changeTransformTo =
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
			'_animation',
				root._animation.create(
					'twig:set+', 'transform', animation_transform.createNow( transform, time )
				)
		);

		system.doAnimation( );
	}
	else
	{
		root.create(
			'_transformExponent', exp,
			'spaceTransform', transform
		);

		if( root.action.finishAnimation ) system.setTimer( time, notAnimationFinish );
	}
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


} );
