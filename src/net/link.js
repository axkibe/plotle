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
		name :
			'link',
		unit :
			'net',
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
							'Object',
						defaultValue :
							null
					},
				_postbox :
					{
						comment :
							'changes that are currently on the way',
						type :
							'Object',
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
							'Object',
						defaultValue :
							null
					},
				_redo :
					{
						comment :
							'the redo stack',
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
			'_outbox', // FIXME changeRay
				[ ],
			'_postbox', // FIXME changeRay
				[ ],
			'_rSeq',
				reply.seq,
			'_undo',
				[ ],
			'_redo',
				[ ]
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
		outbox,
		postbox,
		redo,
		report,
		seq,
		space,
		tfxChgX,
		u,
		undo;

	if( !reply.ok )
	{
		system.failScreen(
			'Server not OK: ' + reply.message
		);

		return;
	}

	chgs = reply.chgs;

	report = jion.changeRay.create( );

	gotOwnChgs = false;

	seq = reply.seq;

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
			chgX =
				jion.change.createFromJSON(
					chgs[ a ].chgX
				);

			cid = chgs[ a ].cid;

			// changes the clients understanding of the server tree
			this._rSpace = // XXX
				chgX
				.changeTree( this._rSpace )
				.tree;

			// if the cid is the one in the postbox the client
			// received the update of its own change.
			if(
				postbox.length > 0
				&&
				postbox[ 0 ].cid === cid
			)
			{
				postbox.splice( 0, 1 ); // XXX

				gotOwnChgs = true;

				continue;
			}

			// if this was not an own change,
			// undo and redo queues are adapted.
			undo = this._undo;

			for(
				b = 0, bZ = undo.length;
				b < bZ;
				b++
			)
			{
				u = undo[ b ];

				if( u.seq < seq + a )
				{
					tfxChgX = u.chgX.transformChangeX( chgX );

					// the change vanished by transformation
					if( tfxChgX === null )
					{
						undo.splice( b--, 1 ); // XXX

						bZ--;

						continue;
					}

					u =
					undo[ b ] =
						jion.changeWrap.create(
							'cid',
								u.cid,
							'chgX',
								tfxChgX,
							'seq',
								u.seq
						);
				}
			}

			redo = this._redo;

			for(
				b = 0, bZ = redo.length;
				b < bZ;
				b++
			)
			{
				u = redo[ b ];

				if( u.seq < seq + a )
				{
					tfxChgX = u.chgX.transformChangeX( chgX );

					// the change vanished by transformation
					if( tfxChgX === null )
					{
						redo.splice( b--, 1 ); // XXX

						bZ--;

						continue;
					}

					u =
					redo[ b ] =
						jion.changeWrap.create(
							'cid',
								u.cid,
							'chgX',
								u.chgX.transformChangeX( chgX ),
							'seq',
								u.seq
						);
				}
			}

			report = report.Append( chgX );
		}

		// adapts all queued changes
		// and rebuilds the clients understanding of its own tree
		outbox = this._outbox;

		space = this._rSpace;

		for(
			a = 0, aZ = postbox.length;
			a < aZ;
			a++
		)
		{
			chgX = postbox[ a ].chgX;

			for(
				b = 0, bZ = report.length;
				b < bZ;
				b++
			)
			{
				chgX =
					chgX.transformChangeX( report.get( b ) );
			}

			// FUTURE adapt changeTree so it
			//        optionally does not create result
			//        intermediary objects but returns
			//        the tree directly
			space =
				chgX
				.changeTree( space )
				.tree;
		}

		// transforms the outbox
		for(
			a = 0, aZ = outbox.length;
			a < aZ;
			a++
		)
		{
			c = outbox[ a ];

			chgX = c.chgX;

			for(
				b = 0, bZ = report.length;
				b < bZ;
				b++
			)
			{
				chgX =
					chgX.transformChangeX(
						report.get( b )
					);
			}

			c =
			outbox[ a ] =
				jion.changeWrap.create(
					'cid',
						c.cid,
					'chgX',
						chgX,
					'seq',
						c.seq
				);

			space =
				chgX
				.changeTree( space )
				.tree;
		}

		this._cSpace = space; // XXX
	}

	this._rSeq = reply.seqZ; // XXX

	if( report.length > 0 )
	{
		system.asyncEvent(
			'update',
			this._cSpace,
			report
		);
	}

	if( gotOwnChgs )
	{
		this._sendChanges( );
	}

	// issues the following update

	this._update( );
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
		result,
		undo;

	result = chg.changeTree( this._cSpace );

	this._cSpace = result.tree;

	chgX = result.chgX;

	c =
		jion.changeWrap.create(
			'cid',
				jools.uid( ),
			'chgX',
				chgX,
			'seq',
				this._rSeq
		);

	this._outbox.push( c ); // XXX

	this._redo = [ ]; // XXX

	undo = this._undo;

	undo.push( c ); // XXX

	if( undo.length > config.maxUndo )
	{
		undo.shift( );
	}

	this._sendChanges( );

	system.asyncEvent(
		'update',
		result.tree,
		chgX
	);

	return result;
};


/*
| Sends the stored changes to server.
*/
link.prototype._sendChanges =
	function( )
{
	// already sending?
	if( this._postbox.length > 0 )
	{
		return;
	}

	// nothing to send?
	if( this._outbox.length === 0 )
	{
		return;
	}

	var c = this._outbox[ 0 ];

	this._outbox.splice( 0, 1 ); // XXX

	this._postbox.push( c );

	root.ajax.twig.command.request(
		{
			cmd :
				'alter',
			spaceUser :
				this.spaceUser,
			spaceTag :
				this.spaceTag,
			chgX :
				c.chgX,
			cid :
				c.cid,
			passhash :
				this.passhash,
			seq :
				this._rSeq,
			user :
				this.username
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
		result;

	if( this._undo.length === 0 )
	{
		return;
	}

	chgX = this._undo.pop( ).chgX.Invert; // XXX

	result = chgX.changeTree( this._cSpace );

	if( result === null )
	{
		return;
	}

	this._cSpace = result.tree; // XXX

	chgX = result.chgX;

	if( chgX === null )
	{
		return;
	}

	c =
		jion.changeWrap.create(
			'cid',
				jools.uid( ),
			'chgX',
				chgX,
			'seq',
				this._rSeq
		);

	this._outbox.push( c ); // XXX

	this._redo.push( c ); //XXX

	this._sendChanges( );

	system.asyncEvent(
		'update',
		result.tree,
		chgX
	);

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
		result;

	if( this._redo.length === 0 )
	{
		return;
	}

	chgX = this._redo.pop( ).chgX.Invert; // XXX

	result = chgX.changeTree( this._cSpace );

	this._cSpace = result.tree; // XXX

	chgX = result.chgX;

	if( chgX === null )
	{
		return;
	}

	c =
		jion.changeWrap.create(
			'cid',
				jools.uid( ),
			'chgX',
				chgX,
			'seq',
				this._rSeq
		);

	this._outbox.push( c );

	this._undo.push( c );

	this._sendChanges( );

	system.asyncEvent(
		'update',
		this._cSpace,
		chgX
	);

	return chgX;
};


} )( );
