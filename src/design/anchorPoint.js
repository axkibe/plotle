/*
| A point anchored within a frame.
|
| FIXME uppercase names
*/


var
	design_anchorPoint,
	euclid_point,
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
							'string'
					},
				x :
					{
						comment :
							'x-distance',
						type :
							'integer'
					},
				y :
					{
						comment :
							'y-distance',
						type :
							'integer'
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
design_anchorPoint.nw =
	design_anchorPoint.create(
		'anchor', 'nw',
		'x', 0,
		'y', 0
	);

/*
| Point in south east.
*/
design_anchorPoint.se =
	design_anchorPoint.create(
		'anchor', 'se',
		'x', 0,
		'y', 0
	);

/*
| Point in south east minus 1.
*/
design_anchorPoint.seMin1 =
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
/**/	if( frame.reflect !== 'euclid_rect' )
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
				euclid_point.create(
					'x', half( pnw.x + pse.x ) + this.x,
					'y', half( pnw.y + pse.y ) + this.y
				)
			);

		case 'n'  :

			return(
				euclid_point.create(
					'x', half( pnw.x + pse.x ) + this.x,
					'y', pnw.y + this.y
				)
			);

		case 'ne' :

			return(
				euclid_point.create(
					'x', pse.x + this.x,
					'y', pnw.y + this.y
				)
			);

		case 'e'  :

			return(
				euclid_point.create(
					'x', pse.x + this.x,
					'y', half( pnw.y + pse.y ) + this.y
				)
			);

		case 'se' :

			return pse.add( this.x, this.y );

		case 's'  :

			return(
				euclid_point.create(
					'x', half( pnw.x + pse.x ) + this.x,
					'y', pse.y + this.y
				)
			);

		case 'sw' :

			return(
				euclid_point.create(
					'x', pnw.x + this.x,
					'y', pse.y + this.y
				)
			);

		case 'w'  :

			return(
				euclid_point.create(
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
