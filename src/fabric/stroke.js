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
		from : { type : [ 'tim.js/src/path/path', '../gleam/point' ], json : true },

		// "arrow" or "none"
		fromStyle : { type : 'string', json: true },

		// itemkey or pos the stroke goes to
		to : { type : [ 'tim.js/src/path/path', '../gleam/point' ], json : true },

		// "arrow" or "none"
		toStyle : { type : 'string', json: true },

		// the path of the arrow
		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },
	};

	def.json = 'arrow';
}


} );
