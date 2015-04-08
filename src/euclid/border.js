/*
| A border.
*/


var
	euclid_color,
	euclid_border;


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
		id : 'euclid_border',
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
				type : 'euclid_color'
				// FIXME default to black
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

prototype = euclid_border.prototype;


/*::::::::::::::::
| default values
::::::::::::::::*/


/*
| A simple black border
*/
euclid_border.simpleBlack =
	euclid_border.create(
		'color', euclid_color.black
	);


} )( );
