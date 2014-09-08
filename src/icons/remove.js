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
	euclid,
	jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'icons.remove',
		singleton :
			true,
		equals :
			'primitive',
		init :
			[ ]
	};
}



var
	remove;

remove = icons.remove;


/*
|  Initializer.
|
|
| NW**B   D**E
|  P***   ***F
|    ***C***
|     O***G
|    ***K***
|  N***   ***H
|  M**L   J**SE
|
*/
remove.prototype._init =
	function( )
{
	var
		pnw,
		pne,
		pse,
		psw,
		pc;

	pnw =
		euclid.point.create(
			'x', 17,
			'y', 16
		);

	pse =
		euclid.point.create(
			'x', 28,
			'y', 27
		);

	pne =
		euclid.point.create(
			'x', pse.x,
			'y', pnw.y
		);

	psw =
		euclid.point.create(
			'x', pnw.x,
			'y', pse.y
		);

	pc =
		// FUTURE make it an euclid middle call
		euclid.point.create(
			'x', jools.half( pnw.x + pse.x ),
			'y', jools.half( pnw.y + pse.y )
		);

	// arm with and height
	var aw = 2;
	var ah = 2;

	// center point width/height
	var cw = 2;
	var ch = 2;

	this._x =
		euclid.shape.create(
			'hull',
				[
					'start', pnw,                 // A
					'line',  pnw.add(  aw,   0 ), // B
					'line',  pc.add(    0, -ch ), // C
					'line',  pne.add( -aw,   0 ), // D
					'line',  pne,                 // E
					'line',  pne.add(   0,  ah ), // F
					'line',  pc.add(   cw,   0 ), // G
					'line',  pse.add(   0, -ah ), // H
					'line',  pse,                 // I
					'line',  pse.add( -aw,   0 ), // J
					'line',  pc.add(    0,  ch ), // K
					'line',  psw.add(  aw,   0 ), // L
					'line',  psw,                 // M
					'line',  psw.add(   0, -ah ), // N
					'line',  pc.add(  -cw,   0 ), // O
					'line',  pnw.add(   0,  ah ), // P
					'line',  'close'              // A
				],
			'pc',
				pc
		);
};


/*
| Draws the moveto button on a fabric
*/
remove.prototype.draw =
	function(
		fabric,
		style,
		view
	)
{
	fabric.paint( style, this._x, view );
};


} )( );
