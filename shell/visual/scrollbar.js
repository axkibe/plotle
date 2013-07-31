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
var Visual;


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

if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
var
	Scrollbar =
	Visual.Scrollbar =
		function(
			pos,      // position
			aperture, // the size of the bar
			max,      // maximum position
			pnw,      // pnw
			size      // size
		)
{
	this.visible =
		false;

	this._$aperture =
		aperture;

	this._$pnw =
		pnw;

	this._$max =
		max;

	this._$size =
		size;

	this.visible =
		max > aperture;

	if( max - aperture >= 0 )
	{
		pos =
			Jools.limit(
				0,
				pos,
				max - aperture
			);
	}
	else
	{
		pos =
			0;
	}

	if( pos < 0 )
	{
		throw new Error(
			'Scrollbar pos < 0'
		);
	}

	this._$pos =
		pos;
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
			this._$pnw,

		size =
			this._$size,

		pos =
			this._$pos,

		max =
			this._$max,

		ap =
			Math.round( this._$aperture * size / max ),

		map =
			Math.max( ap, ths.minSize ),

		sy =
			Math.round( pos * ( ( size - map + ap ) / max ) ),

		s05 =
			Jools.half( ths.strength );

	return (
		new Euclid.RoundRect(
			view.point(
				pnw.x,
				pnw.y + sy
			).add(
				-s05,
				0
			),
			view.point(
				pnw.x,
				pnw.y + sy + map
			).add(
				s05,
				0
			),
			ths.ellipseA,
			ths.ellipseB
		)
	);
};


/*
| Returns the scrollbars position.
*/
Scrollbar.prototype.getPos =
	function( )
{
	if( !this.visible )
	{
		return 0;
	}

	return this._$pos;
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
			this._$pnw,

		dex =
			view.dex( p ),

		dey =
			view.dey( p );

	return (
		dex >= pnw.x &&
		dey >= pnw.y &&
		dex <= pnw.x + theme.scrollbar.strength &&
		dey <= pnw.y + this._$size
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
	return d * this._$max / this._$size;
};


} )( );
