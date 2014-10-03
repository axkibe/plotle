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
	config,
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
				path :
					{
						comment :
							'the path of the link',
						type :
							'jion.path',
						defaultValue :
							null
					},
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
							'jion.changeWrapRay',
						defaultValue :
							null
					},
				_postbox :
					{
						comment :
							'changes that are currently on the way',
						type :
							'jion.changeWrapRay',
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
					},
				_undo :
					{
						comment :
							'the undo stack',
						type :
							'jion.changeWrapRay',
						defaultValue :
							null
					},
				_redo :
					{
						comment :
							'the redo stack',
						type :
							'jion.changeWrapRay',
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
			cmd :
				'auth',
			user :
				username,
			passhash :
				passhash
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

	system.asyncEvent(
		'onAuth',
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
			cmd :
				'register',
			user :
				username,
			mail :
				mail,
			passhash :
				passhash,
			news  :
				news
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

	system.asyncEvent(
		'onRegister',
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
			cmd :
				'get',
			create :
				create,
			spaceUser :
				spaceUser,
			spaceTag :
				spaceTag,
			path :
				jion.path.empty,
			passhash :
				this.passhash,
			seq :
				-1,
			user :
				this.username
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

	if( !reply.ok )
	{
		system.asyncEvent(
			'onAquireSpace',
			reply
		);

		this._update( );

		return;
	}

	switch( reply.status )
	{
		case 'nonexistent' :
		case 'no access' :

			system.asyncEvent(
				'onAquireSpace',
				jools.immute(
					{
						status :
							reply.status,
						spaceUser :
							request.spaceUser,
						spaceTag :
							request.spaceTag
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
			'spaceUser',
				request.spaceUser,
			'spaceTag',
				request.spaceTag,
			'_cSpace',
				space,
			'_rSpace',
				space,
			'_outbox',
				jion.changeWrapRay.create( ),
			'_postbox',
				jion.changeWrapRay.create( ),
			'_rSeq',
				reply.seq,
			'_undo',
				jion.changeWrapRay.create( ),
			'_redo',
				jion.changeWrapRay.create( )
		);

	system.asyncEvent(
		'onAquireSpace',
		jools.immute(
			{
				status :
					reply.status,
				spaceUser :
					request.spaceUser,
				spaceTag :
					request.spaceTag,
				space :
					space,
				access :
					reply.access
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
			cmd :
				'update',
			passhash :
				this.passhash,
			spaceUser :
				this.spaceUser,
			spaceTag :
				this.spaceTag,
			seq :
				this._rSeq,
			user :
				this.username
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
		redo,
		report,
		seq,
		cSpace,
		rSpace,
		tfxChgX,
		u,
		undo;

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

	report = jion.changeRay.create( );

	gotOwnChgs = false;

	seq = reply.seq;

	undo = link._undo;

	redo = link._redo;

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
			chgX = jion.change.createFromJSON( chgs[ a ].chgX );

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

			// if this was not an own change,
			// undo and redo queues are adapted.

			for(
				b = 0, bZ = undo.length;
				b < bZ;
				b++
			)
			{
				u = undo.get( b );

				if( u.seq < seq + a )
				{
					tfxChgX = u.chgX.transformChangeX( chgX );

					// the change vanished by transformation
					if( tfxChgX === null )
					{
						undo = undo.remove( b-- );

						bZ--;

						continue;
					}

					undo =
						undo.set(
							b,
							jion.changeWrap.create(
								'cid',
									u.cid,
								'chgX',
									tfxChgX,
								'seq',
									u.seq
							)
						);
				}
			}

			for(
				b = 0, bZ = redo.length;
				b < bZ;
				b++
			)
			{
				u = redo.get( b );

				if( u.seq < seq + a )
				{
					tfxChgX = u.chgX.transformChangeX( chgX );

					// the change vanished by transformation
					if( tfxChgX === null )
					{
						redo = redo.remove( b-- );

						bZ--;

						continue;
					}

					redo.set(
						b,
						jion.changeWrap.create(
							'cid',
								u.cid,
							'chgX',
								u.chgX.transformChangeX( chgX ),
							'seq',
								u.seq
						)
					);
				}
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
					jion.changeWrap.create(
						'cid',
							c.cid,
						'chgX',
							chgX,
						'seq',
							c.seq
					)
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
			'_cSpace',
				cSpace,
			'_outbox',
				outbox,
			'_postbox',
				postbox,
			'_redo',
				redo,
			'_rSeq',
				reply.seqZ,
			'_rSpace',
				rSpace,
			'_undo',
				undo
		);


	if( report.length > 0 )
	{
		system.asyncEvent(
			'update',
			cSpace,
			report
		);
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
		chg
	)
{
	var
		c,
		chgX,
		link,
		result,
		undo;

	link = this;

/**/if( CHECK )
/**/{
/**/	if( root.link !== link )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	result = chg.changeTree( link._cSpace );

	chgX = result.chgX;

	c =
		jion.changeWrap.create(
			'cid',
				jools.uid( ),
			'chgX',
				chgX,
			'seq',
				link._rSeq
		);

	undo = link._undo;

	undo = undo.append( c );

	if( undo.length > config.maxUndo )
	{
		undo = undo.remove( 0 );
	}

	link =
	root.link =
		link.create(
			'_cSpace',
				result.tree,
			'_undo',
				undo,
			'_outbox',
				root.link._outbox.append( c ),
			'_redo',
				jion.changeWrapRay.create( )
		);

	link._sendChanges( );

	system.asyncEvent( 'update', result.tree, chgX );

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
				link._outbox.remove( 0 ),
			'_postbox',
				link._postbox.append( c )
		);

	root.ajax.twig.command.request(
		{
			cmd :
				'alter',
			spaceUser :
				link.spaceUser,
			spaceTag :
				link.spaceTag,
			chgX :
				c.chgX,
			cid :
				c.cid,
			passhash :
				link.passhash,
			seq :
				link._rSeq,
			user :
				link.username
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


/*
| Reverts actions from the undo chain.
*/
link.prototype.undo =
	function( )
{
	var
		c,
		chgX,
		link,
		result,
		undo;

	link = this;

/**/if( CHECK )
/**/{
/**/	if( root.link !== link )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	undo = link._undo;

	if( undo.length === 0 )
	{
		return;
	}

	chgX = undo.get( undo.length - 1 ).chgX.invert;

	undo = undo.remove( undo.length - 1 );

	result = chgX.changeTree( link._cSpace );

	if( result === null )
	{
		root.link =
			root.link.create(
				'_undo',
					undo
			);

		return;
	}

	chgX = result.chgX;

	if( chgX === null )
	{
		root.link =
			root.link.create(
				'_cSpace',
					result.tree,
				'_undo',
					undo
			);

		return;
	}

	c =
		jion.changeWrap.create(
			'cid',
				jools.uid( ),
			'chgX',
				chgX,
			'seq',
				link._rSeq
		);

	link =
	root.link =
		root.link.create(
			'_cSpace',
				result.tree,
			'_outbox',
				link._outbox.append( c ),
			'_redo',
				link._redo.append( c ),
			'_undo',
				undo
		);

	link._sendChanges( );

	system.asyncEvent( 'update', result.tree, chgX );

	return chgX;
};


/*
| Sends the stored changes to remote meshmashine
*/
link.prototype.redo =
	function( )
{
	var
		c,
		chgX,
		link,
		redo,
		result;

	link = this;

/**/if( CHECK )
/**/{
/**/	if( root.link !== link )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	redo = link._redo;

	if( redo.length === 0 )
	{
		return;
	}

	chgX = redo.get( redo.length - 1 ).chgX.invert;

	result = chgX.changeTree( link._cSpace );

	redo = redo.remove( redo.length - 1 );

	if( result === null )
	{
		root.link =
			root.link.create(
				'_redo',
					redo
			);

		return;
	}

	chgX = result.chgX;

	if( chgX === null )
	{
		root.link =
			root.link.create(
				'_cSpace',
					result.tree,
				'_redo',
					redo
			);

		return;
	}

	c =
		jion.changeWrap.create(
			'cid',
				jools.uid( ),
			'chgX',
				chgX,
			'seq',
				link._rSeq
		);

	link =
	root.link =
		root.link.create(
			'_cSpace',
				result.tree,
			'_outbox',
				link._outbox.append( c ),
			'_redo',
				redo,
			'_undo',
				link._undo.append(c)
		);

	link._sendChanges( );

	system.asyncEvent(
		'update',
		result.tree,
		chgX
	);

	return chgX;
};


} )( );
