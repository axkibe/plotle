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

const gruga_relation = require( '../gruga/relation' );


/*
| The item's glint.
|
| This cannot be done lazily, since it may
| depend on other items.
*/
def.func.glint =
	function( )
{
	const fabric = this.fabric;

	const shape =
		gleam_arrow.create(
			'joint1', fabric.from,
			'joint2', fabric.to,
			'end1', fabric.fromStyle,
			'end2', fabric.toStyle
		).shape.transform( this.transform );

	// FIXME remove gruga_relation dependency
	return gleam_glint_paint.createFS( gruga_relation.facet, shape );
};


} );
