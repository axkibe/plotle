/*
| A view on a space determines the current
| pan, zooming and viewport (size of screen)
|
| FIXME remove
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
				comment : 'the zoom factor',
				type : 'number'
			}
		}
	};
}


var
	euclid_point,
	euclid_rect,
	euclid_view,
	jion;


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

	return x * this.zoom + this.pan.x;
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

	return ( x  - this.pan.x ) / this.zoom;
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

	return y * this.zoom + this.pan.y;
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

	return ( y - this.pan.y ) / this.zoom;
};


/*
| A view with pan zero, but same zoom level
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
| A view with pan zero and zoom 1
*/
jion.lazyValue(
	prototype,
	'sizeOnly',
	function( )
{
	return(
		this.create(
			'pan', euclid_point.zero,
			'zoom', 1
		)
	);
}
);


/*
| The rect covered by this view.
*/
jion.lazyValue(
	prototype,
	'rect',
	function( )
{
	var
		pan;

	pan = this.pan;

	return(
		euclid_rect.create(
			'pnw', pan,
			'pse',
				pan.add(
					this.width / this.zoom,
					this.height / this.zoom
				)
		)
	);
}
);


/*
| The zero based area of this view.
|
| FIXME check if still useful.
*/
jion.lazyValue(
	prototype,
	'baseArea',
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
		'pan', euclid_point.zero,
		'width', 0,
		'zoom', 1
	);


} )( );
