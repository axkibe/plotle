/*
| A view on a space determines the current
| pan, zooming and viewport (size of screen)
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
	jools,
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
	return {
		id :
			'euclid.view',
		attributes :
			{
				fact :
					{
						comment :
							'zooming factor of view',
						type :
							'Number'
					},
				height :
					{
						comment :
							'current height of screen',
						type :
							'Integer'
					},
				pan :
					{
						comment :
							'point in north west (equals panning)',
						type :
							'euclid.point'
					},
				width :
					{
						comment :
							'current width of screen',
						type :
							'Integer'
					}
			},
		init :
			[ ],
		node :
			true
	};
}


var
	point,
	view;

/*
| Node includes.
*/
if( SERVER )
{
	view = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );

	point = require( './point' );
}
else
{
	view = euclid.view;

	point = euclid.point;
}


/*
| Initializer.
*/
view.prototype._init =
	function( )
{
	if( SHELL )
	{
		this.fact =
			jools.limit(
				theme.zoom.min,
				this.fact,
				theme.zoom.max
			);

		this.zoom =
			Math.pow(
				theme.zoom.base,
				this.fact
			);
	}
};


/*
| Returns the scaled distance of d
*/
view.prototype.scale =
	function(
		d
	)
{
	return this.zoom * d;
};


/*
| Returns the x value for a point for this view.
*/
view.prototype.x =
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
view.prototype.dex =
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
view.prototype.y =
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
view.prototype.dey =
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
|
| FUTURE remove?
*/
jools.lazyValue(
	view.prototype,
	'home',
	function( )
	{
		return this.create( 'pan', point.zero );
	}
);



/*
| A view with pan zero and fact zero
*/
jools.lazyValue(
	view.prototype,
	'sizeOnly',
	function( )
	{
		return(
			this.create(
				'pan', point.zero,
				'fact', 0
			)
		);
	}
);


/*
| Returns a point repositioned to the current view.
*/
view.prototype.point =
	function(
		p
	)
{
	var
		anchor;

	switch( p.reflect )
	{
		case 'euclid.point' :

			return(
				point.renew(
					this.x( p.x ),
					this.y( p.y ),
					p
				)
			);

		case 'euclid.fixPoint' :

			anchor = p.anchor;

			return(
				point.create(
					'x', this.x( anchor.x ) + p.x,
					'y', this.y( anchor.y ) + p.y
				)
			);

		default :

			throw new Error( );
	}
};


/*
| Returns the original position of repositioned point.
*/
view.prototype.depoint =
	function(
		p
	)
{

/**/if( CHECK )
/**/{
/**/	if( p.reflect !== 'euclid.point' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		point.create(
			'x', this.dex( p.x ),
			'y', this.dey( p.y )
		)
	);
};


/*
| Returns a rect repositioned and resized to the current view.
*/
view.prototype.rect =
	function(
		a1,
		a2
	)
{
	var
		pnw,
		pse,
		r;

	if( this.zoom === 1 )
	{
		r =
			( a1.reflect === 'euclid.rect' )
			? a1
			: euclid.rect.create(
				'pnw', a1,
				'pse', a2
			);

		return(
			( this.pan.x === 0 && this.pan.y === 0 )
			? r
			: r.add( this.pan )
		);
	}

	if( a1.reflect === 'euclid.rect' )
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
		euclid.rect.create(
			'pnw', this.point( pnw ),
			'pse', this.point( pse )
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
view.prototype.review =
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
		f1 =
			jools.limit(
				theme.zoom.min,
				this.fact + df,
				theme.zoom.max
			);
	}

	z1 = Math.pow( 1.1, f1 );

	f = 1 / z1 - 1 / this.zoom;

	return(
		this.create(
			'fact', f1,
			'pan',
				point.create(
					'x', Math.round( pan.x + p.x * f ),
					'y', Math.round( pan.y + p.y * f )
				)
		)
	);
};


/*
| The zero based frame of this view.
*/
jools.lazyValue(
	view.prototype,
	'baseFrame',
	function( )
	{
		return(
			euclid.rect.create(
				'pnw',
					point.zero,
				'pse',
					point.create(
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
view.proper =
	view.create(
		'height', 0,
		'fact', 0,
		'pan', point.zero,
		'width', 0
	);


} )( );
