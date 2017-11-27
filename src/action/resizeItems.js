/*
| The user is resizing an item.
*/
'use strict';


tim.define( module, 'action_resizeItems', ( def, action_resizeItems ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


/*
| The jion definition.
*/
{
	def.attributes =
	{
		itemPaths:
		{
			// the paths of the items to drag
			type : [ 'undefined', 'jion$pathList' ]
		},
		startPoint :
		{
			// mouseDown point on drag creation
			type : 'gleam_point'
		},
		pBase :
		{
			// base the resize to this point
			type : [ 'undefined', 'gleam_point' ]
		},
		proportional :
		{
			// if true resize proportionally
			// scaleX must be === scaleY
			type : [ 'undefined', 'boolean' ]
		},
		resizeDir :
		{
			// resize to this direction
			type : [ 'undefined', 'string' ]
		},
		scaleX :
		{
			// scale x by this factor
			type : [ 'undefined', 'number' ]
		},
		scaleY :
		{
			// scale y by this factor
			type : [ 'undefined', 'number' ]
		},
		startZones :
		{
			// the zones as the resize started
			type : [ 'undefined', 'gleam_rectGroup' ]
		}
	};
}


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns true if an entity with path is affected by this action.
*/
def.func.affects =
	function(
		path
	)
{
	const paths = this.itemPaths;

	for( let a = 0, pLen = paths.length; a < pLen; a++ )
	{
		const pa = paths.get( a );

		if( pa.equals( path ) ) return true;
	}

	return false;
};


/*
| 'Normal' button ought to be down during this action.
*/
def.func.normalButtonDown = true;


} );
