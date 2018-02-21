/*
| The user is resizing an item.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/
if( TIM )
{
	def.attributes =
	{
		// the paths of the items to drag
		itemPaths: { type : [ 'undefined', 'tim.js/pathList' ] },

		// mouseDown point on drag creation
		startPoint : { type : '../gleam/point' },

		// base the resize to this point
		pBase : { type : [ 'undefined', '../gleam/point' ] },

		// if true resize proportionally
		// scaleX must be === scaleY
		proportional : { type : [ 'undefined', 'boolean' ] },

		// resize to this direction
		resizeDir : { type : [ 'undefined', 'string' ] },

		// scale x by this factor
		scaleX : { type : [ 'undefined', 'number' ] },

		// scale y by this factor
		scaleY : { type : [ 'undefined', 'number' ] },

		// the zones as the resize started
		startZones : { type : [ 'undefined', '../gleam/rectGroup' ] },
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

