/*
| A rectangle with rounded corners.
|
| RoundRects are immutable objects.
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


var
	euclid_point,
	euclid_roundRect,
	euclid_shape,
	jools,
	shapeSection_line,
	shapeSection_round,
	shapeSection_start;


/*
| Capsule
*/
( function() {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return {

		id :
			'euclid_roundRect',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north west',
						type :
							'euclid_point'
					},
				pse :
					{
						comment :
							'point in south east',
						type :
							'euclid_point'
					},
				a :
					{
						comment :
							'horizontal rounding',
						type :
							'number'
					},
				b :
					{
						comment :
							'vertical rounding',
						type :
							'number'
					}
			},

		init :
			[ 'pnw', 'pse', 'a', 'b' ]
	};
}


/*
| Initializes the round rect.
*/
euclid_roundRect.prototype._init =
	function(
		pnw,
		pse,
		a,
		b
	)
{
	var
		pne,
		psw;

	pne = euclid_point.create( 'x', pse.x, 'y', pnw.y );

	psw = euclid_point.create( 'x', pnw.x, 'y', pse.y );

	this.shape =
		euclid_shape.create(
			'ray:init',
				[
					shapeSection_start.create(
						'p', pnw.add( 0 , b )
					),
					shapeSection_round.create(
						'p', pnw.add( a , 0 ),
						'rotation', 'clockwise'
					),
					shapeSection_line.create(
						'p', pne.sub( a , 0 )
					),
					shapeSection_round.create(
						'p', pne.add( 0 , b ),
						'rotation', 'clockwise'
					),
					shapeSection_line.create(
						'p', pse.sub( 0 , b )
					),
					shapeSection_round.create(
						'p', pse.sub( a , 0 ),
						'rotation', 'clockwise'
					),
					shapeSection_line.create(
						'p', psw.add( a , 0 )
					),
					shapeSection_round.create(
						'p', psw.sub( 0 , b ),
						'rotation', 'clockwise'
					),
					shapeSection_line.create(
						'close', true
					)
				],
			'pc',
				this.pc
		);
};


/*
| point in the center
*/
jools.lazyValue(
	euclid_roundRect.prototype,
	'pc',
	function( )
	{
		return(
			euclid_point.create(
				'x', jools.half( this.pse.x + this.pnw.x ),
				'y', jools.half( this.pse.y + this.pnw.y )
			)
		);
	}
);


/*
| Rectangle width.
*/
jools.lazyValue(
	euclid_roundRect.prototype,
	'width',
	function( )
	{
		return this.pse.x - this.pnw.x;
	}
);

/*
| Rectangle height.
*/
jools.lazyValue(
	euclid_roundRect.prototype,
	'height',
	function( )
	{
		return this.pse.y - this.pnw.y;
	}
);


/*
| Returns true if point is within the ellipse.
*/
euclid_roundRect.prototype.within =
	function
	(
		view,
		p
	)
{
	var
		pp;

	pp = view.depoint( p );

	if(
		pp.x < this.pnw.x
		||
		pp.y < this.pnw.y
		||
		pp.x > this.pse.x
		||
		pp.y > this.pse.y
	)
	{
		return false;
	}

	return this.shape.within( view, p );
};


/*
| Gets the source of a projection to p.
*/
euclid_roundRect.prototype.getProjection =
	function
	(
		// ...
	)
{
	return this.shape.getProjection.apply(
		this.shape,
		arguments
	);
};


} )( );
