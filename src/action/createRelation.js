/*
| A user is creating a new relation.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the item the relation goes from
		fromItemPath : { type : [ 'undefined', 'tim.js/src/path' ] },

		// offset when panning during creation
		offset : { type : [ 'undefined', '../gleam/point' ] },

		// the item the relation goes to
		toItemPath : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the arrow destination while its floating
		toPoint : { type : [ 'undefined', '../gleam/point' ] },

		// FUTURE make a defined state list
		// the state of the relation creation
		relationState : { type : 'string' },

		// mouse down point on drag creation
		startPoint : { type : [ 'undefined', '../gleam/point' ] },
	};
}


/*
| Returns true if an entity with path is affected by this action.
*/
def.func.affectsItem =
	function(
		item
	)
{
	const path = item.path;

	return path.equals( this.fromItemPath ) || path.equals( this.toItemPath );
};


} );
