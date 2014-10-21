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
	jion,
	jools,
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
		{
			cmd : 'auth',
			user : username,
			passhash : passhash
		},
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
		{
			cmd : 'register',
			user : username,
			mail : mail,
			passhash : passhash,
			news  : news
		},
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
link.prototype.aquireSpace =
	function(
		spaceUser,
		spaceTag,
		create
	)
{
	// aborts the current running update.
	root.ajax.twig.update.abortAll( );

	root.ajax.twig.command.request(
		{
			cmd : 'get',
			create : create,
			spaceUser : spaceUser,
			spaceTag : spaceTag,
			path : jion.path.empty,
			passhash : this.passhash,
			seq : -1,
			user : this.username
		},
		'_onAquireSpace'
	);
};


/*
| A space has been aquired.
*/
link.prototype._onAquireSpace =
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
		root.onAquireSpace( reply );

		this._update( );

		return;
	}

	switch( reply.status )
	{
		case 'nonexistent' :
		case 'no access' :

			root.onAquireSpace(
				jools.immute(
					{
						status : reply.status,
						spaceUser : request.spaceUser,
						spaceTag : request.spaceTag
					}
				)
			);

			this._update( );

			return;
	}

	if( reply.node.type !== 'visual.space' )
	{
		throw new Error(
			'aquireSpace(): server served no space '
		);
	}

	space = visual.space.createFromJSON( reply.node );

	root.link =
		root.link.create(
			'spaceUser', request.spaceUser,
			'spaceTag', request.spaceTag,
			'_cSpace', space,
			'_rSpace', space,
			'_outbox', ccot.changeWrapRay.create( ),
			'_postbox', ccot.changeWrapRay.create( ),
			'_rSeq', reply.seq
		);

	root.onAquireSpace(
		jools.immute(
			{
				status : reply.status,
				spaceUser : request.spaceUser,
				spaceTag : request.spaceTag,
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
		{
			cmd : 'update',
			passhash : this.passhash,
			spaceUser : this.spaceUser,
			spaceTag : this.spaceTag,
			seq : this._rSeq,
			user : this.username
		},
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
				chgX = chgX.transformChangeX( report.get( b ) );
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
				chgX = chgX.transformChangeX( report.get( b ) );
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
		change,  // the change to apply on the tree
		noTrack  // if true do not report the dotracker
		//       // ( for example this is an undo itself )
	)
{
	var
		changeWrap,
		chgX,
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

	result = change.changeTree( link._cSpace );

	chgX = result.chgX;

	changeWrap =
		ccot.changeWrap.create(
			'cid', jools.uid( ),
			'chgX', chgX,
			'seq', link._rSeq // XXX
		);

	link =
	root.link =
		link.create(
			'_cSpace',
				result.tree,
			'_outbox',
				root.link._outbox.append( changeWrap )
		);

	if( !noTrack )
	{
		root.doTracker.track( changeWrap );
	}

	link._sendChanges( );

	root.update( result.tree, chgX );

	return result;
};


/*
| Sends the stored changes to server.
*/
link.prototype._sendChanges =
	function( )
{
	var
		c,
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

	c = link._outbox.get( 0 );

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
				link._postbox.append( c )
		);

	root.ajax.twig.command.request(
		{
			cmd : 'alter',
			spaceUser : link.spaceUser,
			spaceTag : link.spaceTag,
			chgX : c.chgX,
			cid : c.cid,
			passhash : link.passhash,
			seq : link._rSeq,
			user : link.username
		},
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
