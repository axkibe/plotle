/*
| A "check" icon.
| used on the backbox
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
	euclid;


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
			'icons.check',
		attributes :
			{
				pc :
					{
						comment :
							'center of the check',
						type :
							'euclid.point'
					}
			},
		init :
			[ ]
	};
}


var
	check;

check = icons.check;


/*
| Sketches the normal button's icon.
*/
check.prototype._init =
	function( )
{
	var
		pc;

	pc = this.pc;

	this._check =
		euclid.shape.create(
			'hull',
				[
					'start', pc.add( -5,  -3 ),
					'line', pc.add(  2,   5 ),
					'line', pc.add( 14, -12 ),
					'line', pc.add(  2,  -1 ),
					'line', 'close'
				],
			'pc', pc
		);
};


/*
| Draws the check button on a display.
*/
check.prototype.draw =
	function(
		display,
		style,
		view
	)
{
	display.paint( style, this._check, view );
};


} )( );
