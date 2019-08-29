/*
| A user on a skid for database storage.
|
| FIXME rename userInfoSkid
*/
'use strict';


tim.define( module, ( def, database_userSkid ) => {


if( TIM )
{
	def.attributes =
	{
		// the username
		_id : { type : 'string', json : true },

		// password hash
		passhash : { type : 'string', json : true },

		// the users email
		mail : { type : 'string', defaultValue : '""', json : true },

		// true if the user checked okay with news emails
		news : { type : [ 'boolean', 'string' ], json : true },
	};

	def.json = 'database_userSkid';
}

const user_info = tim.require( '../user/info' );


/*
| Creates a database_userSkid from a user_info.
*/
def.static.createFromUser =
	function(
		user
	)
{
	const dus =
		database_userSkid.create(
			'_id', user.name,
			'passhash', user.passhash,
			'mail', user.mail,
			'news', user.news
		);

	tim.aheadValue( dus, 'asUser', user );

	return dus;
};


def.lazy.asUser =
	function( )
{
	return(
		user_info.create(
			'name', this._id,
			'passhash', this.passhash,
			'mail', this.mail,
			'news', this.news
		)
	);
};


} );
