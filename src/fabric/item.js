/*
| Everything there is in a space.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| This tim needs to be extended.
*/
def.abstract = true;


def.extend = './fiber';


if( TIM )
{
	def.attributes =
	{
		// the keys of the items this item affects (for ancillaries)
		affects : { type : [ 'undefined', 'tim.js/stringSet' ] },

		// true if the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

		// node currently hovered upon
		// defaults to not accepting hovers
		// no json thus not saved or transmitted
		hover : { type : 'undefined' },

		// the trace of the item
		// no json thus not saved or transmitted
		trace : { type : [ 'undefined', '../trace/item' ] },
	};
}


const action_createRelation = tim.require( '../action/createRelation' );

const action_dragItems = tim.require( '../action/dragItems' );

const action_none = tim.require( '../action/none' );

const gleam_point = tim.require( '../gleam/point' );

const mark_items = tim.require( '../mark/items' );


/*
| The changes needed for secondary data to adapt to primary.
*/
def.proto.ancillary = ( ) => undefined;


/*
| Returns the action if an item concerns about it.
*/
def.static.concernsAction =
	function(
		action,
		item
	)
{
	if( action.timtype === action_none ) return action;

	if( !item || !item.trace ) return action_none.singleton;

	return action.affectsItem( item ) ? action : action_none.singleton;
};


/*
| Returns the action if a 'trace'-d item with concerns about a hover.
*/
def.static.concernsHover =
def.proto.concernsHover =
	( hover, trace ) => undefined;


/*
| Returns the mark if a 'trace'-d item concerns about a mark.
*/
def.static.concernsMark =
	function(
		mark,
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/}

	if( !mark || !trace ) return;

	if( mark.encompasses( trace ) ) return mark;
};


/*
| A createRelation action stops.
*/
def.proto.createRelationStop =
	function(
		p
	)
{
	const action = this.action;

/**/if( CHECK )
/**/{
/**/	if( action.timtype !== action_createRelation ) throw new Error( );
/**/}

	if( !this.tZone.within( p ) ) return false;

	root.spawnRelation( root.space.get( action.fromItemPath.get( -1 ) ), this );

	return true;
};


/*
| Dragging start.
*/
def.static.dragStart =
def.proto.dragStart =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl,    // true if ctrl or meta key was held down
		action   // current action
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	if( !this.pointWithin( p ) ) return;

	// dragging
	if( this.access !== 'rw' ) return;

	let mark = this.mark;

	if( !mark || mark.timtype !== mark_items )
	{
		mark = mark_items.createWithOne( this.trace );
	}

	const items = root.space.getSet( mark.itemsMark );

	root.alter(
		'action',
			action_dragItems.create(
				'items', items,
				'moveBy', gleam_point.zero,
				'startPoint', p.detransform( this.transform ),
				'startZone', this.zone
			),
		'mark', mark
	);

	return true;
};


/*
| Nofication when the item lost the users mark.
| Defaults to doing nothing about it.
*/
def.proto.markLost = function( ){ };


/*
| Returns true if a point is within
| the item.
*/
def.proto.pointWithin =
	function(
		p
	)
{
	return this.tZone.within( p ) && this.tShape.within( p );
};


/*
| Zone in current transform.
*/
def.lazy.tZone =
	function( )
{
	return this.zone.transform( this.transform );
};


/*
| Generic ctrl click handler.
|
| Takes care about mutli-selecting item groups by ctrl+click.
|
| Returns true if it handled the click event.
*/
def.proto._ctrlClick =
	function(
		p,     // the point clicked
		shift, // true if shift key was pressed
		mark   // the current user mark
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	if( this.access !== 'rw' ) return false;

	if( !mark )
	{
		root.alter( 'mark', mark_items.createWithOne( this.trace ) );

		return true;
	}

	root.alter( 'mark', mark.itemsMark.toggle( this.trace ) );
};


/*
| The shape in current transform.
*/
def.lazy.tShape =
	function( )
{
	return this.shape.transform( this.transform );
};


} );
