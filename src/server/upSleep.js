/*
| A client's update set to sleep.
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'server_upSleep',
		attributes :
			{
				// TODO check if needed
				'username' :
					{
						comment :
							'username that is put the sleep',
						type :
							'string'
					},
				'seq' :
					{
						comment :
							'the sequence number the client is sleeping at',
						type :
							'integer'
					},
				'timer' :
					{
						comment :
							'the timer associated with this sleep',
						type :
							'protean',
					},
				'result' :
					{
						comment :
							'the node result handler of the clients request',
						type :
							'protean'
					},
				'spaceRef' :
					{
						comment :
							'the space the update is sleeping for',
						type :
							'fabric_spaceRef'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
