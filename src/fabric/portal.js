/*
| A portal to another space.
*/
'use strict';


tim.define( module, 'fabric_portal', ( def, fabric_portal ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// the path of the doc
			type : [ 'undefined', 'tim$path' ]
		},
		spaceUser :
		{
			// owner of the space the portal goes to
			type : 'string',
			json : true
		},
		spaceTag :
		{
			// tag of the space the portal goes to
			type : 'string',
			json : true
		},
		zone :
		{
			// the portals zone
			type : 'gleam_rect',
			json : true
		}
	};
}

} );
