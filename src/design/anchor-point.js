/*
| A point anchored within a frame.
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
	jools,
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
			'AnchorPoint',

		unit :
			'Design',

		attributes :
			{
				anchor :
					{
						comment :
							'compass of the anchor',

						type :
							'String'
					},

				x :
					{
						comment :
							'x-distance',

						type :
							'Integer'
					},

				y :
					{
						comment :
							'y-distance',

						type :
							'Integer'
					}
			}
	};
}


var
	AnchorPoint =
		Design.AnchorPoint;

/*
| Point in center
*/
AnchorPoint.PC =
	AnchorPoint.create(
		'anchor',
			'c',
		'x',
			0,
		'y',
			0
	);


/*
| Point in north west
*/
AnchorPoint.PNW =
	AnchorPoint.create(
		'anchor',
			'nw',
		'x',
			0,
		'y',
			0
	);

/*
| Point in south east
*/
AnchorPoint.PSE =
	AnchorPoint.create(
		'anchor',
			'se',
		'x',
			0,
		'y',
			0
	);

/*
| Point in south east minus 1
*/
AnchorPoint.PSE_M1 =
	AnchorPoint.create(
		'anchor',
			'se',
		'x',
			-1,
		'y',
			-1
	);

/*
| Computes the AnchorPoint to an Euclid one.
*/
AnchorPoint.prototype.compute =
	function(
		frame
	)
{
	var
		half,
		pnw,
		pse;

/**/if( CHECK )
/**/{
/**/	if( frame.reflex !== 'euclid.rect' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	half = jools.half;

	pnw = frame.pnw;

	pse = frame.pse;

	switch( this.anchor )
	{
		case 'c'  :

			return (
				Euclid.Point.create(
					'x',
						half( pnw.x + pse.x ) + this.x,
					'y',
						half( pnw.y + pse.y ) + this.y
				)
			);

		case 'n'  :

			return (
				Euclid.Point.create(
					'x',
						half( pnw.x + pse.x ) + this.x,
					'y',
						pnw.y + this.y
				)
			);

		case 'ne' :

			return (
				Euclid.Point.create(
					'x',
						pse.x + this.x,
					'y',
						pnw.y + this.y
				)
			);

		case 'e'  :

			return (
				Euclid.Point.create(
					'x',
						pse.x + this.x,
					'y',
						half( pnw.y + pse.y ) + this.y
				)
			);

		case 'se' :

			return (
				pse.add(
					this.x,
					this.y
				)
			);

		case 's'  :

			return (
				Euclid.Point.create(
					'x',
						half( pnw.x + pse.x ) + this.x,
					'y',
						pse.y + this.y
				)
			);

		case 'sw' :

			return (
				Euclid.Point.create(
					'x',
						pnw.x + this.x,
					'y',
						pse.y + this.y
				)
			);

		case 'w'  :

			return (
				Euclid.Point.create(
					'x',
						pnw.x + this.x,
					'y',
						half( pnw.y + pse.y ) +
						this.y
				)
			);

		case 'nw' :

			return (
				pnw.add(
					this.x,
					this.y
				)
			);

		default :

			throw new Error( );
	}
};


})( );
