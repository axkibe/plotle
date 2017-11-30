/*
| A reference to a moment of a dynamic.
*/
'use strict';


tim.define( module, 'ref_moment', ( def, ref_moment ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		dynRef :
		{
			// the dynamic referenced
			type : [ 'ref_space', 'ref_userSpaceList' ],
			json : true,
		},
		seq :
		{
			// sequence number the dynamic is at
			type : 'integer',
			json : true,
		}
	};
}


} );
