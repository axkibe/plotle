/*
| An ellipse.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'gleam_ellipse',
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
			gradientPC :
			{
				comment : 'center for gradient',
				type : [ 'undefined', 'gleam_point' ],
				assign : '_gradientPC'
			},
			gradientR0 :
			{
				comment : 'inner radius for circle gradients',
				type : [ 'undefined', 'number' ],
				assign : '_gradientR0'
			},
			gradientR1 :
			{
				comment : 'outer radius for circle gradients',
				type : [ 'undefined', 'number' ],
				assign : '_gradientR1'
			}
		},
		init : [ 'pos', 'width', 'height' ]
	};
}


var
	gleam_ellipse,
	gleam_point,
	gleam_shape_round,
	gleam_shape,
	gleam_shape_start,
	jion,
	swatch;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = gleam_ellipse.prototype;


/*
| Initialization.
| FIXME make lazy
*/
prototype._init =
	function(
		p,
		width,
		height
	)
{
	// cardinal coords
	var
		wx,
		ny,
		ex,
		sy,
		// middles of cardinal cords
		my,
		mx,
		// cardinal points
		pw,
		pn,
		pe,
		ps;

	wx = p.x;

	ny = p.y;

	ex = p.x + width;

	sy = p.y + height;

	// middles of cardinal cords
	my = ( ny + sy ) / 2;

	mx = ( wx + ex ) / 2;

	// cardinal points
	pw =
	this.pw =
		gleam_point.create( 'x', wx, 'y', my );

	pn =
	this.pn =
		gleam_point.create( 'x', mx, 'y', ny );

	pe =
	this.pe =
		gleam_point.create( 'x', ex, 'y', my );

	ps =
	this.ps =
		gleam_point.create( 'x', mx, 'y', sy );

	this.shape =
		gleam_shape.create(
			'ray:init',
			[
				gleam_shape_start.create( 'p', pw ),
				gleam_shape_round.create( 'p', pn ),
				gleam_shape_round.create( 'p', pe ),
				gleam_shape_round.create( 'p', ps ),
				gleam_shape_round.create( 'close', true )
			],
			'pc', this.pc
		);
};


/*
| Shortcut to create an ellipse by specifying p and size.
*/
gleam_ellipse.posSize =
	function(
		pos,
		size
	)
{
	return(
		gleam_ellipse.create(
			'pos', pos,
			'width', size.width,
			'height', size.height
		)
	);
};


/*
| Returns a moved ellipse.
*/
prototype.add =
	function(
		p
	)
{
	return(
		( p.x === 0 && p.y === 0 )
		? this
		: this.create( 'pos', this.pos.add( p.x, p.y ) )
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
| Gets the source of a projection to p.
*/
prototype.getProjection =
	function
	(
		// ...
	)
{
	return this.shape.getProjection.apply( this.shape, arguments );
};


/*
| Gradient's center point.
*/
jion.lazyValue(
	prototype,
	'gradientPC',
function( )
{
	if( this._gradientPC ) return this._gradientPC;

	return this.pc;
}
);


/*
| Gradient inner radius.
*/
jion.lazyValue(
	prototype,
	'gradientR1',
	function( )
{
	if( this._gradientR1 ) { return this._gradientR1; }

	return Math.max( this.width, this.height );
}
);


/*
| Gradient inner radius.
*/
jion.lazyValue(
	prototype,
	'gradientR0',
	function( )
{
	if( this._gradientR0 ) return this._gradientR0;

	return 0;
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
			'gradientPC',
				this.gradientPC !== undefined
				? this.gradientPC.transform( transform )
				: pass,
			'gradientR0',
				this.gradientR0 !== undefined
				? transform.scale( this.gradientR0 )
				: pass,
			'gradientR1',
				this.gradientR1 !== undefined
				? transform.scale( this.gradientR1 )
				: pass
		)
	);
};


/*
| Center point of an ellipse.
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
| Returns true if p is within the ellipse.
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

