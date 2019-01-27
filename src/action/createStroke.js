/*
| A user is creating a new stroke.
*/
'use strict';


tim.define( module, ( def, action_createStroke ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// the item path or pos the stroke goes from
		from : { type : [ 'undefined', 'tim.js/src/path', '../gleam/point' ] },

		// the item path hovered upon
		hover : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the item path or pos the stroke goes to
		to : { type : [ 'undefined', 'tim.js/src/path', '../gleam/point' ] },

		// the itemType of stroke ("arrow" or "line")
		itemType : { type : 'string' },
	};
}


const action_none = require( '../action/none' );

const fabric_stroke = require( '../fabric/stroke' );

const visual_stroke = require( '../visual/stroke' );


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	const path = item.path;

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
