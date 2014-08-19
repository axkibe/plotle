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
			'AnchorEllipse',
		unit :
			'design',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north-west',
						type :
							'AnchorPoint'
					},
				pse :
					{
						comment :
							'point in south-east',
						type :
							'AnchorPoint'
					}
			}
	};
}


var
	AnchorEllipse;

AnchorEllipse = design.AnchorEllipse;


/*
| ellipse filling the full frame
| skewed a little to north west
*/
AnchorEllipse.fullSkewNW =
	AnchorEllipse.create(
		'pnw',
			design.AnchorPoint.PNW,
		'pse',
			design.AnchorPoint.PSE_M1
	);


/*
| Computes a rect modelled relative to this rect.
*/
AnchorEllipse.prototype.compute =
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
