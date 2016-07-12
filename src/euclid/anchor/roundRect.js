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
				type : 'euclid_anchor_point'
			},
			pse :
			{
				comment : 'point in south-east',
				type : 'euclid_anchor_point'
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
| Computes to an unanchored rect for a area/view:
*/
prototype.compute =
	function(
		area,
		view
	)
{
	return(
		euclid_roundRect.create(
			'pnw', this.pnw.compute( area, view ),
			'pse', this.pse.compute( area, view ),
			'a', view.scale( this.a ),
			'b', view.scale( this.b )
		)
	);
};


})( );
