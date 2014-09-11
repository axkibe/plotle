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


/*
| Export
*/
var
	euclid;

euclid = euclid || { };


/*
| Imports
*/
var
	jools;


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
			'euclid.roundRect',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north west',
						type :
							'euclid.point'
					},
				pse :
					{
						comment :
							'point in south east',
						type :
							'euclid.point'
					},
				a :
					{
						comment :
							'horizontal rounding',
						type :
							'Number'
					},
				b :
					{
						comment :
							'vertical rounding',
						type :
							'Number'
					}
			},

		init :
			[
				'pnw',
				'pse',
				'a',
				'b'
			]
	};
}


var
	roundRect;

roundRect = euclid.roundRect;


/*
| Initializes the round rect.
*/
roundRect.prototype._init =
	function(
		pnw,
		pse,
		a,
		b
	)
{
	var
		pne =
			euclid.point.create( 'x', pse.x, 'y', pnw.y ),

		psw =
			euclid.point.create( 'x', pnw.x, 'y', pse.y );

	this.shape =
		euclid.shape.create(
			'hull',
				[
					'start',
						pnw.add( 0 , b ),
					'round',
						'clockwise',
						pnw.add( a , 0 ),
					'line',
						pne.sub( a , 0 ),
					'round',
						'clockwise',
						pne.add( 0 , b ),
					'line',
						pse.sub( 0 , b ),
					'round',
						'clockwise',
						pse.sub( a , 0 ),
					'line',
						psw.add( a , 0 ),
					'round',
						'clockwise',
						psw.sub( 0 , b ),
					'line',
						'close'
				],
			'pc',
				this.pc
		);
};


/*
| point in the center
*/
jools.lazyValue(
	roundRect.prototype,
	'pc',
	function( )
	{
		return (
			euclid.point.create(
				'x',
					jools.half( this.pse.x + this.pnw.x ),
				'y',
					jools.half( this.pse.y + this.pnw.y )
			)
		);
	}
);


/*
| Rectangle width.
*/
jools.lazyValue(
	roundRect.prototype,
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
	roundRect.prototype,
	'height',
	function( )
	{
		return this.pse.y - this.pnw.y;
	}
);


/*
| Returns true if point is within the ellipse.
*/
roundRect.prototype.within =
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
roundRect.prototype.getProjection =
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
