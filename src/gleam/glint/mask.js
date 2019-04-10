/*
| Masked glints.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the glints to draw
		glint : { type : './list' },

		// true if reversing mask
		reversed : { type : [ 'undefined', 'boolean' ] },

		// the shape(list) to mask to
		shape : { type : [ '< ../shape-types', '../shapeList' ] }
	};
}


} );
