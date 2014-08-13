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
	euclid,
	jools,
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

	ny = jools.half( this.view.height - height );

	this.frame =
		euclid.Rect.create(
			'pnw',
				euclid.point.create(
					'x',
						0,
					'y',
						ny
				),
			'pse',
				euclid.point.create(
					'x',
						width,
					'y',
						ny + height
				)
		);

	this.silhoutte =
		euclid.ellipse.create(
			'pnw',
				euclid.point.create(
					'x',
						width - 1 - ew,
					'y',
						0 - jools.half( eh - height )
				),
			'pse',
				euclid.point.create(
					'x',
						width - 1,
					'y',
						height + jools.half( eh - height )
				),
			'gradientPC',
				euclid.point.create(
					'x',
						-600,
					'y',
						jools.half( height )
				),
			'gradientR1',
				650
		);
};


} )( );
