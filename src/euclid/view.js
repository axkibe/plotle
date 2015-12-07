/*
| A view on a space determines the current
| pan, zooming and viewport (size of screen)
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
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
			},
			zoom :
			{
				comment : 'set the zoom factor directly',
				type : [ 'undefined', 'number' ],
				assign : ''
			}
		},
		init : [ 'zoom' ]
	};
}


var
	euclid_point,
	euclid_rect,
	euclid_view,
	jion,
	math_limit,
	shell_settings;


/*
| Capsule
*/
( function( ) {
'use strict';


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
	function(
		zoom
	)
{
	if( zoom === undefined )
	{
		this.fact =
			math_limit(
				shell_settings.zoomMin,
				this.fact,
				shell_settings.zoomMax
			);

		this.zoom = Math.pow( shell_settings.zoomBase, this.fact );
	}
	else
	{
		this.zoom = zoom;
	}
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

	return Math.round( ( x + this.pan.x ) * this.zoom );
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
/**/	if( typeof( x ) !== 'number' || arguments.length !== 1 )
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
/**/	if( typeof( y ) !== 'number' || arguments.length !== 1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return Math.round( y / this.zoom - this.pan.y );
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
		f1 =
			math_limit(
				shell_settings.zoomMin,
				this.fact + df,
				shell_settings.zoomMax
			);
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
