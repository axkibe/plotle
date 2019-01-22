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
def.func.affectsItem =
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


} );

