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
		fromItemTrace : { type : [ 'undefined', '../trace/item' ] },

		// offset when panning during creation
		offset : { type : [ 'undefined', '../gleam/point' ] },

		// the item the relation goes to
		toItemTrace : { type : [ 'undefined', '../trace/item' ] },

		// the arrow destination while its floating
		toPoint : { type : [ 'undefined', '../gleam/point' ] },

		// TODO make a defined state list
		// the state of the relation creation
		relationState : { type : 'string' },

		// mouse down point on drag creation
		startPoint : { type : [ 'undefined', '../gleam/point' ] },
	};
}


const action_none = tim.require( './none' );
const fabric_space = tim.require( '../fabric/space' );
const result_hover = tim.require( '../result/hover' );


/*
| Returns true if an item is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	const trace = item.trace;

	return trace.equals( this.fromItemTrace ) || trace.equals( this.toItemTrace );
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
	if( screen.timtype !== fabric_space ) return;

	if( this.relationState === 'pan' )
	{
		// panning while creating a relation
		const pd = p.sub( this.startPoint );

		// FIXME this is an akward call.
		root.alter(
			'spaceTransform', screen.transform.create( 'offset', this.offset.add( pd ) )
		);

		return;
	}

	// Looks if this action is dragging over an item
	for( let item of screen )
	{
		if( item.tZone.within( p ) )
		{
			root.alter( 'action', this.create( 'toItemTrace', item.trace ) );

			return;
		}
	}

	root.alter( 'action', this.create( 'toItemTrace', undefined, 'toPoint', p ) );
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

	// see if one item was targeted
	for( let item of screen )
	{
		if( !item.pointWithin( p ) ) continue;

		root.alter(
			'action',
				this.create(
					'fromItemTrace', item.trace,
					'relationState', 'hadSelect',
					'toPoint', p
				)
		);

		return;
	}

	root.alter(
		'action',
			this.create(
				'offset', screen.transform.offset,
				'relationState', 'pan',
				'startPoint', p
			)
	);
};


/*
| A createRelation action stops.
*/
def.proto.createRelationStop =
	function(
		p
	)
{
	if( !this.tZone.within( p ) ) return false;


	return true;
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

			if( this.toItemTrace )
			{
				root.spawnRelation(
					screen.get( this.fromItemTrace.key ),
					screen.get( this.toItemTrace.key )
				);
			}

			root.alter(
				'action',
				shift
				? action_createRelation.create( 'relationState', 'start' )
				: action_none.singleton
			);

			return;

		case 'start' : root.alter( 'action', action_none.singleton ); return;

		case 'pan' :

			root.alter( 'action', this.create( 'relationState', 'start' ) );

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
| Returns a result_hover with hovering trace and cursor to show.
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
				root.alter( 'action', this.create( 'fromItemTrace', item.trace ) );

				return result_hover.cursorDefault;
			}
		}

		root.alter( 'action', this.create( 'fromItemTrace', undefined ) );

		return result_hover.cursorDefault;
	}

	// otherwise forwards the pointingHover to the screen like action_none

	return screen.pointingHover( p, shift, ctrl );
};


} );
