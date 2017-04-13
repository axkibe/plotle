/*
| A rectangle with rounded corners.
|
| RoundRects are immutable objects.
|
|      <--> a
|      |  |
|  pos + .----------------. - - - A - - - A
|      .'                  `. _ _ V b     | height
|      |                    |             |
|      |                    |             |
|      |                    |             |
|      |                    |             |
|      '.                  .'             | 
|        `----------------' + - - - - - - V
|      |                    |
|      <--------------------> width
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
			pos :
			{
				comment : 'position',
				type : 'gleam_point'
			},
			width :
			{
				comment : 'width',
				type : 'number'
			},
			height :
			{
				comment : 'height',
				type : 'number'
			},
			a :
			{
				comment : 'horizonal rounding',
				type : 'number'
			},
			b :
			{
				comment : 'vertical rounding',
				type : 'number'
			}
		},
		init : [ 'pos', 'width', 'height', 'a', 'b' ]
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
|
| FIXME make it a lazy value instead
*/
prototype._init =
	function(
		pos,
		width,
		height,
		a,
		b
	)
{
	var
		pne,
		pse,
		psw;

	// FIXME these points aren't needed
	pne = gleam_point.xy( pos.x + width, pos.y );

	pse = gleam_point.xy( pos.x + width, pos.y + height );

	psw = gleam_point.xy( pos.x, pos.y + height );

	this.shape =
		gleam_shape.create(
			'ray:init',
				[
					gleam_shape_start.create(
						'p', pos.add( 0 , b )
					),
					gleam_shape_round.create(
						'p', pos.add( a , 0 )
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
| Returns a round rect moved by x/y
*/
prototype.add =
	function(
		x,
		y
	)
{
	if( x === 0 && y === 0 ) return this;

	return this.create( 'pos', this.pos.add( x, y ) );
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
| point in the center
*/
jion.lazyValue(
	prototype,
	'pc',
	function( )
	{
		return(
			gleam_point.create(
				'x', this.pos.x + this.width / 2,
				'y', this.pos.y + this.height / 2
			)
		);
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
			'pos', this.pos.transform( transform ),
			'width', transform.scale( this.width ),
			'height', transform.scale( this.height ),
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
