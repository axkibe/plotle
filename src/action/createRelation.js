/*
| A user is creating a new relation.
*/
'use strict';


tim.define( module, ( def, action_createRelation ) => {


def.extend = './base';


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


const action_none = require( './none' );

const result_hover = require( '../result/hover' );

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

	// Looks if this action is dragging over an item
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

		if( !item.pointWithin( p ) ) continue;

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
	switch( this.relationState )
	{
		case 'hadSelect' :

			if( this.toItemPath )
			{
				const item = screen.get( this.toItemPath.get( -1 ) );

				item.createRelationStop( p );
			}

			root.create(
				'action',
				shift
				? action_createRelation.create( 'relationState', 'start' )
				: action_none.create( )
			);

			return;

		case 'start' : root.create( 'action', action_none.create( ) ); return;

		case 'pan' :

			root.create( 'action', this.create( 'relationState', 'start' ) );

			return;

		default : throw new Error( );
	}
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

	if( this.relationState === 'start' )
	{
		for( let a = 0, al = screen.length; a < al; a++ )
		{
			const item = screen.atRank( a );

			if( item.pointWithin( p ) )
			{
				root.create( 'action', this.create( 'fromItemPath', item.path ) );

				return result_hover.cursorDefault;
			}
		}

		root.create( 'action', this.create( 'fromItemPath', undefined ) );

		return result_hover.cursorDefault;
	}

	// otherwise forwards the pointingHover to the screen like action_none

	return screen.pointingHover( p, shift, ctrl );
};


} );
