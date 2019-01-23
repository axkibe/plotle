/*
| A space visualisation.
*/
'use strict';


tim.define( module, ( def, visual_space ) => {


if( TIM )
{
	def.attributes =
	{
		// rights the current user has for this space
		access : { type : [ 'undefined', 'string' ] },

		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// space fabric data
		fabric : { type : '../fabric/space' },

		// the alteration frame
		frame : { type : [ './frame', 'undefined' ] },

		// node currently hovered upon
		hover : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// reference to this space
		ref : { type : [ 'undefined', '../ref/space' ] },

		// the current transform of space
		transform : { type : '../gleam/transform' },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.twig =
	[
		'undefined',
		'./label',
		'./note',
		'./portal',
		'./relation',
		'./stroke'
	];
}


const action_createGeneric = require( '../action/createGeneric' );

const action_createRelation = require( '../action/createRelation' );

const action_createStroke = require( '../action/createStroke' );

const action_dragItems = require( '../action/dragItems' );

const action_pan = require( '../action/pan' );

const action_resizeItems = require( '../action/resizeItems' );

const action_select = require( '../action/select' );

const action_scrolly = require( '../action/scrolly' );

const change_grow = require( '../change/grow' );

const change_list = require( '../change/list' );

const fabric_label = require( '../fabric/label' );

const fabric_note = require( '../fabric/note' );

const fabric_portal = require( '../fabric/portal' );

const fabric_relation = require( '../fabric/relation' );

const fabric_stroke = require( '../fabric/stroke' );

const gleam_arrow = require( '../gleam/arrow' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_label = require( '../gruga/label' );

const gruga_note = require( '../gruga/note' );

const gruga_relation = require( '../gruga/relation' );

const gruga_select = require( '../gruga/select' );

const pathList = require( 'tim.js/src/pathList' );

const result_hover = require( '../result/hover' );

const session_uid = require( '../session/uid' );

const tim_path = require( 'tim.js/src/path' );

const visual_frame = require( '../visual/frame' );

const visual_grid = require( '../visual/grid' );

const visual_item = require( '../visual/item' );

const visual_itemList = require( '../visual/itemList' );

const visual_label = require( '../visual/label' );

const visual_mark_items = require( '../visual/mark/items' );

const visual_note = require( '../visual/note' );

const visual_portal = require( '../visual/portal' );

const visual_relation = require( '../visual/relation' );

const visual_stroke = require( '../visual/stroke' );


/*
| Path of the visual space.
*/
def.staticLazy.spacePath = ( ) => tim_path.empty.append( 'spaceVisual' );


/*
| The path for transientItems
*/
def.staticLazy.transPath = ( ) => visual_space.spacePath.append( ':transient' );


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	const focus = this.focus;

	if( !focus ) return;

	return this.transform.y( focus.attentionCenter );
};


/*
| A click.
*/
def.proto.click =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const access = this.access;

	const mark = this.mark;

	const frame = this.frame;

	if( frame && frame.click( p, shift, ctrl, access ) ) return true;

	// clicked some item?
	for( let a = 0, al = this.length; a < al; a++ )
	{
		const item = this.atRank( a );

		if( ctrl )
		{
			if( item.ctrlClick( p, shift, access, mark ) ) return true;
		}
		else
		{
			if( item.click( p, shift, access ) ) return true;
		}
	}

	// otherwise ...

	if( !ctrl ) root.setUserMark( undefined );

	return true;
};


/*
| Returns the hover path if the space concerns about a hover.
*/
def.static.concernsHover =
	function(
		hover
	)
{
	return( hover && hover.get( 0 ) === 'spaceVisual' ? hover : undefined );
};



/*
| Returns the mark if the space concerns about a mark.
*/
def.static.concernsMark =
	function(
		mark
	)
{
	return(
		( mark && mark.containsPath( visual_space.spacePath ) )
		? mark
		: undefined
	);
};


/*
| Transforms the items into visual items.
*/
def.transform.get =
	function(
		key,   // key of the visual item to be retrieved
		item   // the unaltered item.
	)
{
	let path;

	const fabric = this.fabric.get( key );

	if( !fabric ) return;

	if( !item )
	{
		item = visual_space._visualMap.get( fabric.timtype );

/**/	if( CHECK )
/**/	{
/**/		if( !item ) throw new Error( );
/**/	}

		path = visual_space.spacePath.append( 'twig' ).appendNC( key );
	}
	else
	{
		path = item.path;
	}

	const action = visual_item.concernsAction( this.action, item );

	const mark = visual_item.concernsMark( this.mark, path );

	let highlight = !!( mark && mark.containsPath( path ) );

	if( !highlight && action && item.timtype )
	{
		highlight = this._highlightItem( item, action );
	}

	const hover = item.concernsHover( this.hover, path );

	if( item === visual_note || item.timtype === visual_note )
	{
		item =
			item.create(
				'action', action,
				'highlight', highlight,
				'hover', hover,
				'fabric', fabric,
				'mark', mark,
				'path', path,
				// FIXME why not just defaultValue?
				'scrollPos', item.scrollPos || gleam_point.zero,
				'transform', this.transform
			);
	}
	else
	{
		item =
			item.create(
				'action', action,
				'highlight', highlight,
				'hover', hover,
				'fabric', fabric,
				'mark', mark,
				'path', path,
				'transform', this.transform
			);
	}

	if( item.timtype === visual_note )
	{
		const aperture = item.zone.height - gruga_note.innerMargin.y;

		const dHeight = item.doc.fullsize.height;

		let scrollPos = item.scrollPos;

		if( dHeight < aperture )
		{
			scrollPos = scrollPos.create( 'y', 0 );

			item = item.create( 'scrollPos', scrollPos );
		}
		else if( scrollPos.y > dHeight - aperture )
		{
			scrollPos = scrollPos.create( 'y', dHeight - aperture );

			item = item.create( 'scrollPos', scrollPos );
		}
	}

	let action2 = action;
	let highlight2 = highlight;

	// FIXME take scrollPos into redo

	if( !action ) action2 = visual_item.concernsAction( this.action, item );

	// checks if the highlight feature has changed on the created item
	if( !highlight2 && action2 && item.timtype )
	{
		highlight2 = this._highlightItem( item, action );
	}

	if( action2 !== action || highlight2 !== highlight )
	{
		item = item.create( 'action', action2, 'highlight', highlight2 );
	}

	return item;
};


/*
| Determines the focused item.
*/
def.lazy.focus =
	function( )
{
	const mark = this.mark;

	if( !mark ) return undefined;

	const paths = mark.itemPaths;

	if( !paths || paths.length !== 1 ) return undefined;

	const path = paths.get( 0 );

	if( path.length <= 2 ) return undefined; // FUTURE shouldn't be necessary

	return this.get( path.get( 2 ) );
};


/*
| The current alteration frame.
*/
def.transform.frame =
	function(
		frame
	)
{
	const mark = this.mark;

	if( !mark ) return;

	if( !mark.itemPaths ) return;

	const content = this.getList( mark.itemPaths );

	if( !content ) return;

	if( !frame ) frame = visual_frame;

	return frame.create( 'content', content, 'transform', this.transform );
};


/*
| Return the space glint.
*/
def.lazy.glint =
	function( )
{
	const action = this.action;

	const transform = this.transform;

	const arr = [ ];

	// true or undefined -> show grid
	if( this.fabric.hasGrid ) arr.push( this._grid.glint );

	for( let r = this.length - 1; r >= 0; r-- )
	{
		const s = this.atRank( r );

		arr.push( s.glint( ) );
	}

	const frame = this.frame;

	if( frame ) arr.push( frame.glint );

	switch( action && action.timtype )
	{
		case action_createGeneric :

			if( action.startPoint ) arr.push( action.transientItem.glint( ) );

			break;

		case action_createStroke :

			if( action.from ) arr.push( action.transientVisual( transform ) .glint( ) );

			break;

		case action_createRelation :

			// FIXME make a transientItem

			if( action.fromItemPath )
			{
				const fromItem = this.get( action.fromItemPath.get( -1 ) );

				let toItem, toJoint;

				if( action.toItemPath ) toItem = this.get( action.toItemPath.get( -1 ) );

				const fromJoint = fromItem.shape;

				if(
					action.toItemPath
					&& !action.toItemPath.equals( action.fromItemPath )
				)
				{
					// arrow connects two items
					toJoint = toItem.shape;
				}
				else if ( action.relationState === 'hadSelect' )
				{
					// arrow points into nowhere
					toJoint = action.toPoint.detransform( transform );
				}

				if( toJoint )
				{
					const arrow =
						gleam_arrow.create(
							'joint1', fromJoint,
							'joint2', toJoint,
							'end1', 'none',
							'end2', 'arrow'
						);

					arr.push(
						gleam_glint_paint.createFS(
							gruga_relation.facet,
							arrow.shape.transform( transform )
						)
					);
				}
			}

			break;

		case action_select :

			if( action.zone )
			{
				arr.push(
					gleam_glint_paint.createFS(
						gruga_select.facet,
						action.zone.transform( transform )
					)
				);
			}

			break;
	}

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| Moving during an operation with the pointing device button held down.
*/
def.proto.dragMove =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	if( !action ) return 'pointer';

	this[ visual_space._dragMoveMap.get( action.timtype ) ]( p, shift, ctrl );
};


/*
| Starts an operation with the pointing device held down.
*/
def.proto.dragStart =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const access = this.access;

	const action = this.action;

	const frame = this.frame;

	const aType = action && action.timtype;

	// see if the frame was targeted
	if( access == 'rw' && frame && aType !== action_select )
	{
		if( frame.dragStart( p, shift, ctrl, access, action ) ) return;
	}

	const transform = this.transform;

	const dp = p.detransform( transform );

	if( aType === action_createGeneric ) { this._startCreateGeneric( p, shift ); return; }

	// see if one item was targeted
	for( let a = 0, al = this.length; a < al; a++ )
	{
		const item = this.atRank( a );

		if( item.dragStart( p, shift, ctrl, access, action ) ) return;
	}

	switch( aType )
	{
		case action_createRelation :

			root.create(
				'action',
					action.create(
						'offset', transform.offset,
						'relationState', 'pan',
						'startPoint', p
					)
			);

			return;

		case action_createStroke :

			root.create( 'action', action.create( 'from', dp ) );

			return;

		case action_select :

			root.create( 'action', action.create( 'startPoint', dp, 'toPoint', dp) );

			return;

		default :

			root.create(
				'action', action_pan.create( 'offset', transform.offset, 'startPoint', p )
			);

			return;
	}
};


/*
| Stops an operation with the poiting device button held down.
*/
def.proto.dragStop =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{

/**/if( CHECK )
/**/{
/**/	if( root.spaceVisual !== this ) throw new Error( );
/**/}

	const action = this.action;

	if( !action ) return;

	// FIXME make map
	switch( action.timtype )
	{
		case action_createGeneric : this._stopCreateGeneric( p, shift, ctrl ); break;

		case action_createRelation : this._stopCreateRelation( p, shift, ctrl ); break;

		case action_createStroke : this._stopCreateStroke( p, shift, ctrl ); break;

		case action_dragItems : this._stopDragItems( p, shift, ctrl ); break;

		case action_pan : root.create( 'action', undefined ); break;

		case action_resizeItems : this._stopDragResizeItems( p, shift, ctrl ); break;

		case action_scrolly : root.create( 'action', undefined ); break;

		case action_select : this._stopSelect( p, shift, ctrl ); break;

		default : throw new Error( );
	}

	return true;
};


/*
| Returns a list of visual items by a list of paths.
*/
def.proto.getList =
	function(
		paths
	)
{
/**/if( CHECK )
/**/{
/**/	if( paths.timtype !== pathList ) throw new Error( );
/**/
/**/	if( paths.length === 0 ) throw new Error( );
/**/}

	const items = [ ];

	for( let a = 0, al = paths.length; a < al; a++ )
	{
		const path = paths.get( a );

/**/	if( CHECK )
/**/	{
/**/		if( path.get( 0 ) !== 'spaceVisual' ) throw new Error( );
/**/
/**/		if( path.get( 1 ) !== 'twig' ) throw new Error( );
/**/	}

		items.push( this.get( path.get( 2 ) ) );
	}

	return visual_itemList.create( 'list:init', items );
};


/*
| Text input
*/
def.proto.input =
	function(
		text
	)
{
	const mark = this.mark;

	if( !mark || !mark.hasCaret ) return false;

	const path = mark.caret.path;

	const item = this.get( path.get( 2 ) );

	if( item ) item.input( text );
};


/*
| Mouse wheel.
*/
def.proto.mousewheel =
	function(
		p,     // cursor point
		dir,   // wheel direction, >0 for down, <0 for up
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const item = this.atRank( r );

		if( item.mousewheel( p, dir, shift, ctrl ) ) return true;
	}

	root.changeSpaceTransformPoint( dir > 0 ? 1 : -1, p );

	return true;
};


/*
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
def.proto.pointingHover =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const frame = this.frame;

	const aType = action && action.timtype;

	switch( aType )
	{
		case action_createRelation :

			if( action.relationState === 'start' )
			{
				for( let a = 0, al = this.length; a < al; a++ )
				{
					const item = this.atRank( a );

					// FIXME really tZone?
					if( item.tZone.within( p ) )
					{
						root.create( 'action', action.create( 'fromItemPath', item.path ) );

						return result_hover.cursorDefault;
					}
				}

				root.create( 'action', action.create( 'fromItemPath', undefined ) );

				return result_hover.cursorDefault;
			}

			break;

		case action_createStroke : return result_hover.cursorDefault;

		case action_dragItems : return result_hover.cursorGrabbing;

		case action_resizeItems : return action.resizeDir.resizeHoverCursor;

		case action_pan :

			if( action.startPoint ) return result_hover.cursorGrabbing;

			break;
	}

	if( frame && aType !== action_select )
	{
		const result = frame.pointingHover( p );

		if( result ) return result;
	}

	for( let a = 0, al = this.length; a < al; a++ )
	{
		const result = this.atRank( a ).pointingHover( p, action );

		if( result ) return result;
	}

	return(
		result_hover.create(
			'cursor', aType === 'action_select' ? 'crosshair' : 'pointer'
		)
	);
};


/*
| Tries to scrolls the focused item to move
| the mark into view.
*/
def.proto.scrollMarkIntoView =
	function( )
{
	const focus =  this.focus;

	if( focus && focus.scrollMarkIntoView ) focus.scrollMarkIntoView( );
};


/*
| The disc is shown while a space is shown.
*/
def.proto.showDisc = true;


/*
| User pressed a special key.
*/
def.proto.specialKey =
	function(
		key,   // key being pressed
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	if( ctrl )
	{
		switch( key )
		{
			case 'z' : root.doTracker.undo( ); return true;

			case 'y' : root.doTracker.redo( ); return true;

			case ',' : root.changeSpaceTransformCenter( 1 ); return true;

			case '.' : root.changeSpaceTransformCenter( -1 ); return true;
		}
	}

	const mark = this.mark;

	if( mark && mark.hasCaret )
	{
		const item = this.get( mark.caret.path.get( 2 ) );

		if( item ) item.specialKey( key, shift, ctrl );

		return;
	}

	if( ctrl )
	{
		switch( key )
		{
			case 'a' :
			{
				// selects all items in this space

				let paths = [ ];

				for( let r = 0, rZ = this.length; r < rZ; r++ )
				{
					paths.push( this.atRank( r ).path );
				}

				paths = pathList.create( 'list:init', paths );

				root.setUserMark( visual_mark_items.create( 'itemPaths', paths ) );

				return true;
			}
		}

		return true;
	}
};


/*
| Map of functions for a drag move.
*/
def.staticLazy._dragMoveMap = ( ) =>
	new Map( [
		[ action_createGeneric, '_moveCreateGeneric' ],
		[ action_createRelation, '_moveCreateRelation' ],
		[ action_createStroke, '_moveCreateStroke' ],
		[ action_pan, '_movePan' ],
		[ action_dragItems, '_moveDragItems' ],
		[ action_resizeItems, '_moveResizeItems' ],
		[ action_scrolly, '_moveScrollY' ],
		[ action_select, '_moveSelect' ],
	] );


/*
| The zoomGrid glint for this space.
*/
def.lazy._grid =
	function( )
{
	return(
		visual_grid.create(
			'transform', this.transform,
			'size', this.viewSize,
			'spacing', visual_space._standardSpacing
		)
	);
};


/*
| Returns true if doing snapping.
*/
def.proto._hasSnapping =
	function(
		ctrl // state of ctrl key (or defined)
	)
{
	return !ctrl && this.fabric.hasSnapping;
};


/*
| Returns true if the item ought to be highlighted.
*/
def.proto._highlightItem =
	function(
		item  // the item in question
	)
{
	const action = this.action;

	const att = action.timtype;

	if(
		att !== action_createRelation
		&& att !== action_createStroke
		&& att !== action_select
	) return false;

	return action.affectsItem( item );
};


/*
| Moves during creating.
*/
def.proto._moveCreate =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const action = this.action;

	const transform = this.transform;

	if( action.offset )
	{
		// panning while creating a relation

		const pd = p.sub( action.startPoint );

		root.create(
			'spaceTransform', transform.create( 'offset', action.offset.add( pd ) )
		);
	}
};


/*
| Moves during creating a generic item.
*/
def.proto._moveCreateGeneric =
	function(
		p,      // point, viewbased point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const action = this.action;

	// there isn't really a creation going on?
	if( !action.startPoint ) return;

	const transform = this.transform;

	const dp = this._snap( p, ctrl ).detransform( transform );

	let zone = gleam_rect.createArbitrary( action.startPoint, dp );

	const model = action.itemTim.model;

	let transientItem = action.transientItem;

	switch( action.itemType )
	{
		case 'note' :
		case 'portal' :

			zone = zone.ensureMinSize( model.minSize );

			transientItem =
				transientItem.create(
					'fabric', transientItem.fabric.create( 'zone', zone ),
					'transform', transform
				);

			break;

		case 'label' :
		{
			const fs = model.doc.fontsize * zone.height / model.zone.height;

			const resized =
				transientItem.create(
					'fabric', model.fabric.create( 'fontsize', fs )
				);

			const pos =
				( dp.x > action.startPoint.x )
				? zone.pos
				: gleam_point.xy(
					zone.pos.x + zone.width - resized.zone.width,
					zone.pos.y
				);

			transientItem =
				resized.create(
					'fabric', resized.fabric.create( 'pos', pos ),
					'transform', transform
				);

			break;
		}

		default : throw new Error( );
	}

	root.create(
		'action', action.create( 'transientItem', transientItem )
	);
};


/*
| Moves during creating a relation.
*/
def.proto._moveCreateRelation =
	function(
		p,      // point, viewbased point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const action = this.action;

	const transform = this.transform;

	if( action.relationState === 'pan' )
	{
		// panning while creating a relation

		const pd = p.sub( action.startPoint );

		root.create(
			'spaceTransform',
				transform.create(
					'offset', action.offset.add( pd )
				)
		);

		return;
	}

	// Looks if the action is dragging to an item
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		if( this.atRank( r ).createRelationMove( p, action ) ) return;
	}

	root.create(
		'action',
			action.create(
				'toItemPath', undefined,
				'toPoint', p
			)
	);
};


/*
| Moves during creating a stroke.
*/
def.proto._moveCreateStroke =
	function(
		p,      // point, viewbased point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const action = this.action;

	/*
	// Looks if the action is dragging to an item
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		if( this.atRank( r ).createRelationMove( p, action ) ) return;
	}
	*/

	root.create( 'action', action.create( 'to', p ) );
};


/*
| Moves during item dragging.
*/
def.proto._moveDragItems =
	function(
		p,       // point of stop
		shift,   // true if shift key was pressed
		ctrl     // true if ctrl key was pressed
	)
{
	const action = this.action;

	const startPoint = action.startPoint;

	const transform = this.transform;

	const startPos = action.startZone.pos;

	const dp = p.detransform( transform );

	let movedStartPos = startPos.add( dp ).sub( startPoint );

	if( this._hasSnapping( ctrl ) )
	{
		movedStartPos =
			this._snap( movedStartPos.transform( transform ) )
			.detransform( transform );
	}

	root.create( 'action', action.create( 'moveBy', movedStartPos.sub( startPos ) ) );

	//gleam_point.xy(
	//  transform.dex( p.x ) - startPoint.x,
	//  transform.dey( p.y ) - startPoint.y
	//)
};


/*
| Moves during item resizing.
*/
def.proto._moveResizeItems =
	function(
		p,     // point of stop
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const transform = this.transform;

	const pBase = action.pBase;

	const proportional = action.proportional;

	const resizeDir = action.resizeDir;

	const startPoint = action.startPoint;

	const startZone = action.startZone;

	const dp = p.detransform( transform );

	let scaleX, scaleY;

	{
		// start zone reference point
		const szrp = resizeDir.from( startZone );

		// distance of startPoint to szrp
		const disp = szrp.sub( startPoint );

		// end zone point
		let ezp = dp.add( disp );

		if( this._hasSnapping( ctrl ) )
		{
			// snap the endzone point
			ezp = this._snap( ezp.transform( transform ) ).detransform( transform );
		}

		if( resizeDir.hasY )
		{
			scaleY = ( pBase.y - ezp.y ) / ( pBase.y - szrp.y );

			if( scaleY < 0 ) scaleY = 0;
		}

		if( resizeDir.hasX )
		{
			scaleX = ( pBase.x - ezp.x ) / ( pBase.x - szrp.x );

			if( scaleX < 0 ) scaleX = 0;
		}
	}

	if( proportional )
	{
		if( scaleX === undefined ) scaleX = scaleY;
		else if( scaleY === undefined ) scaleY = scaleX;
	}
	else
	{
		if( scaleX === undefined ) scaleX = 1;

		if( scaleY === undefined ) scaleY = 1;
	}

	const paths = action.itemPaths;

	const startZones = action.startZones;

	for( let a = 0, al = paths.length; a < al; a++ )
	{
		const path = paths.get( a );

		const key = path.get( 2 );

		const item = this.get( key );

		const startZone = startZones.get( key );

		let min = item.minScaleX( startZone );

		if( scaleX < min ) scaleX = min;

		min = item.minScaleY( startZone );

		if( scaleY < min ) scaleY = min;
	}

	if( proportional ) scaleX = scaleY = Math.max( scaleX, scaleY );

	root.create( 'action', action.create( 'scaleX', scaleX, 'scaleY', scaleY ) );
};


/*
| Moves during panning.
*/
def.proto._movePan =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const transform = this.transform;

	const pd = p.sub( action.startPoint );

	root.create(
		'spaceTransform',
			transform.create(
				'offset', action.offset.add( pd )
			)
	);
};


/*
| Moves during selecting.
*/
def.proto._moveSelect =
	function(
		p         // point
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	if( action.itemPath )
	{
		const item = this.get( action.itemPath.get( 2 ) );

		return item.moveSelect( p );
	}

	root.create(
		'action', action.create( 'toPoint', p.detransform( this.transform ) )
	);
};


/*
| Moves during scrolling.
*/
def.proto._moveScrollY =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const item = this.get( action.scrollPath.get( -1 ) );

	const dy = ( p.y - action.startPoint.y ) / this.transform.zoom;

	const sbary = item.scrollbarY;

	let spos = action.startPos + sbary.scale( dy );

	if( spos < 0 ) spos = 0;

	root.setPath(
		item.path.append( 'scrollPos' ),
		item.scrollPos.create( 'y', spos )
	);
};


/*
| Takes the ranks of the fabric.
*/
def.lazy._ranks =
	function( )
{
	return this.fabric._ranks;
};


/*
| Snaps a point onto the grid.
*/
def.proto._snap =
	function(
		p,     // the point to snap
		ctrl   // if true don't to snapping (can be undefined)
	)
{
	if( !this._hasSnapping( ctrl ) ) return p;

	return this._grid.snap( p );
};


/*
| Standard grid spacing.
*/
def.staticLazy._standardSpacing = ( ) => gleam_point.xy( 15, 15 );


/*
| Starts creating a generic item.
*/
def.proto._startCreateGeneric =
	function(
		p,     // point of start
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const itemTim = action.itemTim;

	const model = itemTim.model;

	const dp = this._snap( p, ctrl ).detransform( this.transform );

	let transientItem;

	switch( itemTim.positioning )
	{
		case 'zone' :
		{
			let fabric  =
				model.fabric.create(
					'zone', gleam_rect.posSize( dp, model.minSize )
				);

			if( itemTim === visual_portal )
			{
				fabric =
					fabric.create(
						'spaceUser', root.userCreds.name,
						'spaceTag', 'home'
					);
			}

			transientItem =
				model.create(
					'fabric', fabric,
					'path', visual_space.transPath,
					'transform', this.transform
				);

			break;
		}

		case 'pos/fontsize' :

			transientItem =
				model.create(
					'fabric', model.fabric.create( 'pos', dp ),
					'path', visual_space.transPath,
					'transform', this.transform
				);

			break;

		default : throw new Error( );

	}

	root.create( 'action', action.create( 'startPoint', dp, 'transientItem', transientItem ) );
};


/*
| Stops creating a generic item.
*/
def.proto._stopCreateGeneric =
	function(
		p,     // point of stop
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	if( !action.startPoint ) return;

	const dp = this._snap( p, ctrl ).detransform( this.transform );

	action.itemTim.createGeneric( action, dp );

	root.create(
		'action',
			shift
			? action_createGeneric.create( 'itemType', action.itemType )
			: undefined
	);
};


/*
| Stops creating.
*/
def.proto._stopCreate =
	function(
		p,      // point of stop
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	root.create(
		'action', this.action.create( 'offset', undefined, 'startPoint', undefined )
	);
};


/*
| Stops creating a relation.
*/
def.proto._stopCreateRelation =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const action = this.action;

	switch( action.relationState )
	{
		case 'hadSelect' :

			if( action.toItemPath )
			{
				const item = this.get( action.toItemPath.get( -1 ) );

				item.createRelationStop( p );
			}

			root.create(
				'action',
				shift
				? action_createRelation.create( 'relationState', 'start' )
				: undefined
			);

			return;

		case 'start' : root.create( 'action', undefined ); return;

		case 'pan' :

			root.create( 'action', action.create( 'relationState', 'start' ) );

			return;

		default : throw new Error( );
	}
};


/*
| Stops creating a relation.
*/
def.proto._stopCreateStroke =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const val = this.action.transientFabric;

	const key = session_uid.newUid( );

	root.alter(
		change_grow.create(
			'val', val,
			'path', tim_path.empty.append( 'twig' ).append( key ),
			'rank', 0
		)
	);
};


/*
| Stops creating a relation.
*/
def.proto._stopDragItems =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const paths = this.action.itemPaths;

	let changes;

	for( let a = 0, al = paths.length; a < al; a++ )
	{
		const item = root.getPath( paths.get( a ) );

		const chi = item.getDragItemChange( );

		if( !chi ) continue;

		if( !changes )
		{
			changes = chi;
		}
		else
		{
			if( changes.timtype !== change_list )
			{
				changes = change_list.create( 'list:append', changes );
			}

			if( chi.timtype !== change_list )
			{
				changes = changes.create( 'list:append', chi );
			}
			else
			{
				changes = changes.appendList( chi );
			}
		}
	}

	if( changes ) root.alter( changes );

	root.create( 'action', undefined );
};


/*
| Stops creating a relation.
*/
def.proto._stopDragResizeItems =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const paths = this.action.itemPaths;

	let changes;

	for( let a = 0, al = paths.length; a < al; a++ )
	{
		const item = root.getPath( paths.get( a ) );

		const chi = item.getResizeItemChange( );

		if( !chi ) continue;

		if( !changes )
		{
			changes = chi;
		}
		else
		{
			if( changes.timtype !== change_list )
			{
				changes = change_list.create( 'list:append', changes );
			}

			if( chi.timtype !== change_list )
			{
				changes = changes.create( 'list:append', chi );
			}
			else
			{
				changes = changes.appendList( chi );
			}

		}
	}

	if( changes ) root.alter( changes );

	root.create( 'action', undefined );
};


/*
| Stops selecting.
*/
def.proto._stopSelect =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	let action = this.action;

/**/if( CHECK )
/**/{
/**/	if( action.timtype !== action_select ) throw new Error( );
/**/}

	action = action.create( 'toPoint', p.detransform( this.transform ) );

	let paths = [ ];

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const item = this.atRank( r );

		if( action.affectsItem( item ) ) paths.push( item.path );
	}

	action = shift ? action_select.create( ) : undefined;

	let mark = pass;

	if( paths.length > 0 )
	{
		paths = pathList.create( 'list:init', paths );

		if( !ctrl || !this.mark )
		{
			mark = visual_mark_items.create( 'itemPaths', paths );
		}
		else
		{
			mark =
				visual_mark_items.create(
					'itemPaths', paths.combine( this.mark.itemPaths )
				);
		}
	}

	root.create( 'action', action );

	root.setUserMark( mark );
};


/*
| Mapping of fabric item name to visual items.
*/
def.staticLazy._visualMap =
	function( )
{
	const map = new Map( );

	map.set( fabric_label, visual_label );
	map.set( fabric_note, visual_note );
	map.set( fabric_portal, visual_portal );
	map.set( fabric_relation, visual_relation );
	map.set( fabric_stroke, visual_stroke );

	if( FREEZE ) Object.freeze( map );

	return map;
};


} );
