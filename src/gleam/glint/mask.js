/*
| Masked glints.
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
		// the glints to draw
		glint : { type : './list' },

		// true if reversing mask
		reverse : { type : [ 'undefined', 'boolean' ] },

		// the shape(list) to mask to
		shape :
		{
			type : tim.typemap( module, '../shape' ).concat( [ '../shapeList' ] )
		}
	};
}


} );

