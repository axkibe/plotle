/*
| A rectangle.
*/
'use strict';


// FIXME
var
	gleam_margin,
	gleam_point,
	gleam_size,
	gleam_transform;


if( NODE )
{
	gleam_point = require( './point' );
}


tim.define( module, 'gleam_rect', ( def, gleam_rect ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	// this tim has an abstract form.
	def.hasAbstract = true;

	def.attributes =
	{
		pos : // position
		{
			type : 'gleam_point',
			json : true,
		},
		height :
		{
			type : 'number',
			json : true,
		},
		width :
		{
			type : 'number',
			json : true,
		}
	};
}


/*::::::::::::::::::::.
:: Static lazy values
':::::::::::::::::::::*/


/*
| A zero rect.
*/
def.staticLazy.zero = () =>
	gleam_rect.create(
		'pos', gleam_point.zero,
		'width', 0,
		'height', 0
	);


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Creates a rect by two arbitrary corner points.
*/
def.static.createArbitrary =
	function(
		p1,  // one point
		p2   // another point
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

	// this should never happen
	throw new Error( );
};


/*
| Shortcut to create a rect by specifying position and size.
*/
def.static.posSize =
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


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Point in the center.
*/
def.lazy.pc = function( )
{
	return this.pos.add( this.width / 2, this.height / 2 );
};


/*
| North point.
*/
def.lazy.pn =
	function( )
{
	return this.pos.add( this.width / 2, 0 );
};


/*
| East point.
*/
def.lazy.pe =
	function( )
{
	return this.pos.add( this.width, this.height / 2 );
};


/*
| South point.
*/
def.lazy.ps =
	function( )
{
	return this.pos.add( this.width / 2, this.height );
};


/*
| North east point.
*/
def.lazy.pne =
	function( )
{
	return this.pos.add( this.width, 0 );
};


// North west point
// is not to be used, since this is 'pos'.


/*
| South east point.
*/
def.lazy.pse =
	function( )
{
	return this.pos.add( this.width, this.height );
};


/*
| South west point.
*/
def.lazy.psw =
	function( )
{
	return this.pos.add( 0, this.height );
};


/*
| West point.
*/
def.lazy.pw =
	function( )
{
	return this.pos.add( 0, this.height / 2 );
};


/*
| A size tim matching this rect.
*/
def.lazy.size =
	function( )
{
	const size = gleam_size.wh( this.width, this.height );

	if( this.pos.equals( gleam_point.zero ) )
	{
		tim.aheadValue( size, 'zeroRect', this );
	}

	return size;
};


/*
| A rectangle of same size with pnw at 0/0
*/
def.lazy.zeroPos =
	function( )
{
	if( this.pos.equals( gleam_point.zero ) ) return this;

	return this.create( 'pos', gleam_point.zero );
};


/*
| A rect larger by 1.
*/
def.lazy.enlarge1 =
	function( )
{
	const enlarge1 =
		this.create(
			'width', this.width + 1,
			'height', this.height + 1
		);

	tim.aheadValue( enlarge1, 'shrink1', this );

	return enlarge1;
};


/*
| A rect larger by 1.5.
*/
def.lazy.add1_5 =
	function( )
{
	return(
		this.create(
			'width', this.width + 1.5,
			'height', this.height + 1.5
		)
	);
};


/*
| A rect smaller by 1.
*/
def.lazy.shrink1 =
	function( )
{
	const shrink1 =
		this.create(
			'width', this.width - 1,
			'height', this.height - 1
		);

	tim.aheadValue( shrink1, 'enlarge1', this );

	return shrink1;
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns a rect moved by a point or x/y.
|
| add( point )   -or-
| add( x, y  )
*/
def.func.add =
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
def.func.border =
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
| Returns a rect which has at least
| minHeight / minWidth
*/
def.func.ensureMinSize =
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
def.func.baseScale =
	function(
		action,
		ax,
		ay
	)
{
	if( action.scaleX === 1 && action.scaleY === 1 )
		return this.add( ax, ay );

	const pos = this.pos.baseScale( action, ax, ay );

	const pse = this.pse.baseScale( action, ax, ay );

	return(
		this.create(
			'pos', pos,
			'width', pse.x - pos.x,
			'height', pse.y - pos.y
		)
	);
};


/*
| Returns this detransformed rect.
*/
def.func.detransform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
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
| Returns the point where a ray going from
| center of the rect (pc) to p intersects with the rect.
*/
def.func.getProjection =
	function(
		p     // point to project to
	)
{
	const pos = this.pos;

	const pc = this.pc;

	const ny = pos.y;

	const wx = pos.x;

	const ex = pos.x + this.width;

	const sy = pos.y + this.height;

	const k = ( p.y - pc.y ) / ( p.x - pc.x );

	// y = (x - pc.x) * k + pc.y
	// x = (y - pc.y) / k + pc.x

	if( p.y <= ny )
	{
		const x = ( ny - pc.y ) / k + pc.x;

		if ( x >= wx && x <= ex ) return gleam_point.xy( x, ny );
	}

	if( p.y >= sy )
	{
		const x = ( sy - pc.y ) / k + pc.x;

		if( x >= wx && x <= ex ) return gleam_point.xy( x, sy );
	}

	if( p.x >= ex )
	{
		const y = ( ex - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy ) return gleam_point.xy( ex, y );
	}

	if( p.x <= wx )
	{
		const y = ( wx - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy ) return gleam_point.xy( wx, y );
	}

	return pc;
};


/*
| Returns this transformed rect.
*/
def.func.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
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
| Returns a rectangle thats reduced on every side by a margin object
*/
def.func.reduce =
	function(
		margin
	)
{
/**/if( CHECK )
/**/{
/**/	if( margin.timtype !== gleam_margin ) throw new Error( );
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
| Returns a rect moved by -x/-y.
*/
def.func.sub =
	function(
		x,
		y
	)
{
	return this.create( 'pos', this.pos.sub( x, y ) );
};


/*
| Returns true if point is within this rect.
|
| FIXME check if this border stuff can be removed.
*/
def.func.within =
	function(
		p,      // point
		border  // additional border
	)
{
	border = border || 0;

	const x = p.x;

	const y = p.y;

	const pos = this.pos;

	return(
		x >= pos.x + border
		&& y >= pos.y + border
		&& x <= pos.x + this.width - border
		&& y <= pos.y + this.height - border
	);
};


} );
