/*
| The link talks asynchronously with the server.
*/

var
	change_wrapRay,
	jion$path,
	net_link,
	reply_auth,
	reply_acquire,
	reply_update,
	request_acquire,
	request_alter,
	request_auth,
	request_register,
	request_update,
	root,
	shell_doTracker,
	system;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'net_link',
		attributes :
		{
			spaceRef :
			{
				comment : 'reference to the current space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ]
			},
			_outbox :
			{
				comment : 'changes to be send to the server',
				type : [ 'undefined', 'change_wrapRay' ]
			},
			_postbox :
			{
				comment : 'changes that are currently on the way',
				type : [ 'undefined', 'change_wrapRay' ]
			},
			_rSeq :
			{
				comment : 'the remote sequence number',
				type : [ 'undefined', 'integer' ]
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = net_link.prototype;


/*
| Aquires a space from the server
| and starts receiving updates for it.
*/
prototype.acquireSpace =
	function(
		spaceRef,
		createMissing
	)
{
	// aborts the current running update.
	root.ajax.get( 'update' ).abortAll( );

	// aborts any previous acquireSpace requests.
	root.ajax.get( 'command' ).abortAll( '_onAcquireSpace' );

	root.ajax.get( 'command' ).request(
		request_acquire.create(
			'createMissing', createMissing,
			'spaceRef', spaceRef,
			'user', this.user
		),
		'_onAcquireSpace'
	);
};


/*
| Alters the tree.
*/
prototype.alter =
	function(
		changeWrap // the changeWrap to apply to tree
	)
{
	var
		space;

/**/if( CHECK )
/**/{
/**/	if( root.link !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	space = changeWrap.changeTree( root.spaceFabric );

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
prototype.auth =
	function(
		user
	)
{
	root.ajax.get( 'command' ).request(
		request_auth.create( 'user', user ),
		'_onAuth'
	);
};


/*
| Tries to registers a new user.
*/
prototype.register =
	function(
		user,
		mail,
		news
	)
{
	root.ajax.get( 'command' ).request(
		request_register.create(
			'user', user,
			'mail', mail,
			'news', news
		),
		'_onRegister'
	);
};


/*
| A space has been acquired.
*/
prototype._onAcquireSpace =
	function(
		request,
		reply
	)
{
	shell_doTracker.flush( );

	if( reply.type === 'reply_error' )
	{
		root.onAcquireSpace( request.spaceRef, reply );

		return;
	}

	reply = reply_acquire.createFromJSON( reply );

	switch( reply.status )
	{
		case 'nonexistent' :
		case 'no access' :

			root.onAcquireSpace( request.spaceRef, reply );

			return;
	}

	root.create(
		'spaceFabric',
			reply.space.create(
				'path', jion$path.empty.append( 'spaceFabric' ),
				'ref', request.spaceRef
			),
		'link',
			root.link.create(
				'spaceRef', request.spaceRef,
				'_outbox', change_wrapRay.create( ),
				'_postbox', change_wrapRay.create( ),
				'_rSeq', reply.seq
			)
	);

	root.onAcquireSpace( request.spaceRef, reply );

	// waits a second before going into update cycle, so safari
	// stops its wheely thing.

	// FIXME in case of aborting updates this needs to be aborted.
	system.setTimer(
		1000,
		function( )
		{
			root.link._update( );
		}
	);
};


/*
| Received an auth reply.
*/
prototype._onAuth =
	function(
		request,
		reply
	)
{
	if( reply.type === 'reply_error' )
	{
		root.onAuth( request, reply );

		return;
	}

	reply = reply_auth.createFromJSON( reply );

	root.onAuth( request, reply );
};


/*
| Received a register reply.
*/
prototype._onRegister =
	function(
		request,
		reply
	)
{
	var
		ok;

	ok = reply.type === 'reply_register';

	// FIXME pass request / reply
	root.onRegister(
		ok,
		ok ? request.user : undefined,
		ok ? undefined : reply.message
	);
};


/*
| Sends the stored changes to server.
*/
prototype._sendChanges =
	function( )
{
	var
		outbox;

/**/if( CHECK )
/**/{
/**/	if( root.link !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	// already sending?
	if( root.link._postbox.length > 0 )
	{
		return;
	}

	// nothing to send?
	if( root.link._outbox.length === 0 )
	{
		return;
	}

	outbox = root.link._outbox;

	root.create(
		'link',
			root.link.create(
				'_outbox', change_wrapRay.create( ),
				'_postbox', outbox
			)
	);

	root.ajax.get( 'command' ).request(
		request_alter.create(
			'changeWrapRay', outbox,
			'seq', root.link._rSeq,
			'spaceRef', root.link.spaceRef,
			'user', root.link.user
		),
		'_onSendChanges'
	);
};


/*
| Received a reply of a sendChanges request.
*/
prototype._onSendChanges =
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
prototype._onUpdate =
	function(
		request,
		reply
	)
{
	var
		a,
		aZ,
		changeWrap,
		changeWrapRay,
		gotOwnChgs,
		outbox,
		postbox,
		report,
		seq,
		space;

/**/if( CHECK )
/**/{
/**/	if( root.link !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( reply.type !== 'reply_update' )
	{
		system.failScreen( reply.message );

		return;
	}

	reply = reply_update.createFromJSON( reply );

	changeWrapRay = reply.changeWrapRay;

	report = change_wrapRay.create( );

	gotOwnChgs = false;

	seq = reply.seq;

	space = root.spaceFabric;

	// if this wasn't an empty timeout
	if( changeWrapRay && changeWrapRay.length > 0 )
	{
		// first undos from the clients space the changes
		// it had done so far.

		postbox = this._postbox;

		outbox = this._outbox;

		// FIXME instead of createInvert( ) convert
		// the changeWrapRays to changeRays and invert
		// them.
		space = outbox.createInvert( ).changeTree( space );

		space = postbox.createInvert( ).changeTree( space );

		for(
			a = 0, aZ = changeWrapRay.length;
			a < aZ;
			a++
		)
		{
			changeWrap = changeWrapRay.get( a );

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

		// FIXME why is it once changeWrapRay then report??

		// transforms the postbox by the updated stuff
		postbox = changeWrapRay.transform( postbox );

		// transforms the outbox by the foreign changes
		outbox = report.transform( outbox );

		// rebuilds the space by own changes

		space = postbox.changeTree( space );

		space = outbox.changeTree( space );
	}

	root.create(
		'link',
			root.link.create(
				// FIXME check why this gets zero
				//       in case of timeout
				'_outbox', outbox || change_wrapRay.create( ),
				'_postbox', postbox || change_wrapRay.create( ),
				'_rSeq', reply.seq + changeWrapRay.length
			),
		'spaceFabric', space
	);

	// FIXME move to "markJockey"
	if( report.length > 0 )
	{
		root.update( report );
	}

	root.create( 'doTracker', root.doTracker.update( report ) );

	if( gotOwnChgs )
	{
		root.link._sendChanges( );
	}

	// issues the following update

	root.link._update( );
};



/*
| Sends an update request to the server and computes its answer.
*/
prototype._update =
	function( )
{
	root.ajax.get( 'update' ).request(
		request_update.create(
			'spaceRef', this.spaceRef,
			'seq',
				this._rSeq !== undefined
				? this._rSeq
				: -1,
			'user', this.user
		),
		'_onUpdate'
	);
};



} )( );
