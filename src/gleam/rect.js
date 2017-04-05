/*
| A rectangle.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_rect',
		attributes :
		{
			pnw :
			{
				comment : 'point in north west',
				json : true,
				type : 'gleam_point'
			},
			pse :
			{
				comment : 'point in south east',
				json : true,
				type : 'gleam_point'
			}
		}
	};
}


var
	gleam_point,
	gleam_rect,
	gleam_size,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	gleam_rect = jion.this( module, 'source' );

	gleam_point = require( './point' );
}


prototype = gleam_rect.prototype;


/*
| Creates a rect by two arbitrary corner points
*/
gleam_rect.createArbitrary =
	function(
		p1,
		p2
	)
{
	var
		pnw,
		pse;

	if( p2.x >= p1.x && p2.y >= p1.y )
	{
		pnw = p1;

		pse = p2;
	}
	else if( p1.x >= p2.x && p1.y >= p2.y )
	{
		pnw = p2;

		pse = p1;
	}
	else if( p2.x >= p1.x && p1.y >= p2.y )
	{
		pnw = gleam_point.create( 'x', p1.x, 'y', p2.y );

		pse = gleam_point.create( 'x', p2.x, 'y', p1.y );
	}
	else if( p1.x >= p2.x && p2.y >= p1.y )
	{
		pnw = gleam_point.create( 'x', p2.x, 'y', p1.y );

		pse = gleam_point.create( 'x', p1.x, 'y', p2.y );
	}
	else
	{
		throw new Error( );
	}

	return gleam_rect.create( 'pnw', pnw, 'pse', pse );
};


/*
| Shortcut to create a rect by specifying pnw and size.
*/
gleam_rect.pnwSize =
	function(
		pnw,
		size
	)
{
	return(
		gleam_rect.create(
			'pnw', pnw,
			'pse', pnw.add( size.width, size.height )
		)
	);
};


/*
| returns a rect moved by a point or x/y
|
| add( point )   -or-
| add( x, y  )
*/
prototype.add =
	function(
		a1,
		a2
	)
{
	return(
		gleam_rect.create(
			'pnw', this.pnw.add( a1, a2 ),
			'pse', this.pse.add( a1, a2 )
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
	var
		pc;

	pc = this.pc;

	return(
		this.create(
			'pnw', this.pnw.border( pc, d ),
			'pse', this.pse.border( pc, d )
		)
	);
};


/*
| North point.
*/
jion.lazyValue(
	prototype,
	'pn',
	function( )
{
	return(
		gleam_point.create(
			'x', ( this.pnw.x + this.pse.x ) / 2,
			'y', this.pnw.y
		)
	);
}
);


/*
| South point.
*/
jion.lazyValue(
	prototype,
	'ps',
	function( )
{
	return(
		gleam_point.create(
			'x', ( this.pnw.x + this.pse.x ) / 2,
			'y', this.pse.y
		)
	);
}
);


/*
| East point.
*/
jion.lazyValue(
	prototype,
	'pe',
	function( )
{
	return(
		gleam_point.create(
			'x', this.pse.x,
			'y', ( this.pse.y + this.pnw.y ) / 2
		)
	);
}
);


/*
| North east point.
*/
jion.lazyValue(
	prototype,
	'pne',
	function( )
{
	return(
		gleam_point.create(
			'x', this.pse.x,
			'y', this.pnw.y
		)
	);
}
);


/*
| South west point.
*/
jion.lazyValue(
	prototype,
	'psw',
	function( )
{
	return(
		gleam_point.create(
			'x', this.pnw.x,
			'y', this.pse.y
		)
	);
}
);


/*
| Returns a rect which has at least
| minHeight / minWidth
*/
prototype.ensureMinSize =
	function(
		minHeight,
		minWidth
	)
{
	if( this.width >= minWidth && this.height >= minHeight ) return this;

	return(
		this.create(
			'pse',
				this.pse.create(
					'x', Math.max( this.pse.x, this.pnw.x + minWidth ),
					'y', Math.max( this.pse.y, this.pnw.y + minHeight )
				)
		)
	);
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
| Returns this point scaled by
| scaleX, scaleY relative to the base point.
*/
prototype.intercept =
	function(
		base,
		scaleX,
		scaleY
	)
{
	if( scaleX === 1 && scaleY === 1 ) return this;

	return(
		this.create(
			'pnw', this.pnw.intercept( base, scaleX, scaleY ),
			'pse', this.pse.intercept( base, scaleX, scaleY )
		)
	);
};


/*
| Returns this transformed rect.
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
			'pse', this.pse.transform( transform )
		)
	);
};


/*
| Returns this detransformed rect.
*/
prototype.detransform =
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
		? this.sub( transform.offset )
		: this.create(
			'pnw', this.pnw.detransform( transform ),
			'pse', this.pse.detransform( transform )
		)
	);
};


/*
| Returns a rectangle thats reduced on every side by a margin object
*/
prototype.reduce =
	function(
		margin
	)
{

/**/if( CHECK )
/**/{
/**/	if( margin.reflect !== 'gleam_margin' ) throw new Error( );
/**/}

	// allows margins to reduce the rect to zero size without erroring.

	return(
		gleam_rect.create(
			'pnw',
				this.pnw.create(
					'x', this.pnw.x + margin.e,
					'y', this.pnw.y + margin.n
				),
			'pse',
				this.pse.create(
					'x', this.pse.x - margin.w,
					'y', this.pse.y - margin.s
				)
		)
	);
};


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
| A rectangle of same size with pnw at 0/0
*/
jion.lazyValue(
	prototype,
	'zeroPnw',
	function( )
{
	if( this.pnw.x === 0 && this.pnw.y === 0 )
	{
		return this;
	}
	else
	{
		return(
			gleam_rect.create(
				'pnw', gleam_point.zero,
				'pse', this.pse.sub( this.pnw )
			)
		);
	}
}
);


/*
| Returns the point where a ray going from
| center of the rect (pc) to p intersects with the rect.
*/
prototype.getProjection =
	function(
		p
	)
{
	var
		pc,
		ny,
		ex,
		sy,
		wx,
		k,
		x,
		y;

	pc = this.pc,

	ny = this.pnw.y,

	ex = this.pse.x,

	sy = this.pse.y,

	wx = this.pnw.x,

	k = ( p.y - pc.y ) / ( p.x - pc.x );

	// y = (x - pc.x) * k + pc.y
	// x = (y - pc.y) / k + pc.x

	if( p.y <= ny )
	{
		x = ( ny - pc.y ) / k + pc.x;

		if ( x >= wx && x <= ex )
		{
			return gleam_point.create( 'x', x, 'y', ny );
		}
	}

	if( p.y >= sy )
	{
		x = ( sy - pc.y ) / k + pc.x;

		if( x >= wx && x <= ex )
		{
			return gleam_point.create( 'x', x, 'y', sy );
		}
	}

	if( p.x >= ex )
	{
		y = ( ex - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return gleam_point.create( 'x', ex, 'y', y );
		}
	}

	if( p.x <= wx )
	{
		y = ( wx - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return gleam_point.create( 'x', wx, 'y', y );
		}
	}

	return pc;
};


/*
| Point in the center.
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
| West point.
*/
jion.lazyValue(
	prototype,
	'pw',
	function( )
{
	return(
		gleam_point.create(
			'x', this.pnw.x,
			'y', ( this.pse.y + this.pnw.y ) / 2
		)
	);
}
);


/*
| A size jion matching this rect.
*/
jion.lazyValue(
	prototype,
	'size',
	function( )
{
	var
		size;

	size =
		gleam_size.create(
			'height', this.height,
			'width', this.width
		);

	if( this.pnw.equals( gleam_point.zero ) )
	{
		jion.aheadValue( size, 'zeroPnwRect', this );
	}

	return size;
}
);


/*
| Returns a rect moved by -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
prototype.sub =
	function(
		a1,
		a2
	)
{
	return(
		gleam_rect.create(
			'pnw', this.pnw.sub( a1, a2 ),
			'pse', this.pse.sub( a1, a2 )
		)
	);
};


/*
| Returns true if point is within this rect.
*/
prototype.within =
	function(
		p,      // point
		border  // additional border
	)
{
	var
		x,
		y,
		pnw,
		pse;

	border = border || 0;

	x = p.x;

	y = p.y;

	pnw = this.pnw;

	pse = this.pse;

	return(
		x >= pnw.x + border
		&& y >= pnw.y + border
		&& x <= pse.x - border
		&& y <= pse.y - border
	);
};



} )( );