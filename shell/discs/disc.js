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


if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


var
	_tag =
		'DISC-11692648';


/*
| Constructor
*/
var Disc =
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
			shellverse.grow(
				'Point',
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

	this.path =
		new Path(
			[
				'disc',
				this.reflect
			]
		);

	this._icons =
		inherit ?
			inherit._icons :
			new Discs.Icons( );

};


/*
| (Re)Creates a new disc.
*/
Disc.create =
	function(
		// free strings
	)
{
	var
		a =
			0,

		aZ =
			arguments.length,

		hover =
			null,

		inherit =
			null,

		mode =
			null,

		name =
			null,

		screensize =
			null;

	while( a < aZ )
	{
		var
			arg =
				arguments[ a++ ];

		switch( arg )
		{
			case 'screensize' :

				screensize =
					arguments[ a++ ];

				break;

			case 'hover' :

				hover =
					arguments[ a++ ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a++ ];

				break;

			case 'mode' :

				mode =
					arguments[ a++ ];

				break;

			case 'name' :

				name =
					arguments[ a++ ];

				break;

			default :

				throw new Error(
					'invalid argument'
				);
		}
	}

/**/if( CHECK )
/**/{
/**/	if( !Discs[ name ] )
/**/	{
/**/		throw new Error(
/**/			'invalid discname: ' + name
/**/		);
/**/	}
/**/}

	if( inherit )
	{
		if( hover === null )
		{
			hover =
				inherit.hover;
		}

		if( screensize === null )
		{
			screensize =
				inherit.screensize;
		}

		if( mode === null )
		{
			mode =
				inherit.mode;
		}

		// TODO use the discs equals mode
	}

	return new Discs[ name ](
		_tag,
		inherit,
		hover,
		mode,
		screensize
	);
};


} )( );
