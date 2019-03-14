/*
| Handles all client requests.
*/
'use strict';


tim.define( module, ( def, server_requestHandler ) => {


/*
| Provides only static functions.
*/
def.abstract = true;


const config = tim.require( '../config/intf' );

const change_dynamic = tim.require( '../change/dynamic' );

const change_wrapList = tim.require( '../change/wrapList' );

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
	function(
		request
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

	if( !root.userNexus.testInCache( userCreds ) )
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

	const seqZ = spaceBox.seqZ;

	if( seq === -1 ) seq = seqZ;

	if( seq < 0 || seq > seqZ ) return replyError( 'invalid seq' );

	try
	{
		// translates the changes if not most recent
		for( let a = seq; a < seqZ; a++ )
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
		function( ) { root.wake( spaceRef ); }
	);

	return reply_alter.create( );
};


/*
| Serves an auth request.
*/
const serveAuth =
	function*(
		request
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

	const userInfo = yield* root.userNexus.testUserCreds( userCreds );

	if( !userInfo ) return replyError( 'Invalid password' );

	const userSpaceList = yield* root.userNexus.getUserSpaceList( userInfo );

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
	function*(
		request
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
		yield* root.userNexus.register(
			user_info.create(
				'name', userCreds.name,
				'passhash', userCreds.passhash,
				'mail', mail,
				'news', news
			)
		);

	if( !sUser ) return replyError( 'Username already taken' );

	return reply_register.create( );
};


/*
| Gets new changes or waits for them.
*/
const serveUpdate =
	function (
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

	const userInfo = root.userNexus.testInCache( request.userCreds );

	if( !userInfo ) return replyError( 'Invalid creds' );

	const moments = request.moments;

	let asw = server_requestHandler.testUpdate( userInfo, moments );

	// if testUpdate failed return the error
	if( asw ) return asw;

	asw = server_requestHandler.conveyUpdate( moments );

	// immediate answer?
	if( asw ) return asw;

	// if not an immediate answer, the request is put to sleep
	const sleepID = '' + root.nextSleepID;

	const timer =
		setTimeout(
			server_requestHandler.expireUpdateSleep,
			60000,
			sleepID
		);

	root.create(
		'nextSleepID', root.nextSleepID + 1,
		'upSleeps',
			root.upSleeps.set(
				sleepID,
				server_upSleep.create(
					'moments', moments,
					'result', result,
					'timer', timer
				)
			)
	);

	result.sleepID = sleepID;
};


/*
| Serves a get request.
*/
const serveAcquire =
	function*(
		request
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

	if( !root.userNexus.testInCache( userCreds ) )
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
			spaceBox = yield* root.createSpace( request.spaceRef );
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
			'seq', spaceBox.seqZ,
			'space', spaceBox.space
		)
	);
};


/*
| Returns a result for an update operation.
*/
def.static.conveyUpdate =
	function(
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

				const seqZ = spaceBox.seqZ;

				if( seq >= seqZ ) continue;

				const chgA = [ ];

				// FIXME make a getChangeWraps function to spaceBox
				for( let c = seq; c < seqZ; c++ )
				{
					chgA.push( spaceBox.getChangeWrap( c ) );
				}

				arr.push(
					change_dynamic.create(
						'seq', seq,
						'changeWrapList',
							change_wrapList.create( 'list:init', chgA ),
						'refDynamic', dynRef
					)
				);

				continue;
			}

			case ref_userSpaceList :
			{
				const userInfo = root.userNexus.getInCache( dynRef.username );

				if( !userInfo ) continue;

				const changeWraps = userInfo.spaceList.changeWraps;

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
	for( let a = 0, al = moments.length; a < al; a++ )
	{
		const moment = moments.get( a );

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

				if ( !( seq >= 0 && seq <= spaceBox.seqZ ) )
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
		sleepID
	)
{
	const sleep = root.upSleeps.get( sleepID );

	// maybe it just had expired already
	if( !sleep ) return;

	root.create(
		'upSleeps', root.upSleeps.remove( sleepID )
	);

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
| Serves an serveRequest
*/
def.static.serve =
	function*(
		request,
		result
	)
{
	// FIXME make a table
	switch( request.type )
	{
		case 'request_alter' : return serveAlter( request );

		case 'request_auth' : return yield* serveAuth( request );

		case 'request_acquire' : return yield* serveAcquire( request );

		case 'request_register' : return yield* serveRegister( request );

		case 'request_update' : return serveUpdate( request, result );

		default :

			log.log( 'unknown command', request );

			return replyError( 'unknown command' );
	}
};


} );
