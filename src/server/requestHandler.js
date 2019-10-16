/*
| Handles all client requests.
*/
'use strict';


tim.define( module, ( def, server_requestHandler ) => {


/*
| Provides only static functions.
*/
def.abstract = true;

const change_dynamic = tim.require( '../change/dynamic' );
const config = tim.require( '../config/intf' );
const log = tim.require( './log' );
const ref_space = tim.require( '../ref/space' );
const ref_userSpaceList = tim.require( '../ref/userSpaceList' );
const reply_acquire = tim.require( '../reply/acquire' );
const reply_alter = tim.require( '../reply/alter' );
const reply_auth = tim.require( '../reply/auth' );
const reply_error = tim.require( '../reply/error' );
const reply_register = tim.require( '../reply/register' );
const reply_update = tim.require( '../reply/update' );
const request_acquire = tim.require( '../request/acquire' );
const request_alter = tim.require( '../request/alter' );
const request_auth = tim.require( '../request/auth' );
const request_register = tim.require( '../request/register' );
const request_update = tim.require( '../request/update' );
const server_spaceNexus = tim.require( './spaceNexus' );
const server_upSleep = tim.require( './upSleep' );
const user_info = tim.require( '../user/info' );


/*
| Creates a reject error for all
| serve* functions
*/
const replyError =
	function(
		message
	)
{
	if( config.get( 'server', 'sensitive' ) )
	{
		// if sensitive (for development) any failure is fatal.
		throw new Error( message );
	}

	log.log( 'reject', message );

	return reply_error.create( 'message', message );
};


/*
| Serves an alter request.
*/
const serveAlter =
	async function(
		request,
		result
	)
{
	if( !config.get( 'server', 'sensitive' ) )
	{
		try
		{
			request = request_alter.createFromJSON( request );
		}
		catch( err )
		{
			return replyError( 'Request JSON translation failed' );
		}
	}
	else
	{
		request = request_alter.createFromJSON( request );
	}

	const userCreds = request.userCreds;

	if( !( await root.userNexus.testUserCreds( userCreds ) ) )
	{
		return replyError( 'Invalid creds' );
	}

	const refMomentSpace = request.refMomentSpace;

	let seq = refMomentSpace.seq;

	let changeWrapList = request.changeWrapList;

	const spaceRef = refMomentSpace.dynRef;

	if( server_spaceNexus.testAccess( userCreds, spaceRef ) !== 'rw' )
	{
		return replyError( 'no access' );
	}

	let spaceBox = root.spaces.get( spaceRef.fullname );

	const boxSeq = spaceBox.seq;

	if( seq === -1 ) seq = boxSeq;

	if( seq < 0 || seq > boxSeq ) return replyError( 'invalid seq' );

	try
	{
		// translates the changes if not most recent
		for( let a = seq; a < boxSeq; a++ )
		{
			changeWrapList =
				spaceBox.getChangeWrap( a ).transform( changeWrapList );
		}

		// this does not yield, its write and forget.
		spaceBox = spaceBox.appendChanges( changeWrapList, userCreds.name );

		root.create(
			'spaces',
				root.spaces.create( 'group:set', spaceRef.fullname, spaceBox )
		);
	}
	catch( error )
	{
		if( error.nonFatal ) return replyError( error.message );

		throw error;
	}

	process.nextTick(
		( ) =>
		{
			root.wake( spaceRef )
			.catch( ( error ) => { console.error( error ); process.exit( -1 ); } );
		}
	);

	return reply_alter.singleton;
};


/*
| Serves an auth request.
*/
const serveAuth =
	async function(
		request,
		result
	)
{
	try
	{
		request = request_auth.createFromJSON( request );
	}
	catch( err )
	{
		log.log( err.stack );

		return replyError( 'Request JSON translation failed' );
	}

	let userCreds = request.userCreds;

	if( userCreds.isVisitor )
	{
		userCreds = root.userNexus.createVisitor( userCreds );

		if( !userCreds ) return replyError( 'invalid visitor request' );

		return reply_auth.create( 'userCreds', userCreds );
	}

	const userInfo = await root.userNexus.testUserCreds( userCreds );

	if( !userInfo ) return replyError( 'Invalid password' );

	const userSpaceList = await root.userNexus.getUserSpaceList( userInfo );

	return(
		reply_auth.create(
			'userCreds', userCreds,
			'userSpaceList', userSpaceList
		)
	);
};


/*
| Serves a register request.
*/
const serveRegister =
	async function(
		request,
		result
	)
{
	try
	{
		request = request_register.createFromJSON( request );
	}
	catch( err )
	{
		log.log( err.stack );

		return replyError( 'Request JSON translation failed' );
	}

	const userCreds = request.userCreds;

	const mail = request.mail;

	const news = request.news;

	if( userCreds.isVisitor )
	{
		return replyError( 'Username must not start with "visitor"' );
	}

	if( userCreds.name.length < 4 )
	{
		return replyError( 'Username too short, min. 4 characters' );
	}

	const sUser =
		await root.userNexus.register(
			user_info.create(
				'name', userCreds.name,
				'passhash', userCreds.passhash,
				'mail', mail,
				'news', news
			)
		);

	if( !sUser ) return replyError( 'Username already taken' );

	return reply_register.singleton;
};


/*
| Gets new changes or waits for them.
*/
const serveUpdate =
	async function(
		request,
		result
	)
{
	try
	{
		request = request_update.createFromJSON( request );
	}
	catch( err )
	{
		log.log( err.stack );

		return replyError( 'Request JSON translation failed' );
	}

	const userInfo = await root.userNexus.testUserCreds( request.userCreds );

	if( !userInfo ) return replyError( 'Invalid creds' );

	const moments = request.moments;

	let asw = server_requestHandler.testUpdate( userInfo, moments );

	// if testUpdate failed return the error
	if( asw ) return asw;

	asw = await server_requestHandler.conveyUpdate( moments );

	// immediate answer?
	if( asw ) return asw;

	// if not an immediate answer, the request is put to sleep
	const sleepId = '' + root.nextSleepId;

	const timer = setTimeout( server_requestHandler.expireUpdateSleep, 60000, sleepId );

	root.create(
		'nextSleepId', root.nextSleepId + 1,
		'upSleeps',
			root.upSleeps.set(
				sleepId,
				server_upSleep.create(
					'moments', moments,
					'result', result,
					'timer', timer
				)
			)
	);

	result.sleepId = sleepId;
};


/*
| Serves a get request.
*/
const serveAcquire =
	async function(
		request,
		result
	)
{
	try
	{
		request = request_acquire.createFromJSON( request );
	}
	catch( err )
	{
		log.log( err.stack );

		return replyError( 'Request JSON translation failed' );
	}

	const userCreds = request.userCreds;

	if( !( await root.userNexus.testUserCreds( userCreds ) ) )
	{
		return replyError( 'Invalid creds' );
	}

	const access = server_spaceNexus.testAccess( userCreds, request.spaceRef );

	if( access === 'no' )
	{
		return(
			reply_acquire.create(
				'access', access,
				'status', 'no access'
			)
		);
	}

	let spaceBox = root.spaces.get( request.spaceRef.fullname );

	if( !spaceBox )
	{
		if( request.createMissing === true )
		{
			spaceBox = await root.createSpace( request.spaceRef );
		}
		else
		{
			return(
				reply_acquire.create(
					'access', access,
					'status', 'nonexistent'
				)
			);
		}
	}

	return(
		reply_acquire.create(
			'status', 'served',
			'access', access,
			'seq', spaceBox.seq,
			'space', spaceBox.space
		)
	);
};


/*
| Returns a result for an update operation.
*/
def.static.conveyUpdate =
	async function(
		moments   // references to moments in dynamics to get updates for
	)
{
	const arr = [ ];

	for( let a = 0, al = moments.length; a < al; a++ )
	{
		const moment = moments.get( a );

		const dynRef = moment.dynRef;

		const seq = moment.seq;

		switch( dynRef.timtype )
		{
			case ref_space :
			{
				const spaceBox = root.spaces.get( dynRef.fullname );

				if( !spaceBox ) continue;

				const boxSeq = spaceBox.seq;

				if( seq >= boxSeq ) continue;

				arr.push(
					change_dynamic.create(
						'seq', seq,
						'changeWrapList', spaceBox.getChangeWrapsUp2Current( seq ),
						'refDynamic', dynRef
					)
				);

				continue;
			}

			case ref_userSpaceList :
			{
				const userInfo = root.userNexus.getByName( dynRef.username );
				if( !userInfo ) continue;

				const userSpaceList = await root.userNexus.getUserSpaceList( userInfo );
				const changeWraps = userSpaceList.changeWraps;

				if( seq - 1 < changeWraps.length )
				{
					arr.push(
						change_dynamic.create(
							'seq', seq,
							'changeWrapList', changeWraps.slice( seq - 1 ),
							'refDynamic', dynRef
						)
					);
				}

				continue;
			}

			default :

				// invalid request behind server checks should never be possible to happen.
				throw new Error( );
		}
	}

	return(
		arr.length > 0
		? reply_update.create( 'list:init', arr )
		: undefined
	);
};


/*
| Tests if an update request is legitimate.
*/
def.static.testUpdate =
	function(
		userInfo, // user info
		moments   // references to space dynamics to get updates for
	)
{
	for( let moment of moments )
	{
		const dynRef = moment.dynRef;

		const seq = moment.seq;

		switch( dynRef.timtype )
		{
			case ref_space :
			{
				if(
					dynRef.username !== 'plotle'
					&& dynRef.username !== userInfo.name
				)
				{
					return replyError( 'update not allowed' );
				}

				const spaceBox = root.spaces.get( dynRef.fullname );

				if( !spaceBox ) return replyError( 'Unknown space' );

				if ( !( seq >= 0 && seq <= spaceBox.seq ) )
				{
					return replyError( 'Invalid or missing seq: ' + seq );
				}

				break;
			}

			case ref_userSpaceList :

				if( dynRef.username !== userInfo.name )
				{
					return replyError( 'userSpaceList not allowed' );
				}

				break;

			default : return replyError( 'Invalid dynamic reference' );
		}
	}
};


/*
| A sleeping update expired.
*/
def.static.expireUpdateSleep =
	function(
		sleepId
	)
{
	const sleep = root.upSleeps.get( sleepId );

	// maybe it just had expired already
	if( !sleep ) return;

	root.create( 'upSleeps', root.upSleeps.remove( sleepId ) );

	const asw = reply_update.create( );

	const result = sleep.result;

	result.writeHead(
		200,
		{
			'Content-Type' : 'application/json',
			'Cache-Control' : 'no-cache',
			'Date' : new Date().toUTCString()
		}
	);

	result.end( JSON.stringify( asw ) );
};


/*
| Maps the request types to functions.
*/
def.staticLazy._serveTable = ( ) =>
( {
	request_alter    : serveAlter,
	request_auth     : serveAuth,
	request_acquire  : serveAcquire,
	request_register : serveRegister,
	request_update   : serveUpdate
} );


/*
| Serves an serveRequest
*/
def.static.serve =
	async function(
		request,
		result
	)
{
	const handler = server_requestHandler._serveTable[ request.type ];

	if( !handler )
	{
		log.log( 'unknown command', request );

		return replyError( 'unknown command' );
	}

	return await handler( request, result );
};


} );
