/*
| A space.
*/
'use strict';


tim.define( module, ( def, fabric_space ) => {


def.extend = './fiber';


if( TIM )
{
	def.attributes =
	{
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

		// reference to this space
		// no json thus not saved or transmitted
		ref : { type : [ 'undefined', '../ref/space' ] },

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

const fabric_itemSet = tim.require( './itemSet' );

const fabric_note = tim.require( './note' );

const gleam_arrow = tim.require( '../gleam/arrow' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gruga_note = tim.require( '../gruga/note' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gruga_relation = tim.require( '../gruga/relation' );

const gruga_select = tim.require( '../gruga/select' );

const result_hover = tim.require( '../result/hover' );

const tim_path = tim.require( 'tim.js/path' );

const trace_item = tim.require( '../trace/item' );

const trace_root = tim.require( '../trace/root' );

const visual_frame = tim.require( '../visual/frame' );

const visual_grid = tim.require( '../visual/grid' );

const mark_items = tim.require( '../mark/items' );


/*
| Gathers the ancillary changes for a changeList.
|
| Returns the ancillary changes.
*/
def.proto.ancillary =
	function(
		affectedTwigItems
	)
{
	let change;

	// FUTURE for( let key of affectedTwigItems )
	for( let item of this )
	{
		let ia = item.ancillary( this );

		if( !ia ) continue;

/**/	if( CHECK )
/**/	{
/**/		if( ia.length === 0 ) throw new Error( );
/**/	}

		if( !change ) { change = ia; continue; }

		// other ancillary changes might affect this change
		// notably the ranking in case of "shrinks"
		ia = change.transform( ia );

		change = change.appendList( ia );
	}

	return change;
};



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
| The zone encompassing all items.
*/
def.lazy.allItemsZone =
	function( )
{
	let first = true;

	let wx, ny, ex, sy;

	for( let item of this )
	{
		const zone = item.zone;

		const pos = zone.pos;

		if( first )
		{
			wx = pos.x;

			ny = pos.y;

			ex = pos.x + zone.width;

			sy = pos.y + zone.height;

			first = false;
		}
		else
		{
			if( pos.x < wx ) wx = pos.x;

			if( pos.y < ny ) ny = pos.y;

			if( pos.x + zone.width > ex ) ex = pos.x + zone.width;

			if( pos.y + zone.height > sy ) sy = pos.y + zone.height;
		}
	}

	return(
		gleam_rect.create(
			'pos', gleam_point.createXY( wx, ny ),
			'height', sy - ny,
			'width', ex - wx
		)
	);
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

	// clicked some item?
	for( let item of this )
	{
		if( item.click( p, shift, ctrl, this.mark ) ) return true;
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
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	if( !mark ) return;

	if( mark.encompasses( fabric_space.spaceTrace ) ) return mark;
};


/*
| Returns the mark if the space concerns about a mark.
*/
def.static.concernsTMark = ( mark ) => mark && mark.hasSpace ? mark : undefined;


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
	for( let item of this )
	{
		if( item.dragStart( p, shift, ctrl, action ) ) return;
	}

	root.alter(
		'action', action_pan.create( 'offset', this.transform.offset, 'startPoint', p )
	);
};


/*
| Determines the focused item.
*/
def.lazy.focus =
	function( )
{
	const mark = this.mark;

	if( !mark ) return;

	const im = mark.itemsMark;

	if( !im || im.size !== 1 ) return;

	const trace = im.trivial;

	return this.get( trace.key );
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

	if( !mark.itemsMark ) return;

	const content = this.getSet( mark.itemsMark );

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

	const path = fabric_space.spacePath.append( 'twig' ).append( key );

	const trace = fabric_space.spaceTrace.appendItem( key );

	// this is all that's needed for server side
	if( NODE ) return item.create( 'path', path, 'trace', trace );

	const mark = fabric_item.concernsMark( this.mark, path, trace );

	let highlight = !!( mark && mark.encompasses( trace ) );

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
				'trace', trace,
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
				'trace', trace,
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
		itemsMark
	)
{
/**/if( CHECK )
/**/{
/**/	if( itemsMark.timtype !== mark_items ) throw new Error( );
/**/
/**/	if( itemsMark.size === 0 ) throw new Error( );
/**/}

	const items = new Set( );

	for( let trace of itemsMark )
	{
/**/	if( CHECK )
/**/	{
/**/		if( trace.timtype !== trace_item ) throw new Error( );
/**/	}

		items.add( this.get( trace.key ) );
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

	for( let item of this.reverse( ) )
	{
		arr.push( item.glint );
	}

	const frame = this.frame;

	if( frame ) arr.push( frame.glint );

	switch( action.timtype )
	{
		case action_createGeneric :
		case action_createStroke :

			if( action.transientItem ) arr.push( action.transientItem.glint );

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
						gleam_glint_paint.createFacetShape(
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
					gleam_glint_paint.createFacetShape(
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
	for( let item of this )
	{
		if( item.mousewheel( p, dir, shift, ctrl ) ) return true;
	}

	root.changeSpaceTransformPoint( dir > 0 ? 1 : -1, p );

	return true;
};


/*
| Adjusts the path attribute to a default.
*/
def.adjust.path = ( path ) => path || fabric_space.spacePath;


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

	for( let item of this )
	{
		const result = item.pointingHover( p, action );

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
	if( !snap || !this.hasSnapping ) return p.detransform( this.transform );

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
| Trace of the space.
*/
def.staticLazy.spaceTrace = ( ) => trace_root.singleton.appendSpace;


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
		const item = this.get( mark.caretOffset.traceItem.key );

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

				const set = new Set( );

				// FIXME make this a lazy
				for( let item of this ) set.add( item.trace );

				root.alter( 'mark', mark_items.create( 'set:init', set ) );

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
| The trace for transientItems
*/
def.staticLazy.transTrace = ( ) => fabric_space.spaceTrace.appendItem( ':transient' );


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
| Standard grid spacing.
*/
def.staticLazy._standardSpacing = ( ) =>
	gleam_point.createXY( 15, 15 );


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
