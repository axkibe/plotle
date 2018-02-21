/*
| A wrapped changed list to be applied on a dynamic.
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
		// the changes
		changeWrapList : { type : [ 'undefined', './wrapList' ], json : true },

		// the dynamic to be changed
		refDynamic : { type : [ '../ref/space', '../ref/userSpaceList' ], json : true },

		// sequence the update starts at
		seq : { type : [ 'undefined', 'integer' ], json : true },
	};

	def.json = 'change_dynamic';
}


} );
