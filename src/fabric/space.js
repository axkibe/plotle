/*
| A space.
*/
'use strict';


tim.define( module, ( def, fabric_space ) => {


if( TIM )
{
	def.attributes =
	{
		// rights the current user has for this space
		// no json thus not saved or transmitted
		access : { type : [ 'undefined', 'string' ] },

		// current action
		// no json thus not saved or transmitted
		action : { type : [ 'undefined', '< ../action/types' ] },

		// the alteration frame
		frame : { type : [ 'undefined', '../visual/frame' ] },

		// this space has a grid.
		// no json thus not saved or transmitted
		hasGrid : { type : 'boolean', defaultValue : 'true', json: true, },

		// node currently hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// this space has grid snapping
		// no json thus not saved or transmitted
		hasSnapping : { type : 'boolean', defaultValue : 'true', json: true },

		// the path of the space
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// reference to this space
		// no json thus not saved or transmitted
		ref : { type : [ 'undefined', '../ref/space' ] },

		// the users mark
		// no json thus not saved or transmitted
		mark : { type : [ 'undefined', '< ../visual/mark/types' ] },

		// the current transform of space
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },

		// current view size
		// no json thus not saved or transmitted
		viewSize : { type : [ 'undefined', '../gleam/size' ] }
	};

	def.twig = [ '< ./item-types' ];

	def.json = 'space';
}


const action_createGeneric = tim.require( '../action/createGeneric' );

const action_createRelation = tim.require( '../action/createRelation' );

const action_createStroke = tim.require( '../action/createStroke' );

const action_pan = tim.require( '../action/pan' );

const action_select = tim.require( '../action/select' );

const fabric_item = tim.require( './item' );

const fabric_itemSet = tim.require( '../fabric/itemSet' );

const fabric_note = tim.require( './note' );

const gleam_arrow = tim.require( '../gleam/arrow' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_point = tim.require( '../gleam/point' );

const gruga_note = tim.require( '../gruga/note' );

const gruga_relation = tim.require( '../gruga/relation' );

const gruga_select = tim.require( '../gruga/select' );

const result_hover = tim.require( '../result/hover' );

const tim_path = tim.require( 'tim.js/path' );

const tim_path_list = tim.require( 'tim.js/pathList' );

const visual_frame = tim.require( '../visual/frame' );

const visual_grid = tim.require( '../visual/grid' );

const visual_mark_items = tim.require( '../visual/mark/items' );


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

	if( !ctrl ) root.alter( 'mark', undefined );

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
	return( hover && hover.get( 0 ) === 'space' ? hover : undefined );
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
		( mark && mark.containsPath( fabric_space.spacePath ) )
		? mark
		: undefined
	);
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

	const action = this.action;

	// see if one item was targeted
	for( let a = 0, al = this.length; a < al; a++ )
	{
		if( this.atRank( a ).dragStart( p, shift, ctrl, action ) ) return;
	}

	root.alter(
		'action', action_pan.create( 'offset', this.transform.offset, 'startPoint', p )
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
/**/	if( root.space !== this ) throw new Error( );
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

	const content = this.getSet( mark.itemPaths );

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
| Adjusts the items (used in shell)
*/
def.adjust.get =
	function(
		key,   // key of the visual item to be retrieved
		item   // the unaltered item.
	)
{
	if( !item ) return;

	let path;

	if( item.path && item.key === key ) path = item.path;
	else path = fabric_space.spacePath.append( 'twig' ).appendNC( key );

	// this is all thats needed for serverside
	if( NODE ) return item.create( 'path', path );

	const mark = fabric_item.concernsMark( this.mark, path );

	let highlight = !!( mark && mark.containsPath( path ) );

	if( !highlight && item.timtype ) highlight = this.action.highlightItem( item );

	const hover = item.concernsHover( this.hover, path );

	const access = this.access;

	if( item === fabric_note || item.timtype === fabric_note )
	{
		item =
			item.create(
				'access', access,
				'highlight', highlight,
				'hover', hover,
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
				'highlight', highlight,
				'hover', hover,
				'mark', mark,
				'path', path,
				'transform', this.transform
			);
	}

	if( item.timtype === fabric_note )
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

	let highlight2 = highlight;

	// FIXME take scrollPos into redo

	// checks if the highlight feature has changed on the created item
	if( !highlight2 && item.timtype ) highlight2 = this.action.highlightItem( item );

	if( highlight2 !== highlight ) item = item.create( 'highlight', highlight2 );

	return item;
};


/*
| Returns a set of items by a list of paths. // FIXME set of paths
*/
def.proto.getSet =
	function(
		paths
	)
{
/**/if( CHECK )
/**/{
/**/	if( paths.timtype !== tim_path_list ) throw new Error( );
/**/
/**/	if( paths.length === 0 ) throw new Error( );
/**/}

	const items = new Set( );

	for( let a = 0, al = paths.length; a < al; a++ )
	{
		const path = paths.get( a );

/**/	if( CHECK )
/**/	{
/**/		if( path.get( 0 ) !== 'space' ) throw new Error( );
/**/
/**/		if( path.get( 1 ) !== 'twig' ) throw new Error( );
/**/	}

		items.add( this.get( path.get( 2 ) ) );
	}

	return fabric_itemSet.create( 'set:init', items );
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
	if( this.hasGrid ) arr.push( this._grid.glint );

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
| Adjusts the path attribute to a default.
*/
def.adjust.path =
	function(
		path
	)
{
	if( path ) return path;

	return tim_path.empty.append( 'space' );
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
| (De)transforms a point from visual reference system (VisualRS) to
| space reference system (SpaceRS)
*/
def.proto.pointToSpaceRS =
	function(
		p,    // the point in visual RS
		snap  // if true snap if enabled for space
	)
{
	if( !snap || !this.hasSnapping )
	{
		return p.detransform( this.transform );
	}

	return this._grid.snap( p ).detransform( this.transform );
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
| Path of the space.
*/
def.staticLazy.spacePath = ( ) => tim_path.empty.append( 'space' );


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

				paths = tim_path_list.create( 'list:init', paths );

				root.alter( 'mark', visual_mark_items.create( 'itemPaths', paths ) );

				return true;
			}
		}

		return true;
	}
};


/*
| The path for transientItems
*/
def.staticLazy.transPath = ( ) => fabric_space.spacePath.append( ':transient' );


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
			'spacing', fabric_space._standardSpacing
		)
	);
};


/*
| Moves during creating.
| FIXME cleanup
*/
/*
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

		root.alter(
			'spaceTransform', transform.create( 'offset', action.offset.add( pd ) )
		);
	}
};
*/


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
	root.alter( 'action', this.action.create( 'offset', undefined, 'startPoint', undefined ) );
};


} );
