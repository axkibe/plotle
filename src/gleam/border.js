/*
| A border.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_border',
		attributes :
		{
			distance :
			{
				comment : 'distance from silhoutte',
				type : 'number',
				defaultValue : '0'
			},
			width :
			{
				comment : 'border width',
				type : 'number',
				defaultValue : '1'
			},
			color :
			{
				comment : 'color',
				type : 'gleam_color',
				defaultValue : 'gleam_color.black'
			}
		}
	};
}


var
	gleam_color,
	gleam_border;


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

prototype = gleam_border.prototype;


/*::::::::::::::::
| default values
::::::::::::::::*/


/*
| A simple black border
*/
gleam_border.simpleBlack =
	gleam_border.create(
		'color', gleam_color.black
	);


} )( );
