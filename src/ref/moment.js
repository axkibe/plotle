/*
| A reference to a moment of a dynamic.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the dynamic referenced
		dynRef : { type : [ './space', './userSpaceList' ], json : true },

		// sequence number the dynamic is at
		seq : { type : 'integer', json : true }
	};

	def.json = 'ref_moment';
}


} );
