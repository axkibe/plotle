/*
| An ellipse.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	euclid_ellipse;

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
		id : 'design_anchorEllipse',
		attributes :
		{
			pnw :
			{
				comment : 'point in north-west',
				type : 'design_anchorPoint'
			},
			pse :
			{
				comment : 'point in south-east',
				type : 'design_anchorPoint'
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = design_anchorEllipse.prototype;


/*
| ellipse filling the full frame
| skewed a little to north west
*/
design_anchorEllipse.fullSkewNW =
	design_anchorEllipse.create(
		'pnw', design_anchorPoint.nw,
		'pse', design_anchorPoint.seMin1
	);


/*
| Computes a rect modelled relative to this rect.
*/
prototype.compute =
	function(
		frame
	)
{
	return(
		euclid_ellipse.create(
			'pnw', this.pnw.compute( frame ),
			'pse', this.pse.compute( frame )
		)
	);
};


})( );
