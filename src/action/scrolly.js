/*
| The user is scrolling a note.
*/


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
		id : 'action_scrolly',
		attributes :
		{
			itemPath :
			{
				comment : 'path to the item being scrolled',
				type : 'jion$path'
			},
			start :
			{
				comment : 'mouse down point on start of scrolling',
				type : 'euclid_point'
			},
			startPos :
			{
				comment : 'position of the scrollbar on start of scrolling',
				type : 'number'
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


} )( );
