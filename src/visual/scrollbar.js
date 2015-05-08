/*
| A scrollbar.
|
| Used by note.
|
| Currently there are only vertical scrollbars.
*/


var
	euclid_roundRect,
	gruga_scrollbar,
	math_half,
	math_limit,
	theme,
	visual_scrollbar;


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
		id : 'visual_scrollbar',
		attributes :
		{
			pos :
			{
				comment : 'position of the scrollbar',
				type : 'number'
			},
			aperture :
			{
				comment :
					'the size of the bar',
				type :
					'number'
			},
			max :
			{
				comment : 'maximum position',
				type : 'number'
			},
			pnw :
			{
				comment : 'point in north west',
				type : 'euclid_point'
			},
			size :
			{
				comment : 'size',
				type : 'number'
			},
			view :
			{
				comment : 'view',
				type : 'euclid_view'
			}
		},
		init : [ ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = visual_scrollbar.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	if( this.max - this.aperture > 0 )
	{
		this.pos = math_limit( 0, this.pos, this.max - this.aperture );
	}
	else
	{
		this.pos = 0;
	}
};


/*
| Draws the scrollbar.
*/
prototype.draw =
	function(
		display,
		view
	)
{
	display.paint(
		gruga_scrollbar.fill,
		gruga_scrollbar.border,
		this.getArea( view )
	);
};


/*
| Returns the (2d) area of the scrollbar.
|
| FIXME use fixPoints
*/
prototype.getArea =
	function(
		view
	)
{
	var
		ths,
		pnw,
		size,
		pos,
		max,
		ap,
		map,
		sy,
		s05;

	ths = theme.scrollbar;

	pnw = this.pnw;

	size = this.size;

	pos = this.pos;

	max = this.max;

	ap = Math.round( this.aperture * size / max );

	map = Math.max( ap, ths.minSize );

	sy = Math.round( pos * ( ( size - map + ap ) / max ) );

	s05 = math_half( ths.strength );

	return(
		euclid_roundRect.create(
			'pnw', pnw.add( 0, sy ).inView( view ).add( -s05, 0 ),
			'pse', pnw.add( 0, sy + map ).inView( view ).add( s05, 0 ),
			'a', ths.ellipseA,
			'b', ths.ellipseB
		)
	);
};


/*
| Returns true if p is within the scrollbar.
*/
prototype.within =
	function(
		p
	)
{
	var
		pnw,
		dex,
		dey;

	pnw = this.pnw;

	// FIXME make a vPNW and vSize
	dex = this.view.dex( p.x );

	dey = this.view.dey( p.y );

	return(
		dex >= pnw.x &&
		dey >= pnw.y &&
		dex <= pnw.x + theme.scrollbar.strength &&
		dey <= pnw.y + this.size
	);
};


/*
| Returns the value of pos change for d pixels in the current zone.
*/
prototype.scale =
	function(
		d
	)
{
	return d * this.max / this.size;
};


} )( );
