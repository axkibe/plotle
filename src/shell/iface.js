/*
| The interface that talks asynchronously with the server.
|
| TODO all asw -> reply
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	IFace;


/*
| Imports
*/
var
	catcher,
	Change,
	ChangeRay,
	config,
	Jools,
	MeshMashine,
	Path,
	shell,
	Sign,
	system,
	Visual;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	_ifaceCatcher;

/*
| Creates a catcher that calls an iface function.
*/
_ifaceCatcher =
	function(
		funcName // name of the function to call
	)
{
	return (
		function( )
		{
			var iface = shell.iface;

			catcher( iface[ funcName ].apply( this, arguments ) );
		}
	);
};


/*
| FIXME move back into the object and make it a joobj.
*/
var
	_ajax;

_ajax =
	{
		request :
			null,
		update :
			null
	};

/*
| Constructor.
*/
IFace =
	function( )
{
	// the current space;
	this.$cSpace = null;

	// the remote tree.
	// what the client thinks the server thinks.
	this.$rSpace = null;

	// the remote sequence number
	this.$remoteSeq = null;

	// the current message sequence number
	this.$mseq = null;

	// changes to be send to the server
	this._$outbox = null;

	// changes that are currently on the way to the server
	this.$postbox = null;
};


/*
| Issues a general purpose AJAX request.
*/
IFace.prototype._request =
	function(
		request,
		receiver
	)
{
	var
		ajax,
		cmd,
		rs;

	cmd = request.cmd;

/**/if( CHECK )
/**/{
/**/	if( !cmd )
/**/	{
/**/		throw new Error( 'ajax request.cmd missing' );
/**/	}
/**/}

	if( _ajax.request )
	{
		console.log( 'already a request active' );

		return false;
	}

	ajax =
	_ajax.request =
		new XMLHttpRequest( );

	ajax.request = request;

	ajax.receiver = receiver;

	ajax.open(
		'POST',
		'/mm',
		true
	);

	ajax.setRequestHeader(
		'Content-type',
		'application/x-www-form-urlencoded'
	);

	ajax.onreadystatechange =
		_ifaceCatcher( '_onReply' );

	rs = JSON.stringify( request );

	Jools.log(
		'iface',
		'->',
		rs
	);

	ajax.send( rs );
};


/*
| A request has been replied.
|
| 'this' is the ajax request.
*/
IFace.prototype._onReply =
	function( )
{
	var
		request,
		reply,
		receiver;

	if(
		this.readyState !== 4
		||
		this.aborted
	)
	{
		return;
	}

	_ajax.request = null;

	this.onreadystatechange = null;

	receiver = this.receiver;

	request = this.request;

	if( this.status !== 200 )
	{
		Jools.log(
			'iface',
			request.cmd,
			'status: ',
			this.status
		);

		if( receiver )
		{
			shell.iface[ receiver ](
				this.request,
				{
					ok:
						false,
					message:
						'connection',
					status:
						this.status
				}
			);
		}

		return;
	}

	try
	{
		reply = JSON.parse( this.responseText );
	}
	catch( e )
	{
		throw new Error(
			'Server answered no JSON!'
		);
	}

	Jools.log( 'iface', '<-', reply );

	if( !reply.ok )
	{
		Jools.log( 'iface', request.cmd, 'server not ok' );
	}

	if( receiver )
	{
		shell.iface[ receiver ]( this.request, reply );
	}
};


/*
| Sets the current user
*/
IFace.prototype.setUser =
	function(
		user,
		passhash
	)
{
	this.$user = user;

	this.$passhash = passhash;
};


/*
| Authentication
*/
IFace.prototype.auth =
	function(
		username,
		passhash
	)
{
	this._request(
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
IFace.prototype._onAuth =
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
| Registers a user.
*/
IFace.prototype.register =
	function(
		user,
		mail,
		passhash,
		news
	)
{
	this._request(
		{
			cmd :
				'register',
			user :
				user,
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
IFace.prototype._onRegister =
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
| Sends a message.
*/
/*
IFace.prototype.sendMessage =
	function(
		message
	)
{
	if( !Jools.isString( message ) )
	{
		throw new Error( 'message is no string' );
	}

	this._request(
		{
			cmd :
				'message',
			user :
				this.$user,
			passhash :
				this.$passhash,
			spaceUser :
				this.$spaceUser,
			spaceTag :
				this.$spaceTag,
			message :
				message
		},
		null
	);
};
*/


/*
| Aquires a space.
*/
IFace.prototype.aquireSpace =
	function(
		spaceUser,
		spaceTag,
		create
	)
{
	// aborts the current running update.
	if( _ajax.update )
	{
		_ajax.update.aborted = true;

		_ajax.update.abort( );

		_ajax.update = null;
	}


	this._request(
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
				Path.empty,
			passhash :
				this.$passhash,
			seq :
				-1,
			user :
				this.$user
		},
		'_onAquireSpace'
	);
};


IFace.prototype._onAquireSpace =
	function(
		request,
		reply
	)
{
	var
		iface;

	iface = shell.iface;

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
			' aquireSpace(): server served no space '
		);
	}

	this.$cSpace =
	this.$rSpace =
		Visual.Space.CreateFromJSON( reply.node );

	this.$spaceUser = request.spaceUser;

	this.$spaceTag = request.spaceTag;

	this._$outbox = [ ];

	this.$postbox = [ ];

	this.$mseq = -1;

	this.$remoteSeq = reply.seq;

	this._$undo = [ ];

	this._$redo = [ ];

	// FIXME check if $cSpace is a space

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
					this.$cSpace,
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
			shell.iface._update( );
		}
	);
};


/*
| Gets a tree.
*/
IFace.prototype.get =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length > 1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.$cSpace.getPath( path );
};


/*
| Sends an update request to the server and computes its answer.
*/
IFace.prototype._update =
	function( )
{
	var
		ajax,
		request;

	if( _ajax.update )
	{
		throw new Error( 'double update' );
	}

	ajax =
	_ajax.update =
		new XMLHttpRequest( );

	ajax.open(
		'POST',
		'/mm',
		true
	);

	ajax.setRequestHeader(
		'Content-type',
		'application/x-www-form-urlencoded'
	);

	ajax.onreadystatechange =
		_ifaceCatcher( '_onUpdate' );

	request =
		{
			cmd :
				'update',
			passhash :
				this.$passhash,
			spaceUser :
				this.$spaceUser,
			spaceTag :
				this.$spaceTag,
			seq :
				this.$remoteSeq,
			mseq :
				this.$mseq,
			user :
				this.$user
		};

	Jools.log(
		'iface',
		'u->',
		request
	);

	request = JSON.stringify( request );

	ajax.send( request );
};


/*
| Called by network on an update.
|
| 'this' is the ajax request.
*/
IFace.prototype._onUpdate =
	function( )
{
	var
		a,
		aZ,
		asw,
		b,
		bZ,
		c,
		chgX,
		chgs,
		cid,
		iface,
		gotOwnChgs,
		msgs,
		mseqZ,
		outbox,
		postbox,
		redo,
		report,
		seq,
		space,
		tfxChgX,
		u,
		undo;

/**/if( CHECK )
/**/{
/**/	if( this !== _ajax.update )
/**/	{
/**/		throw new Error( 'invalid ajax call in onUpdate' );
/**/	}
/**/}

	iface = shell.iface;

	if(
		this.readyState !== 4
		||
		this.aborted
	)
	{
		return;
	}

	// ios bug?
	// hinders the onreadystatechange function to be
	// called multiple times
	this.onreadystatechange = null;

	_ajax.update = null;

	if( this.status !== 200 )
	{
		Jools.log(
			'iface',
			'update.status == ' + this.status
		);

		system.failScreen(
			'Connection with server failed.'
		);

		return;
	}

	try
	{
		asw = JSON.parse( this.responseText );
	}
	catch( e )
	{
		throw new Error(
			'Server answered no JSON!'
		);
	}

	Jools.log( 'iface', '<-u', asw );

	if( !asw.ok )
	{
		system.failScreen(
			'Server not OK: ' + asw.message
		);

		return;
	}

	chgs = asw.chgs;

	report = new ChangeRay( );

	gotOwnChgs = false;

	seq = asw.seq;

	// this wasn't an empty timeout?
	if( chgs && chgs.length > 0 )
	{
		postbox = iface.$postbox;

		for(
			a = 0, aZ = chgs.length;
			a < aZ;
			a++
		)
		{
			chgX =
				new Change(
					chgs[ a ].chgX.src,
					chgs[ a ].chgX.trg
				);

			cid = chgs[ a ].cid;

			// changes the clients understanding of the server tree
			iface.$rSpace =
				chgX
				.changeTree( iface.$rSpace)
				.tree;

			if(
				postbox.length > 0
				&&
				postbox[ 0 ].cid === cid
			)
			{
				postbox.splice( 0, 1 );

				gotOwnChgs = true;

				continue;
			}

			// alters undo and redo queues.
			undo = iface._$undo;

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
						undo.splice( b--, 1 );
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

			redo = iface._$redo;

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
						undo.splice( b--, 1 );
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

			report = report.append( chgX );
		}

		// adapts all queued changes
		// and rebuilds the clients understanding of its own tree
		outbox = iface._$outbox;

		space = iface.$rSpace;

		for(
			a = 0, aZ = postbox.length;
			a < aZ;
			a++
		)
		{
			chgX =
				postbox[ a ].chgX;

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

		iface.$cSpace = space;
	}

	msgs = asw.msgs;

	if( msgs )
	{
		for( a = 0, aZ = msgs.length; a < aZ; a++ )
		{
			system.asyncEvent(
				'message',
				msgs[ a ]
			);
		}
	}

	iface.$remoteSeq = asw.seqZ;

	mseqZ = asw.mseqZ;

	if( Jools.is( mseqZ ) )
	{
		iface.$mseq = mseqZ;
	}

	if( report.length > 0 )
	{
		system.asyncEvent(
			'update',
			iface.$cSpace,
			report
		);
	}

	if( gotOwnChgs )
	{
		iface._sendChanges( );
	}

	// issues the following update
	iface._update( );
};


/*
| Alters the tree
|
| FIXME why doesnt this get a change?
*/
IFace.prototype.alter =
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
		new Change(
			new Sign( src ),
			new Sign( trg )
		).changeTree(
			this.$cSpace
		);

	this.$cSpace = result.tree;

	chgX = result.chgX,

	c =
		Jools.immute( {
			cid :
				Jools.uid( ),
			chgX :
				chgX,
			seq :
				this.$remoteSeq
		} );

	this._$outbox.push( c );

	this._$redo = [ ];

	undo = this._$undo;

	undo.push( c );

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
IFace.prototype._sendChanges =
	function( )
{
	var
		ajax;

	// already sending?
	if( this.$postbox.length > 0 )
	{
		return;
	}

	// nothing to send?
	if( this._$outbox.length === 0 )
	{
		return;
	}

	ajax = new XMLHttpRequest( );

	ajax.open(
		'POST',
		'/mm',
		true
	);

	ajax.setRequestHeader(
		'Content-type',
		'application/x-www-form-urlencoded'
	);

	ajax.onreadystatechange =
		function( )
		{
			var asw;

			if( ajax.readyState !== 4 )
			{
				return;
			}

			if( ajax.status !== 200 )
			{
				system.failScreen(
					'Cannot send changes, error code ' + ajax.status
				);

				return;
			}

			try
			{
				asw = JSON.parse( ajax.responseText );
			}
			catch( e )
			{
				system.failScreen(
					'Server answered no JSON!'
				);

				return;
			}

			Jools.log(
				'iface',
				'<-sc',
				asw
			);

			if( !asw.ok )
			{
				system.failScreen(
					'Server not OK: ' + asw.message
				);

				return;
			}
		};

	var c = this._$outbox[0];

	this._$outbox.splice(0, 1);

	this.$postbox.push(c);

	var request =
		{
			cmd :
				'alter',
			spaceUser :
				this.$spaceUser,
			spaceTag :
				this.$spaceTag,
			chgX :
				c.chgX,
			cid :
				c.cid,
			passhash :
				this.$passhash,
			seq :
				this.$remoteSeq,
			user :
				this.$user
		};

	Jools.log(
		'iface',
		'sc->',
		request
	);

	request = JSON.stringify( request );

	ajax.send( request );
};


/*
| Reverts actions from the undo chain.
*/
IFace.prototype.undo =
	function( )
{
	var
		c,
		chgX,
		result;

	if( this._$undo.length === 0 )
	{
		return;
	}

	chgX =
		this._$undo.pop( ).chgX.invert( ),

	result =
		chgX
		.changeTree( this.$cSpace );

	if( result === null )
	{
		return;
	}

	this.$cSpace = result.tree;

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
					this.$remoteSeq
			}
		);

	this._$outbox.push( c );

	this._$redo.push( c );

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
IFace.prototype.redo =
	function( )
{
	var
		c,
		chgX,
		result;

	if( this._$redo.length === 0 )
	{
		return;
	}

	chgX = this._$redo.pop( ).chgX.invert( ),

	result =
		chgX
		.changeTree( this.$cSpace );

	this.$cSpace =
		result.tree;

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
					this.$remoteSeq
			}
		);

	this._$outbox.push( c );

	this._$undo.push( c );

	this._sendChanges( );

	system.asyncEvent(
		'update',
		this.$cSpace,
		chgX
	);

	return chgX;
};


} )( );
