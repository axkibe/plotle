/*
| Holds an manages all spaces.
*/


var
	server_spaceNexus;

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
	return{
		id : 'server_spaceNexus',
		group : [ 'server_spaceBox' ]
	};
}


var
	config;

server_spaceNexus = require( 'jion' ).this( module );

config = require( '../../config' );


/*
| Tests if the user has access to a space.
*/
server_spaceNexus.testAccess =
	function(
		user,
		spaceRef
	)
{
	if( spaceRef.username == 'ideoloom' )
	{
		switch( spaceRef.tag )
		{
			case 'sandbox' : return 'rw';

			case 'home' : return user.name === config.admin ? 'rw' : 'ro';

			default : return 'no';
		}
	}

	if( user.isVisitor ) return 'no';

	if( user.name === spaceRef.username ) return 'rw';

	return 'no';
};


} )( );
