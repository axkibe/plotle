/*
| Result of a pointingHover call.
|
| Containts the path of the component being hovered over
| As well the shape the cursor should get.
*/
'use strict';


tim.define( module, 'result_hover', ( def, result_hover ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		cursor :
		{
			// the cursor to display
			type : 'string'
		},
		path :
		{
			// the path to the thing being hovered upon
			type : [ 'undefined', 'jion$path' ]
		}
	};
}


} );
