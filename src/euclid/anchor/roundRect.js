/*
| A rectangle with rounded corners.
|
|      <--> a
|      |  |
| pnw  + .----------------. - - - A
|      .'                  `. _ _ V b
|      |                    |
|      |                    |
|      |                    |
|      |                    |
|      '.                  .'
|        `----------------' + pse
|
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_roundRect',
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
			a :
			{
				comment : 'horizontal rounding',
				type : 'number'
			},
			b :
			{
				comment : 'vertical rounding',
				type : 'number'
			}
		}
	};
}


var
	euclid_anchor_border,
	euclid_anchor_roundRect,
	euclid_roundRect;

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

prototype = euclid_anchor_roundRect.prototype;


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
| Computes to an unanchored rect for a tenter:
*/
prototype.compute =
	function(
		tenter
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return(
		euclid_roundRect.create(
			'pnw', this.pnw.compute( tenter ),
			'pse', this.pse.compute( tenter ),
			'a', this.a,
			'b', this.b
		)
	);
};


})( );
