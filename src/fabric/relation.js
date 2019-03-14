/*
| Relates two items (including other relations).
*/
'use strict';


tim.define( module, ( def, fabric_relation ) => {


def.extend = './label';


if( TIM )
{
	def.attributes =
	{
		// access level of current user (rw or ro)
		// no json thus not saved or transmitted
		access : { type : [ 'undefined', 'string' ] },

		// current action
		// no json thus not saved or transmitted
		action : { type : [ 'undefined', '< ../action/types' ] },

		// the labels document
		doc : { type : './doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the item is highlighted
		// no json thus not saved or transmitted
		highlight : { type : [ 'undefined', 'boolean' ] },

		// node currently hovered upon
		// no json thus not saved or transmitted
		hover : { type : 'undefined' },

		// item the relation goes from
		item1key : { type : 'string', json : true },

		// item the relation goes to
		item2key : { type : 'string', json : true },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the doc
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// position
		pos : { type : '../gleam/point', json : true },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },
	};

	def.json = 'relation';
}


} );
