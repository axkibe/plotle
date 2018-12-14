/*
| Holds an manages all spaces.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.group = [ './spaceBox' ];
}


const config = require( '../config/intf' );


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
	if( spaceRef.username == 'linkloom' )
	{
		switch( spaceRef.tag )
		{
			case 'sandbox' : return 'rw';

			case 'home' : return user.name === config.get( 'admin' ) ? 'rw' : 'ro';

			default : return 'no';
		}
	}

	if( user.isVisitor ) return 'no';

	if( user.name === spaceRef.username ) return 'rw';

	return 'no';
};


} );
