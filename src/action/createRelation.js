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


const visual_space = require( '../visual/space' );


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
| Drag moves.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	// this action only makes sense on spaces
	if( screen.timtype !== visual_space ) return;

	if( this.relationState === 'pan' )
	{
		// panning while creating a relation
		const pd = p.sub( this.startPoint );

		// FIXME this is an akward call.
		root.create(
			'spaceTransform', screen.transform.create( 'offset', this.offset.add( pd ) )
		);

		return;
	}

	// Looks if this action is dragging to an item
	for( let r = 0, rZ = screen.length; r < rZ; r++ )
	{
		const item = screen.atRank( r );

		if( item.tZone.within( p ) )
		{
			root.create( 'action', this.create( 'toItemPath', item.path ) );

			return;
		}
	}

	root.create( 'action', this.create( 'toItemPath', undefined, 'toPoint', p ) );
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
	if( screen.timtype !== visual_space ) return;

	// see if one item was targeted
	for( let a = 0, al = screen.length; a < al; a++ )
	{
		const item = screen.atRank( a );

		if( !item.tShape.within( p ) ) continue;

		root.create(
			'action',
				this.create(
					'fromItemPath', item.path,
					'relationState', 'hadSelect',
					'toPoint', p
				)
		);

		return;
	}

	root.create(
		'action',
			this.create(
				'offset', screen.transform.offset,
				'relationState', 'pan',
				'startPoint', p
			)
	);
};


} );
