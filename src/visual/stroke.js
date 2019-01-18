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


const gleam_glint_list = require( '../gleam/glint/list' );


/*
| The item's glint.
|
| This cannot be done lazily, since
| when one of the items the relation
| points to is moved the arrows are moved
| too.
*/
def.func.glint =
	function( )
{
	const arr = [ ];

	return gleam_glint_list.create( 'list:init', arr );
};


} );
