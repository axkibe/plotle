/*
| The user is selecting stuff via a rectangle.
*/
'use strict';


// FIXME
var
	gleam_rect;


tim.define( module, 'action_select', ( def, action_select ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		itemPath :
		{
			// if selecting ranges (text block), item to path
			type : [ 'undefined', 'tim$path' ]
		},
		startPoint :
		{
			// point at start of operation
			type : [ 'undefined', 'gleam_point' ]
		},
		toPoint :
		{
			// point the rectangle goes to
			type : [ 'undefined', 'gleam_point' ]
		}
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns true if an entity with path is affected by this action.
*/
def.func.affects =
	function(
		path
	)
{
	const tZone = this.zone;

	if( !tZone ) return false;

	const item = root.getPath( path );

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
