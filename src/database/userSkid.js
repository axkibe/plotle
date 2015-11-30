/*
| A user on a skid for database storage.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'database_userSkid',
		attributes :
		{
			_id :
			{
				comment : 'the username',
				json : true,
				type : 'string',
			},
			passhash :
			{
				comment : 'password hash',
				json : true,
				type : 'string'
			},
			mail :
			{
				comment : 'the users email',
				json : true,
				type : 'string',
				defaultValue : '""'
			},
			news :
			{
				comment : 'if the user checked okay with news emails',
				json : true,
				type : [ 'boolean', 'string' ],
			},
			clearPass :
			{
				comment : 'clear password for autogenerated users',
				json : true,
				type : [ 'undefined', 'string' ]
			}
		}
	};
}


/*
| Capsule
*/
( function( ) {
"use strict";


var
	database_userSkid,
	jion,
	user_info;

jion = require( 'jion' );

database_userSkid = jion.this( module );

user_info = require( '../user/info' );


/*
| Creates a database_userSkid from a user_info.
*/
database_userSkid.createFromUser =
	function(
		user
	)
{
	var
		dus;

	dus =
		database_userSkid.create(
			'_id', user.name,
			'passhash', user.passhash,
			'mail', user.mail,
			'news', user.news
		);

	jion.aheadValue( dus, 'asUser', user );

	return dus;
};


jion.lazyValue(
	database_userSkid.prototype,
	'asUser',
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
}
);


}( ) );
