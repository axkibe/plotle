/*
| Holds an manages all users.
|
| FUTURE move database interaction into here.
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'server_userNexus',
		attributes :
			{
				_cache :
				{
					comment :
						'table of all cached user credentials',
					type :
						'user_infoGroup',
					defaultValue :
						'user_infoGroup.create( )'
				},
			}
	};
}


var
	database_userSkid,
	fabric_spaceRef,
	user_info,
	resume,
	server_userNexus;


server_userNexus = require( '../jion/this' )( module );

user_info = require( '../user/info' );

database_userSkid = require( '../database/userSkid' );

fabric_spaceRef = require( '../fabric/spaceRef' );

resume = require( 'suspend' ).resume;


/*
| Tests if a user is in the cache.
*/
server_userNexus.prototype.testInCache =
	function(
		user
	)
{
	var
		cUser;

	cUser = this._cache.get( user.name );

	if( !cUser ) return false;

	return cUser.passhash === user.passhash;
};



/*
| Tests if the user creds are ok.
*/
server_userNexus.prototype.testUserCreds =
	function*(
		user
	)
{
	var
		cUser,
		val;

	cUser = this._cache.get( user.name );

	if( cUser )
	{
		return cUser.passhash === user.passhash;
	}

	// else load it from the database
	val =
		yield root.repository.users.findOne(
			{ _id : user.name },
			resume( )
		);

	if( val === null )
	{
		return null;
	}

	cUser =
		database_userSkid.createFromJSON( val ).asUser;

	root.create(
		'userNexus', this.create( '_cache', this._cache.set( cUser.name, cUser ) )
	);

	return cUser.passhash === user.passhash;
};


/*
| Creates a new visitor.
*/
server_userNexus.prototype.createVisitor =
	function(
		user
	)
{
	var
		nextVisitor,
		name;

/**/if( CHECK )
/**/{
/**/	if( user.name !== 'visitor' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	nextVisitor = root.nextVisitor;

	do
	{
		name = 'visitor-' + ( ++nextVisitor );
	}
	while( this._cache.get( name ) );

	root.create(
		'nextVisitor', nextVisitor,
		'userNexus',
			this.create(
				'_cache',
				this._cache.set(
					name,
					user_info.create(
						'name', name,
						'passhash', user.passhash,
						'news', false
					)
				)
			)
	);

	return user.create( 'name', name );
};


/*
| Registers a user.
*/
server_userNexus.prototype.register =
	function*(
		user
	)
{
	var
		val;

	if( this._cache.get( user.name ) )
	{
		return false;
	}

	val =
		yield root.repository.users.findOne(
			{ _id : user.name },
			resume( )
		);

	if( val !== null )
	{
		return false;
	}

	root.create(
		'userNexus',
		this.create( '_cache', this._cache.set( user.name, user ) )
	);

	yield root.repository.users.insert(
		JSON.parse( JSON.stringify(
			database_userSkid.createFromUser( user )
		) ),
		resume( )
	);

	yield* root.createSpace(
		fabric_spaceRef.create( 'username', user.name, 'tag', 'home' )
	);

	return true;
};


} )( );
