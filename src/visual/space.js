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
		access : { type : 'string' },

		// current action
		action : { type : [ '< ../action/types' ] },

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

const action_pan = require( '../action/pan' );

const action_select = require( '../action/select' );

const fabric_label = require( '../fabric/label' );

const fabric_note = require( '../fabric/note' );

const fabric_portal = require( '../fabric/portal' );

const fabric_relation = require( '../fabric/relation' );

const fabric_stroke = require( '../fabric/stroke' );

const gleam_arrow = require( '../gleam/arrow' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_point = require( '../gleam/point' );

const gruga_note = require( '../gruga/note' );

const gruga_relation = require( '../gruga/relation' );

const gruga_select = require( '../gruga/select' );

const pathList = require( 'tim.js/src/pathList' );

const result_hover = require( '../result/hover' );

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
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	const frame = this.frame;

	if( frame && frame.click( p, shift, ctrl ) ) return true;

	const mark = this.mark;

	// clicked some item?
	for( let a = 0, al = this.length; a < al; a++ )
	{
		const item = this.atRank( a );

		if( item.click( p, shift, ctrl, mark ) ) return true;
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
| Transforms the fabric items into visual items.
*/
def.adjust.get =
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

	if( !highlight && item.timtype ) highlight = this.action.highlightItem( item );

	const hover = item.concernsHover( this.hover, path );

	const access = this.access;

	if( item === visual_note || item.timtype === visual_note )
	{
		item =
			item.create(
				'access', access,
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
				'access', access,
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
		const aperture = item.zone( ).height - gruga_note.innerMargin.y;

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

	action2 = visual_item.concernsAction( this.action, item );

	// checks if the highlight feature has changed on the created item
	if( !highlight2 && action2 && item.timtype ) highlight2 = this.action.highlightItem( item );

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
def.adjust.frame =
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

	return(
		frame.create(
			'access', this.access,
			'content', content,
			'transform', this.transform
		)
	);
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

	switch( action.timtype )
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

				const fromJoint = fromItem.shape( );

				if(
					action.toItemPath
					&& !action.toItemPath.equals( action.fromItemPath )
				)
				{
					// arrow connects two items
					toJoint = toItem.shape( );
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

	const frame = this.frame;

	// see if the frame was targeted
	if( access == 'rw' && frame && frame.dragStart( p, shift, ctrl ) ) return;

	// see if one item was targeted
	for( let a = 0, al = this.length; a < al; a++ )
	{
		const item = this.atRank( a );

		if( item.dragStart( p, shift, ctrl ) ) return;
	}

	root.create(
		'action',
			action_pan.create(
				'offset', this.transform.offset,
				'startPoint', p
			)
	);
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

	// FIXME make map
	switch( this.action.timtype )
	{

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
| Returns a result_hover with hovering path and cursor to show.
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

	const aType = action.timtype;

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

	return result_hover.create( 'cursor', aType === action_select ? 'crosshair' : 'pointer' );
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
| Takes the ranks of the fabric.
*/
def.lazy._ranks =
	function( )
{
	return this.fabric._ranks;
};


/*
| (De)transforms a point from visual reference system (VisualRS) to
| space reference system (SpaceRS)
*/
def.proto.pointToSpaceRS =
	function(
		p,    // the point in visual RS
		snap  // if true snap if enabled for space
	)
{
	if( !snap || !this.fabric.hasSnapping )
	{
		return p.detransform( this.transform );
	}

	return this._grid.snap( p ).detransform( this.transform );
};


/*
| Standard grid spacing.
*/
def.staticLazy._standardSpacing = ( ) => gleam_point.xy( 15, 15 );


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
	root.create( 'action', this.action.create( 'offset', undefined, 'startPoint', undefined ) );
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
