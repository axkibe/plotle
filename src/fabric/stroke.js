/*
| A stroke (with possible arrow heads)
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// itemkey or pos the stoke goes from
		from : { type : [ 'tim.js/path', '../gleam/point' ], json : true },

		// "arrow" or "none"
		fromStyle : { type : 'string', json: true },

		// itemkey or pos the stroke goes to
		to : { type : [ 'tim.js/path', '../gleam/point' ], json : true },

		// "arrow" or "none"
		toStyle : { type : 'string', json: true },

		// the path of the arrow
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },
	};

	def.json = 'arrow';
}


} );
