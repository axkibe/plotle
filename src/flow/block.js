/*
| A flow block consists of flow lines.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'flow_block',
		attributes :
		{
			height :
			{
				comment : 'height of the flow',
				type : 'number'
			},
			width :
			{
				comment : 'width of the flow',
				type : 'number'
			}
		},
		list : [ 'flow_line' ]
	};
}


/*
| Capsule
*/
(function() {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
