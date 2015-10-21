/*
| An ellipse.
*/


var
	design_ellipse,
	design_point,
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
		id : 'design_ellipse',
		attributes :
		{
			pnw :
			{
				comment : 'point in north-west',
				type : 'design_point'
			},
			pse :
			{
				comment : 'point in south-east',
				type : 'design_point'
			},
			gradientPC :
			{
				comment : 'center of gradient',
				type : [ 'undefined', 'design_point' ]
			},
			gradientR1 :
			{
				comment : 'radius of radial gradient',
				type : [ 'undefined', 'number' ]
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

prototype = design_ellipse.prototype;


/*
| ellipse filling the full frame
| skewed a little to north west
*/
design_ellipse.fullSkewNW =
	design_ellipse.create(
		'pnw', design_point.nw,
		'pse', design_point.seMin1
	);


/*
| Computes a rect modelled relative to this rect.
*/
prototype.compute =
	function(
		frame
	)
{
	var
		gpc;

	gpc = this.gradientPC;

	return(
		euclid_ellipse.create(
			'pnw', this.pnw.compute( frame ),
			'pse', this.pse.compute( frame ),
			'gradientPC', gpc && gpc.compute( frame ),
			'gradientR1', this.gradientR1
		)
	);
};


})( );
