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
			'check',
		unit :
			'icons',
		attributes :
			{
				pc :
					{
						comment :
							'center of the check',
						type :
							'euclid.point'
					}
			}
	};
}


var
	check;

check =
	icons.check;


/*
| Sketches the normal button's icon.
*/
check.prototype.sketch =
	function(
		fabric
		// border,
		// twist
	)
{
	var
		pc,
		pcx,
		pcy;

	pc = this.pc;

	pcx = pc.x;

	pcy = pc.y;

	fabric.moveTo(
		pcx -  5,
		pcy -  3
	);

	fabric.lineTo(
		pcx +  2,
		pcy +  5
	);

	fabric.lineTo(
		pcx + 14,
		pcy - 12
	);

	fabric.lineTo(
		pcx +  2,
		pcy -  1
	);

	fabric.lineTo(
		pcx -  5,
		pcy -  3
	);
};


} )( );
