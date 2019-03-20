/*
| The user is dragging an item.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// the paths of the items to drag
		startItems : { type : [ 'undefined', '../fabric/itemSet' ] },

		// drags the items by this x/y
		moveBy : { type : '../gleam/point' },

		// the zone of items when started
		// (used for snapping)
		startZone : { type : '../gleam/rect' },

		// mouse down point on drag creation
		startPoint : { type : '../gleam/point' },
	};
}


const action_none = tim.require( './none' );

const change_list = tim.require( '../change/list' );

const fabric_space = tim.require( '../fabric/space' );

const result_hover = tim.require( '../result/hover' );


/*
| Returns true if an entity with path is affected by this action.
| FIXME remove
*/
def.proto.affectsItem =
	function(
		item
	)
{
	/*
	const paths = this.itemPaths;

	for( let a = 0, pLen = paths.length; a < pLen; a++ )
	{
		const pa = paths.get( a );

		if( pa.equals( item.path ) ) return true;
	}
	*/
	console.log( 'FIXME remove' );

	return false;
};


/*
| Returns a zone affected by this action.
| FIXME remove
*/
def.proto.affectZone =
	function(
		zone,      // the unaffected zone
		minSize    // minimum size of the zone
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/}

	return zone.add( this.moveBy );
};


/*
| Returns a zone affected by this action.
| FIXME remove
*/
def.proto.affectPoint =
	function(
		p   // the unaffected point
	)
{
	return p.add( this.moveBy );
};


/*
| The changes this action applies on the fabric tree.
*/
def.lazy.changes =
	function( )
{
	let changes = change_list.create( );

	const it = this.startItems.iterator( );

	for( let i = it.next( ); !i.done; i = it.next( ) )
	{
		const item = i.value;

		const chi = item.getActionChanges( this );

		if( chi.timtype !== change_list )
		{
			changes = changes.create( 'list:append', chi );
		}
		else
		{
			changes = changes.appendList( chi );
		}
	}

	return changes;
};


/*
| Drag moves during item dragging.
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

	const startPoint = this.startPoint;

	const transform = screen.transform;

	const startPos = this.startZone.pos;

	const dp = p.detransform( transform );

	let movedStartPos = startPos.add( dp ).sub( startPoint );

	// FIXME decomplicated this.
	movedStartPos = screen.pointToSpaceRS( movedStartPos.transform( transform ), !ctrl );

	root.alter( 'action', this.create( 'moveBy', movedStartPos.sub( startPos ) ) );
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
	root.alter( 'action', action_none.singleton, 'change', this.changes );
};


/*
| 'Normal' button ought to be down during this action.
*/
def.proto.normalButtonDown = true;


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

	return result_hover.cursorGrabbing;
};


} );
