/*
| Holds an manages all users.
|
| FUTURE move database interaction into here.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'server_userNexus',
		attributes :
		{
			cache :
			{
				comment : 'table of all cached user infos',
				type : 'user_infoGroup',
				defaultValue : 'user_infoGroup.create( )'
			}
		}
	};
}


/*
| Capsule.
*/
( function( ) {
'use strict';


var
	change_listAppend,
	database_userSkid,
	dynamic_refSpacesList,
	prototype,
	ref_space,
	ref_spaceList,
	resume,
	server_userNexus,
	user_info;


server_userNexus = require( 'jion' ).this( module );

prototype = server_userNexus.prototype;

change_listAppend = require( '../change/listAppend' );

dynamic_refSpacesList = require( '../dynamic/refSpacesList' );

user_info = require( '../user/info' );

database_userSkid = require( '../database/userSkid' );

ref_space = require( '../ref/space' );

ref_spaceList = require( '../ref/spaceList' );

resume = require( 'suspend' ).resume;


/*
| Adds the reference of a space being owned by an user.
|
| The user must be loaded in cache for this to work.
*/
prototype.addUserSpaceRef =
	function(
		spaceRef
	)
{
	var
		a,
		aZ,
		cSpaces,  // current space list
		dSpaces,  // dynamic space list
		username,
		userInfo;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	username = spaceRef.username;

	userInfo = this.cache.get( username );

/**/if( CHECK )
/**/{
/**/	if( !userInfo ) throw new Error( );
/**/}

	dSpaces = userInfo.spaces;

	cSpaces = dSpaces.current;

	for( a = 0, aZ = cSpaces.length; a < aZ; a++ )
	{
		if( cSpaces.get( a ).equals( spaceRef ) ) throw new Error( );
	}

	dSpaces =
		dSpaces.alter(
			change_listAppend.create( 'val', spaceRef )
		);

	userInfo = userInfo.create( 'spaces', dSpaces );

	root.create(
		'userNexus',
			this.create(
				'cache', this.cache.create( 'group:set', username, userInfo )
			)
	);
};


/*
| Creates a new visitor.
*/
prototype.createVisitor =
	function(
		userCreds
	)
{
	var
		nextVisitor,
		name;

/**/if( CHECK )
/**/{
/**/	if( userCreds.name !== 'visitor' ) throw new Error( );
/**/}

	nextVisitor = root.nextVisitor;

	do
	{
		name = 'visitor-' + ( ++nextVisitor );
	}
	while( this.cache.get( name ) );

	root.create(
		'nextVisitor', nextVisitor,
		'userNexus',
			this.create(
				'cache',
				this.cache.set(
					name,
					user_info.create(
						'name', name,
						'passhash', userCreds.passhash,
						'news', false
					)
				)
			)
	);

	return userCreds.create( 'name', name );
};


/*
| Gets the list of spaces of a user.
*/
prototype.getUserSpaces =
	function*(
		userInfo
	)
{
	var
		arr,
		cursor,
		o,
		spaces,
		userSpaces;

/**/if( CHECK )
/**/{
/**/	if( userInfo.reflect !== 'user_info' ) throw new Error( );
/**/}

	spaces = userInfo.spaces;

	if( spaces ) return spaces;

	arr = [ ];

	cursor =
		yield root.repository.spaces.find(
			{ },
			{ sort: '_id' },
			resume( )
		);

	for(
		o = yield cursor.nextObject( resume( ) );
		o;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		if( o.username !== userInfo.name ) continue;

		arr.push( 
			ref_space.create(
				'username', o.username,
				'tag', o.tag
			)
		);
	}

	userSpaces =
		dynamic_refSpacesList.create(
			'current', ref_spaceList.create( 'list:init', arr )
		);

	root.create(
		'userNexus',
			root.userNexus.create(
				'cache',
					root.userNexus.cache.set(
						userInfo.name,
						userInfo.create(
							'spaces', userSpaces
						)
					)
			)
	);

	return userSpaces;
};


/*
| Registers a user.
*/
prototype.register =
	function*(
		userInfo
	)
{
	var
		val;

/**/if( CHECK )
/**/{
/**/	if( userInfo.reflect !== 'user_info' ) throw new Error( );
/**/}

	if( userInfo.spaces )
	{
		throw new Error( 'registered user had "spaces" set' );
	}

	// user already registered and in cache
	if( this.cache.get( userInfo.name ) ) return false;

	val =
		yield root.repository.users.findOne(
			{ _id : userInfo.name },
			resume( )
		);

	// user already registered
	if( val ) return false;

	userInfo = userInfo.create( 'spaces', dynamic_refSpacesList.create( ) );
	
	root.create(
		'userNexus',
		this.create( 'cache', this.cache.set( userInfo.name, userInfo ) )
	);

	yield root.repository.users.insert(
		JSON.parse( JSON.stringify(
			database_userSkid.createFromUser( userInfo )
		) ),
		resume( )
	);

	yield* root.createSpace(
		ref_space.create( 'username', userInfo.name, 'tag', 'home' )
	);

	return true;
};


/*
| Tests if a user is already the cache.
|
| If so returns the matching user info.
*/
prototype.testInCache =
	function(
		userCreds
	)
{
	var
		userInfo;

	userInfo = this.cache.get( userCreds.name );

	if( !userInfo || userInfo.passhash !== userCreds.passhash ) return false;

	return userInfo;
};


/*
| Tests if the user creds are ok.
|
| If so loads and returns the matching user info.
*/
prototype.testUserCreds =
	function*(
		userCreds
	)
{
	var
		userInfo,
		val;

	userInfo = this.cache.get( userCreds.name );

	// if in cache answer directly
	if( userInfo )
	{
		if( userInfo.passhash !== userCreds.passhash ) return false;

		return userInfo;
	}

	// else the user is to be loaded from the database
	val =
		yield root.repository.users.findOne(
			{ _id : userCreds.name },
			resume( )
		);

	if( !val ) return false;

	userInfo = database_userSkid.createFromJSON( val ).asUser;

	root.create(
		'userNexus',
			this.create( 'cache', this.cache.set( userInfo.name, userInfo ) )
	);

	if( userInfo.passhash !== userCreds.passhash ) return false;

	return userInfo;
};



} )( );
