/*
| A bezier curve.
|
| Authors: Axel Kittenberger
*/


/*
| Exports
*/
var Curve =
	null;


/*
| Imports
*/
var Jools;
var Euclid;


/*
| Capsule
*/
( function() {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
Curve =
	function(
		twig,
		frame
	)
{
	var data =
	this.data =
		[ ];

	if( twig.type !== 'Curve' )
	{
		throw new Error( 'Curve twig not a Curve' );
	}

	if( twig.copse[ twig.ranks[ 0 ] ].type !== 'MoveTo' )
	{
		throw new Error(' Curve does not begin with MoveTo' );
	}

	for(
		var a = 0, aZ = twig.length;
		a < aZ;
		a++
	) {
		var ct =
			twig.copse[ twig.ranks[ a ] ];

		data.push(
			{
				to :
					frame.computePoint( ct.to ),
				twig :
					ct
			}
		);
	}
};


/*
| Sketches a curve in a fabric
*/
Curve.prototype.sketch =
	function(
		fabric,
		border
		// twist
	)
{
	var data = this.data;
	var lbx = 0;
	var lby = 0;
	var bo = border;

	for(var a = 0, aZ = data.length; a < aZ; a++)
	{
		var c = data[a];
		var ct = c.twig;
		var to = c.to;
		var bx = ct.bx * bo;
		var by = ct.by * bo;
		switch(ct.type) {
			case 'MoveTo':
				fabric.moveTo(to.x + bx, to.y + by);
				break;

			case 'LineTo':
				fabric.lineTo(to.x + bx, to.y + by);
				break;

			case 'BeziTo':
				var tbx = to.x + bx;
				var tby = to.y + by;
				fabric.beziTo(
					ct.c1x + (tbx && tbx + lbx ? (tbx / (tbx + lbx)) : 0),
					ct.c1y + (tby && tby + lby ? (tby / (tby + lby)) : 0),

					ct.c2x + (tbx && tbx +  bx ? (tbx / (tbx + bx)) : 0),
					ct.c2y + (tby && tby +  by ? (tby / (tby + by)) : 0),

					tbx,
					tby
				);
			break;

			default :
				throw new Error('invalid curve type: ' + ct.type);
		}

		lbx = bx;
		lby = by;
	}
};

} ) ();
