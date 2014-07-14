/*
| An ellipse.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Design;


Design =
	Design || { };


/*
| Import
*/
var
	Euclid;

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
			'Design',
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
	AnchorEllipse =
		Design.AnchorEllipse;


/*
| Ellipse filling the full frame
| skewed a little to north west
*/
AnchorEllipse.fullSkewNW =
	AnchorEllipse.Create(
		'pnw',
			Design.AnchorPoint.PNW,
		'pse',
			Design.AnchorPoint.PSE_M1
	);


/*
| Computes a rect modelled relative to this rect.
*/
AnchorEllipse.prototype.compute =
	function(
		frame
	)
{
	return Euclid.Ellipse.Create(
		'pnw',
			this.pnw.compute( frame ),
		'pse',
			this.pse.compute( frame )
	);
};


})( );
