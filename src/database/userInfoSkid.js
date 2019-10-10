/*
| A user on a skid for database storage.
*/
'use strict';


tim.define( module, ( def, database_userInfoSkid ) => {


if( TIM )
{
	def.attributes =
	{
		// the users email
		mail : { type : 'string', defaultValue : '""', json : true },

		// the username
		name : { type : 'string', json : true },

		// true if the user checked okay with news emails
		news : { type : [ 'boolean', 'string' ], json : true },

		// password hash
		passhash : { type : 'string', json : true },

		// database table, must be "users"
		table : { type : 'string', defaultValue : '"users"', json : true },

		// database id
		_id : { type : 'string', json : true },
	};

	def.json = 'userInfoSkid';
}

const user_info = tim.require( '../user/info' );


/*
| Creates a database_userInfoSkid from a user_info.
*/
def.static.createFromUserInfo =
	function(
		user
	)
{
	const skid =
		database_userInfoSkid.create(
			'_id', 'users:' + user.name,
			'mail', user.mail,
			'name', user.name,
			'news', user.news,
			'passhash', user.passhash
		);

	tim.aheadValue( skid, 'asUser', user );

	return skid;
};


def.lazy.asUser =
	function( )
{
	return(
		user_info.create(
			'mail', this.mail,
			'name', this.name,
			'news', this.news,
			'passhash', this.passhash
		)
	);
};


} );
