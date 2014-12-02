/*
| An ellipse.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
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
		id :
			'design_anchorEllipse',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north-west',
						type :
							'design_anchorPoint'
					},
				pse :
					{
						comment :
							'point in south-east',
						type :
							'design_anchorPoint'
					}
			}
	};
}


/*
| ellipse filling the full frame
| skewed a little to north west
*/
design_anchorEllipse.fullSkewNW =
	design_anchorEllipse.create(
		'pnw', design_anchorPoint.PNW,
		'pse', design_anchorPoint.PSE_M1
	);


/*
| Computes a rect modelled relative to this rect.
*/
design_anchorEllipse.prototype.compute =
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
