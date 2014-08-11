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
	Euclid,
	Jools,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor
*/
var
Disc =
Discs.Disc =
	function( )
{
	// abstract should not be constructed.
	// FIXME just make it an object?
	throw new Error( );
};


/*
| Common initializer.
*/
Disc._init =
	function(
		// inherit
	)
{
	var
		style,
		width,
		height,
		ew,
		eh,
		ny;

	style =
	this.style =
		theme.disc[ this.reflexName ],

	width = style.width,

	height = style.height,

	ew = style.ellipse.width,

	eh = style.ellipse.height,

	ny = Jools.half( this.view.height - height );

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
};


} )( );
