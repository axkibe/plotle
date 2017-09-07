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
		}
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
| The shape of the roundRect.
*/
jion.lazyValue(
	prototype,
	'shape',
function( )
{
	var
		a,
		b,
		b2,
		h,
		p,
		w;

	a = this.a;

	b = this.b;

	h = this.height;

	p = this.pos;

	w = this.width;

	b2 = b * 2;

	if( b2 + 0.1 >= h )
	{
		return(
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.create(
						'p', p.add( 0 , b )
					),
					gleam_shape_round.create(
						'p', p.add( a , 0 )
					),
					gleam_shape_line.create(
						'p', p.add( w - a , 0 )
					),
					gleam_shape_round.create(
						'p', p.add( w , b )
					),
					gleam_shape_round.create(
						'p', p.add( w - a , h )
					),
					gleam_shape_line.create(
						'p', p.add( a , h )
					),
					gleam_shape_round.create(
						'close', true
					)
				],
				'pc', this.pc
			)
		);
	}

	return(
		gleam_shape.create(
			'list:init',
			[
				gleam_shape_start.create(
					'p', p.add( 0 , b )
				),
				gleam_shape_round.create(
					'p', p.add( a , 0 )
				),
				gleam_shape_line.create(
					'p', p.add( w - a , 0 )
				),
				gleam_shape_round.create(
					'p', p.add( w , b )
				),
				gleam_shape_line.create(
					'p', p.add( w , h - b )
				),
				gleam_shape_round.create(
					'p', p.add( w - a , h )
				),
				gleam_shape_line.create(
					'p', p.add( a , h )
				),
				gleam_shape_round.create(
					'p', p.add( 0 , h - b )
				),
				gleam_shape_line.create(
					'close', true
				)
			],
			'pc', this.pc
		)
	);
}
);


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
