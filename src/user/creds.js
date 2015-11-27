/*
| User credentials.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'user_creds',
		attributes :
		{
			name :
			{
				comment : 'the username',
				type : 'string',
				json : true
			},
			passhash :
			{
				comment : 'password hash',
				type : 'string',
				json : true
			}
		}
	};
}


var
	jion,
	session_uid,
	user_creds;


/*
| Capsule
*/
( function( ) {
"use strict";


if( NODE )
{
	user_creds = require( 'jion' ).this( module, 'source' );

	jion = require( 'jion' );
}


/*
| Returns true if this user is a visitor
*/
jion.lazyValue(
	user_creds.prototype,
	'isVisitor',
	function( )
	{
		return this.name.substr( 0, 7 ) === 'visitor';
	}
);


/*
| Creates a user jion from the local storage.
*/
user_creds.createFromLocalStorage =
	function( )
{
	var
		name;

	name = window.localStorage.getItem( 'username' );

	if( name )
	{
		return(
			user_creds.create(
				'name', name,
				'passhash', window.localStorage.getItem( 'passhash' )
			)
		);
	}
	else
	{
		return;
	}
};


/*
| Clears the user jion from local storage.
*/
user_creds.clearLocalStorage =
	function( )
{
	window.localStorage.setItem( 'username', undefined );

	window.localStorage.setItem( 'passhash', undefined );
};


/*
| Creates a visitor user.
*/
user_creds.createVisitor =
	function( )
{
	return(
		user_creds.create(
			'name', 'visitor',
			'passhash', session_uid( )
		)
	);
};


/*
| Saves this user jion to local storage.
*/
user_creds.prototype.saveToLocalStorage =
	function( )
{
	window.localStorage.setItem( 'username', this.name );

	window.localStorage.setItem( 'passhash', this.passhash );
};


}( ) );
