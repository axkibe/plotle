/*
| The link talks asynchronously with the server.
*/
'use strict';


tim.define( module, ( def ) => {


const change_wrapList = require( '../change/wrapList' );

const reply_auth = require( '../reply/auth' );

const reply_acquire = require( '../reply/acquire' );

const reply_error = require( '../reply/error' );

const reply_register = require( '../reply/register' );

const reply_update = require( '../reply/update' );

const ref_moment = require( '../ref/moment' );

const ref_momentList = require( '../ref/momentList' );

const request_acquire = require( '../request/acquire' );

const request_alter = require( '../request/alter' );

const request_auth = require( '../request/auth' );

const request_register = require( '../request/register' );

const request_update = require( '../request/update' );

const shell_doTracker = require( '../shell/doTracker' );

const tim_path = tim.import( 'tim.js', 'path' );


def.attributes =
{
	// reference to the current moment of dynamic space
	refMomentSpace : { type : [ 'undefined', '../ref/moment' ] },

	// reference to the current moment
	// of the userSpaceList
	refMomentUserSpaceList : { type : [ 'undefined', '../ref/moment' ] },

	// user space list dynamic
	userSpaceList : { type : [ 'undefined', '../dynamic/refSpaceList' ] },

	// currently logged in user credentials
	userCreds : { type : [ 'undefined', '../user/creds' ] },

	// changes to be send to the server
	_outbox : { type : [ 'undefined', '../change/wrapList' ] },

	// changes that are currently on the way
	_postbox : { type : [ 'undefined', '../change/wrapList' ] },

	// the timer on startup
	_startTimer : { type : [ 'undefined', 'integer' ] },
};


/*
| Aquires a space from the server
| and starts receiving updates for it.
*/
def.func.acquireSpace =
	function(
		spaceRef,
		createMissing
	)
{
	if( root.link._startTimer !== undefined )
	{
		system.cancelTimer( root.link._startTimer );

		root.create(
			'link', root.link.create( '_startTimer', undefined )
		);
	}

	// aborts the current running update.
	root.ajax
	.get( 'update' )
	.abortAll( );

	// aborts any previous acquireSpace requests.
	root.ajax
	.get( 'command' )
	.abortAll( '_onAcquireSpace' );

	root.ajax
	.get( 'command' )
	.request(
		request_acquire.create(
			'createMissing', createMissing,
			'spaceRef', spaceRef,
			'userCreds', root.link.userCreds
		),
		'_onAcquireSpace'
	);
};


/*
| Alters the tree.
*/
def.func.alter =
	function(
		changeWrap // the changeWrap to apply to tree
	)
{
/**/if( CHECK )
/**/{
/**/	if( root.link !== this ) throw new Error( );
/**/}

	const space = changeWrap.changeTree( root.spaceFabric );

	root.create(
		'link',
			root.link.create(
				'_outbox', root.link._outbox.append( changeWrap )
			),
		'spaceFabric', space
	);

	root.link._sendChanges( );

	root.update( changeWrap );
};


/*
| Checks with server if user creds are valid.
*/
def.func.auth =
	function(
		userCreds
	)
{
	root.ajax
	.get( 'command' )
	.request(
		request_auth.create( 'userCreds', userCreds ),
		'_onAuth'
	);
};


/*
| Tries to registers a new user.
*/
def.func.register =
	function(
		userCreds,
		mail,
		news
	)
{
	root.ajax
	.get( 'command' )
	.request(
		request_register.create(
			'userCreds', userCreds,
			'mail', mail,
			'news', news
		),
		'_onRegister'
	);
};


/*
| A space has been acquired.
*/
def.func._onAcquireSpace =
	function(
		request,
		reply
	)
{
	shell_doTracker.flush( );

	switch( reply.type )
	{
		case 'reply_error' :

			reply = reply_error.createFromJSON( reply );

			root.onAcquireSpace( request, reply );

			return;

		case 'reply_acquire' :

			reply = reply_acquire.createFromJSON( reply );

			break;

		default : throw new Error( );
	}

	switch( reply.status )
	{
		case 'nonexistent' :
		case 'no access' :

			root.onAcquireSpace( request, reply );

			return;
	}

	// waits a second before going into update cycle, so safari
	// stops its wheely thing.
	const startTimer =
		system.setTimer(
			1000,
			function( )
			{
				root.create(
					'link', root.link.create( '_startTimer', undefined )
				);

				root.link._update( );
			}
		);

	root.create(
		'spaceFabric',
			reply.space.create(
				'path', tim_path.empty.append( 'spaceFabric' ),
				'ref', request.spaceRef
			),
		'link',
			root.link.create(
				'refMomentSpace',
					ref_moment.create(
						'dynRef', request.spaceRef,
						'seq', reply.seq
					),
				'_outbox', change_wrapList.create( ),
				'_postbox', change_wrapList.create( ),
				'_startTimer', startTimer
			)
	);

	root.onAcquireSpace( request, reply );
};


/*
| Received an auth reply.
*/
def.func._onAuth =
	function(
		request,
		reply
	)
{
	switch( reply.type )
	{
		case 'reply_error' :

			reply = reply_error.createFromJSON( reply );

			break;

		case 'reply_auth' :

			reply = reply_auth.createFromJSON( reply );

			break;

		default : throw new Error( );
	}

	root.onAuth( request.userCreds.isVisitor, reply );
};


/*
| Received a register reply.
*/
def.func._onRegister =
	function(
		request,
		reply
	)
{
	switch( reply.type )
	{
		case 'reply_error' :

			reply = reply_error.createFromJSON( reply );

			break;

		case 'reply_register' :

			reply = reply_register.createFromJSON( reply );

			break;

		default : throw new Error( );
	}

	root.onRegister( request, reply );
};


/*
| Sends the stored changes to server.
*/
def.func._sendChanges =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( root.link !== this ) throw new Error( );
/**/}

	// already sending?
	if( root.link._postbox.length > 0 ) return;

	// nothing to send?
	if( root.link._outbox.length === 0 ) return;

	const outbox = root.link._outbox;

	root.create(
		'link',
			root.link.create(
				'_outbox', change_wrapList.create( ),
				'_postbox', outbox
			)
	);

	root.ajax
	.get( 'command' )
	.request(
		request_alter.create(
			'changeWrapList', outbox,
			'refMomentSpace', root.link.refMomentSpace,
			'userCreds', root.link.userCreds
		),
		'_onSendChanges'
	);
};


/*
| Received a reply of a sendChanges request.
*/
def.func._onSendChanges =
	function(
		request,
		reply
	)
{
	if( reply.type !== 'reply_alter' )
	{
		system.failScreen( 'Server not OK: ' + reply.message );
	}
};


/*
| Received an update.
*/
def.func._onUpdate =
	function(
		request,
		reply
	)
{
/**/if( CHECK )
/**/{
/**/	if( root.link !== this ) throw new Error( );
/**/}

	if( reply.type !== 'reply_update' )
	{
		system.failScreen( reply.message );

		return;
	}

	reply = reply_update.createFromJSON( reply );

	let gotOwnChgs = false;

	for( let r = 0, rl = reply.length; r < rl; r++ )
	{
		const changeDynamic = reply.get( 0 );

		if( changeDynamic.refDynamic.equals( this.refMomentSpace.dynRef ) )
		{
			if( this._gotUpdateSpace( changeDynamic ) ) gotOwnChgs = true;
		}
		else if(
			changeDynamic.refDynamic.equals( this.refMomentUserSpaceList.dynRef )
		)
		{
			this._gotUpdateUserSpaceList( changeDynamic );
		}
		else
		{
			throw new Error( 'unexpected update dynamic from server' );
		}
	}

	if( gotOwnChgs ) root.link._sendChanges( );

	// issues the following update
	root.link._update( );
};


/*
| Updates the current space dynamic.
*/
def.func._gotUpdateSpace =
	function(
		changeDynamic  // the dynamic change instructions
	)
{
	const changeWrapList = changeDynamic.changeWrapList;

	let report = change_wrapList.create( );

	const seq = changeDynamic.seq;

	let space = root.spaceFabric;

	let gotOwnChgs = false;

/**/if( CHECK )
/**/{
/**/	// the server never should say, there are updates for a space
/**/	// and then don't have any
/**/	if( !changeWrapList || changeWrapList.length === 0 ) throw new Error( );
/**/}

	// first undos from the clients space the changes
	// it had done so far.

	let postbox = this._postbox;

	let outbox = this._outbox;

	space = outbox.changeTreeReverse( space );

	space = postbox.changeTreeReverse( space );

	for( let a = 0, aZ = changeWrapList.length; a < aZ; a++ )
	{
		const changeWrap = changeWrapList.get( a );

		// applies changes to the space
		space = changeWrap.changeTree( space );

		// if the cid is the one in the postbox the client
		// received the update of its own change.
		if(
			postbox.length > 0
			&& postbox.get( 0 ).cid === changeWrap.cid
		)
		{
			postbox = postbox.remove( 0 );

			gotOwnChgs = true;

			continue;
		}

		// otherwise it was a foreign change
		report = report.append( changeWrap );
	}

	// FUTURE why is it once changeWrapList then report??

	// FIXME changing this now, check if async edits still
	// are okay

	// transforms the postbox by the updated stuff
	// postbox = changeWrapList.transform( postbox );
	postbox = report.transform( postbox );

	// transforms the outbox by the foreign changes
	outbox = report.transform( outbox );

	// rebuilds the space by own changes

	space = postbox.changeTree( space );

	space = outbox.changeTree( space );

	root.create(
		'link',
			root.link.create(
				'_outbox', outbox || change_wrapList.create( ),
				'_postbox', postbox || change_wrapList.create( ),
				'refMomentSpace',
					root.link.refMomentSpace.create(
						'seq', seq + changeWrapList.length
					)
			),
		'spaceFabric', space
	);

	// FUTURE move to "markJockey"
	if( report.length > 0 )
	{
		root.update( report );

		root.create( 'doTracker', root.doTracker.update( report ) );
	}

	return gotOwnChgs;
};


/*
| Updates the current space dynamic.
*/
def.func._gotUpdateUserSpaceList =
	function(
		changeDynamic  // the dynamic change instructions
	)
{
	const rmusl = root.link.refMomentUserSpaceList;

	const userSpaceList = root.link.userSpaceList.applyChangeDynamic( changeDynamic );

	root.create(
		'userSpaceList', userSpaceList.current,
		'link',
			root.link.create(
				'refMomentUserSpaceList', rmusl.create( 'seq', userSpaceList.seq ),
				'userSpaceList', userSpaceList
			)
	);
};


/*
| Sends an update request to the server and computes its answer.
*/
def.func._update =
	function( )
{
	const list = [ this.refMomentSpace ];

	const refMomentUserSpaceList = this.refMomentUserSpaceList;

	if( refMomentUserSpaceList ) list.push( refMomentUserSpaceList );

	root.ajax
	.get( 'update' )
	.request(
		request_update.create(
			'moments', ref_momentList.create( 'list:init', list ),
			'userCreds', this.userCreds
		),
		'_onUpdate'
	);
};


} );
