/*
| Hashes a password.
*/
'use strict';


tim.define( module, 'user_passhash', ( def, user_passhash ) => {


const hash_sha1 = require( '../hash/sha1' );


/*
| Hashes the password.
*/
def.static.calc =
	function(
		password
	)
{
	return hash_sha1.calc( password + '-meshcraft-8833' );
};


} );

