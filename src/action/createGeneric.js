/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
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
		// item type to be created
		itemType :
		{
			type : 'protean'
			// 'visual_note:static',
			// 'visual_label:static',
			// 'visual_portal:static'
		},

		// the transient item in creation
		transItem : { type : [ '< ../visual/item-types', 'undefined' ] },

		// start point of drag creation
		startPoint : { type : [ 'undefined', '../gleam/point' ] }
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
		// path
	)
{
	return false;
};


} );
