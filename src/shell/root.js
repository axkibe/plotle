/*
| The root of the user shell.
*/
'use strict';


tim.define( module, ( def, shell_root ) => {


if( TIM )
{
	def.create = [ '_create' ];

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
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the link to the server
		link : { type : '../net/link' },

		// currently form/disc shown
		show : { type : [ '< ../show/types' ] },

		// current space data
		space : { type : [ 'undefined', '../fabric/space' ] },

		// reference to current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// current space transform
		spaceTransform : { type : '../gleam/transform' },

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


const animation_root = tim.require( '../animation/root' );

const animation_transform = tim.require( '../animation/transform' );

const action_none = tim.require( '../action/none' );

const action_select = tim.require( '../action/select' );

const change_grow = tim.require( '../change/grow' );

const change_join = tim.require( '../change/join' );

const change_list = tim.require( '../change/list' );

const change_remove = tim.require( '../change/remove' );

const change_wrap = tim.require( '../change/wrap' );

const disc_root = tim.require( '../disc/root' );

const disc_create = tim.require( '../disc/create' );

const disc_main = tim.require( '../disc/main' );

const disc_zoom = tim.require( '../disc/zoom' );

const fabric_doc = tim.require( '../fabric/doc' );

const fabric_para = tim.require( '../fabric/para' );

const fabric_relation = tim.require( '../fabric/relation' );

const fabric_space = tim.require( '../fabric/space' );

const form_loading = tim.require( '../form/loading' );

const form_login = tim.require( '../form/login' );

const form_moveTo = tim.require( '../form/moveTo' );

const form_noAccessToSpace = tim.require( '../form/noAccessToSpace' );

const form_nonExistingSpace = tim.require( '../form/nonExistingSpace' );

const form_root = tim.require( '../form/root' );

const form_signUp = tim.require( '../form/signUp' );

const form_space = tim.require( '../form/space' );

const form_user = tim.require( '../form/user' );

const form_welcome = tim.require( '../form/welcome' );

const gleam_connect = tim.require( '../gleam/connect' );

const gleam_display_canvas = tim.require( '../gleam/display/canvas' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_transform = tim.require( '../gleam/transform' );

const gruga_controls = tim.require( '../gruga/controls' );

const gruga_disc_create = tim.require( '../gruga/disc/create' );

const gruga_loading = tim.require( '../gruga/loading' );

const gruga_login = tim.require( '../gruga/login' );

const gruga_disc_main = tim.require( '../gruga/disc/main' );

const gruga_moveTo = tim.require( '../gruga/moveTo' );

const gruga_noAccessToSpace = tim.require( '../gruga/noAccessToSpace' );

const gruga_nonExistingSpace = tim.require( '../gruga/nonExistingSpace' );

const gruga_relation = tim.require( '../gruga/relation' );

const gruga_signUp = tim.require( '../gruga/signUp' );

const gruga_space = tim.require( '../gruga/space' );

const gruga_user = tim.require( '../gruga/user' );

const gruga_welcome = tim.require( '../gruga/welcome' );

const gruga_disc_zoom = tim.require( '../gruga/disc/zoom' );

const math = tim.require( '../math/root' );

const net_ajax = tim.require( '../net/ajax' );

const net_channel = tim.require( '../net/channel' );

const net_link = tim.require( '../net/link' );

const ref_space = tim.require( '../ref/space' );

const result_hover = tim.require( '../result/hover' );

const reply_auth = tim.require( '../reply/auth' );

const reply_error = tim.require( '../reply/error' );

const session_uid = tim.require( '../session/uid' );

const shell_doTracker = tim.require( './doTracker' );

const shell_settings = tim.require( './settings' );

const show_create = tim.require( '../show/create' );

const show_form = tim.require( '../show/form' );

const show_normal = tim.require( '../show/normal' );

const show_zoom = tim.require( '../show/zoom' );

const tim_path = tim.require( 'tim.js/path' );

const user_creds = tim.require( '../user/creds' );

const visual_mark_caret = tim.require( '../visual/mark/caret' );

const visual_mark_range = tim.require( '../visual/mark/range' );

const widget_factory = tim.require( '../widget/factory' );



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
| Adjusts the current action.
|
| Makes sure the action has not any removed items in them.
| If so the paths are removed from its itemPathsList.
|
| If no item is left, action is set to none.
|
| FIXME rebuild into alter( )
*/
/*
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
			const space = this.space;

			const iPaths = action.itemPaths;

			if( iPaths )
			{
				let p, pl;

				for( p = 0, pl = iPaths.length; p < pl; p++ )
				{
					const path = iPaths.get( p );

					if( path.get( 0 ) === 'space' && !space.get( path.get( 2 ) ) ) break;
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

						if( path.get( 0 ) === 'space' &&
							!space.get( path.get( 2 ) )
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
*/


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

	shell_root._create(
		'action', action_none.singleton,
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
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	const hover = this.hover;
/**/
/**/	if( hover && hover.isEmpty ) throw new Error( );
/**/}
};



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

	// FIXME check if this is privatable
	root._create( 'display', display );

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
			'hasGrid', this.space && this.space.hasGrid,
			'hasSnapping', this.space && this.space.hasSnapping,
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
def.adjust.space =
	function(
		space
	)
{
	if( !space ) return;

	const mark = fabric_space.concernsMark( this._mark );

	const hover = fabric_space.concernsHover( this.hover );

	return(
		space.create(
			'access', this.access,
			'action', this.action,
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
| Alters to shell.
*/
def.proto.alter =
	function(
		// free strings
	)
{
	let action = pass;

	// FIXME make ajax part of link.
	let ajax = pass;

	let change = pass;

	let changeWrap;

	let doTracker = pass;

	let form = pass;

	let hover = pass;

	let link = pass;

	let mark = pass;

	let omark;

	let show = pass;

	let space = pass;

	let spaceTransform = pass;

	let userSpaceList = pass;

	let userCreds = pass;

	for( let a = 0, al = arguments.length; a < al; a += 2 )
	{
		const command = arguments[ a ];

		const arg = arguments[ a + 1 ];

		switch( command )
		{
			case 'action' : action = arg; continue;

			case 'ajax' : ajax = arg; continue;

			case 'change' : change = arg; continue;

			case 'changeWrap' : changeWrap = arg; continue;

			case 'doTracker' : doTracker = arg; continue;

			case 'form' : form = arg; continue;

			case 'hover' : hover = arg; continue;

			case 'link' : link = arg; continue;

			case 'mark' : mark = arg; continue;

			case 'show' : show = arg; continue;

			case 'space' : space = arg; continue;

			case 'spaceTransform' : spaceTransform = arg; continue;

			case 'userCreds' : userCreds = arg; continue;

			case 'userSpaceList' : userSpaceList = arg; continue;

			default :
			{
/**/			if( CHECK )
/**/			{
/**/				if( command.timtype !== tim_path ) throw new Error( );
/**/			}

				const base = command.get( 0 );

				switch( base )
				{
					case 'form' :

						if( CHECK )
/**/					{
/**/						if( command.get( 1 ) !== 'twig' ) throw new Error( );
/**/					}

						if( form === pass ) form = this.form;

						form = form.setPath( command.chop, arg );

						break;

					case 'space' :

						if( space === pass ) space = this.space;

						if( CHECK )
/**/					{
/**/						if( command.get( 1 ) !== 'twig' ) throw new Error( );
/**/					}

						if( space === pass ) space = this.space;

						space = space.setPath( command.chop, arg );

						break;

					default : throw new Error( );
				}
			}
		}
	}

	if( change !== pass )
	{
/**/	if( CHECK )
/**/	{
/**/		if( changeWrap ) throw new Error( );
/**/
/**/		if( Array.isArray( change ) ) throw new Error( );
/**/	}

		if( space === pass ) space = root.space;

		if( change.timtype !== change_list )
		{
			change = change_list.create( 'list:init', [ change ] );
		}

		space = change.changeTree( space );

		const ancillary = space.ancillary( change.affectedTwigItems );

		if( ancillary )
		{
			space = ancillary.changeTree( space );

			change = change.appendList( ancillary );
		}

		{
			const changeWrap =
				// FIXME make a shortcut function
				change_wrap.create(
					'cid', session_uid.newUid( ),
					'changeList', change
				);

			root.link.alter( changeWrap );

			root.doTracker.track( changeWrap );
		}
	}
	else if( changeWrap )
	{
		// the undo/redo tracker does directly changeWraps
		if( space === pass ) space = root.space;

		space = changeWrap.changeTree( space );

		// no need for ancillaries

		root.link.alter( changeWrap );
	}

	if( space !== pass ) space = space.create( 'action', action_none.singleton );

	if( mark !== pass )
	{
		if( mark && mark.timtype === visual_mark_caret )
		{
			mark = mark.create( 'focus', this._systemFocus );
		}

		omark = root._mark;
	}

	root._create(
		'action', action,
		'ajax', ajax,
		'doTracker', doTracker,
		'form', form,
		'hover', hover,
		'link', link,
		'show', show,
		'space', space,
		'spaceTransform', spaceTransform,
		'userCreds', userCreds,
		'userSpaceList', userSpaceList,
		'_mark', mark
	);

	if( omark )
	{
		// issues the markLost( ) calls
		// used by empty labels to remove themselves
		const oip = omark.itemPaths;

		if( oip )
		{
			const nip = mark && mark.itemPaths;

			for( let a = 0, al = oip.length; a < al; a++ )
			{
				const op = oip.get( a );

				if( nip && nip.contains( op ) ) continue;

				const item = root.getPath( op );

				if( item ) item.markLost( );
			}
		}
	}
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
		math.limit(
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
	const space = root._actionSpace;

	const rZ = space.length;

	if( rZ === 0 ) return;

	let item = space.atRank( 0 );

	let zone = item.zone;

	let pos = item.pos || zone.pos;

	let wx = pos.x;

	let ny = pos.y;

	let ex = wx + zone.width;

	let sy = ny + zone.height;

	for( let r = 1; r < rZ; r++ )
	{
		item = space.atRank( r );

		pos = item.pos;

		if( !pos ) { zone = item.zone; pos = zone.pos; }

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
		this._create( '_mark', mark.create( 'retainx', undefined ) );
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

	root._create( '_animation', root._animation.create( 'twig:remove', name ) );

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

		if( root._actionSpace ) root._actionSpace.scrollMarkIntoView( );
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
		root._create(
			'userCreds', root._visitorCreds,
			'userSpaceList', undefined,
			'link', link
		);

		root.moveToSpace( ref_space.plotleHome, false );

		return;
	}

	// FIXME i don't get it what happens when there are no _visitorCreds

	root.alter(
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
	let loading = root.form.get( 'loading' );

	const spaceText = loading.get( 'spaceText' ).create( 'text', spaceRef.fullname );

	loading = loading.set( 'spaceText', spaceText );

	root._create(
		'fallbackSpaceRef', this.spaceRef,
		'form', root.form.set( 'loading', loading ),
		'show', show_form.loading,
		'space', undefined
	);

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

			root.alter(
				root.form.get( 'nonExistingSpace' ).path.append( 'nonSpaceRef' ),
				request.spaceRef
			);

			if( root.fallbackSpaceRef )
			{
				root.moveToSpace( root.fallbackSpaceRef, false );
			}

			root._create( 'show', show_form.nonExistingSpace );

			return;

		case 'no access' :

			root.alter(
				root.form.get( 'noAccessToSpace' ).path.append( 'nonSpaceRef' ),
				request.spaceRef
			);

			if( root.fallbackSpaceRef )
			{
				root.moveToSpace( root.fallbackSpaceRef, false );
			}

			root._create( 'show', show_form.noAccessToSpace );

			return;

		default :

			system.failScreen( 'Unknown acquireSpace( ) status' );

			return;
	}

	const access = reply.access;

	const show = root.show;

	root._create(
		'access', access,
		'show',
			( show.timtype === show_form && show.formName === 'loading' )
			? show_normal.create( )
			: pass,
		'space', reply.space.create( 'action', action_none.singleton ),
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
		root.alter(
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
		root.alter(
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

	root._create(
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

			root.alter( 'hover', result.path );

			return result.cursor;
		}
	}

	const result = root.action.pointingHover( p, screen, shift, ctrl );

/**/if( CHECK )
/**/{
/**/	if( result.timtype !== result_hover ) throw new Error( );
/**/}

	root.alter( 'hover', result.path );

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
		root.alter( 'action', action_none.singleton );
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
/**/		|| frontMark.path.get( 0 ) !== 'space'
/**/		|| backMark.path.get( 0 ) !== 'space'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if ( frontMark.path.equals( backMark.path ) )
	{
		root.alter(
			'change',
			change_remove.create(
				'path', frontMark.path.chop,
				'at1', frontMark.at,
				'at2', backMark.at,
				'val',
					root._actionSpace.getPath( frontMark.path.chop )
					.substring( frontMark.at, backMark.at )
			)
		);

		return;
	}

	const changes = [ ];

	const k1 = frontMark.path.get( -2 );

	const k2 = backMark.path.get( -2 );

	const pivot =
		root.space.getPath(
			frontMark.path.chop.shorten.shorten.shorten
		);

	const r1 = pivot.rankOf( k1 );

	const r2 = pivot.rankOf( k2 );

	let text = root.space.getPath( frontMark.path.chop );

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

	root.alter( 'change', changes );
};


/*
| The window has been resized.
*/
def.proto.resize =
	function(
		size    // of type gleam_size
	)
{
	root._create(
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

	root._create( '_systemFocus', focus, '_mark', mark );
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
	root.alter(
		'action', action_none.singleton,
		'show', root._actionSpace ? show_normal.create( ) : show_form.loading
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

	const key = session_uid.newUid( );

	const path = tim_path.empty.append( 'space' ).append( 'twig' ).append( key );

	const val =
		fabric_relation.create(
			'zone',
				gleam_rect.create(
					'pos', pos,
					'width', 0,
					'height', 0
				),
			'doc',
				fabric_doc.create(
					'twig:add', '1',
					fabric_para.create( 'text', 'relates to' )
				),
			'fontsize', 20,
			'item1key', item1.path.get( -1 ),
			'item2key', item2.path.get( -1 ),
			'path', path
		);

	const mpath = path.append( 'doc', ).append( 'twig' ).append( '1' ).append( 'text' );

	let change =
		change_list.create(
			'list:append',
			change_grow.create(
				'val', val,
				'path', path.chop,
				'rank', 0
			)
		);

	change = change.appendList( val.ancillary( root.space ) );

	root.alter(
		'change', change,
		'mark', visual_mark_caret.pathAt( mpath, 0 )
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

		if( action.timtype === action_none ) root.alter( 'action', action_select.create( ) );

		return true;
	}

	const screen = root._currentScreen;

	const result = screen.specialKey( key, shift, ctrl );

	if( root._actionSpace ) root._actionSpace.scrollMarkIntoView( );

	return result;
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
				root.space.getPath( mark.docPath.chop )
			);

			break;

		default :

			mark = mark.createTransformed( changes );

			break;
	}

	root.alter( 'mark', mark );
};


/*
| Helper for alter( ).
|
| Handles 'change' alterations.
*/
def.proto._alterChange =
	function(
		change,  // the change or change list to apply
		space    // the space
	)
{
};


/*
| The space with the current action applied.
*/
def.lazy._actionSpace =
	function( )
{
	let space = this.space;

	// checks if alter set a none action.

	if( !space ) return;

/**/if( CHECK )
/**/{
/**/	if( !space.action ) throw new Error( );
/**/}

	const change = this.action.changes;

	space = change.changeTree( space );

	{
		const ancillary = space.ancillary( change.affectedTwigItems );

		if( ancillary ) space = ancillary.changeTree( space );
	}

	return space.create( 'action', this.action );
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
		root._create(
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
		root._create(
			'_transformExponent', exp,
			'spaceTransform', transform
		);

		if( root.action.finishAnimation ) system.setTimer( time, notAnimationFinish );
	}
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
			'action', action_none.singleton,
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
				'action', action_none.singleton,
				'viewSize', viewSize,
				'twig:init', twig, layout._ranks
			);
	}

	let formRoot =
		form_root.create(
			'action', action_none.singleton,
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

			return root._actionSpace;

		case show_form :

			return root.form.get( show.formName );

		default : throw new Error( );
	}
};


} );
