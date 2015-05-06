/*
| An users action in the making.
|
| Creating a new note.
| Creating a new label.
| Creating a new portal.
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
		id : 'action_createGeneric',
		attributes :
		{
			itemType :
			{
				comment : 'item type to be created',
				// FUTURE make list of possibilities
				type : 'string'
			},
			transItem :
			{
				comment : 'the transient item in creation',
				type :
					require( '../typemaps/visualItems' )
					.concat( [ 'undefined' ] )
			},
			model :
			{
				comment : 'a transient item used as original model',
				type :
					require( '../typemaps/visualItems' )
					.concat( [ 'undefined' ] )
			},
			start :
			{
				comment : 'mouse down point on drag creation',
				type : [ 'undefined', 'euclid_point' ]
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
