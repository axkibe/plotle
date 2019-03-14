/*
| Hashes a password.
*/
'use strict';


tim.define( module, ( def ) => {


const hash_sha1 = tim.require( '../hash/sha1' );


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
