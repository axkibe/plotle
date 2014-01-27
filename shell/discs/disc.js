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


/*
| Constructor
|
| TODO remove
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
			style.ellipse.height,

		ny =
			Jools.half( screensize.y - height );

	this.frame =
		Euclid.Rect.create(
			'pnw',
				Euclid.Point.create(
					'x',
						0,
					'y',
						ny
				),
			'pse',
				Euclid.Point.create(
					'x',
						width,
					'y',
						ny + height
				)
		);

	this._tree =
		inherit ?
			inherit._tree :
			shellverse.grow( Design[ this.reflect ] );

	this.silhoutte =
		Euclid.Ellipse.create(
			'pnw',
				Euclid.Point.create(
					'x',
						width - 1 - ew,
					'y',
						0 - Jools.half( eh - height )
				),
			'pse',
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
			'gradientR1',
				650
		);

	this.path =
		Path.empty.append( 'discs' ).append( this.reflect );

	this._icons =
		inherit ?
			inherit._icons :
			new Discs.Icons( );

};



/*
| Common initializer.
*/
Discs.Disc._init =
	function(
		inherit
	)
{
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
			style.ellipse.height,

		ny =
			Jools.half( this.view.height - height );

	this.frame =
		Euclid.Rect.create(
			'pnw',
				Euclid.Point.create(
					'x',
						0,
					'y',
						ny
				),
			'pse',
				Euclid.Point.create(
					'x',
						width,
					'y',
						ny + height
				)
		);

	this._tree =
		inherit
		?
		inherit._tree
		:
		shellverse.grow( Design[ this.reflect ] );

	this.silhoutte =
		Euclid.Ellipse.create(
			'pnw',
				Euclid.Point.create(
					'x',
						width - 1 - ew,
					'y',
						0 - Jools.half( eh - height )
				),
			'pse',
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
			'gradientR1',
				650
		);

	this._icons =
		inherit
		?
		inherit._icons
		:
		new Discs.Icons( );
};


} )( );
