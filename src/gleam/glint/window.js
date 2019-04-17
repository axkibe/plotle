/*
| Puts a pane on display.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the pane(cutout) to display
		pane : { type : './pane' },

		// position of the window
		pos : { type : '../point' }
	};
}


} );
