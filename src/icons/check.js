/*
| A "check" icon.
| used on the backbox
*/


var
	euclid,
	icons_check;


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
			'icons_check',
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


/*
| Sketches the normal button's icon.
*/
icons_check.prototype._init =
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
icons_check.prototype.draw =
	function(
		display,
		style,
		view
	)
{
	display.paint( style, this._check, view );
};


} )( );
