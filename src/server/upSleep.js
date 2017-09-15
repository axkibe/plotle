/*
| A client's update set to sleep.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'server_upSleep',
		attributes :
		{
			moments :
			{
				comment : 'the list of moment of a dynamics the client is sleeping for',
				type : 'ref_momentList',
			},
			result :
			{
				comment : 'the node result handler of the clients request',
				type : 'protean'
			},
			timer :
			{
				comment : 'the timer associated with this sleep',
				type : 'protean',
			}
		}
	};
}


require( 'jion' ).this( module );
