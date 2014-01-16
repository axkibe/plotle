/*
| A disc panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Discs;

Discs =
	Discs || { };


/*
| Imports
*/
var
	Design,
	Euclid,
	Jools,
	shellverse,
	theme,
	Path;


/*
| Capsule
*/
( function( ) {
'use strict';


/**/if( CHECK && typeof( window ) === 'undefined' )
/**/{
/**/	throw new Error(
/**/		'this code needs a browser!'
/**/	);
/**/}


/*
| Constructor
*/
Discs.Disc =
	function(
		inherit,
		hover,
		screensize
	)
{
/**/if( CHECK )
/**/{
/**/	if( !screensize )
/**/	{
/**/		throw new Error(
/**/			'screensize missing'
/**/		);
/**/	}
/**/
/**/	if( !hover )
/**/	{
/**/		throw new Error(
/**/			'hover missing'
/**/		);
/**/	}
/**/}

	this.screensize =
		screensize;

	var
		style =
		this.style =
			theme.disc[ this.reflect ],

		width =
			style.width,

		height =
			style.height,

		ew =
			style.ellipse.width,

		eh =
			style.ellipse.height;

	this.frame =
		Euclid.Rect.create(
			'pnw/size',
			Euclid.Point.create(
				'x',
					0,
				'y',
					Jools.half( screensize.y - height )
			),
			width,
			height
		);

	this._tree =
		inherit ?
			inherit._tree :
			shellverse.grow( Design[ this.reflect ] );

	this.silhoutte =
		new Euclid.Ellipse(
			Euclid.Point.create(
				'x',
					width - 1 - ew,
				'y',
					0 - Jools.half( eh - height )
			),
			Euclid.Point.create(
				'x',
					width - 1,
				'y',
					height + Jools.half( eh - height )
			),
			'gradientPC',
				Euclid.Point.create(
					'x',
						-600,
					'y',
						Jools.half( height )
				),
			'gradientR0',
				0,
			'gradientR1',
				650
		);

	this.path =
		Path.empty.append( 'disc' ).append( this.reflect );

	this._icons =
		inherit ?
			inherit._icons :
			new Discs.Icons( );

};


} )( );
