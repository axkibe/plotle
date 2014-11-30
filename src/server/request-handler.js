/*
| Handles all client requests.
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


var
	requestHandler,
	ccot_changeWrapRay,
	config,
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
	serveAcquire,
	serveAlter,
	serveAuth,
	serveRegister,
	serveUpdate,
	resume;

requestHandler =
module.exports =
	{ };

config = require( '../../config' );

ccot_changeWrapRay = require( '../ccot/change-wrap-ray' );

jools = require( '../jools/jools' );

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

fabric_spaceRef = require( '../fabric/space-ref' );


/*
| Creates a reject error for all
| serve* functions
*/
replyError =
	function(
		message
	)
{
	if( config.develServer )
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
		passhash,
		seq,
		seqZ,
		spaceBox,
		spaceRef,
		username;

	try
	{
		request = request_alter.createFromJSON( request );
	}
	catch( err )
	{
		return replyError( 'command not valid jion' );
	}

	seq = request.seq;

	changeWrapRay = request.changeWrapRay;

	spaceRef = request.spaceRef;

	username = request.username;

	passhash = request.passhash;

	if( root.$users[ username ].pass !== passhash  )
	{
		return replyError( 'invalid pass' );
	}

	if( root.testAccess( username, spaceRef ) !== 'rw' )
	{
		return replyError( 'no access' );
	}

	spaceBox = root.$spaces[ spaceRef.fullname ];

	seqZ = spaceBox.seqZ;

	if( seq === -1 )
	{
		seq = seqZ;
	}

	if( seq < 0 || seq > seqZ )
	{
		return replyError( 'invalid seq' );
	}

	// translates the changes if not most recent
	for( a = seq; a < seqZ; a++ )
	{
		changeWrapRay = spaceBox.getChangeSkid( a ).transform( changeWrapRay );
	}

	// this does not yield, its write and forget.
	spaceBox =
	root.$spaces[ spaceRef.fullname ] =
		spaceBox.appendChanges( changeWrapRay, request.username );

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
		uid,
		users,
		val;

	try
	{
		request = request_auth.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'command not valid jion' );
	}

	users = root.$users;

	if( request.username === 'visitor' )
	{
		do
		{
			root.$nextVisitor++;

			uid = 'visitor-' + root.$nextVisitor;
		}
		while( users[ uid ] );

		users[ uid ] =
			// FUTURE
			{
				username : uid,
				pass : request.passhash,
				created : Date.now( ),
				use : Date.now( )
			};

		return reply_auth.create( 'username', uid );
	}

	if( !users[ request.username ] )
	{
		val =
			yield root.repository.users.findOne(
				{ _id : request.username },
				resume( )
			);

		if( val === null )
		{
			return replyError( 'Username unknown' );
		}

		users[ request.username ] = val;
	}

	if( users[ request.username ].pass !== request.passhash )
	{
		return replyError( 'Invalid password' );
	}

	return reply_auth.create( 'username', request.username );
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
		passhash,
		user,
		username;

	try
	{
		request = request_register.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'command not valid jion' );
	}


	username = request.username;

	passhash = request.passhash;

	mail = request.mail;

	news = request.news;

	if( username.substr( 0, 7 ) === 'visitor' )
	{
		return replyError( 'Username must not start with "visitor"' );
	}

	if( username.length < 4 )
	{
		return replyError( 'Username too short, min. 4 characters' );
	}

	user =
		yield root.repository.users.findOne(
			{ _id : username },
			resume( )
		);

	if( user !== null )
	{
		return replyError( 'Username already taken' );
	}

	user = {
		_id : username,
		pass : passhash,
		mail : mail,
		news : news
	};

	yield root.repository.users.insert( user, resume( ) );

	root.$users[ username ] = user;

	yield* root.createSpace(
		fabric_spaceRef.create( 'username', username, 'tag', 'home' )
	);

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
		passhash,
		seq,
		sleepID,
		timerID,
		spaceBox,
		spaceRef,
		username;

	try
	{
		request = request_update.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return jools.reject( 'command not valid jion' );
	}

	username = request.username;

	passhash = request.passhash;

	spaceRef = request.spaceRef;

	seq = request.seq;

	if(
		!root.$users[ username ]
		||
		root.$users[ username ].pass !== passhash
	)
	{
		throw jools.reject( 'Invalid password' );
	}

	spaceBox = root.$spaces[ spaceRef.fullname ];

	if( !spaceBox )
	{
		return jools.reject( 'Unknown space' );
	}

	if ( !( seq >= 0 && seq <= spaceBox.seqZ ) )
	{
		return jools.reject( 'Invalid or missing seq: ' + seq );
	}

	asw = requestHandler.conveyUpdate( seq, spaceRef );

	// immediate answer?
	if( asw.changeWrapRay.length > 0 )
	{
		return asw;
	}

	// if not an immediate anwwer, the request is put to sleep
	sleepID = '' + root.$nextSleep++;

	timerID =
		setTimeout(
			requestHandler.expireUpdateSleep,
			60000,
			sleepID
		);

	root.$upsleep[ sleepID ] =
		{
			username : username,
			seq : seq,
			timerID : timerID,
			result : result,
			spaceRef : spaceRef
		};

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
		passhash,
		spaceBox,
		username;

	try
	{
		request = request_acquire.createFromJSON( request );
	}
	catch( err )
	{
		console.log( err.stack );

		return replyError( 'command not valid jion' );
	}

	passhash = request.passhash;

	username = request.username;

	if(
		root.$users[ username ] === undefined
		||
		passhash !== root.$users[ username ].pass
	)
	{
		return replyError( 'wrong username/password' );
	}

	access = root.testAccess( username, request.spaceRef );

	if( access === 'no' )
	{
		return(
			reply_acquire.create(
				'access', access,
				'status', 'no access'
			)
		);
	}

	spaceBox = root.$spaces[ request.spaceRef.fullname ];

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
requestHandler.conveyUpdate =
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


	spaceBox = root.$spaces[ spaceRef.fullname ];

	seqZ = spaceBox.seqZ;

	console.log( 'CUTODO', seq, seqZ );

	// FUTURE have the spaceBox deliver a changeWrapRay
	chgA = [ ];

	for( c = seq; c < seqZ; c++ )
	{
		chgA.push( spaceBox.getChangeSkid( c ).asChangeWrap );
	}

	return(
		reply_update.create(
			'seq', seq,
			'changeWrapRay',
				ccot_changeWrapRay.create( 'ray:init', chgA )
		)
	);
};


/*
| A sleeping update expired.
*/
requestHandler.expireUpdateSleep =
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

	sleep = root.$upsleep[ sleepID ];

	// maybe it just had expired at the same time
	if( !sleep )
	{
		return;
	}

	spaceBox = root.$spaces[ sleep.spaceRef.fullname ];

	seqZ = spaceBox.seqZ;

	delete root.$upsleep[ sleepID ]; // FIXME

	asw =
		reply_update.create(
			'seq', sleep.seq,
			'changeWrapRay', ccot_changeWrapRay.create( )
		);

	// FUTURE this should be in the ajax/http part
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

	result.end(
		JSON.stringify( asw )
	);
};



/*
| Serves an serveRequest
*/
requestHandler.serve =
	function*(
		request,
		result
	)
{
	switch( request.type )
	{
		case 'request.alter' :

			return serveAlter( request );

		case 'request.auth' :

			return yield* serveAuth( request );

		case 'request.acquire' :

			return yield* serveAcquire( request );

		case 'request.register' :

			return yield* serveRegister( request );

		case 'request.update' :

			return serveUpdate( request, result );

		default :

			return replyError( 'unknown command' );
	}
};


} )( );
