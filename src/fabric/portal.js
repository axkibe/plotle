/*
| A portal to another space.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		// owner of the space the portal goes to
		spaceUser : { type : 'string', json : true },

		// tag of the space the portal goes to
		spaceTag : { type : 'string', json : true },

		// the portals zone
		zone : { type : '../gleam/rect', json : true }
	};

	def.json = 'portal';
}

} );
