/*
| A view on a space determines the current
| pan, zooming and viewport (size of screen)
|
| FIXME move the rect/rountRect/point/ellipse stuff to these objects.
*/


var
	euclid_ellipse,
	euclid_point,
	euclid_roundRect,
	euclid_rect,
	euclid_view,
	math_limit,
	jion,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'euclid_view',
		attributes :
		{
			fact :
			{
				comment : 'zooming factor of view',
				type : 'number'
			},
			height :
			{
				comment : 'current height of screen',
				type : 'integer'
			},
			pan :
			{
				comment : 'point in north west (equals panning)',
				type : 'euclid_point'
			},
			width :
			{
				comment : 'current width of screen',
				type : 'integer'
			}
		},
		init : [ ]
	};
}


var
	prototype;


/*
| Node includes.
*/
if( NODE )
{
	jion = require( 'jion' );

	euclid_view = require( 'jion' ).this( module, 'source' );

	euclid_point = require( './point' );

	euclid_view.prototype._init = function( ) { };

	return;
}


prototype = euclid_view.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	this.fact = math_limit( theme.zoom.min, this.fact, theme.zoom.max );

	this.zoom = Math.pow( theme.zoom.base, this.fact );
};


/*
| Returns the scaled distance of d
*/
prototype.scale =
	function(
		d
	)
{
	return this.zoom * d;
};


/*
| Returns the x value for a point for this view.
*/
prototype.x =
	function(
		x
	)
{
/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( x ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return Math.round(
		( x + this.pan.x ) * this.zoom
	);
};


/*
| Returns the original x value for a point in this view.
*/
prototype.dex =
	function(
		x
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( x ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return Math.round( x / this.zoom - this.pan.x );
};


/*
| Returns the y value for a point for this view.
*/
prototype.y =
	function(
		y
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( y ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return Math.round(
		( y + this.pan.y ) * this.zoom
	);
};


/*
| Returns the original y value for a point in this view.
*/
prototype.dey =
	function(
		y
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( y ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return Math.round(
		y / this.zoom - this.pan.y
	);
};


/*
| A view with pan zero, but same fact level
*/
jion.lazyValue(
	prototype,
	'home',
	function( )
	{
		return this.create( 'pan', euclid_point.zero );
	}
);



/*
| A view with pan zero and fact zero
*/
jion.lazyValue(
	prototype,
	'sizeOnly',
	function( )
	{
		return(
			this.create(
				'pan', euclid_point.zero,
				'fact', 0
			)
		);
	}
);


/*
| Returns a point repositioned to the current view.
*/
prototype.point =
	function(
		p
	)
{
	throw new Error( 'XXX' );
	/*
	var
		anchor;

	switch( p.reflect )
	{
		case 'euclid_point' :

			return(
				p.create(
					'x', this.x( p.x ),
					'y', this.y( p.y )
				)
			);

		case 'euclid_fixPoint' :

			anchor = p.anchor;

			return(
				euclid_point.create(
					'x', this.x( anchor.x ) + p.x,
					'y', this.y( anchor.y ) + p.y
				)
			);

		default :

			throw new Error( );
	}
	*/
};


/*
| Returns the original position of repositioned point.
*/
prototype.depoint =
	function(
		p
	)
{

/**/if( CHECK )
/**/{
/**/	if( p.reflect !== 'euclid_point' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		euclid_point.create(
			'x', this.dex( p.x ),
			'y', this.dey( p.y )
		)
	);
};


/*
| Returns a ellipse for the current view.
*/
prototype.ellipse =
	function(
		ellipse
	)
{
	if( this.zoom === 1 )
	{
		return(
			( this.pan.x === 0 && this.pan.y === 0 )
			? ellipse
			: ellipse.add( this.pan )
		);
	}

	return(
		euclid_ellipse.create(
			'pnw', ellipse.pnw.inView( this ),
			'pse', ellipse.pse.inView( this )
			// FIXME gradients
		)
	);
};


/*
| Returns a roundRect for the current view.
*/
prototype.roundRect =
	function(
		roundRect
	)
{
	if( this.zoom === 1 )
	{
		return(
			( this.pan.x === 0 && this.pan.y === 0 )
			? roundRect
			: roundRect.add( this.pan )
		);
	}

	return(
		euclid_roundRect.create(
			'pnw', roundRect.pnw.inView( this ),
			'pse', roundRect.pse.inView( this ),
			'a', this.scale( roundRect.a ),
			'b', this.scale( roundRect.b )
		)
	);
};


/*
| Returns a rect repositioned and resized to the current view.
*/
prototype.rect =
	function(
		a1,
		a2
	)
{
	var
		pnw,
		pse,
		r;

	if( arguments.length !== 1 )
	{
		throw new Error( 'FIXME' );
	}

	if( this.zoom === 1 )
	{
		r =
			( a1.reflect === 'euclid_rect' )
			? a1
			: euclid_rect.create(
				'pnw', a1,
				'pse', a2
			);

		return(
			( this.pan.x === 0 && this.pan.y === 0 )
			? r
			: r.add( this.pan )
		);
	}

	if( a1.reflect === 'euclid_rect' )
	{
		pnw = a1.pnw;

		pse = a1.pse;
	}
	else
	{
		pnw = a1;

		pse = a2;
	}

	return(
		euclid_rect.create(
			'pnw', pnw.inView( this ),
			'pse', pse.inView( this )
		)
	);
};


/*
| Returns a view with changed zoom level and
| a pan so p stays in the same spot.
|
| new pnw (k1) calculates as:
|
| A: p = (y0 + k1) * z1
| B: p = (y0 + k0) * z0
|
| A: p / z1 = y0 + k1
| B: p / z0 = y0 + k0
|
| A - B: p / z1 - p / z0 = k1 - k0
|
| -> k1 = p *(1 / z1 - 1 / z0) + k0
*/
prototype.review =
	function(
		df,
		p
	)
{
	var
		f,
		f1,
		pan,
		z1;

	pan = this.pan;

	if( df === 0 )
	{
		f1 = 0;
	}
	else
	{
		f1 = math_limit( theme.zoom.min, this.fact + df, theme.zoom.max );
	}

	z1 = Math.pow( 1.1, f1 );

	f = 1 / z1 - 1 / this.zoom;

	return(
		this.create(
			'fact', f1,
			'pan',
				euclid_point.create(
					'x', Math.round( pan.x + p.x * f ),
					'y', Math.round( pan.y + p.y * f )
				)
		)
	);
};


/*
| The zero based frame of this view.
*/
jion.lazyValue(
	prototype,
	'baseFrame',
	function( )
	{
		return(
			euclid_rect.create(
				'pnw', euclid_point.zero,
				'pse',
					euclid_point.create(
						'x', this.width,
						'y', this.height
					)
			)
		);
	}
);


/*
| Proper is the view at point zero with zero zoom.
*/
euclid_view.proper =
	euclid_view.create(
		'height', 0,
		'fact', 0,
		'pan', euclid_point.zero,
		'width', 0
	);


} )( );
