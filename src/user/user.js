/*
| A user.
*/


var
	jools,
	user_user;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'user_user',
		attributes :
			{
				name :
					{
						comment :
							'the username',
						type :
							'string',
					},
				passhash :
					{
						comment :
							'password hash',
						type :
							'string'
					}
			}
	};
}

if( SERVER )
{
	user_user = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}


/*
| Returns true if this user is a visitor
*/
jools.lazyValue(
	user_user.prototype,
	'isVisitor',
	function( )
	{
		return this.name.substr( 0, 7 ) === 'visitor';
	}
);


}( ) );
