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
	Euclid,
	Jools,
	shellverse,
	theme,
	Path,
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
		name =
			null,

		inherit =
			null,

		layout =
			null,

		screensize =
			null;
	
	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		switch( arguments[ a ] )
		{
			case 'name' :

				name =
					arguments[ ++a ];

				break;

			case 'inherit' :

				inherit =
					arguments[ ++a ];

				break;

			case 'screensize' :

				screensize =
					arguments[ ++a ];

				break;

			case 'layout' :

				layout =
					arguments[ ++a ];

				break;

			default :

				throw new Error(
					'invalid arguments: ' + arguments[ a + 1]
				);
		}
	}

	if( CHECK )
	{
		if( name === null )
		{
			throw new Error(
				'name missing'
			);
		}
		
		if( screensize === null )
		{
			throw new Error(
				'screensize missing'
			);
		}

		if( layout === null )
		{
			throw new Error(
				'layout missing'
			);
		}
	}

	// TODO remove
	this.name =
		name;

	this.screensize =
		screensize;

	// TODO remove
	this.layout =
		layout;

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

	this.path =
		new Path(
			[
				name
			]
		);

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
				twig[ wname ],

			path =
				new Path(
					[
						this.name,
						wname
					]
				);

		switch( tree.twig.type )
		{
			case 'ButtonWidget' :

				this.buttons[ wname ] =
					Widgets.Button.create(
						'section',
							'disc',
						'path',
							path,
						'superFrame',
							this.frame.zeropnw,
						'inherit',
							inherit && inherit.buttons[ wname ],
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
