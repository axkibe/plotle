/*
| A color.
|
| Optinally including alpha channel.
*/


var
	euclid_color,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'euclid_color',
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_color.prototype;


/*
| Shortcut creator.
*/
euclid_color.rgb =
	function(
		red,
		green,
		blue
	)
{
	return(
		euclid_color.create(
			'red', red,
			'green', green,
			'blue', blue
		)
	);
};


/*
| Shortcut creator.
*/
euclid_color.rgba =
	function(
		red,
		green,
		blue,
		alpha
	)
{
	return(
		euclid_color.create(
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
euclid_color.black =
	euclid_color.create(
		'red', 0,
		'green', 0,
		'blue', 0
	);


/*
| Red.
*/
euclid_color.red =
	euclid_color.create(
		'red', 255,
		'green', 0,
		'blue', 0
	);

/*
| White.
*/
euclid_color.white =
	euclid_color.create(
		'red', 255,
		'green', 255,
		'blue', 255
	);



} )( );
