/*
| The link talks asynchronously with the server.
*/

var
	change_wrapRay,
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
	return {
		id :
			'net_link',
		attributes :
			{
				spaceRef :
					{
						comment :
							'reference to the current space',
						type :
							'fabric_spaceRef',
						defaultValue :
							'null'
					},
				user :
					{
						comment :
							'currently logged in user',
						type :
							'user_user',
						defaultValue :
							'null'
					},
				_cSpace :
					{
						comment :
							'the current space',
						type :
							'fabric_space',
						defaultValue :
							'null'
					},
				_outbox :
					{
						comment :
							'changes to be send to the server',
						type :
							'change_wrapRay',
						defaultValue :
							'null'
					},
				_postbox :
					{
						comment :
							'changes that are currently on the way',
						type :
							'change_wrapRay',
						defaultValue :
							'null'
					},
				_rSeq :
					{
						comment :
							'the remote sequence number',
						type :
							'integer',
						defaultValue :
							'null'
					},
				_rSpace :
					{
						comment :
							'the remote space',
							// what the client thinks the server thinks
						type :
							'fabric_space',
						defaultValue :
							'null'
					}
			}
	};
}


/*
| Checks with server if user creds are valid.
*/
net_link.prototype.auth =
	function(
		user
	)
{
	root.ajax.twig.command.request(
		request_auth.create( 'user', user ),
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
	if( reply.type === 'reply_error' )
	{
		root.onAuth( request, reply );

		return;
	}

	reply = reply_auth.createFromJSON( reply );

	root.onAuth( request, reply );
};


/*
| Tries to registers a new user.
*/
net_link.prototype.register =
	function(
		user,
		mail,
		news
	)
{
	root.ajax.twig.command.request(
		request_register.create(
			'user', user,
			'mail', mail,
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
		ok ? request.user : null,
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
			'user', this.user,
			'spaceRef', spaceRef
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
	shell_doTracker.flush( );

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

	root.create(
		'link',
			root.link.create(
				'spaceRef', request.spaceRef,
				'_cSpace', reply.space,
				'_rSpace', reply.space,
				'_outbox', change_wrapRay.create( ),
				'_postbox', change_wrapRay.create( ),
				'_rSeq', reply.seq
			)
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
			'spaceRef', this.spaceRef,
			'seq',
				this._rSeq !== null
				? this._rSeq
				: -1,
			'user', this.user
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
		outbox,
		postbox,
		report,
		seq,
		cSpace,
		rSpace;

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

	// if this wasn't an empty timeout
	// process the received changes

	// adapts all queued unsend changes (postbox)
	// and
	// rebuilds the clients understanding of its own tree

	cSpace =
	rSpace =
		root.link._rSpace;

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
				changeWrap.changeTree( rSpace );

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

		cSpace = postbox.changeTree( cSpace );

		// transforms the outbox by the foreign changes
		outbox = report.transform( outbox );

		cSpace = outbox.changeTree( cSpace );
	}

	root.create(
		'link',
			root.link.create(
				'_cSpace', cSpace,
				'_outbox', outbox,
				'_postbox', postbox,
				'_rSeq', reply.seq + changeWrapRay.length,
				'_rSpace', rSpace
			)
	);

	// FIXME simply have it set the space.
	if( report.length > 0 )
	{
		root.update( cSpace, report );
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
| Alters the tree.
*/
net_link.prototype.alter =
	function(
		changeWrap // the changeWrap to apply to tree
	)
{
	var
		tree;

/**/if( CHECK )
/**/{
/**/	if( root.link !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	tree = changeWrap.changeTree( root.link._cSpace );

	root.create(
		'link',
			root.link.create(
				'_cSpace', tree,
				'_outbox', root.link._outbox.append( changeWrap )
			)
	);

	root.link._sendChanges( );

	root.update( tree, changeWrap );
};


/*
| Sends the stored changes to server.
*/
net_link.prototype._sendChanges =
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

	root.ajax.twig.command.request(
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
