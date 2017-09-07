/*
| A color.
|
| Optionally including an alpha value.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_color',
		attributes :
		{
			alpha :
			{
				comment : 'alpha value',
				type : [ 'undefined', 'number' ]
			},
			red :
			{
				comment : 'red value',
				type : 'integer'
			},
			green :
			{
				comment : 'green value',
				type : 'integer'
			},
			blue :
			{
				comment : 'blue value',
				type : 'integer'
			}
		}
	};
}


var
	gleam_color,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = gleam_color.prototype;


/*
| Shortcut creator.
*/
gleam_color.rgb =
	function(
		red,
		green,
		blue
	)
{
	return(
		gleam_color.create(
			'red', red,
			'green', green,
			'blue', blue
		)
	);
};


/*
| Shortcut creator.
*/
gleam_color.rgba =
	function(
		red,
		green,
		blue,
		alpha
	)
{
	return(
		gleam_color.create(
			'red', red,
			'green', green,
			'blue', blue,
			'alpha', alpha
		)
	);
};


/*
| Color text understood by browser.
*/
jion.lazyValue(
	prototype,
	'css',
	function( )
	{
		if( this.alpha )
		{
			return(
				'rgba( '
				+ this.red + ', '
				+ this.green + ', '
				+ this.blue + ', '
				+ this.alpha
				+ ' )'
			);
		}
		else
		{
			return(
				'rgb( '
				+ this.red + ', '
				+ this.green + ', '
				+ this.blue
				+ ' )'
			);
		}
	}
);


/*-----------------
| precreated colors
*-----------------*/

/*
| Black.
*/
gleam_color.black =
	gleam_color.create(
		'red', 0,
		'green', 0,
		'blue', 0
	);


/*
| Red.
*/
gleam_color.red =
	gleam_color.create(
		'red', 255,
		'green', 0,
		'blue', 0
	);

/*
| White.
*/
gleam_color.white =
	gleam_color.create(
		'red', 255,
		'green', 255,
		'blue', 255
	);



} )( );
