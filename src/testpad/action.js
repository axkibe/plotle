/*
| The user is panning the background.
*/


/*
| Jion definition.
*/
if( JION )
{
	throw{
		id : 'testpad_action',
		attributes :
		{
			command :
			{
				comment : 'action command',
				type : 'string'
			},
			line :
			{
				comment : 'action affects at line',
				type : 'integer'
			},
			at :
			{
				comment : 'action affects offset',
				type : [ 'undefined', 'integer' ]
			},
			at2 :
			{
				comment : 'action affects offset (span end)',
				type : [ 'undefined', 'integer' ]
			},
			value :
			{
				comment : 'action carries value',
				type : [ 'undefined', 'string' ]
			}
		}
	};
}


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


} )( );
