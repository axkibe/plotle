/*
| A bezier curve.
|
| Authors: Axel Kittenberger
*/


/*
| Exports
*/
var
	Curve =
		null;

/*
| Imports
*/
var
	Jools,
	Euclid;


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
Curve =
	function(
		tree,
		frame
	)
{
	var
		data =
		this._data =
			[ ];

	if( tree.type !== 'Curve' )
	{
		throw new Error(
			'Curve tree not a Curve'
		);
	}

	if( tree.twig[ tree.ranks[ 0 ] ].type !== 'MoveTo' )
	{
		throw new Error(
			'Curve does not begin with MoveTo'
		);
	}

	for(
		var a = 0, aZ = tree.length;
		a < aZ;
		a++
	)
	{
		var
			ct =
				tree.twig[ tree.ranks[ a ] ];

		data.push(
			{
				to :
					frame.computePoint( ct.to ),

				tree :
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
	var
		data =
			this._data,

		lbx =
			0,

		lby =
			0,

		bo =
			border;

	for(
		var a = 0, aZ = data.length;
		a < aZ;
		a++
	)
	{
		var
			c =
				data[a],

			ct =
				c.tree,

			to =
				c.to,

			bx =
				ct.bx * bo,

			by =
				ct.by * bo;

		switch( ct.type )
		{
			case 'MoveTo':

				fabric.moveTo( to.x + bx, to.y + by );

				break;

			case 'LineTo':

				fabric.lineTo( to.x + bx, to.y + by );

				break;

			case 'BeziTo':

				var
					tbx =
						to.x + bx,

					tby =
						to.y + by;

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

		lbx =
			bx;

		lby =
			by;
	}
};

} )( );

