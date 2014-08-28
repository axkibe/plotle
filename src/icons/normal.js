/*
| The "normal" icon.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	icons;

icons = icons || { };


/*
| Capsule
*/
( function( ) {
'use strict';


var
	normal;

normal =
icons.normal =
	{ };


/*
| Sketches the normal button's icon.
*/
normal.sketch =
	function(
		fabric
		// border,
		// twist
	)
{
	var wx = 18;
	var ny = 12;

	//
	//
	//  A
	//  **
	//  ***
	//  ****
	//  *****
	//  ******
	//  *******
	//  **F**C*B
	//  G   **
	//       **
	//        ED

	fabric.moveTo( wx +  0, ny +  0 );  // A
	fabric.lineTo( wx + 11, ny + 10 );  // B
	fabric.lineTo( wx +  6, ny + 11 );  // C
	fabric.lineTo( wx +  9, ny + 17 );  // D
	fabric.lineTo( wx +  7, ny + 18 );  // E
	fabric.lineTo( wx +  4, ny + 12 );  // F
	fabric.lineTo( wx +  0, ny + 15 );  // G
	fabric.lineTo( wx +  0, ny +  0 );  // A
};


} )( );
