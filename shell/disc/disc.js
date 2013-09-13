/*
| A disc panel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Disc;

Disc =
	Disc || { };


/*
| Imports
*/
var
	config,
	Curve,
	Dash,
	Design,
	Euclid,
	fontPool,
	Jools,
	Proc,
	shell,
	shellverse,
	theme,
	Tree,
	Widgets;


/*
| Capsule
*/
( function( ) {
'use strict';


if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor
*/
Disc.Disc =
	function(
		// ... free strings ...
	)
{
	var
		inherit =
			Jools.parseFreeStrings.call(
				this,
				{
					'name' :
					{
						type :
							'param',

						required :
							true
					},

					'inherit' :
					{
						type :
							'return'
					},

					'screensize' :
					{
						type :
							'param',

						required :
							true
					}
				},
				arguments
			);

	var
		style =
		this.style =
			theme.disc[ this.name ],

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
			shellverse.grow(
				'Point',
				'x',
					0,
				'y',
					Jools.half( this.screensize.y - height )
			),
			width,
			height
		);

	this.iframe =
		Euclid.Rect.create(
			'pnw/size',
			Euclid.Point.zero,
			width,
			height
		);

	this._tree =
		inherit ?
			inherit._tree :
			shellverse.grow( this.layout );

	this.silhoutte =
		new Euclid.Ellipse(
			shellverse.grow(
				'Point',
				'x',
					width - 1 - ew,
				'y',
					0 - Jools.half( eh - height )
			),
			shellverse.grow(
				'Point',
				'x',
					width - 1,
				'y',
					height + Jools.half( eh - height )
			),
			'gradientPC',
				shellverse.grow(
					'Point',
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

	// the buttons
	this.buttons =
		{ };

	var
		icons =
		this._icons =
			inherit ?
				inherit._icons :
				new Disc.Icons( );

	var
		twig =
			this._tree.twig,

		ranks =
			this._tree.ranks;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		var
			wname =
				ranks[ r ],

			tree =
				twig[ wname ];

		switch( tree.twig.type )
		{
			case 'ButtonWidget' :

				this.buttons[ wname ] =
					Widgets.Button.create(
						'parent',
							this,
						'inherit',
							inherit && inherit.buttons[ wname ],
						'name',
							wname,
						'tree',
							tree,
						'icons',
							icons
					);

					break;

			default :

				throw new Error(
					'Cannot create widget of type: ' +
						tree.twig.type
				);
		}
	}

	this.$hover =
		inherit && inherit.$hover;
};


} )( );
