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
				type : require( './typemap-points.js' )
			},
			pse :
			{
				comment : 'point in south-east',
				type : require( './typemap-points.js' )
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
	euclid_anchor_border,
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
| Returns an euclid_anchor_border for this
| anchored shape.
*/
prototype.border =
	function(
		d
	)
{
	return(
		euclid_anchor_border.create(
			'distance', d,
			'shape', this
		)
	);
};


/*
| Computes a rect modelled relative to this rect.
*/
prototype.compute =
	function(
		view
	)
{
	var
		gpc,
		gr1;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	gpc = this.gradientPC;

	gr1 = this.gradientR1;

	return(
		euclid_ellipse.create(
			'pnw', this.pnw.compute( view ),
			'pse', this.pse.compute( view ),
			'gradientPC', gpc && gpc.compute( view ),
			'gradientR1',
				view
				? ( gr1 ? view.scale( gr1 ) : undefined )
				: gr1
		)
	);
};


/*
| ellipse filling the full area
| skewed a little to north west
|
| FIXME remove the "Skew"
*/
euclid_anchor_ellipse.fullSkewNW =
	euclid_anchor_ellipse.create(
		'pnw', euclid_anchor_point.nw,
		'pse', euclid_anchor_point.seMin1
	);

})( );
