/*
| The "moveto" icon.
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


/*
| The jion definition
*/
if( JION )
{
	return {
		name :
			'moveto',
		unit :
			'icons',
		singleton :
			true,
		equals :
			'primitive'
	};
}

var
	moveto;

moveto = icons.moveto;


/*
| Sketches the moveto button's icon.
*/
moveto.prototype.sketch =
	function(
		fabric
		// border,
		// twist
	)
{
	var wx = 22;
	var ny = 11;

	//
	//     A
	//    ***
	//   *****
	//  *******
	// G*F***C*B
	//   *****
	//   *****
	//   *****
	//   E***D
	//
	//   H***I
	//   K***J

	fabric.moveTo( wx + 0, ny +  0 );  // A
	fabric.lineTo( wx + 6, ny +  8 );  // B
	fabric.lineTo( wx + 2, ny +  8 );  // C
	fabric.lineTo( wx + 2, ny + 14 );  // D
	fabric.lineTo( wx - 2, ny + 14 );  // E
	fabric.lineTo( wx - 2, ny +  8 );  // F
	fabric.lineTo( wx - 6, ny +  8 );  // G
	fabric.lineTo( wx + 0, ny +  0 );  // A

	fabric.moveTo( wx - 2, ny + 16 );  // H
	fabric.lineTo( wx + 2, ny + 16 );  // I
	fabric.lineTo( wx + 2, ny + 17 );  // J
	fabric.lineTo( wx - 2, ny + 17 );  // K
	fabric.moveTo( wx - 2, ny + 16 );  // H

	fabric.moveTo( wx - 2, ny + 19 );  // H
	fabric.lineTo( wx + 2, ny + 19 );  // I
	fabric.lineTo( wx + 2, ny + 20 );  // J
	fabric.lineTo( wx - 2, ny + 20 );  // K
	fabric.moveTo( wx - 2, ny + 19 );  // H
};


} )( );
