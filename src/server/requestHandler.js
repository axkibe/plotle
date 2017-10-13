/*
| Handles all client requests.
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


var
	change_dynamic,
	change_wrapList,
	config,
	database_userSkid,
	log_ajax,
	log_warn,
	ref_space,
	replyError,
	reply_acquire,
	reply_alter,
	reply_auth,
	reply_error,
	reply_register,
	reply_update,
	request_acquire,
	request_alter,
	request_auth,
	request_register,
	request_update,
	resume,
	server_requestHandler,
	server_spaceNexus,
	server_upSleep,
	serveAcquire,
	serveAlter,
	serveAuth,
	serveRegister,
	serveUpdate,
	user_info;

server_requestHandler =
module.exports =
	{ };

config = require( '../../config' );

log_ajax = require( '../log/ajax' );

log_warn = require( '../log/warn' );

change_dynamic = require( '../change/dynamic' );

change_wrapList = require( '../change/wrapList' );

database_userSkid = require( '../database/userSkid' );

reply_acquire = require( '../reply/acquire' );

reply_alter = require( '../reply/alter' );

reply_auth = require( '../reply/auth' );

reply_error = require( '../reply/error' );

reply_register = require( '../reply/register' );

reply_update = require( '../reply/update' );

request_acquire = require( '../request/acquire' );

request_alter = require( '../request/alter' );

request_auth = require( '../request/auth' );

request_register = require( '../request/register' );

request_update = require( '../request/update' );

resume = require( 'suspend' ).resume;

ref_space = require( '../ref/space' );

server_spaceNexus = require( './spaceNexus' );

server_upSleep = require( './upSleep' );

user_info = require( '../user/info' );


/*
| Creates a reject error for all
| serve* functions
*/
replyError =
	function(
		message
	)
{
	if( config.server_devel )
	{
		// in devel mode any failure is fatal.
		throw new Error( message );
	}

	log_warn( 'reject', message );

	return reply_error.create( 'message', message );
};


/*
| Serves an alter request.
*/
serveAlter =
	function(
		request
	)
{
	var
		a,
		changeWrapList,
		refMomentSpace,
		seq,
		seqZ,
		spaceBox,
		spaceRef,
		userCreds;

	if( !config.server_devel )
	{
		try
		{
	  		request = request_alter.createFromJSON( request );
		}
		catch( err )
		{
			return replyError( 'Command not valid jion' );
		}
	}
	else
	{
		request = request_alter.createFromJSON( request );
	}
	
	userCreds = request.userCreds;

	if( !root.userNexus.testInCache( userCreds ) )
	{
		return replyError( 'Invalid creds' );
	}

	refMomentSpace = request.refMomentSpace;

	seq = refMomentSpace.seq;

	changeWrapList = request.changeWrapList;

	spaceRef = refMomentSpace.dynRef;

	if( server_spaceNexus.testAccess( userCreds, spaceRef ) !== 'rw' )
	{
		return replyError( 'no access' );
	}

	spaceBox = root.spaces.get( spaceRef.fullname );

	seqZ = spaceBox.seqZ;

	if( seq === -1 ) seq = seqZ;

	if( seq < 0 || seq > seqZ ) return replyError( 'invalid seq' );

	try
	{
		// translates the changes if not most recent
		for( a = seq; a < seqZ; a++ )
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
		if( error.nonFatal && !config.server_devel )
		{
			return replyError( error.message );
		}
		else
		{
			throw error;
		}
	}

	process.nextTick(
		function( ) { root.wake( spaceRef ); }
	);

	return reply_alter.create( );
};


/*
| Serves an auth request.
*/
serveAuth =
	function*(
		request
	)
{
	var
		userCreds,
		userInfo,
		userSpaceList;

	try
	{
		request = request_auth.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'Command not valid jion' );
	}

	userCreds = request.userCreds;

	if( userCreds.isVisitor )
	{
		userCreds = root.userNexus.createVisitor( userCreds );

		return reply_auth.create( 'userCreds', userCreds );
	}

	userInfo = yield* root.userNexus.testUserCreds( userCreds );

	if( !userInfo ) return replyError( 'Invalid password' );

	userSpaceList = yield* root.userNexus.getUserSpaceList( userInfo );

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
serveRegister =
	function*(
		request
	)
{
	var
		mail,
		news,
		userCreds,
		sUser;

	try
	{
		request = request_register.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'Command not valid jion' );
	}


	userCreds = request.userCreds;

	mail = request.mail;

	news = request.news;

	if( userCreds.isVisitor )
	{
		return replyError( 'Username must not start with "visitor"' );
	}

	if( userCreds.name.length < 4 )
	{
		return replyError( 'Username too short, min. 4 characters' );
	}

	sUser =
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
serveUpdate =
	function (
		request,
		result
	)
{
	var
		asw,
		moments,
		sleepID,
		timer,
		userInfo;

	try
	{
		request = request_update.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'Command not valid jion' );
	}

	userInfo = root.userNexus.testInCache( request.userCreds );

	if( !userInfo ) return replyError( 'Invalid creds' );

	moments = request.moments;

	asw = server_requestHandler.testUpdate( userInfo, moments );

	// if testUpdate failed return the error
	if( asw ) return asw;

	asw = server_requestHandler.conveyUpdate( moments );

	// immediate answer?
	if( asw ) return asw;

	// if not an immediate answer, the request is put to sleep
	sleepID = '' + root.nextSleepID;

	timer =
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
serveAcquire =
	function*(
		request
	)
{
	var
		access,
		spaceBox,
		userCreds;

	try
	{
		request = request_acquire.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'Command not valid jion' );
	}

	userCreds = request.userCreds;

	if( !root.userNexus.testInCache( userCreds ) )
	{
		return replyError( 'Invalid creds' );
	}

	access = server_spaceNexus.testAccess( userCreds, request.spaceRef );

	if( access === 'no' )
	{
		return(
			reply_acquire.create(
				'access', access,
				'status', 'no access'
			)
		);
	}

	spaceBox = root.spaces.get( request.spaceRef.fullname );

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
server_requestHandler.conveyUpdate =
	function(
		moments   // references to moments in dynamics to get updates for
	)
{
	var
		a,
		arr,
		aZ,
		c,
		changeWraps,
		chgA,
		dynRef,
		moment,
		seq,
		seqZ,
		spaceBox,
		userInfo;

	arr = [ ];
				
	for( a = 0, aZ = moments.length; a < aZ; a++ )
	{
		moment = moments.get( a );

		dynRef = moment.dynRef;
	
		seq = moment.seq;

		switch( dynRef.reflect )
		{
			case 'ref_space' :

				spaceBox = root.spaces.get( dynRef.fullname );

				if( !spaceBox ) continue;

				seqZ = spaceBox.seqZ;

				if( seq >= seqZ ) continue;

				chgA = [ ];

				// FIXME make a getChangeWraps function to spaceBox
				for( c = seq; c < seqZ; c++ )
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

			case 'ref_userSpaceList' :

				userInfo = root.userNexus.getInCache( dynRef.username );

				if( !userInfo ) continue;

				changeWraps = userInfo.spaceList.changeWraps;

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
server_requestHandler.testUpdate =
	function(
		userInfo, // user info
		moments   // references to space dynamics to get updates for
	)
{
	var
		a,
		aZ,
		dynRef,
		moment,
		spaceBox,
		seq;

	for( a = 0, aZ = moments.length; a < aZ; a++ )
	{
		moment = moments.get( a );

		dynRef = moment.dynRef;
	
		seq = moment.seq;

		switch( dynRef.reflect )
		{
			case 'ref_space' :

				if(
					dynRef.username !== 'ideoloom'
					&& dynRef.username !== userInfo.name
				)
				{
					return replyError( 'update not allowed' );
				}

				spaceBox = root.spaces.get( dynRef.fullname );

				if( !spaceBox ) return replyError( 'Unknown space' );

				if ( !( seq >= 0 && seq <= spaceBox.seqZ ) )
				{
					return replyError( 'Invalid or missing seq: ' + seq );
				}

				break;

			case 'ref_userSpaceList' :

				if( dynRef.username !== userInfo.name )
				{
					return replyError( 'userSpaceList not allowed' );
				}

				break;

			default :

				return replyError( 'Invalid dynamic reference' );
		}
	}
};


/*
| A sleeping update expired.
*/
server_requestHandler.expireUpdateSleep =
	function(
		sleepID
	)
{
	var
		asw,
		result,
		sleep;

	sleep = root.upSleeps.get( sleepID );

	// maybe it just had expired already
	if( !sleep ) return;

	root.create(
		'upSleeps', root.upSleeps.remove( sleepID )
	);

	asw = reply_update.create( );

	log_ajax( '->', asw );

	result = sleep.result;

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
server_requestHandler.serve =
	function*(
		request,
		result
	)
{
	switch( request.type )
	{
		case 'request_alter' :

			return serveAlter( request );

		case 'request_auth' :

			return yield* serveAuth( request );

		case 'request_acquire' :

			return yield* serveAcquire( request );

		case 'request_register' :

			return yield* serveRegister( request );

		case 'request_update' :

			return serveUpdate( request, result );

		default :

			log_warn( 'unknown command', request );

			return replyError( 'unknown command' );
	}
};


} )( );
