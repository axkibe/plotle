/*
| A disc panel.
*/


/*
| Export
*/
var
	discs,
	discs_disc;

discs = discs || { };


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
discs_disc =
discs.disc = // FUTURE remove
	function( )
{
	// abstract should not be constructed.
	// FIXME just make it an object?
	throw new Error( );
};


/*
| Common initializer.
*/
discs_disc._init =
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
		theme.disc[ this.reflectName ],

	width = style.width,

	height = style.height,

	ew = style.ellipse.width,

	eh = style.ellipse.height,

	ny = jools.half( this.view.height - height );

	this.frame =
		euclid.rect.create(
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
