/*
| A scrollbar (used by note).
|
| Currently there are only vertical scrollbars.
*/


var
	euclid_roundRect,
	euclid_view,
	jools,
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
	return {
		id :
			'visual_scrollbar',
		attributes :
			{
				pos :
					{
						comment :
							'position of the scrollbar',
						type :
							'number'
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
						comment :
							'maximum position',
						type :
							'number'
					},
				pnw :
					{
						comment :
							'point in north west',
						type :
							'euclid_point'
					},
				size :
					{
						comment :
							'size',
						type :
							'number'
					}
			},
		init :
			[ ]
	};
}


/*
| Initializer.
*/
visual_scrollbar.prototype._init =
	function( )
{
	this.visible = this.max > this.aperture;

	// FIXME this look more complicated than it needs to be
	if( this.max - this.aperture >= 0 )
	{
		this.pos =
			jools.limit(
				0,
				this.pos,
				this.max - this.aperture
			);
	}
	else
	{
		this.pos = 0;
	}

	if( this.pos < 0 )
	{
		throw new Error( );
	}
};


/*
| Draws the scrollbar.
*/
visual_scrollbar.prototype.draw =
	function(
		display,
		view
	)
{
/**/if( CHECK )
/**/{
/**/	if( !this.visible )
/**/	{
/**/		// Trying to drawing an invisible scrollbar
/**/		throw new Error( );
/**/	}
/**/}

	display.paint(
		theme.scrollbar.style,
		this.getArea( view ),
		euclid_view.proper
	);
};


/*
| Returns the (2d) area of the scrollbar.
|
| FIXME use fixPoints
*/
visual_scrollbar.prototype.getArea =
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

	s05 = jools.half( ths.strength );

	return (
		euclid_roundRect.create(
			'pnw', view.point( pnw.add( 0, sy ) ).add( -s05, 0 ),
			'pse', view.point( pnw.add( 0, sy + map ) ).add( s05, 0 ),
			'a', ths.ellipseA,
			'b', ths.ellipseB
		)
	);
};


/*
| Returns true if p is within the scrollbar.
*/
visual_scrollbar.prototype.within =
	function(
		view,
		p
	)
{
	if( !this.visible )
	{
		return false;
	}

	var
		pnw =
			this.pnw,

		dex =
			view.dex( p.x ),

		dey =
			view.dey( p.y );

	return (
		dex >= pnw.x &&
		dey >= pnw.y &&
		dex <= pnw.x + theme.scrollbar.strength &&
		dey <= pnw.y + this.size
	);
};


/*
| Returns the value of pos change for d pixels in the current zone.
*/
visual_scrollbar.prototype.scale =
	function(
		d
	)
{
	return d * this.max / this.size;
};


} )( );
