/*
| A user is creating a new stroke.
*/
'use strict';


tim.define( module, ( def, action_createStroke ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// the joint the stroke goes from
		j1 : { type : [ 'undefined', '../trace/item', '../gleam/point' ] },

		// the item trace hovered upon
		hover : { type : [ 'undefined', '../trace/item' ] },

		// the item trace or pos the stroke goes to
		j2 : { type : [ 'undefined', '../trace/item', '../gleam/point' ] },

		// the transient stroke in creation
		transientItem : { type : [ 'undefined', '< ../fabric/item-types' ] },

		// the itemType of stroke ("arrow" or "line")
		itemType : { type : 'string' },
	};
}


const action_none = tim.require( './none' );
const change_grow = tim.require( '../change/grow' );
const fabric_space = tim.require( '../fabric/space' );
const fabric_stroke = tim.require( '../fabric/stroke' );
const gleam_line = tim.require( '../gleam/line' );
const gleam_transform = tim.require( '../gleam/transform' );
const result_hover = tim.require( '../result/hover' );
const session_uid = tim.require( '../session/uid' );
const trace_item = tim.require( '../trace/item' );
const trace_space = tim.require( '../trace/space' );


/*
| Returns true if an item is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	const trace = item.trace;

	return(
		trace.chopRoot.equals( this.j1 )
		|| trace.chopRoot.equals( this.j2 )
		|| trace.equals( this.hover )
	);
};


/*
| Shortcut.
*/
def.staticLazy.createArrow = ( ) =>
	action_createStroke.create( 'itemType', 'arrow' );


/*
| Shortcut.
*/
def.staticLazy.createLine = ( ) =>
	action_createStroke.create( 'itemType', 'line' );


/*
| Drag moves during creating a stroke.
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

	const psrs = screen.pointToSpaceRS( p, !ctrl );

	let j1 = this.j1;

	if( j1.timtype === trace_item )
	{
		j1 = screen.get( j1.key );

		// early aborts the creation if the first item got removed
		if( !j1 ) { root.alter( 'action', undefined ); return; }

		j1 = j1.shape;
	}

	let hover;

	for( let item of screen )
	{
		if( item.pointWithin( p ) ) { hover = item; break; }
	}

	const line = gleam_line.createConnection( j1, hover ? hover.shape : psrs );

	const j2 = hover ? hover.trace.chopRoot : psrs;

	const transientItem =
		this.transientItem.create(
			'transform', screen.transform,
			'jp1', line.p1,
			'jp2', line.p2,
			'j2', j2
		);

	root.alter( 'action', this.create( 'j2', j2, 'transientItem', transientItem ) );
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

	const psrs = screen.pointToSpaceRS( p, !ctrl );

	const j1 = this.hover || psrs;

	const transientItem =
		fabric_stroke.create(
			'access', 'rw',
			'highlight', false,
			'j1', j1,
			'jp1', psrs,
			'js1', 'none',
			'trace', fabric_space.transTrace,
			'transform', gleam_transform.normal,
			'j2', j1,
			'jp2', psrs,
			'js2', this._toStyle,
		);

	root.alter(
		'action',
			this.create(
				'j1', this.hover || screen.pointToSpaceRS( p, !ctrl ),
				'transientItem', transientItem
			)
	);
};


/*
| Stops creating a relation.
*/
def.proto.dragStop =
	function(
		p,      // point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const val = this.transientItem;

	const key = session_uid.newUid( );

	root.alter(
		'action', action_none.singleton,
		'change',
			change_grow.create(
				'val', val,
				'trace', trace_space.fakeRoot.appendItem( key ),
				'rank', 0
			)
	);
};


/*
| Returns true if the item should be highlighted.
| Default, don't highlight items.
*/
def.proto.highlightItem = function( item ) { return this.affectsItem( item ); };


/*
| Mouse hover.
|
| Returns a result_hover.
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

	for( let item of screen )
	{
		if( item.pointWithin( p ) )
		{
			root.alter( 'action', this.create( 'hover', item.trace ) );

			return result_hover.cursorDefault;
		}
	}

	root.alter( 'action', this.create( 'hover', undefined ) );

	return result_hover.cursorDefault;
};


/*
| The end style of the be created stroke.
*/
def.lazy._toStyle =
	function( )
{
	switch( this.itemType )
	{
		case 'arrow' : return 'arrow';

		case 'line' : return 'none';

		default : throw new Error( );
	}
};


} );
