/*
| The link talks asynchronously with the server.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	net;

net = net || { };


/*
| Imports
*/
var
	ccot,
	jools,
	request,
	root,
	system,
	visual;


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
			'net.link',
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
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							null
					},
				spaceUser :
					{
						comment :
							'user of the current space',
						type :
							'String',
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
							'ccot.changeWrapRay',
						defaultValue :
							null
					},
				_postbox :
					{
						comment :
							'changes that are currently on the way',
						type :
							'ccot.changeWrapRay',
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

var link = net.link;


/*
| Checks with server if a username / passhash
| combo is valid.
*/
link.prototype.auth =
	function(
		username,
		passhash
	)
{
	root.ajax.twig.command.request(
		request.auth.create(
			'user', username,
			'passhash', passhash
		),
		'_onAuth'
	);
};


/*
| Received an auth reply.
*/
link.prototype._onAuth =
	function(
		request,
		reply
	)
{
	var
		ok;

	ok = reply.ok;

	root.onAuth(
		ok,
		ok ? reply.user : null,
		ok ? request.passhash : null,
		ok ? null : reply.message
	);
};


/*
| Tries to registers a new user.
*/
link.prototype.register =
	function(
		username,
		mail,
		passhash,
		news
	)
{
	root.ajax.twig.command.request(
		request.register.create(
			'user', username,
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
link.prototype._onRegister =
	function(
		request,
		reply
	)
{
	var
		ok;

	ok = reply.ok;

	root.onRegister(
		ok,
		ok ? request.user : null,
		ok ? request.passhash : null,
		ok ? null : reply.message
	);
};


/*
| Aquires a space from the server
| and starts receiving updates for it.
*/
link.prototype.acquireSpace =
	function(
		spaceRef,
		createMissing
	)
{
	// aborts the current running update.
	root.ajax.twig.update.abortAll( );

	root.ajax.twig.command.request(
		request.acquire.create(
			'createMissing', createMissing,
			'passhash', this.passhash,
			'space', spaceRef,
			'user', this.username
		),
		'_onAcquireSpace'
	);
};


/*
| A space has been acquired.
*/
link.prototype._onAcquireSpace =
	function(
		request,
		reply
	)
{
	var
		space;

	root.doTracker.flush( );

	if( !reply.ok )
	{
		root.onAcquireSpace( reply );

		this._update( );

		return;
	}

	switch( reply.status )
	{
		case 'nonexistent' :
		case 'no access' :

			root.onAcquireSpace(
				jools.immute(
					{
						status : reply.status,
						// FIXME give reference
						spaceUser : request.space.username,
						spaceTag : request.space.tag
					}
				)
			);

			this._update( );

			return;
	}

	if( reply.node.type !== 'visual.space' )
	{
		throw new Error(
			'acquireSpace(): server served no space '
		);
	}

	space = visual.space.createFromJSON( reply.node );

	root.link =
		root.link.create(
			// FIXME use spaceRef
			'spaceUser', request.space.username,
			'spaceTag', request.space.tag,
			'_cSpace', space,
			'_rSpace', space,
			'_outbox', ccot.changeWrapRay.create( ),
			'_postbox', ccot.changeWrapRay.create( ),
			'_rSeq', reply.seq
		);

	root.onAcquireSpace(
		jools.immute(
			{
				status : reply.status,
				// FIXME use spaceRef
				spaceUser : request.space.username,
				spaceTag : request.space.tag,
				space : space,
				access : reply.access
			}
		)
	);

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
link.prototype._update =
	function( )
{
	root.ajax.twig.update.request(
		request.update.create(
			'passhash', this.passhash,
			'spaceUser', this.spaceUser,
			'spaceTag', this.spaceTag,
			'seq',
				this._rSeq !== null
				? this._rSeq
				: -1,
			'user', this.username
		),
		'_onUpdate'
	);
};


/*
| Received an update.
*/
link.prototype._onUpdate =
	function(
		request,
		reply
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		c,
		chgX,
		chgs,
		cid,
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

	if( !reply.ok )
	{
		system.failScreen( reply.message );

		return;
	}

	chgs = reply.chgs;

	report = ccot.changeRay.create( );

	gotOwnChgs = false;

	seq = reply.seq;

	rSpace = link._rSpace;

	// if this wasn't an empty timeout
	// process the received changes

	if( chgs && chgs.length > 0 )
	{

		postbox = this._postbox;

		for(
			a = 0, aZ = chgs.length;
			a < aZ;
			a++
		)
		{
			chgX = ccot.change.createFromJSON( chgs[ a ].chgX );

			cid = chgs[ a ].cid;

			// changes the clients understanding of the server tree
			rSpace = chgX.changeTree( rSpace ).tree;

			// if the cid is the one in the postbox the client
			// received the update of its own change.
			if(
				postbox.length > 0
				&&
				postbox.get( 0 ).cid === cid
			)
			{
				postbox = postbox.remove( 0 );

				gotOwnChgs = true;

				continue;
			}

			report = report.append( chgX );
		}

		// adapts all queued changes
		// and
		// rebuilds the clients understanding of its own tree
		outbox = this._outbox;

		cSpace = rSpace;

		for(
			a = 0, aZ = postbox.length;
			a < aZ;
			a++
		)
		{
			chgX = postbox.get( a ).chgX;

			for(
				b = 0, bZ = report.length;
				b < bZ;
				b++
			)
			{
				chgX = chgX.transform( report.get( b ) );
			}

			// FUTURE adapt changeTree so it
			//        optionally does not create result
			//        intermediary objects but returns
			//        the tree directly
			cSpace = chgX.changeTree( cSpace ).tree;
		}

		// transforms the outbox
		for(
			a = 0, aZ = outbox.length;
			a < aZ;
			a++
		)
		{
			c = outbox.get( a );

			chgX = c.chgX;

			for(
				b = 0, bZ = report.length;
				b < bZ;
				b++
			)
			{
				chgX = chgX.transform( report.get( b ) );
			}

			outbox =
				outbox.set(
					a,
					c.create( 'chgX', chgX )
				);

			cSpace =
				chgX
				.changeTree( cSpace )
				.tree;
		}
	}

	link =
	root.link =
		link.create(
			'_cSpace', cSpace,
			'_outbox', outbox,
			'_postbox', postbox,
			'_rSeq', reply.seqZ,
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
link.prototype.alter =
	function(
		changes,  // the change(ray) to apply on the tree
		noTrack  // if true do not report the dotracker
		//       // ( for example this is an undo itself )
	)
{
	var
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

	result = changes.changeTree( link._cSpace );

	changes = result.chgX;

	changeWrap =
		ccot.changeWrap.create(
			'cid', jools.uid( ),
			'chgX', changes
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

	root.update( result.tree, changes );

	return result;
};


/*
| Sends the stored changes to server.
*/
link.prototype._sendChanges =
	function( )
{
	var
		changeWrap,
		changeWrapRay,
		link;

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

	// TODO fix
	changeWrap = link._outbox.get( 0 );

	// TODO remove this workaround
	changeWrapRay = ccot.changeWrapRay.create( );

	changeWrapRay = changeWrapRay.append( changeWrap );


	link =
	root.link =
		link.create(
			'_outbox',
//				ccot.changeWrapRay.create( ),
// TODO
				link._outbox.remove( 0 ),
			'_postbox',
//				link._outbox
// TODO
				changeWrapRay
		);

	root.ajax.twig.command.request(
		request.alter.create(
			'changeWrapRay', changeWrapRay,
			'passhash', link.passhash,
			'seq', link._rSeq,
			'spaceUser', link.spaceUser,
			'spaceTag', link.spaceTag,
			'user', link.username
		),
		'_onSendChanges'
	);
};


/*
| Received a reply of a sendChanges request.
*/
link.prototype._onSendChanges =
	function(
		request,
		reply
	)
{
	if( !reply.ok )
	{
		system.failScreen(
			'Server not OK: ' + reply.message
		);

		return;
	}
};


} )( );
