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
		// the item path or pos the stroke goes from
		from : { type : [ 'undefined', 'tim.js/path', '../gleam/point' ] },

		// the item path hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the item path or pos the stroke goes to
		to : { type : [ 'undefined', 'tim.js/path', '../gleam/point' ] },

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

const gleam_transform = tim.require( '../gleam/transform' );

const result_hover = tim.require( '../result/hover' );

const session_uid = tim.require( '../session/uid' );

const tim_path = tim.require( 'tim.js/path' );


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	let path = item.path;

	if( path.get( 0 ) !== 'space' ) return false;

	path = path.chop;

	return path.equals( this.from ) || path.equals( this.to ) || path.equals( this.hover );
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

	const ps = screen.pointToSpaceRS( p, !ctrl );

	let transientItem = this.transientItem;

	transientItem =
		transientItem.create(
			'transform', screen.transform,
			'to', this.hover || ps
		);

	root.alter( 'action', this.create( 'to', ps, 'transientItem', transientItem ) );
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

	const from = this.hover || screen.pointToSpaceRS( p, !ctrl );

	const transientItem =
		fabric_stroke.create(
			'access', 'rw',
			'highlight', false,
			'from', from,
			'fromStyle', 'none',
			'path', fabric_space.transPath,
			'transform', gleam_transform.normal,
			'to', from,
			'toStyle', this._toStyle,
		);

	root.alter(
		'action',
			this.create(
				'from', this.hover || screen.pointToSpaceRS( p, !ctrl ),
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
				'path', tim_path.empty.append( 'twig' ).append( key ),
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

	if( !this.from )
	{
		for( let a = 0, al = screen.length; a < al; a++ )
		{
			const item = screen.atRank( a );

			if( item.pointWithin( p ) )
			{
				root.alter( 'action', this.create( 'hover', item.path.chop ) );

				return result_hover.cursorDefault;
			}
		}

		root.alter( 'action', this.create( 'hover', undefined ) );

		return result_hover.cursorDefault;
	}

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
