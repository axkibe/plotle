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
| The jion definition
*/
if( JION )
{
	throw{
		id : 'gleam_roundRect',
		attributes :
		{
			pnw :
			{
				comment : 'point in north west',
				type : 'gleam_point'
			},
			pse :
			{
				comment : 'point in south east',
				type : 'gleam_point'
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
		},
		init : [ 'pnw', 'pse', 'a', 'b' ]
	};
}


var
	gleam_point,
	gleam_roundRect,
	gleam_shape,
	gleam_shape_line,
	gleam_shape_round,
	gleam_shape_start,
	jion,
	swatch;


/*
| Capsule
*/
( function() {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype = gleam_roundRect.prototype;


/*
| Initializes the round rect.
*/
prototype._init =
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

	pne = gleam_point.create( 'x', pse.x, 'y', pnw.y );

	psw = gleam_point.create( 'x', pnw.x, 'y', pse.y );

	this.shape =
		gleam_shape.create(
			'ray:init',
				[
					gleam_shape_start.create(
						'p', pnw.add( 0 , b )
					),
					gleam_shape_round.create(
						'p', pnw.add( a , 0 )
					),
					gleam_shape_line.create(
						'p', pne.sub( a , 0 )
					),
					gleam_shape_round.create(
						'p', pne.add( 0 , b )
					),
					gleam_shape_line.create(
						'p', pse.sub( 0 , b )
					),
					gleam_shape_round.create(
						'p', pse.sub( a , 0 )
					),
					gleam_shape_line.create(
						'p', psw.add( a , 0 )
					),
					gleam_shape_round.create(
						'p', psw.sub( 0 , b )
					),
					gleam_shape_line.create(
						'close', true
					)
				],
			'pc', this.pc
		);
};


/*
| Returns a round rect moved by a point.
*/
prototype.add =
	function(
		p
	)
{
	if( p.x === 0 && p.y === 0 ) return this;

	return(
		this.create(
			'pnw', this.pnw.add( p ),
			'pse', this.pse.add( p )
		)
	);
};


/*
| Returns a shape bordering this shape by d.
*/
prototype.border =
	function(
		d // distance to border
	)
{
	return this.shape.border( d );
};


/*
| Rectangle height.
*/
jion.lazyValue(
	prototype,
	'height',
	function( )
	{
		return this.pse.y - this.pnw.y;
	}
);


/*
| point in the center
*/
jion.lazyValue(
	prototype,
	'pc',
	function( )
	{
		return(
			gleam_point.create(
				'x', ( this.pse.x + this.pnw.x ) / 2,
				'y', ( this.pse.y + this.pnw.y ) / 2
			)
		);
	}
);


/*
| Rectangle width.
*/
jion.lazyValue(
	prototype,
	'width',
	function( )
	{
		return this.pse.x - this.pnw.x;
	}
);




/*
| Gets the source of a projection to p.
*/
prototype.getProjection =
	function
	(
		// ...
	)
{
	return(
		this.shape.getProjection.apply(
			this.shape,
			arguments
		)
	);
};


/*
| Returns a transformed roundRect.
*/
prototype.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.reflect !== 'gleam_transform' ) throw new Error( );
/**/}

	return(
		transform.zoom === 1
		? this.add( transform.offset )
		: this.create(
			'pnw', this.pnw.transform( transform ),
			'pse', this.pse.transform( transform ),
			'a', transform.scale( this.a ),
			'b', transform.scale( this.b )
		)
	);
};


/*
| Returns true if p is within the shape.
*/
prototype.within =
	function(
		p
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return swatch.within( p, this );
};


} )( );