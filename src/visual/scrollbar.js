/*
| A scrollbar (used by note)
|
| Currently there are only vertical scrollbars.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;


/*
| Imports
*/
var
	Euclid,
	Jools,
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

		name :
			'Scrollbar',

		unit :
			'Visual',

		attributes :
			{
				pos :
					{
						comment :
							'position of the scrollbar',

						type :
							'Number'
					},

				aperture :
					{
						comment :
							'the size of the bar',

						type :
							'Number'
					},

				max :
					{
						comment :
							'maximum position',

						type :
							'Number'
					},

				pnw :
					{
						comment :
							'point in north west',

						type :
							'Point'
					},

				size :
					{
						comment :
							'size',

						type :
							'Number'
					}
			},

		init :
			[ ]
	};
}


var
	Scrollbar =
		Visual.Scrollbar;


/*
| Initializer.
*/
Scrollbar.prototype._init =
	function( )
{
	this.visible =
		this.max > this.aperture;

	// FIXME this look more complicated than it needs to be
	if( this.max - this.aperture >= 0 )
	{
		this.pos =
			Jools.limit(
				0,
				this.pos,
				this.max - this.aperture
			);
	}
	else
	{
		this.pos =
			0;
	}

	if( this.pos < 0 )
	{
		throw new Error( );
	}
};


/*
| Draws the scrollbar.
*/
Scrollbar.prototype.draw =
	function(
		fabric,
		view
	)
{
	if( !this.visible )
	{
		throw new Error(
			'Drawing an invisible scrollbar'
		);
	}

	fabric.paint(
		theme.scrollbar.style,
		this.getArea( view ),
		'sketch',
		Euclid.View.proper
	);
};


/*
| Returns the (2d) area of the scrollbar.
*/
Scrollbar.prototype.getArea =
	function(
		view
	)
{
	var
		ths =
			theme.scrollbar,

		pnw =
			this.pnw,

		size =
			this.size,

		pos =
			this.pos,

		max =
			this.max,

		ap =
			Math.round( this.aperture * size / max ),

		map =
			Math.max( ap, ths.minSize ),

		sy =
			Math.round( pos * ( ( size - map + ap ) / max ) ),

		s05 =
			Jools.half( ths.strength );

	return (
		Euclid.RoundRect.Create(
			'pnw',
				view.point(
					pnw.add( 0, sy )
				)
				.add( -s05, 0 ),
			'pse',
				view.point(
					pnw.add( 0, sy + map )
				)
				.add( s05, 0 ),
			'a',
				ths.ellipseA,
			'b',
				ths.ellipseB
		)
	);
};


/*
| Returns true if p is within the scrollbar.
*/
Scrollbar.prototype.within =
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
Scrollbar.prototype.scale =
	function(
		d
	)
{
	return d * this.max / this.size;
};


} )( );
