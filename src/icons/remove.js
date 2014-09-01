/*
| Sketches of the icons on the discs.
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
| Imports
*/
var
	jools;


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
		id :
			'icons.remove',
		singleton :
			true,
		equals :
			'primitive'
	};
}



var
	remove;

remove = icons.remove;


/*
| Sketches the remove button's icon.
*/
remove.prototype.sketch =
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

	var cx = jools.half( wx + ex );
	var cy = jools.half( ny + sy );

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
