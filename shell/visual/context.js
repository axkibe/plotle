/*
| Context. Styling of text.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;

Visual =
	Visual || { };


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code requires a browser!'
	);
}


/*
| Constructor
*/
var Context =
Visual.Context =
	function(
		fontsize,
		paraSep
	)
{
	if( CHECK )
	{
		if( typeof( fontsize ) !== 'number' )
		{
			throw new Error(
				'fontsize missing'
			);
		}

		if( typeof( paraSep ) !== 'number' )
		{
			throw new Error(
				'paraSep missing'
			);
		}
	}

	this.fontsize =
		fontsize;

	this.paraSep =
		paraSep;
};


Context.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		fontsize =
			null,

		paraSep =
			null;


	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'nherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'fontsize' :

				fontsize =
					arguments[ a + 1 ];

				break;

			case 'paraSep' :

				paraSep =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);
		}
	}

	if( inherit )
	{
		if( fontsize === null )
		{
			fontsize =
				inherit.fontsize;
		}

		if( paraSep === null )
		{
			paraSep =
				inherit.paraSep;
		}

		if(
			inherit.fontsize === fontsize &&
			inherit.paraSep === paraSep
		)
		{
			return inherit;
		}
	}

	return (
		new Context(
			fontsize,
			paraSep
		)
	);
};


} )( );
