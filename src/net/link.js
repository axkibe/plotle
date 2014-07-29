/*
| The link talks asynchronously with the server.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Net;

Net = Net || { };

/*
| Imports
*/
var
	config,
	Jion,
	Jools,
	MeshMashine,
	shell,
	system,
	Visual;


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
			'Link',
		unit :
			'Net',
		attributes :
			{
				path :
					{
						comment :
							'the path of the link',
						type :
							'Path',
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

var Link = Net.Link;


/*
| Checks with server if a username / passhash
| combo is valid.
*/
Link.prototype.auth =
	function(
		username,
		passhash
	)
{
	shell.ajax.twig.command.request(
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
Link.prototype._onAuth =
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
Link.prototype.register =
	function(
		username,
		mail,
		passhash,
		news
	)
{
	shell.ajax.twig.command.request(
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
Link.prototype._onRegister =
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
Link.prototype.aquireSpace =
	function(
		spaceUser,
		spaceTag,
		create
	)
{
	// aborts the current running update.
	shell.ajax.twig.update.abortAll( );

	shell.ajax.twig.command.request(
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
				Jion.Path.empty,
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
Link.prototype._onAquireSpace =
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
				Jools.immute(
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

	if( reply.node.type !== 'Space' )
	{
		throw new Error(
			'aquireSpace(): server served no space '
		);
	}

	space = Visual.Space.CreateFromJSON( reply.node );

	shell.link =
		shell.link.Create(
			'spaceUser',
				request.spaceUser,
			'spaceTag',
				request.spaceTag,
			'_cSpace',
				space,
			'_rSpace',
				space,
			'_outbox', // FIXME ChangeRay
				[ ],
			'_postbox', // FIXME ChangeRay
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
		Jools.immute(
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
			shell.link._update( );
		}
	);
};



/*
| Sends an update request to the server and computes its answer.
*/
Link.prototype._update =
	function( )
{
	shell.ajax.twig.update.request(
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
Link.prototype._onUpdate =
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

	report = Jion.ChangeRay.Create( );

	gotOwnChgs = false;

	seq = reply.seq;

	// was this an not a timeout and thus empty?
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
				Jion.Change.CreateFromJSON(
					chgs[ a ].chgX
				);

			cid = chgs[ a ].cid;

			// changes the clients understanding of the server tree
			this._rSpace = // XXX
				chgX
				.changeTree( this._rSpace)
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
					tfxChgX =
						MeshMashine.tfxChgX(
							u.chgX,
							chgX
						);

					// the change vanished by transformation
					if( tfxChgX === null )
					{
						undo.splice( b--, 1 ); // XXX

						bZ--;

						continue;
					}

					u =
					undo[ b ] =
						Jools.immute( {
							cid :
								u.cid,
							chgX :
								tfxChgX,
							seq :
								u.seq
						} );
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
					tfxChgX =
						MeshMashine.tfxChgX(
							u.chgX,
							chgX
						);

					// the change vanished by transformation
					if( tfxChgX === null )
					{
						redo.splice( b--, 1 ); // XXX

						bZ--;

						continue;
					}

					u =
					redo[ b ] =
						Jools.immute( {
							cid :
								u.cid,
							chgX :
								MeshMashine.tfxChgX(
									u.chgX,
									chgX
								),
							seq :
								u.seq
						} );
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
					MeshMashine.tfxChgX(
						chgX,
						report.get( b )
					);
			}

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
					MeshMashine.tfxChgX(
						chgX,
						report.get( b )
					);
			}

			c =
			outbox[ a ] =
				Jools.immute(
					{
						cid :
							c.cid,
						chgX :
							chgX,
						seq :
							c.seq
					}
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
|
| FIXME why doesnt this get a change?
*/
Link.prototype.alter =
	function(
		src,
		trg
	)
{
	var
		c,
		chgX,
		result,
		undo;

	result =
		Jion.Change.Create( // FIXME CreateFromJSON
			'src',
				Jion.Sign.CreateFromJSON( src ),
			'trg',
				Jion.Sign.CreateFromJSON( trg )
		).changeTree(
			this._cSpace
		);

	this._cSpace = result.tree;

	chgX = result.chgX,

	c =
		Jools.immute( {
			cid :
				Jools.uid( ),
			chgX :
				chgX,
			seq :
				this._rSeq
		} );

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
| Sends the stored changes to remote meshmashine.
*/
Link.prototype._sendChanges =
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

	shell.ajax.twig.command.request(
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
Link.prototype._onSendChanges =
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
Link.prototype.undo =
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
		Jools.immute(
			{
				cid :
					Jools.uid( ),
				chgX :
					chgX,
				seq :
					this._rSeq
			}
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
Link.prototype.redo =
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
		Jools.immute(
			{
				cid :
					Jools.uid( ),
				chgX :
					chgX,
				seq :
					this._rSeq
			}
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
