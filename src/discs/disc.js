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
	throw new Error(
		CHECK && 'initializing abstract'
	);
};


/*
| Common initializer.
*/
Disc._init =
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
		Euclid.Rect.Create(
			'pnw',
				Euclid.Point.Create(
					'x',
						0,
					'y',
						ny
				),
			'pse',
				Euclid.Point.Create(
					'x',
						width,
					'y',
						ny + height
				)
		);

	this.silhoutte =
		Euclid.Ellipse.Create(
			'pnw',
				Euclid.Point.Create(
					'x',
						width - 1 - ew,
					'y',
						0 - Jools.half( eh - height )
				),
			'pse',
				Euclid.Point.Create(
					'x',
						width - 1,
					'y',
						height + Jools.half( eh - height )
				),
			'gradientPC',
				Euclid.Point.Create(
					'x',
						-600,
					'y',
						Jools.half( height )
				),
			'gradientR1',
				650
		);

	// TODO this is ouch.
	this._icons =
		(
			inherit
			&&
			inherit._icons
		)
		||
		new Discs.Icons( );
};


} )( );
