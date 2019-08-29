/*
| User credentials.
*/
'use strict';


tim.define( module, ( def, user_creds ) => {


if( TIM )
{
	def.attributes =
	{
		// the username
		name : { type : 'string', json : true },

		// password hash
		passhash : { type : 'string', json : true },
	};

	def.json = 'user_creds';
}

const session_uid = tim.require( '../session/uid' );

/*
| Creates a user tim from the local storage.
*/
def.static.createFromLocalStorage =
	function( )
{
	const name = window.localStorage.getItem( 'username' );

	if( name )
	{
		return(
			user_creds.create(
				'name', name,
				'passhash', window.localStorage.getItem( 'passhash' )
			)
		);
	}
};


/*
| Clears the user information from local storage.
*/
def.static.clearLocalStorage =
	function( )
{
	window.localStorage.removeItem( 'username' );

	window.localStorage.removeItem( 'passhash' );
};


/*
| Creates a visitor user.
*/
def.static.createVisitor =
	function( )
{
	return(
		user_creds.create(
			'name', 'visitor',
			'passhash', session_uid.newUid( )
		)
	);
};


/*
| Returns true if this user is a visitor
*/
def.lazy.isVisitor =
	function( )
{
	return this.name.substr( 0, 7 ) === 'visitor';
};


/*
| Saves this user tim to local storage.
*/
def.proto.saveToLocalStorage =
	function( )
{
	window.localStorage.setItem( 'username', this.name );

	window.localStorage.setItem( 'passhash', this.passhash );
};


} );
