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
		from : { type : [ 'undefined', 'tim.js/src/path/path', '../gleam/point' ] },

		// the item path hovered upon
		hover : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		// the item path or pos the stroke goes to
		to : { type : [ 'undefined', 'tim.js/src/path/path', '../gleam/point' ] },

		// the itemType of stroke ("arrow" or "line")
		itemType : { type : 'string' },
	};
}


const action_none = require( './none' );

const change_grow = require( '../change/grow' );

const fabric_stroke = require( '../fabric/stroke' );

const result_hover = require( '../result/hover' );

const session_uid = require( '../session/uid' );

const tim_path = require( 'tim.js/src/path/path' );

const visual_space = require( '../visual/space' );

const visual_stroke = require( '../visual/stroke' );


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	let path = item.path;

	if( path.get( 0 ) !== 'spaceVisual' ) return false;

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
	if( screen.timtype !== visual_space ) return;

	const ps = screen.pointToSpaceRS( p, !ctrl );

	root.create( 'action', this.create( 'to', ps ) );
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

	root.create(
		'action', this.create( 'from', this.hover || screen.pointToSpaceRS( p, !ctrl ) )
	);
};


/*
| Stops creating a relation.
*/
def.proto.dragStop =
	function(
		p,      // point of stop
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	const val = this.transientFabric;

	const key = session_uid.newUid( );

	root.alter(
		change_grow.create(
			'val', val,
			'path', tim_path.empty.append( 'twig' ).append( key ),
			'rank', 0
		)
	);

	root.create( 'action', action_none.create( ) );
	// FIXME switch to action none?
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
				root.create( 'action', this.create( 'hover', item.path.chop ) );

				return result_hover.cursorDefault;
			}
		}

		root.create( 'action', this.create( 'hover', undefined ) );

		return result_hover.cursorDefault;
	}

	return result_hover.cursorDefault;
};


/*
| The transient item being created.
*/
def.lazy.transientFabric =
	function( )
{
	return(
		fabric_stroke.create(
			'from', this.from,
			'to', this.to,
			'fromStyle', 'none',
			'toStyle', this._toStyle
		)
	);
};


/*
| The transient visual being created.
*/
def.proto.transientVisual =
	function(
		transfrom   // the transform for the item
	)
{

	return(
		visual_stroke.create(
			'access', 'rw',
			'action', action_none.create( ),
			'fabric', this.transientFabric,
			'highlight', false,
			'transform', transfrom
		)
	);
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
