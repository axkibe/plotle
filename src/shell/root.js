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

		// display's device pixel ratio
		devicePixelRatio : { type : 'number' },

		// the discs
		discs : { type : '../discs/root' },

		// the un/re/do tracker
		doTracker : { type : './doTracker' },

		// fallback to this space if loading another failed
		fallbackSpaceRef : { type : [ 'undefined', '../ref/space' ] },

		// the forms
		forms : { type : '../forms/root' },

		// currently hovered on field/item
		hover : { type : [ 'undefined', '< ../trace/hover-types' ] },

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

		// the display within everything happens
		_display : { type : '../gleam/display/canvas' },

		// the users mark
		_mark : { type : [ 'undefined', '< ../mark/visual-types' ] },

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
				'_display' : true,
				'link' : true,
			}
		}
	};

	def.global = 'root';
}


const animation_root = tim.require( '../animation/root' );
const animation_transform = tim.require( '../animation/transform' );
const action_createGeneric = tim.require( '../action/createGeneric' );
const action_none = tim.require( '../action/none' );
const action_select = tim.require( '../action/select' );
const change_join = tim.require( '../change/join' );
const change_list = tim.require( '../change/list' );
const change_remove = tim.require( '../change/remove' );
const change_wrap = tim.require( '../change/wrap' );
const discs_root = tim.require( '../discs/root' );
const fabric_space = tim.require( '../fabric/space' );
const forms_root = tim.require( '../forms/root' );
const gleam_glint_list = tim.require( '../gleam/glint/list' );
const gleam_point = tim.require( '../gleam/point' );
const gleam_transform = tim.require( '../gleam/transform' );
const gruga_controls = tim.require( '../gruga/controls' );
const mark_caret = tim.require( '../mark/caret' );
const mark_range = tim.require( '../mark/range' );
const math = tim.require( '../math/root' );
const net_channel = tim.require( '../net/channel' );
const net_link = tim.require( '../net/link' );
const ref_space = tim.require( '../ref/space' );
const reply_auth = tim.require( '../reply/auth' );
const reply_error = tim.require( '../reply/error' );
const result_hover = tim.require( '../result/hover' );
const shell_doTracker = tim.require( './doTracker' );
const show_create = tim.require( '../show/create' );
const show_form = tim.require( '../show/form' );
const show_normal = tim.require( '../show/normal' );
const show_zoom = tim.require( '../show/zoom' );
const trace_discs = tim.require( '../trace/discs' );
const trace_forms = tim.require( '../trace/forms' );
const trace_space = tim.require( '../trace/space' );
const user_creds = tim.require( '../user/creds' );


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
| If so the trace are removed from its itemTraceSet.
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
		case action_createGeneric :
		{
			const dpr = this.devicePixelRatio;
			const ti = action.transientItem;

			if( !ti || ti.devicePixelRatio === dpr ) return action;

			return action.create( 'transientItem', ti.create( 'devicePixelRatio', dpr ) );
		}

		default : return action;

		/*
		case action_dragItems :
		case action_resizeItems :

			// TODO!
			break;
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

					if( p2 === 0 ) return;

					return(
						action.create(
							'itemPaths', tim_pathList.create( 'list:init', nPaths )
						)
					);
				}

				return action;
			}
		}*/
	}
};


/*
| Returns the attention center.
|
| That is the horiziontal offset of the caret.
|
| Used for example on the iPad so the caret is scrolled into view when the keyboard is visible.
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
/**/	if( root ) throw new Error( );
/**/}

	const viewSize = display.size;

	const show = show_form.loading;

	let userCreds = user_creds.createFromLocalStorage( );

	if( !userCreds ) userCreds = user_creds.createVisitor( );

	const dpr = display.devicePixelRatio;

	shell_root._create(
		'action', action_none.singleton,
		'devicePixelRatio', display.devicePixelRatio,
		'doTracker', shell_doTracker.create( ),
		'link',
			net_link.create(
				'twig:add', 'command', net_channel.create( 'name', 'command' ),
				'twig:add', 'update', net_channel.create( 'name', 'update' )
			),
		'show', show,
		'spaceTransform', gleam_transform.normal,
		'viewSize', display.size,
		'discs', discs_root.createFromLayout( viewSize, show, dpr ),
		'forms', forms_root.createFromLayout( viewSize, dpr ),
		'_animation', animation_root.create( ),
		'_display', display,
		'_systemFocus', true
	);

	root.link.auth( userCreds );
};


/*
| Adjusts the disc.
*/
def.adjust.discs =
	function(
		discs
	)
{
	const zoom = Math.min( this.viewSize.height / gruga_controls.designSize.height, 1 );

	const ctransform =
		gleam_transform.create(
			'zoom', zoom,
			'offset', gleam_point.zero
		);

	let hover = this.hover;

	if( hover && !hover.traceDiscs ) hover = undefined;

	return(
		discs.create(
			'access', this.access,
			'action', this.action,
			'controlTransform', ctransform,
			'devicePixelRatio', this.devicePixelRatio,
			'hover', hover,
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

	let display = root._display;

	const screen = root._currentScreen;

	const a = [ screen.glint ];

	if( screen.showDisc ) a[ 1 ] = root.discs.glint;

	display = display.create( 'glint', gleam_glint_list.create( 'list:init', a ) );

	display.render;

	root._create( '_display', display );

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
def.adjust.forms =
	function(
		forms
	)
{
	const space = this.space;

	return(
		forms.create(
			'action', this.action,
			'devicePixelRatio', this.devicePixelRatio,
			'hasGrid', space && space.hasGrid,
			'hasGuides', space && space.hasGuides,
			'hasSnapping', space && space.hasSnapping,
			'hover', forms_root.concernsHover( this.hover ),
			'mark', forms_root.concernsMark( this._mark ),
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
			'devicePixelRatio', this.devicePixelRatio,
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
	let change = pass;
	let changeWrap;
	let clearRetainX;
	let doTracker = pass;
	let forms = pass;
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
			case 'change' : change = arg; continue;
			case 'changeWrap' : changeWrap = arg; continue;
			case 'clearRetainX' : clearRetainX = arg; continue;
			case 'doTracker' : doTracker = arg; continue;
			case 'forms' : forms = arg; continue;
			case 'hover' : hover = arg; continue;
			case 'link' : link = arg; continue;
			case 'mark' : mark = arg; continue;
			case 'show' : show = arg; continue;
			case 'space' : space = arg; continue;
			case 'spaceTransform' : spaceTransform = arg; continue;
			case 'userCreds' : userCreds = arg; continue;
			case 'userSpaceList' : userSpaceList = arg; continue;

			// a trace
			default :
			{
				const base = command.get( 1 );

				switch( base.timtype )
				{
					case trace_forms :

						if( forms === pass ) forms = this.forms;

						forms = command.chopRoot.graft( forms, arg );

						break;

					case trace_space :

						if( space === pass ) space = this.space;

						space = command.chopRoot.graft( space, arg );

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
			const changeWrap = change_wrap.createWrapped( change );

			root.link.send( changeWrap );

			if( mark === pass ) mark = root.update( changeWrap );

/**/		if( CHECK )
/**/		{
/**/			if( doTracker !== pass ) throw new Error( );
/**/		}

			doTracker = root.doTracker.track( changeWrap );
		}
	}
	else if( changeWrap )
	{
		// the undo/redo tracker does directly changeWraps
		if( space === pass ) space = root.space;

		space = changeWrap.changeTree( space );

		// no need for ancillaries

		root.link.send( changeWrap );

		mark = root.update( changeWrap );
	}

	if( space !== pass ) space = space.create( 'action', action_none.singleton );

	if( clearRetainX )
	{
		if( mark === pass ) mark = this._mark;

		if( mark.retainx !== undefined ) mark = mark.create( 'retainx', undefined );
	}

	if( mark !== pass )
	{
		if( mark && mark.timtype === mark_caret )
		{
			mark = mark.create( 'focus', this._systemFocus );
		}

		omark = root._mark;
	}

	if( space !== pass || mark !== pass )
	{
		if( mark && mark.timtype === mark_range )
		{
			if( space === pass ) space = this.space;

			const markedItem = space.get( mark.beginOffset.traceItem.key );

			mark = mark.create( 'doc', markedItem.doc );
		}
	}

	root._create(
		'action', action,
		'doTracker', doTracker,
		'forms', forms,
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
		const oim = omark.itemsMark;

		if( oim )
		{
			const nim = mark && mark.itemsMark;

			for( let itemTrace of oim )
			{
				if( nim && nim.containsItemTrace( itemTrace ) ) continue;

				const item = itemTrace.pick( root );

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
	const e1 = math.limit( config.zoomMin, this._transformExponent + de, config.zoomMax );
	const zoom = Math.pow( 1.1, e1 );
	const h = 1 / st.zoom - 1 / zoom;

	this._changeTransformTo(
		e1,
		st.create(
			'offset',
				gleam_point.createXY(
					( offset.x / st.zoom - p.x * h ) * zoom,
					( offset.y / st.zoom - p.y * h ) * zoom
				),
			'zoom', zoom
		),
		config.animation.zoomStepTime
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
	const allItemsZone = space.allItemsZone;
	// center
	const cx = allItemsZone.pc.x;
	const cy = allItemsZone.pc.y;
	const ex = allItemsZone.pos.x;
	const ny = allItemsZone.pos.y;
	const sy = allItemsZone.pse.y;
	const wx = allItemsZone.pse.x;
	const discWidth = root.discs.get( 'main' ).tZone.width;
	const vsx = root.viewSize.width - discWidth;
	const vsy = root.viewSize.height;
	const vsx2 = vsx / 2;
	const vsy2 = vsy / 2;
	const zoomMin = config.zoomMin;

	let exp;
	let z;

	for( exp = config.zoomMax; exp > zoomMin; exp-- )
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
			'offset', gleam_point.createXY( vsx2 - cx * z + discWidth, vsy2 - cy * z ),
			'zoom', z
		),
		config.animation.zoomAllHomeTime
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
		config.animation.zoomAllHomeTime
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
	const bubble = root.discs.click( p, shift, ctrl );

	// if bubble === false do not bubble
	if( bubble !== undefined ) return bubble;

	return screen.click( p, shift, ctrl );
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
	root.forms.cycleFocus( name, dir );
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
		const bubble = root.discs.dragMove( p, shift, ctrl );

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
		const bubble = root.discs.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return;
	}

	root.action.dragStart( p, screen, shift, ctrl );
};


/*
| A button has been dragStarted.
*/
def.proto.dragStartButton =
	function(
		trace
	)
{
	switch( trace.get( 1 ).timtype )
	{
		case trace_discs : return root.discs.dragStartButton( trace, false, false );

		case trace_forms : return root.forms.dragStartButton( trace, false, false );

		default : throw new Error( );
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
		const bubble = root.discs.dragStop( p, shift, ctrl );

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

	// TODO i don't get it what happens when there are no _visitorCreds

	root.alter( 'userSpaceList', undefined, 'link', link );

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
		const bubble = root.discs.mousewheel( p, dir, shift, ctrl );

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
	let loading = root.forms.get( 'loading' );

	const spaceText = loading.get( 'spaceText' ).create( 'text', spaceRef.fullname );

	loading = loading.set( 'spaceText', spaceText );

	root._create(
		'fallbackSpaceRef', this.spaceRef,
		'forms', root.forms.set( 'loading', loading ),
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
				root.forms.get( 'nonExistingSpace' ).trace.appendNonSpaceRef,
				request.spaceRef
			);

			if( root.fallbackSpaceRef ) root.moveToSpace( root.fallbackSpaceRef, false );

			root._create( 'show', show_form.nonExistingSpace );

			return;

		case 'no access' :

			root.alter(
				root.forms.get( 'noAccessToSpace' ).trace.appendNonSpaceRef,
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
			? show_normal.singleton
			: pass,
		'space',
			reply.space.create( 'action', action_none.singleton ),
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
		root.forms.get( 'login' ).onAuth( reply );

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

	root.forms.get( 'signUp' ).onRegister( request, reply );
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
		const result = root.discs.pointingHover( p, shift, ctrl );

		if( result )
		{
/**/		if( CHECK )
/**/		{
/**/			if( result.timtype !== result_hover ) throw new Error( );
/**/		}

			root.alter( 'hover', result.trace );

			return result.cursor;
		}
	}

	const result = root.action.pointingHover( p, screen, shift, ctrl );

/**/if( CHECK )
/**/{
/**/	if( result.timtype !== result_hover ) throw new Error( );
/**/}

	root.alter( 'hover', result.trace );

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
		const bubble = root.discs.probeClickDrag( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

//	TODO
//	return screen.probeClickDrag( p, shift, ctrl );

	return 'atween';
};


/*
| A button has been pushed.
*/
def.proto.pushButton =
	function(
		trace   // trace of the button pushed
	)
{
	switch( trace.get( 1 ).timtype )
	{
		case trace_discs : return root.discs.pushButton( trace, false, false );

		case trace_forms : return root.forms.pushButton( trace, false, false );

		default : throw new Error( );
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
	const frontOffset = range.frontOffset;

	const backOffset = range.backOffset;

	const frontTracePara = frontOffset.tracePara;

	const backTracePara = backOffset.tracePara;

	if ( frontTracePara.equals( backTracePara ) )
	{
		root.alter(
			'change',
			change_remove.create(
				'trace', frontTracePara.chopRoot.appendText,
				'at1', frontOffset.at,
				'at2', backOffset.at,
				'val',
					frontOffset.last.chopRoot.pick( root._actionSpace )
					.substring( frontOffset.at, backOffset.at )
			)
		);

		return;
	}

	const change = [ ];

	const k1 = frontOffset.tracePara.key;

	const k2 = backOffset.tracePara.key;

	const pivot = frontTracePara.traceDoc.pick( root );

	const r1 = pivot.rankOf( k1 );

	const r2 = pivot.rankOf( k2 );

	let text = pivot.get( k1 ).text;

	let ve;

	for( let r = r1; r < r2; r++ )
	{
		ve = pivot.atRank( r + 1 );

		change.push(
			change_join.create(
				'trace', frontOffset.traceText.chopRoot,
				'trace2', ve.trace.appendText.chopRoot,
				'at1', text.length
			)
		);

		text += ve.text;
	}

	text = text.substring( frontOffset.at, text.length - ve.text.length + backOffset.at );

	change.push(
		change_remove.create(
			'trace', frontOffset.traceText.chopRoot,
			'at1', frontOffset.at,
			'at2', frontOffset.at + text.length,
			'val', text
		)
	);

	root.alter( 'change', change_list.create( 'list:init', change ) );
};


/*
| The window has been resized.
*/
def.proto.resize =
	function(
		size,            // of type gleam_size
		devicePixelRatio // display's (changed?) device pixel ratio
	)
{
	if( root.devicePixelRatio !== devicePixelRatio )
	{
		console.log(
			'devicePixelRatio changed from' + root.devicePixelRatio
			+ 'to' + devicePixelRatio
		);
	}

	root._create(
		'devicePixelRatio', devicePixelRatio,
		'viewSize', size,
		'_display', root._display.resize( size, devicePixelRatio ),
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

	if( mark && mark.timtype === mark_caret )
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
		'show', root._actionSpace ? show_normal.singleton : show_form.loading
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
		trace  // trace of the checkbox
	)
{
/**/if( CHECK )
/**/{
/**/	if( !trace.traceForms ) throw new Error( );
/**/}

	root.forms.toggleCheckbox( trace, false, false );
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

	mark = changes.transform( mark );

	if( !mark ) return;

	if( mark.timtype === mark_range )
	{
		return mark.create( 'doc', mark.doc.trace.pick( root ) );
	}

	return mark;
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

	for(;;)
	{
		const ancillary = space.ancillary( change.affectedTwigItems );

		if( !ancillary ) break;

		space = ancillary.changeTree( space );
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
	if( config.animation.enable )
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

			return root.forms.get( show.formName );

		default : throw new Error( );
	}
};


} );
