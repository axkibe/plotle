/*
| A user is creating a new relation.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


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
def.proto.affectsItem =
	function(
		item
	)
{
	const path = item.path;

	return path.equals( this.fromItemPath ) || path.equals( this.toItemPath );
};


/*
| Drag moves during creating a relation.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		space,  // the visual space for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	if( this.relationState === 'pan' )
	{
		// panning while creating a relation
		const pd = p.sub( this.startPoint );

		// FIXME this is an akward call.
		root.create(
			'spaceTransform', space.transform.create( 'offset', this.offset.add( pd ) )
		);

		return;
	}

	// Looks if this action is dragging to an item
	// FIXME move somewhere else
	for( let r = 0, rZ = space.length; r < rZ; r++ )
	{
		if( space.atRank( r ).createRelationMove( p, this ) ) return;
	}

	root.create( 'action', this.create( 'toItemPath', undefined, 'toPoint', p ) );
};


} );
