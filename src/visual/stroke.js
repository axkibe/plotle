/*
| A stroke (with possibly arrowhead decorations).
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './item';


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the item's fabric
		fabric : { type : '../fabric/stroke' },

		// true if the item is highlighted
		highlight : { type : 'boolean' },

		// node currently hovered upon
		hover : { type : [ 'undefined' ] },

		// the users mark
		mark : { type : [ '< ./mark/types', 'undefined' ] },

		// the path of the itm
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the current space transform
		transform : { type : '../gleam/transform' },
	};
}


const gleam_arrow = require( '../gleam/arrow' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_rect = require( '../gleam/rect' );

const gruga_relation = require( '../gruga/relation' );


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	return this.zone.pc.y;
};


/*
| Sees if this portal is being clicked.
*/
def.proto.click =
	function(
		p,
		shift,
		access  // FIXME have access be an attribute
	)
{
	return;
};



/*
| Handles a potential dragStart event for this item.
*/
def.proto.dragStart =
	function(
		p,
		shift,
		ctrl,
		access
	)
{
	// FIXME make it more coherent what don't care means
	// false or undefined
	return false;
};


/*
| The item's glint.
|
| This cannot be done lazily, since it may
| depend on other items.
*/
def.proto.glint =
	function( )
{
	const shape = this.shape.transform( this.transform );

	// FIXME remove gruga_relation dependency
	return gleam_glint_paint.createFS( gruga_relation.facet, shape );
};


/*
| No scaling minimum.
*/
def.proto.minScaleX =
def.proto.minScaleY =
	( ) => 0;


/*
| Mouse wheel turned.
*/
def.proto.mousewheel =
	function(
		p,
		dir
		// shift,
		// ctrl
	)
{
	return false;
};


/*
| User is hovering his/her pointing device around.
|
| Checks if this item reacts on this.
*/
def.proto.pointingHover =
	function(
		p       // point hovered upon
	)
{
	return;
};


/*
| The items shape
*/
def.lazy.shape =
	function( )
{
	const fabric = this.fabric;

	return(
		gleam_arrow.create(
			'joint1', fabric.from,
			'joint2', fabric.to,
			'end1', fabric.fromStyle,
			'end2', fabric.toStyle
		).shape
	);
};



/*
| The items zone possibly altered by action.
*/
def.lazy.zone =
	function( )
{
	return gleam_rect.createArbitrary( this._pointFrom, this._pointTo );
};



/*
| Point the stroke goes from.
*/
def.lazy._pointFrom =
	function( )
{
	return this.fabric.from;
};


/*
| Point the stroke goes to.
*/
def.lazy._pointTo =
	function( )
{
	return this.fabric.to;
};


} );
