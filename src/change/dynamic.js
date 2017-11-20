/*
| A wrapped changed list to be applied on a dynamic.
*/
'use strict';


tim.define( module, 'change_dynamic', ( def, change_dynamic ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		changeWrapList :
		{
			// the changes
			type : [ 'undefined', 'change_wrapList' ],
			json : true,
		},
		refDynamic :
		{
			// the dynamic to be changed
			type : [ 'ref_space', 'ref_userSpaceList' ],
			json : true,
		},
		seq :
		{
			// sequence the update starts at
			type : [ 'undefined', 'integer' ],
			json : true,
		}
	};
}


} );
