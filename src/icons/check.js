/*
| A "check" icon.
| used on the backbox
*/


var
	euclid_shape,
	icons_check,
	shapeSection_line,
	shapeSection_start;


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
							'euclid_point'
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
		euclid_shape.create(
			'ray:init',
			[
				shapeSection_start.create( 'p', pc.add( -5,  -3 ) ),
				shapeSection_line.create( 'p', pc.add(  2,   5 ) ),
				shapeSection_line.create( 'p', pc.add( 14, -12 ) ),
				shapeSection_line.create( 'p', pc.add(  2,  -1 ) ),
				shapeSection_line.create( 'close', true )
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
