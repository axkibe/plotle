/*
| Holds an manages all users.
|
| FUTURE move database interaction into here.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		_cache :
		{
			// table of all cached user infos
			type : '../user/infoGroup',
			defaultValue : 'require( "../user/infoGroup" ).create( )'
		}
	};
}


const change_listAppend = require( '../change/listAppend' );

const dynamic_refSpaceList = require( '../dynamic/refSpaceList' );

const user_info = require( '../user/info' );

const database_userSkid = require( '../database/userSkid' );

const ref_space = require( '../ref/space' );

const ref_spaceList = require( '../ref/spaceList' );

const resume = require( 'suspend' ).resume;


/*
| Adds the reference of a space being owned by an user.
|
| The user must be loaded in cache for this to work.
*/
def.proto.addUserSpaceRef =
	function(
		spaceRef
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	const username = spaceRef.username;

	let userInfo = this._cache.get( username );

/**/if( CHECK )
/**/{
/**/	if( !userInfo ) throw new Error( );
/**/}

	// dynamic space list
	let dsl = userInfo.spaceList;

	// current space list
	const csl = dsl.current;

	for( let a = 0, aZ = csl.length; a < aZ; a++ )
	{
		if( csl.get( a ).equals( spaceRef ) ) throw new Error( );
	}

	dsl =
		dsl.alter(
			change_listAppend.create( 'val', spaceRef )
		);

	userInfo = userInfo.create( 'spaceList', dsl );

	root.create(
		'userNexus',
			this.create(
				'_cache', this._cache.create( 'group:set', username, userInfo )
			)
	);
};


/*
| Creates a new visitor.
*/
def.proto.createVisitor =
	function(
		userCreds
	)
{
	if( userCreds.name !== 'visitor' ) return;

	let nextVisitor = root.nextVisitor;

	let name;

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
def.proto.getUserSpaceList =
	function*(
		userInfo
	)
{
/**/if( CHECK )
/**/{
/**/	if( userInfo.timtype !== user_info ) throw new Error( );
/**/}

	const spaceList = userInfo.spaceList;

	if( spaceList ) return spaceList;

	const arr = [ ];

	const cursor =
		yield root.repository.spaces.find(
			{ },
			{ sort: '_id' },
			resume( )
		);

	for(
		let o = yield cursor.nextObject( resume( ) );
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

	const userSpaceList =
		dynamic_refSpaceList.create(
			'current', ref_spaceList.create( 'list:init', arr )
		);

	root.create(
		'userNexus',
			root.userNexus.create(
				'_cache',
					root.userNexus._cache.set(
						userInfo.name,
						userInfo.create(
							'spaceList', userSpaceList
						)
					)
			)
	);

	return userSpaceList;
};


/*
| Registers a user.
*/
def.proto.register =
	function*(
		userInfo
	)
{
/**/if( CHECK )
/**/{
/**/	if( userInfo.timtype !== user_info ) throw new Error( );
/**/}

	if( userInfo.spaceList )
	{
		throw new Error( 'registered user had "spaceList" set' );
	}

	// user already registered and in cache
	if( this._cache.get( userInfo.name ) ) return false;

	const val =
		yield root.repository.users.findOne(
			{ _id : userInfo.name },
			resume( )
		);

	// user already registered
	if( val ) return false;

	userInfo =
		userInfo.create(
			'spaceList', dynamic_refSpaceList.create( 'current', ref_spaceList.create( ) )
		);

	root.create(
		'userNexus',
		this.create( '_cache', this._cache.set( userInfo.name, userInfo ) )
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
def.proto.getInCache =
	function(
		username
	)
{
	return this._cache.get( username );
};


/*
| Tests if a user is already in the cache.
|
| If so returns the matching user info.
*/
def.proto.testInCache =
	function(
		userCreds
	)
{
	const userInfo = this._cache.get( userCreds.name );

	if( !userInfo || userInfo.passhash !== userCreds.passhash ) return false;

	return userInfo;
};


/*
| Tests if the user creds are ok.
|
| If so loads and returns the matching user info.
*/
def.proto.testUserCreds =
	function*(
		userCreds
	)
{
	let userInfo = this._cache.get( userCreds.name );

	// if in cache answer directly
	if( userInfo )
	{
		if( userInfo.passhash !== userCreds.passhash ) return false;

		return userInfo;
	}

	// else the user is to be loaded from the database
	const val =
		yield root.repository.users.findOne(
			{ _id : userCreds.name },
			resume( )
		);

	if( !val ) return false;

	userInfo = database_userSkid.createFromJSON( val ).asUser;

	root.create(
		'userNexus', this.create( '_cache', this._cache.set( userInfo.name, userInfo ) )
	);

	if( userInfo.passhash !== userCreds.passhash ) return false;

	return userInfo;
};


} );
