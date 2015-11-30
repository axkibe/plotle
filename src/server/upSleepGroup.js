/*
| A group of update sleeps.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'server_upSleepGroup',
		group : [ 'server_upSleep' ]
	};
}


require( 'jion' ).this( module );

