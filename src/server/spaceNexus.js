/*
| Holds an manages all spaces.
*/
'use strict';


tim.define( module, 'server_spaceNexus', ( def, server_spaceNexus ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.group = [ 'server_spaceBox' ];
}


const config = require( '../../config' );


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Tests if the user has access to a space.
*/
def.static.testAccess =
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


} );
