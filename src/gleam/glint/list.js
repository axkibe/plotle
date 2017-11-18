/*
| A list of stuff to display.
*/
'use strict';


tim.define( module, 'gleam_glint_list', ( def, gleam_glint_list ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.list =
		[
			'gleam_glint_border',
			'gleam_glint_fill',
			'gleam_glint_mask',
			'gleam_glint_paint',
			'gleam_glint_text',
			'gleam_glint_list',
			'gleam_glint_window'
		];
}


} );
