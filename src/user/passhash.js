/*
| Hashes a password.
*/


var
	user_passhash,
	hash_sha1;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Hashes the password.
*/
user_passhash =
	function(
		password
	)
{
	return hash_sha1( password + '-meshcraft-8833' );
};


} )( );
