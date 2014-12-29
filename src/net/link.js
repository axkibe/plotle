/*
| The link talks asynchronously with the server.
*/

var
	ccot_changeRay,
	ccot_changeWrap,
	ccot_changeWrapRay,
	jools,
	net_link,
	request_acquire,
	request_alter,
	request_auth,
	request_register,
	request_update,
	reply_acquire,
	reply_update,
	root,
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
	return {
		id :
			'net_link',
		attributes :
			{
				passhash :
					{
						comment :
							'password hashcode of current user',
						type :
							'String',
						defaultValue :
							null
					},
				spaceRef :
					{
						comment :
							'reference to the current space',
						type :
							'fabric_spaceRef',
						defaultValue :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							null
					},
				_cSpace :
					{
						comment :
							'the current space',
						type :
							'Object',
						defaultValue :
							null
					},
				_outbox :
					{
						comment :
							'changes to be send to the server',
						type :
							'ccot_changeWrapRay',
						defaultValue :
							null
					},
				_postbox :
					{
						comment :
							'changes that are currently on the way',
						type :
							'ccot_changeWrapRay',
						defaultValue :
							null
					},
				_rSeq :
					{
						comment :
							'the remote sequence number',
						type :
							'Integer',
						defaultValue :
							null
					},
				_rSpace :
					{
						comment :
							'the remote space',
							// what the client thinks the server thinks
						type :
							'Object',
						defaultValue :
							null
					}
			}
	};
}


/*
| Checks with server if a username / passhash
| combo is valid.
*/
net_link.prototype.auth =
	function(
		username,
		passhash
	)
{
	root.ajax.twig.command.request(
		request_auth.create(
			'username', username,
			'passhash', passhash
		),
		'_onAuth'
	);
};


/*
| Received an auth reply.
*/
net_link.prototype._onAuth =
	function(
		request,
		reply
	)
{
	root.onAuth( request, reply );
};


/*
| Tries to registers a new user.
*/
net_link.prototype.register =
	function(
		username,
		mail,
		passhash,
		news
	)
{
	root.ajax.twig.command.request(
		request_register.create(
			'username', username,
			'mail', mail,
			'passhash', passhash,
			'news', news
		),
		'_onRegister'
	);
};


/*
| Received a register reply.
*/
net_link.prototype._onRegister =
	function(
		request,
		reply
	)
{
	var
		ok;

	ok = reply.type === 'reply_register';

	// FUTURE pass request / reply
	root.onRegister(
		ok,
		ok ? request.username : null,
		ok ? request.passhash : null,
		ok ? null : reply.message
	);
};


/*
| Aquires a space from the server
| and starts receiving updates for it.
*/
net_link.prototype.acquireSpace =
	function(
		spaceRef,
		createMissing
	)
{
	// aborts the current running update.
	root.ajax.twig.update.abortAll( );

	root.ajax.twig.command.request(
		request_acquire.create(
			'createMissing', createMissing,
			'passhash', this.passhash,
			'spaceRef', spaceRef,
			'username', this.username
		),
		'_onAcquireSpace'
	);
};


/*
| A space has been acquired.
*/
net_link.prototype._onAcquireSpace =
	function(
		request,
		reply
	)
{
	root.doTracker.flush( );

	if( reply.type === 'reply_error' )
	{
		root.onAcquireSpace( request.spaceRef, reply );

		root.link._update( );

		return;
	}

	reply = reply_acquire.createFromJSON( reply );

	switch( reply.status )
	{
		case 'nonexistent' :
		case 'no access' :

			root.onAcquireSpace( request.spaceRef, reply );

			root.link._update( );

			return;
	}

	root.link =
		root.link.create(
			'spaceRef', request.spaceRef,
			'_cSpace', reply.space,
			'_rSpace', reply.space,
			'_outbox', ccot_changeWrapRay.create( ),
			'_postbox', ccot_changeWrapRay.create( ),
			'_rSeq', reply.seq
		);

	root.onAcquireSpace( request.spaceRef, reply );

	// waits a second before going into update cycle, so safari
	// stops its wheely thing.
	system.setTimer(
		1,
		function( )
		{
			root.link._update( );
		}
	);
};



/*
| Sends an update request to the server and computes its answer.
*/
net_link.prototype._update =
	function( )
{
	root.ajax.twig.update.request(
		request_update.create(
			'passhash', this.passhash,
			'spaceRef', this.spaceRef,
			'seq',
				this._rSeq !== null
				? this._rSeq
				: -1,
			'username', this.username
		),
		'_onUpdate'
	);
};


/*
| Received an update.
*/
net_link.prototype._onUpdate =
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
		link,
		outbox,
		postbox,
		report,
		seq,
		cSpace,
		rSpace;

	link = this;

/**/if( CHECK )
/**/{
/**/	if( root.link !== link )
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

	report = ccot_changeWrapRay.create( );

	gotOwnChgs = false;

	seq = reply.seq;

	// if this wasn't an empty timeout
	// process the received changes

	// adapts all queued unsend changes (postbox)
	// and
	// rebuilds the clients understanding of its own tree

	cSpace =
	rSpace =
		link._rSpace;

	// FUTURE fix these length === 0 cases
	if( changeWrapRay && changeWrapRay.length > 0 )
	{
		postbox = this._postbox;

		outbox = this._outbox;

		for(
			a = 0, aZ = changeWrapRay.length;
			a < aZ;
			a++
		)
		{
			changeWrap = changeWrapRay.get( a );

			// changes the clients understanding of the server tree
			cSpace =
			rSpace =
				changeWrap.changeTree( rSpace ).tree;

			// if the cid is the one in the postbox the client
			// received the update of its own change.
			if(
				postbox.length > 0
				&&
				postbox.get( 0 ).cid === changeWrap.cid
			)
			{
				postbox = postbox.remove( 0 );

				gotOwnChgs = true;

				continue;
			}

			// otherwise it was a foreign change
			report = report.append( changeWrap );
		}

		postbox = changeWrapRay.transform( postbox );

		cSpace = postbox.changeTree( cSpace ).tree;

		// transforms the outbox by the foreign changes
		outbox = report.transform( outbox );

		cSpace = outbox.changeTree( cSpace ).tree;
	}

	link =
	root.link =
		link.create(
			'_cSpace', cSpace,
			'_outbox', outbox,
			'_postbox', postbox,
			'_rSeq', reply.seq + changeWrapRay.length,
			'_rSpace', rSpace
		);


	if( report.length > 0 )
	{
		root.update( cSpace, report );
	}

	if( gotOwnChgs )
	{
		link._sendChanges( );
	}

	// issues the following update

	link._update( );
};


/*
| Alters the tree.
*/
net_link.prototype.alter =
	function(
		changes,  // the change(ray) to apply on the tree
		noTrack  // if true do not report the dotracker
		//       // ( for example this is an undo itself )
	)
{
	var
		changeRay,
		changeWrap,
		link,
		result;

	link = this;

/**/if( CHECK )
/**/{
/**/	if( root.link !== link )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	switch( changes.reflect )
	{
		case 'ccot_change' :

			changeRay = ccot_changeRay.create( 'ray:init', [ changes ] );

			break;

		case 'ccot_changeRay' :

			changeRay = changes;

			break;

		default :

			throw new Error( );
	}

	result = changeRay.changeTree( link._cSpace );

	changeRay = result.reaction;

	changeWrap =
		ccot_changeWrap.create(
			'cid', jools.uid( ),
			'changeRay', changeRay
		);

	link =
	root.link =
		link.create(
			'_cSpace', result.tree,
			'_outbox', root.link._outbox.append( changeWrap )
		);

	if( !noTrack )
	{
		root.doTracker.track( changeWrap );
	}

	link._sendChanges( );

	root.update( result.tree, changeRay );

	return result;
};


/*
| Sends the stored changes to server.
*/
net_link.prototype._sendChanges =
	function( )
{
	var
		link,
		outbox;

	link = this;

/**/if( CHECK )
/**/{
/**/	if( root.link !== link )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	// already sending?
	if( link._postbox.length > 0 )
	{
		return;
	}

	// nothing to send?
	if( link._outbox.length === 0 )
	{
		return;
	}

	outbox = link._outbox;

	link =
	root.link =
		link.create(
			'_outbox', ccot_changeWrapRay.create( ),
			'_postbox', outbox
		);

	root.ajax.twig.command.request(
		request_alter.create(
			'changeWrapRay', outbox,
			'passhash', link.passhash,
			'seq', link._rSeq,
			'spaceRef', link.spaceRef,
			'username', link.username
		),
		'_onSendChanges'
	);
};


/*
| Received a reply of a sendChanges request.
*/
net_link.prototype._onSendChanges =
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


} )( );
