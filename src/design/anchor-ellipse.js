/*
| An ellipse.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	design;

design = design || { };


/*
| Import
*/
var
	euclid;

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
			'anchorEllipse',
		unit :
			'design',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north-west',
						type :
							'design.anchorPoint'
					},
				pse :
					{
						comment :
							'point in south-east',
						type :
							'design.anchorPoint'
					}
			}
	};
}


var
	anchorEllipse;

anchorEllipse = design.anchorEllipse;


/*
| ellipse filling the full frame
| skewed a little to north west
*/
anchorEllipse.fullSkewNW =
	anchorEllipse.create(
		'pnw',
			design.anchorPoint.PNW,
		'pse',
			design.anchorPoint.PSE_M1
	);


/*
| Computes a rect modelled relative to this rect.
*/
anchorEllipse.prototype.compute =
	function(
		frame
	)
{
	return (
		euclid.ellipse.create(
			'pnw',
				this.pnw.compute( frame ),
			'pse',
				this.pse.compute( frame )
		)
	);
};


})( );
