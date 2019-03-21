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
		items : { type : [ 'undefined', '../fabric/itemSet' ] },

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

const change_set = tim.require( '../change/set' );

const fabric_space = tim.require( '../fabric/space' );

const result_hover = tim.require( '../result/hover' );


/*
| The changes this action applies on the fabric tree.
*/
def.lazy.changes =
	function( )
{
	const moveBy = this.moveBy;

	const changes = [ ];

	if( moveBy.x === 0 && moveBy.y === 0 ) return change_list.empty;

	for( let item of this.items.iterator( ) )
	{
		if( item.actionAffectsZone )
		{
			const iZone = item.zone;

			const aZone = iZone.add( moveBy );

			changes.push(
				change_set.create(
					'path', item.path.chop.append( 'zone' ),
					'val', aZone,
					'prev', iZone
				)
			);
		}

		if( item.actionAffectsPosFs )
		{
			const iPos = item.pos;

			const aPos = iPos.add( moveBy );

			changes.push(
				change_set.create(
					'path', item.path.chop.append( 'pos' ),
					'val', aPos,
					'prev', iPos
				)
			);
		}
	}

	return change_list.create( 'list:init', changes );
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
