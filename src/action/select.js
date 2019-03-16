/*
| The user is selecting stuff via a rectangle.
*/
'use strict';


tim.define( module, ( def, action_select ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// if selecting ranges (text block), item to path
		itemPath : { type : [ 'undefined', 'tim.js/path' ] },

		// point at start of operation
		startPoint : { type : [ 'undefined', '../gleam/point' ] },

		// point the rectangle goes to
		toPoint : { type : [ 'undefined', '../gleam/point' ] },
	};
}


const action_none = tim.require( './none' );

const fabric_space = tim.require( '../fabric/space' );

const gleam_rect = tim.require( '../gleam/rect' );

const result_hover = tim.require( '../result/hover' );

const tim_path_list = tim.require( 'tim.js/pathList' );

const visual_mark_items = tim.require( '../visual/mark/items' );


/*
| Zone of the action.
*/
def.lazy.zone =
	function( )
{
	return(
		this.startPoint
		&& gleam_rect.createArbitrary( this.startPoint, this.toPoint )
	);
};


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	const zone = this.zone;

	if( !zone ) return false;

	const tPos = zone.pos;

	const iZone = item.zone;

	const iPos = iZone.pos;

	return(
		iPos.x >= tPos.x
		&& iPos.y >= tPos.y
		&& iPos.x + iZone.width <= tPos.x + zone.width
		&& iPos.y + iZone.height <= tPos.y + zone.height
	);
};


/*
| Drag moves during selecting.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	// this action only makes sense on spaces
	if( screen.timtype !== fabric_space ) return;

	if( this.itemPath )
	{
		const item = screen.get( this.itemPath.get( 2 ) );

		return item.moveSelect( p );
	}

	root.create( 'action', this.create( 'toPoint', screen.pointToSpaceRS( p, false ) ) );
};


/*
| Starts a drag.
*/
def.proto.dragStart =
	function(
		p,     // cursor point
		screen, // the screen for this operation
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	// this action only makes sense on spaces
	if( screen.timtype !== fabric_space ) return;

	const ps = screen.pointToSpaceRS( p, !ctrl );

	root.create( 'action', this.create( 'startPoint', ps, 'toPoint', ps ) );
};


/*
| Stops a drag.
*/
def.proto.dragStop =
	function(
		p,      // point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	let action = this.create( 'toPoint', screen.pointToSpaceRS( p, false ) );

	let paths = [ ];

	for( let r = 0, rZ = screen.length; r < rZ; r++ )
	{
		const item = screen.atRank( r );

		if( action.affectsItem( item ) ) paths.push( item.path );
	}

	let mark = pass;

	if( paths.length > 0 )
	{
		paths = tim_path_list.create( 'list:init', paths );

		if( !ctrl || !screen.mark )
		{
			mark = visual_mark_items.create( 'itemPaths', paths );
		}
		else
		{
			mark =
				visual_mark_items.create(
					'itemPaths', paths.combine( screen.mark.itemPaths )
				);
		}
	}

	root.create( 'action', shift ? action_select.create( ) : action_none.create( ) );

	root.setUserMark( mark );
};


/*
| Returns true if the item should be highlighted.
| Default, don't highlight items.
*/
def.proto.highlightItem = function( item ) { return this.affectsItem( item ); };



/*
| Mouse hover.
|
| Returns a result_hover with hovering path and cursor to show.
*/
def.proto.pointingHover =
	function(
		p,     // cursor point
		screen, // the screen for this operation
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	return result_hover.cursorCrosshair;
};


} );
