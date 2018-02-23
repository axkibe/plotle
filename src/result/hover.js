/*
| Result of a pointingHover call.
|
| Containts the path of the component being hovered over
| As well the shape the cursor should get.
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
		// the cursor to display
		cursor : { type : 'string' },

		// the path to the thing being hovered upon
		path : { type : [ 'undefined', 'tim.js/path' ] },
	};
}


} );
