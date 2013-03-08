/*
| Sketches of the icons on the discs.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Disc;
Disc =
	Disc || { };


/*
| Imports
*/
var config;
var Curve;
var Euclid;
var Jools;
var shell;
var theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined')
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var Icons =
Disc.Icons =
	function( )
{
};


/*
| Sketches the normal button's icon.
*/
Icons.prototype.normal =
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


/*
| Sketches the moveto button's icon.
*/
Icons.prototype.moveto =
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


/*
| Sketches the remove button's icon.
*/
Icons.prototype.remove =
	function(
		fabric
		// border,
		// twist
	)
{
	var w =
		11;

	var h =
		11;

	// zone
	var wx = 17;
	var ny = 16;
	var ex = wx + w;
	var sy = ny + h;

	var cx = Jools.half( wx + ex );
	var cy = Jools.half( ny + sy );

	// arm with and height
	var aw = 2;
	var ah = 2;

	// center point width/height
	var cw = 2;
	var ch = 2;

	//
	// A**B   D**E
	// P***   ***F
	//   ***C***
	//    O***G
	//   ***K***
	// N***   ***H
	// M**L   J**I
	//

	fabric.moveTo( wx      , ny      );  // A
	fabric.lineTo( wx + aw , ny      );  // B
	fabric.lineTo( cx      , cy - ch );  // C
	fabric.lineTo( ex - aw , ny      );  // D
	fabric.lineTo( ex      , ny      );  // E
	fabric.lineTo( ex      , ny + ah );  // F
	fabric.lineTo( cx + cw , cy      );  // G
	fabric.lineTo( ex      , sy - ah );  // H
	fabric.lineTo( ex      , sy      );  // I
	fabric.lineTo( ex - aw , sy      );  // J
	fabric.lineTo( cx      , cy + ch );  // K
	fabric.lineTo( wx + aw , sy      );  // L
	fabric.lineTo( wx      , sy      );  // M
	fabric.lineTo( wx      , sy - ah );  // N
	fabric.lineTo( cx - cw , cy      );  // O
	fabric.lineTo( wx      , ny + ah );  // P
	fabric.lineTo( wx      , ny      );  // A

};


} )( );
