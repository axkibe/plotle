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


/*
| Creates a user jion from the local storage.
*/
user_user.createFromLocalStorage =
	function( )
{
	var
		name;

	name = window.localStorage.getItem( 'username' );

	if( name )
	{
		return(
			user_user.create(
				'name', name,
				'passhash', window.localStorage.getItem( 'passhash' )
			)
		);
	}
	else
	{
		return null;
	}
};


/*
| Clears the user jion from local storage.
*/
user_user.clearLocalStorage =
	function( )
{
	window.localStorage.setItem( 'username', null );

	window.localStorage.setItem( 'passhash', null );
};


/*
| Saves this user jion to local storage.
*/
user_user.prototype.saveToLocalStorage =
	function( )
{
	window.localStorage.setItem( 'username', this.name );

	window.localStorage.setItem( 'passhash', this.passhash );
};


}( ) );
