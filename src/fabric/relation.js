/*
| Relates two items (including other relations).
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'fabric_relation',
		attributes :
		{
			doc :
			{
				comment : 'the labels document',
				type : 'fabric_doc',
				json : true
			},
			fontsize :
			{
				comment : 'the fontsize of the label',
				type : 'number',
				json : true
			},
			item1key :
			{
				comment : 'item the relation goes from',
				type : 'string',
				json : true
			},
			item2key :
			{
				comment : 'item the relation goes to',
				type : 'string',
				json : true
			},
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			pnw :
			{
				comment : 'point in the north-west',
				type : 'euclid_point',
				json : true
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
}


} )( );

