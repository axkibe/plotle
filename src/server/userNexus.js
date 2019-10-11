/*
| Holds and manages all user infos.
*/
'use strict';


tim.define( module, ( def, server_userNexus ) => {


if( TIM )
{
	def.attributes =
	{
		// table of all cached user infos
		_cache : { type : '../user/infoGroup' }
	};
}


const change_listAppend = tim.require( '../change/listAppend' );
const dynamic_refSpaceList = tim.require( '../dynamic/refSpaceList' );
const user_info = tim.require( '../user/info' );
const database_userInfoSkid = tim.require( '../database/userInfoSkid' );
const ref_space = tim.require( '../ref/space' );
const ref_spaceList = tim.require( '../ref/spaceList' );
const user_infoGroup = tim.require( '../user/infoGroup' );


/*
| Adds the reference of a space being owned by an user.
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

	for( let r of csl )
	{
		if( r.equals( spaceRef ) ) throw new Error( );
	}

	dsl = dsl.alter( change_listAppend.create( 'val', spaceRef ) );

	userInfo = userInfo.create( 'spaceList', dsl );

	root.create(
		'userNexus',
			this.create(
				'_cache', this._cache.create( 'group:set', username, userInfo )
			)
	);
};


/*
| Creates the user nexus from database.
*/
def.static.createFromRepository =
	async function(
		repository
	)
{
	const rows = await repository.getUserNames( );
	let cache = user_infoGroup.create( );

	for( let r of rows )
	{
		const e = await repository.getUser( r.key );
		const ui = database_userInfoSkid.createFromJSON( e );
		cache = cache.set( ui.name, ui.asUser );
	}

	return server_userNexus.create( '_cache', cache );
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

	do name = 'visitor-' + ( ++nextVisitor );
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
	async function(
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
	const spaceIDs = await root.repository.getSpaceIDs( );

	for( let row of spaceIDs )
	{
		const id = row.id;
		const p = id.split( ':' );
		if( p[ 0 ] !== 'spaces' ) throw new Error( );
		if( p[ 1 ] !== userInfo.name ) continue;

		arr.push( ref_space.create( 'username', p[ 1 ], 'tag', p[ 2 ] ) );
	}

	const userSpaceList =
		dynamic_refSpaceList.create( 'current', ref_spaceList.create( 'list:init', arr ) );

	root.create(
		'userNexus',
			root.userNexus.create(
				'_cache',
					root.userNexus._cache.set(
						userInfo.name,
						userInfo.create( 'spaceList', userSpaceList )
					)
			)
	);

	return userSpaceList;
};


/*
| Registers a user.
*/
def.proto.register =
	async function(
		userInfo
	)
{
/**/if( CHECK )
/**/{
/**/	if( userInfo.timtype !== user_info ) throw new Error( );
/**/}

	if( userInfo.spaceList ) throw new Error( 'registered user had "spaceList" set' );

	// user already registered
	if( this._cache.get( userInfo.name ) ) return false;

	userInfo =
		userInfo.create(
			'spaceList', dynamic_refSpaceList.create( 'current', ref_spaceList.create( ) )
		);

	root.create(
		'userNexus',
		this.create( '_cache', this._cache.set( userInfo.name, userInfo ) )
	);

	await root.repository.saveUser( userInfo );
	await root.createSpace( ref_space.create( 'username', userInfo.name, 'tag', 'home' ) );

	return true;
};


/*
| Returns
|
| If so returns the matching user info.
*/
def.proto.getByName =
	function(
		username
	)
{
	return this._cache.get( username );
};


/*
| Tests if the user creds are ok.
|
| If so loads and returns the matching user info.
*/
def.proto.testUserCreds =
	async function(
		userCreds
	)
{
	const userInfo = this.getByName( userCreds.name );
	if( !userInfo ) return false;
	if( userInfo.passhash !== userCreds.passhash ) return false;
	return userInfo;
};


} );
