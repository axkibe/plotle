/*
| The user is selecting stuff via a rectangle.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// if selecting ranges (text block), item to path
		itemPath : { type : [ 'undefined', 'tim.js/src/path' ] },

		// point at start of operation
		startPoint : { type : [ 'undefined', '../gleam/point' ] },

		// point the rectangle goes to
		toPoint : { type : [ 'undefined', '../gleam/point' ] },
	};
}


const gleam_rect = require( '../gleam/rect' );

const visual_space = require( '../visual/space' );


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
	const tZone = this.zone;

	if( !tZone ) return false;

	const tPos = tZone.pos;

	const iZone = item.zone;

	const iPos = iZone.pos;

	return(
		iPos.x >= tPos.x
		&& iPos.y >= tPos.y
		&& iPos.x + iZone.width <= tPos.x + tZone.width
		&& iPos.y + iZone.height <= tPos.y + tZone.height
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
	if( screen.timtype !== visual_space ) return;

	if( this.itemPath )
	{
		const item = screen.get( this.itemPath.get( 2 ) );

		return item.moveSelect( p );
	}

	root.create( 'action', this.create( 'toPoint', screen.pointToSpaceRS( p, false ) ) );
};


} );
