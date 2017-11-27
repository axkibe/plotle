/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
*/
'use strict';


tim.define( module, 'action_createGeneric', ( def, action_createGeneric ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		itemType :
		{
			// item type to be created
			type : 'protean'
			// 'visual_note:static',
			// 'visual_label:static',
			// 'visual_portal:static'
		},
		transItem :
		{
			// the transient item in creation
			type :
				require( '../visual/typemap-item' )
				.concat( [ 'undefined' ] )
		},
		startPoint :
		{
			// start point of drag creation
			type : [ 'undefined', 'gleam_point' ]
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
		// path
	)
{
	return false;
};


} );
