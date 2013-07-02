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
	Pattern,
	Proc,
	shell,
	theme,
	Tree,
	Widgets;


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
| Constructor
|
| TODO change to free string arguments
*/
Disc.Disc =
	function(
		// ... free strings ...
	)
{
	var inherit =
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

	var style =
	this.style =
		theme.disc[ this.name ];

	// TODO remove this.width/height vars
	var width =
		this.width =
		style.width;

	var height =
		this.height =
		style.height;

	var ew =
		style.ellipse.width;

	var eh =
		style.ellipse.height;

	this.oframe =
		new Euclid.Rect(
			'pnw/size',
			new Euclid.Point(
				0,
				Jools.half( this.screensize.y - this.height )
			),
			width,
			height
		);

	this.iframe =
		new Euclid.Rect(
			'pnw/size',
			Euclid.Point.zero,
			width,
			height
		);

	// TODO inherit
	this._tree =
		new Tree(
			this.layout,
			Pattern
		);

	this.silhoutte =
		new Euclid.Ellipse(
			new Euclid.Point(
				width - 1 - ew,
				0 - Jools.half( eh - height )
			),
			new Euclid.Point(
				width - 1,
				height + Jools.half( eh - height )
			),
			'gradientPC',
				new Euclid.Point(
					-600,
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

	var icons =
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

		switch( tree.type )
		{
			case 'Button' :

				this.buttons[ wname ] =
					new Widgets.Button(
						'parent',
							this,
						'name',
							wname,
						'tree',
							tree,
						'inherit',
							inherit && inherit.buttons[ wname ],
						'icons',
							icons
					);

					break;

			default :

				throw new Error(
					'Cannot create widget of type: ' + tree.type
				);
		}
	}

	this.$hover =
		inherit && inherit.$hover;
};


/*
| Force clears all caches.
*/
Disc.Disc.prototype.knock =
	function( )
{
	this.$fabric =
		null;
};


} )( );
