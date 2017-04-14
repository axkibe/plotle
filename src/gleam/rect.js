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
			pos :
			{
				comment : 'position',
				json : true,
				type : 'gleam_point'
			},
			height :
			{
				comment : 'height',
				json : true,
				type : 'number'
			},
			width :
			{
				comment : 'width',
				json : true,
				type : 'number'
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
	if( p2.x >= p1.x && p2.y >= p1.y )
	{
		return(
			gleam_rect.create(
				'pos', p1,
				'width', p2.x - p1.x,
				'height', p2.y - p1.y
			)
		);
	}
	else if( p1.x >= p2.x && p1.y >= p2.y )
	{
		return(
			gleam_rect.create(
				'pos', p2,
				'width', p1.x - p2.x,
				'height', p1.y - p2.y
			)
		);
	}
	else if( p2.x >= p1.x && p1.y >= p2.y )
	{
		return(
			gleam_rect.create(
				'pos', gleam_point.xy( p1.x, p2.y ),
				'width', p2.x - p1.x,
				'height', p1.y - p2.y
			)
		);
	}
	else if( p1.x >= p2.x && p2.y >= p1.y )
	{
		return(
			gleam_rect.create(
				'pos', gleam_point.xy( p2.x, p1.y ),
				'width', p1.x - p2.x,
				'height', p2.y - p1.y
			)
		);
	}
	else
	{
		throw new Error( );
	}
};


/*
| Shortcut to create a rect by specifying position and size.
*/
gleam_rect.posSize =
	function(
		pos,
		size
	)
{
	return(
		gleam_rect.create(
			'pos', pos,
			'width', size.width,
			'height', size.height
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
	return this.create( 'pos', this.pos.add( a1, a2 ) );
};


/*
| Returns a shape bordering this shape by d.
*/
prototype.border =
	function(
		d // distance to border
	)
{
	return(
		this.create(
			'pos', this.pos.add(d, d),
			'width', this.width - 2 * d,
			'height', this.height - 2 * d
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
	return this.pos.add( this.width / 2, 0 );
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
	return this.pos.add( this.width / 2, this.height );
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
	return this.pos.add( this.width, this.height / 2 );
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
	return this.pos.add( this.width, 0 );
}
);


/*
| North west point.
*/
jion.lazyValue(
	prototype,
	'pnw',
	function( )
{
	// FIXME console.log('XXX');
	return this.pos;
}
);


/*
| South east point.
*/
jion.lazyValue(
	prototype,
	'pse',
	function( )
{
	return this.pos.add( this.width, this.height );
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
	return this.pos.add( 0, this.height );
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
			'width', Math.max( this.width, minWidth ),
			'height', Math.max( this.height, minHeight )
		)
	);
};


/*
| Returns this point scaled by
| scaleX, scaleY relative to the base point.
*/
prototype.baseScale =
	function(
		action,
		ax,
		ay
	)
{
	var
		pos,
		pse;

	if( action.scaleX === 1 && action.scaleY === 1 )
		return this.add( ax, ay );

	pos = this.pos.baseScale( action, ax, ay );

	pse = this.pse.baseScale( action, ax, ay );

	return(
		this.create(
			'pos', pos,
			'width', pse.x - pos.x,
			'height', pse.y - pos.y
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
			'pos', this.pos.transform( transform ),
			'width', transform.scale( this.width ),
			'height', transform.scale( this.height )
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
			'pos', this.pos.detransform( transform ),
			'width', transform.scale( this.width ),
			'height', transform.scale( this.height )
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
			'pos', this.pos.add( margin.e, margin.n ),
			'width', this.width - margin.e - margin.w,
			'height', this.height - margin.n - margin.s
		)
	);
};


/*
| A rectangle of same size with pnw at 0/0
*/
jion.lazyValue(
	prototype,
	'zeroPos',
	function( )
{
	if( this.pos.x === 0 && this.pos.y === 0 )
	{
		return this;
	}
	else
	{
		return this.create( 'pos', gleam_point.zero );
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
			'x', this.pos.x + this.width / 2,
			'y', this.pos.y + this.height / 2
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
			'x', this.pos.x,
			'y', this.pos.y + this.height / 2
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
		jion.aheadValue( size, 'zeroRect', this );
	}

	return size;
}
);


/*
| Returns a rect moved by -x/-y.
*/
prototype.sub =
	function(
		x,
		y
	)
{
	return this.create( 'pos', this.pos.sub( x, y ) );
};


/*
| A rect larger by 1.
| FIXME rename enlarge1
*/
jion.lazyValue(
	prototype,
	'add1',
	function( )
{
	var add1;

	add1 = this.create( 'width', this.width + 1, 'height', this.height + 1 );

	jion.aheadValue( add1, 'sub1', this );

	return add1;
}
);


/*
| A rect larger by 1.5.
*/
jion.lazyValue(
	prototype,
	'add1_5',
	function( )
{
	var add1_5;

	add1_5 =
		this.create(
			'width', this.width + 1.5,
			'height', this.height + 1.5
		);

	return add1_5;
}
);


/*
| A rect smaller by 1.
*/
jion.lazyValue(
	prototype,
	'sub1',
	function( )
{
	var sub1;

	sub1 = this.create( 'width', this.width - 1, 'height', this.height - 1 );

	jion.aheadValue( sub1, 'add1', this );

	return sub1;
}
);


/*
| Returns true if point is within this rect.
|
| FIXME remove that border thing
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
		pos;

	border = border || 0;

	x = p.x;

	y = p.y;

	pos = this.pos;

	return(
		x >= pos.x + border
		&& y >= pos.y + border
		&& x <= pos.x + this.width - border
		&& y <= pos.y + this.height - border
	);
};


/*
| A zero rect.
*/
gleam_rect.zero =
	gleam_rect.create(
		'pos', gleam_point.zero,
		'width', 0,
		'height', 0
	);



} )( );
