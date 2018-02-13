/*
| Masked glints.
*/
'use strict';


tim.define( module, 'gleam_glint_mask', ( def, gleam_glint_mask ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		glint :
		{
			// the glints to draw
			type : 'gleam_glint_list'
		},
		reverse :
		{
			// true if reversing mask
			type : [ 'undefined', 'boolean' ]
		},
		shape :
		{
			// the shape(list) to mask to
			type :
				tim.typemap( module, '../shape' )
				.concat( [ '../shapeList' ] )
		}
	};
}


} );
