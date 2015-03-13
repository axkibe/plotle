/*
| Handles all client requests.
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


var
	change_wrapRay,
	config,
	database_userSkid,
	fabric_spaceRef,
	jools,
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

jools = require( '../jools/jools' );

change_wrapRay = require( '../change/wrapRay' );

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

fabric_spaceRef = require( '../fabric/spaceRef' );

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

	jools.log( 'reject', 'reject', message );

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
		changeWrapRay,
		seq,
		seqZ,
		spaceBox,
		spaceRef,
		user;

	if( !config.server_devel )
	{
		try
		{
			request = request_alter.createFromJSON( request );
		}
		catch( err )
		{
			return replyError( 'command not valid jion' );
		}
	}
	else
	{
		request = request_alter.createFromJSON( request );
	}

	seq = request.seq;

	changeWrapRay = request.changeWrapRay;

	spaceRef = request.spaceRef;

	user = request.user;

	if( !root.userNexus.testInCache( user ) )
	{
		return replyError( 'invalid creds' );
	}

	if( root.testAccess( user.name, spaceRef ) !== 'rw' )
	{
		return replyError( 'no access' );
	}

	spaceBox = root.spaces.get( spaceRef.fullname );

	seqZ = spaceBox.seqZ;

	if( seq === -1 )
	{
		seq = seqZ;
	}

	if( seq < 0 || seq > seqZ )
	{
		return replyError( 'invalid seq' );
	}

	try
	{
		// translates the changes if not most recent
		for( a = seq; a < seqZ; a++ )
		{
			changeWrapRay =
				spaceBox.getChangeSkid( a ).transform( changeWrapRay );
		}

		// this does not yield, its write and forget.
		spaceBox = spaceBox.appendChanges( changeWrapRay, user.name );

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
		user;

	try
	{
		request = request_auth.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'command not valid jion' );
	}

	user = request.user;

	if( user.name === 'visitor' )
	{
		user = root.userNexus.createVisitor( user );

		return reply_auth.create( 'user', user );
	}

	if( !( yield* root.userNexus.testUserCreds( user ) ) )
	{
		return replyError( 'Invalid password' );
	}

	return reply_auth.create( 'user', user );
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
		user,
		sUser;

	try
	{
		request = request_register.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'command not valid jion' );
	}


	user = request.user;

	mail = request.mail;

	news = request.news;

	if( user.isVisitor )
	{
		return replyError( 'Username must not start with "visitor"' );
	}

	if( user.name.length < 4 )
	{
		return replyError( 'Username too short, min. 4 characters' );
	}

	sUser =
		yield* root.userNexus.register(
			user_info.create(
				'name', user.name,
				'passhash', user.passhash,
				'mail', mail,
				'news', news
			)
		);

	if( !sUser )
	{
		return replyError( 'Username already taken' );
	}

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
		seq,
		sleepID,
		spaceBox,
		spaceRef,
		timer,
		user;

	try
	{
		request = request_update.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'command not valid jion' );
	}

	user = request.user;

	spaceRef = request.spaceRef;

	seq = request.seq;

	if( !root.userNexus.testInCache( user ) )
	{
		return replyError( 'invalid creds' );
	}

	spaceBox = root.spaces.get( spaceRef.fullname );

	if( !spaceBox )
	{
		return replyError( 'Unknown space' );
	}

	if ( !( seq >= 0 && seq <= spaceBox.seqZ ) )
	{
		return replyError( 'Invalid or missing seq: ' + seq );
	}

	asw = server_requestHandler.conveyUpdate( seq, spaceRef );

	// immediate answer?
	if( asw.changeWrapRay.length > 0 )
	{
		return asw;
	}

	// if not an immediate anwwer, the request is put to sleep
	sleepID = '' + root.nextSleepID;

	timer =
		setTimeout(
			server_requestHandler.expireUpdateSleep,
			60000,
			// 1000,
			sleepID
		);

	root.create(
		'nextSleepID', root.nextSleepID + 1,
		'upSleeps',
			root.upSleeps.set(
				sleepID,
				server_upSleep.create(
					'seq', seq,
					'timer', timer,
					'result', result,
					'spaceRef', spaceRef
				)
			)
	);

	result.sleepID = sleepID;

	return null;
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
		user;

	try
	{
		request = request_acquire.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'command not valid jion' );
	}

	user = request.user;

	if( !root.userNexus.testInCache( user ) )
	{
		return replyError( 'invalid creds' );
	}

	access = root.testAccess( user.name, request.spaceRef );

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
		seq,     // get updates since this sequence
		spaceRef // reference of space
	)
{
	var
		c,
		chgA,
		seqZ,
		spaceBox;

	spaceBox = root.spaces.get( spaceRef.fullname );

	seqZ = spaceBox.seqZ;

	// FIXME have the spaceBox deliver a changeWrapRay
	chgA = [ ];

	for( c = seq; c < seqZ; c++ )
	{
		chgA.push( spaceBox.getChangeSkid( c ).asChangeWrap );
	}

	return(
		reply_update.create(
			'seq', seq,
			'changeWrapRay',
				change_wrapRay.create( 'ray:init', chgA )
		)
	);
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
		seqZ,
		sleep,
		spaceBox;

	sleep = root.upSleeps.get( sleepID );

	// maybe it just had expired at the same time
	if( !sleep )
	{
		return;
	}

	spaceBox = root.spaces.get( sleep.spaceRef.fullname );

	seqZ = spaceBox.seqZ;

	root.create(
		'upSleeps', root.upSleeps.remove( sleepID )
	);

	asw =
		reply_update.create(
			'seq', sleep.seq,
			'changeWrapRay', change_wrapRay.create( )
		);

	// FIXME this should be in the ajax/http part
	//        of the server
	jools.log( 'ajax', '->', asw );

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

			return replyError( 'unknown command' );
	}
};


} )( );
