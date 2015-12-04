/*
| An ellipse.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_ellipse',
		attributes :
		{
			pnw :
			{
				comment : 'point in north-west',
				type : 'euclid_anchor_point'
			},
			pse :
			{
				comment : 'point in south-east',
				type : 'euclid_anchor_point'
			},
			gradientPC :
			{
				comment : 'center of gradient',
				type : [ 'undefined', 'euclid_anchor_point' ]
			},
			gradientR1 :
			{
				comment : 'radius of radial gradient',
				type : [ 'undefined', 'number' ]
			}
		}
	};
}


var
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_ellipse;

/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_anchor_ellipse.prototype;


/*
| ellipse filling the full frame
| skewed a little to north west
*/
euclid_anchor_ellipse.fullSkewNW =
	euclid_anchor_ellipse.create(
		'pnw', euclid_anchor_point.nw,
		'pse', euclid_anchor_point.seMin1
	);


/*
| Computes a rect modelled relative to this rect.
*/
prototype.compute =
	function(
		frame,
		view
	)
{
	var
		gpc,
		gr1;

	gpc = this.gradientPC;

	gr1 = this.gradientR1;

	return(
		euclid_ellipse.create(
			'pnw', this.pnw.compute( frame, view ),
			'pse', this.pse.compute( frame, view ),
			'gradientPC', gpc && gpc.compute( frame, view ),
			'gradientR1',
				view
				? ( gr1 ? view.scale( gr1 ) : undefined )
				: gr1
		)
	);
};


})( );
