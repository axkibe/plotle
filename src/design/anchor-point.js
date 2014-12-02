/*
| A point anchored within a frame.
|
| FIXME uppercase names
*/


var
	design_anchorPoint,
	euclid,
	jools;

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
	return{
		id :
			'design_anchorPoint',
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


/*
| Point in center.
*/
design_anchorPoint.PC =
	design_anchorPoint.create(
		'anchor', 'c',
		'x', 0,
		'y', 0
	);


/*
| Point in north west.
*/
design_anchorPoint.PNW =
	design_anchorPoint.create(
		'anchor', 'nw',
		'x', 0,
		'y', 0
	);

/*
| Point in south east.
*/
design_anchorPoint.PSE =
	design_anchorPoint.create(
		'anchor', 'se',
		'x', 0,
		'y', 0
	);

/*
| Point in south east minus 1.
*/
design_anchorPoint.PSE_M1 =
	design_anchorPoint.create(
		'anchor', 'se',
		'x', -1,
		'y', -1
	);

/*
| Computes the anchorPoint to an euclid one.
*/
design_anchorPoint.prototype.compute =
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
/**/	if( frame.reflect !== 'euclid.rect' )
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

			return(
				euclid.point.create(
					'x', half( pnw.x + pse.x ) + this.x,
					'y', half( pnw.y + pse.y ) + this.y
				)
			);

		case 'n'  :

			return(
				euclid.point.create(
					'x', half( pnw.x + pse.x ) + this.x,
					'y', pnw.y + this.y
				)
			);

		case 'ne' :

			return(
				euclid.point.create(
					'x', pse.x + this.x,
					'y', pnw.y + this.y
				)
			);

		case 'e'  :

			return(
				euclid.point.create(
					'x', pse.x + this.x,
					'y', half( pnw.y + pse.y ) + this.y
				)
			);

		case 'se' :

			return pse.add( this.x, this.y );

		case 's'  :

			return(
				euclid.point.create(
					'x', half( pnw.x + pse.x ) + this.x,
					'y', pse.y + this.y
				)
			);

		case 'sw' :

			return(
				euclid.point.create(
					'x', pnw.x + this.x,
					'y', pse.y + this.y
				)
			);

		case 'w'  :

			return(
				euclid.point.create(
					'x', pnw.x + this.x,
					'y', half( pnw.y + pse.y ) + this.y
				)
			);

		case 'nw' :

			return pnw.add( this.x, this.y );

		default :

			throw new Error( );
	}
};


})( );
