/*
| The interface that talks asynchronously with the server.
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
	Change,
	ChangeRay,
	config,
	Jools,
	MeshMashine,
	meshverse,
	Path,
	Sign,
	system;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
IFace =
	function( )
{
	// the current space;
	this.$cSpace =
		null;

	// the remote tree.
	// what the client thinks the server thinks.
	this.$rSpace =
		null;

	// the remote time sequence
	this.$remoteTime =
		null;

	// the current message sequence number
	this.$mseq =
		null;

	// changes to be send to the server
	this._$outbox =
		null;

	// changes that are currently on the way to the server
	this.$postbox =
		null;

	// current update request
	this._$updateAjax =
		null;
};


/*
| General purpose AJAX.
*/
IFace.prototype._ajax =
	function(
		request,
		callback
	)
{
	if( !request.cmd )
	{
		throw new Error( 'ajax request.cmd missing' );
	}


	var
		ajax =
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
		function( )
	{
		if( ajax.readyState !== 4 )
		{
			return;
		}

		if( ajax.status !== 200 )
		{
			Jools.log(
				'iface',
				request.cmd,
				'status: ',
				ajax.status
			);

			if( callback )
			{
				callback(
					{
						ok:
							false,
						message:
							'connection',
						status:
							ajax.status
					}
				);
			}

			return;
		}

		var asw;
		try
		{
			asw = JSON.parse( ajax.responseText );
		}
		catch( e )
		{
			if( callback )
			{
				callback(
					{
						ok      : false,
						message : 'nojson'
					}
				);
			}
		}

		Jools.log( 'iface', '<-', asw );

		if( !asw.ok )
		{
			Jools.log( 'iface', request.cmd, 'server not ok' );

			if( callback )
			{
				callback( asw, null );
			}

			return;
		}

		if( callback )
		{
			callback( asw );
		}
	};

	var
		rs =
			JSON.stringify( request );

	Jools.log(
		'iface',
		'->',
		rs
	);

	ajax.send( rs );
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
	this.$user =
		user;

	this.$passhash =
		passhash;
};


/*
| Authentication
*/
IFace.prototype.auth =
	function(
		user,
		passhash,
		callback
	)
{
	var self = this;

	if( self.$authActive )
	{
		throw new Error( 'Auth already active' );
	}

	self.$authActive = true;

	self._ajax(
		{
			cmd      : 'auth',
			user     : user,
			passhash : passhash
		},
		function( asw )
		{
			self.$authActive = false;

			if( asw.ok )
			{
				callback(
					{
						ok :
							true,
						user :
							asw.user,
						passhash :
							passhash
					}
				);
			}
			else
			{
				callback( asw );
			}
		}
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
		news,
		onRegisterReceiver
	)
{
	var
		self =
			this;

	if( self.$regActive )
	{
		throw new Error( 'Register already active' );
	}

	self.$regActive =
		true;

	self._ajax(
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
		function( asw )
		{
			self.$regActive =
				false;

			onRegisterReceiver.onRegister(
				user,
				passhash,
				asw
			);
		}
	);
};


/*
| Sends a message.
*/
IFace.prototype.sendMessage =
	function( message )
{
	var self = this;

	if( !Jools.isString( message ) )
	{
		throw new Error( 'message is no string' );
	}

	self._ajax(
		{
			cmd :
				'message',

			user :
				self.$user,

			passhash :
				self.$passhash,

			spaceUser :
				self.$spaceUser,

			spaceTag :
				self.$spaceTag,

			message :
				message
		},
		null
	);
};


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
	var self =
		this;

	// aborts the current running update.
	if( self._$updateAjax )
	{
		self._$updateAjax.$abort =
			true;

		self._$updateAjax.abort( );

		self._$updateAjax =
			null;
	}

	var
		ajax =
		self.$aquireAjax =
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
	function( )
	{
		var asw;

		if( ajax.readyState !== 4 ||
			self.$aquireAjax !== ajax
		)
		{
			return;
		}

		if( ajax.status !== 200 )
		{
			self.$aquireAjax =
				null;

			Jools.log(
				'iface',
				'aquireSpace.status == ' + ajax.status
			);

			system.asyncEvent(
				'onAquireSpace',
				Jools.immute(
					{
						status :
							'connection fail',

						message :
							'connection fail: ' +
								ajax.status
					}
				)
			);

			self._update( );

			return;
		}

		try
		{
			asw = JSON.parse( ajax.responseText );
		}
		catch( e )
		{
			self.$aquireAjax =
				null;

			throw new Error(
				'Server delivered no JSON.'
			);
		}

		Jools.log(
			'iface',
			'<-sg',
			asw
		);

		if( !asw.ok )
		{
			self.$aquireAjax =
				null;

			throw new Error(
				'Server not OK: ' + asw.message
			);
		}

		switch( asw.status )
		{
			case 'nonexistent' :
			case 'no access' :

				system.asyncEvent(
					'onAquireSpace',
					Jools.immute(
						{
							status :
								asw.status,

							spaceUser :
								spaceUser,

							spaceTag :
								spaceTag
						}
					)
				);

				self._update( );

				return;
		}

		if( asw.node.type !== 'Space' )
		{
			throw new Error(
				' aquireSpace(): server served no space '
			);
		}

		self.$cSpace =
		self.$rSpace =
			meshverse.grow( asw.node );

		self.$spaceUser =
			spaceUser;

		self.$spaceTag =
			spaceTag;

		self._$outbox =
			[ ];

		self.$postbox =
			[ ];

		self.$mseq =
			-1;

		self.$remoteTime =
			asw.time;

		self._$undo =
			[ ];

		self._$redo =
			[ ];

		system.asyncEvent(
			'onAquireSpace',
			Jools.immute(
				{
					status :
						asw.status,

					spaceUser :
						spaceUser,

					spaceTag :
						spaceTag,

					tree :
						self.$cSpace,

					access :
						asw.access
				}
			)
		);

		// waits a second before going into update cycle, so safari
		// stops its wheely thing.
		system.setTimer(
			1,
			function( )
			{
				if( self.$aquireAjax === ajax )
				{
					self._update( );
				}

				self.$aquireAjax =
					null;
			}
		);
	};

	var request =
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
				self.$passhash,

			time :
				-1,

			user :
				self.$user
		};

	Jools.log(
		'iface',
		'sg->',
		request
	);

	request = JSON.stringify( request );

	ajax.send( request );
};


/*
| Gets a tree.
*/
IFace.prototype.get =
	function(
		path,
		len
	)
{
	return this.$cSpace.getPath( path, len );
};


/*
| Sends an update request to the server and computes its answer.
*/
IFace.prototype._update =
	function( )
{
	var self = this;

	if( self._$updateAjax )
	{
		throw new Error( 'double update?' );
	}

	var ajax =
	self._$updateAjax =
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

	ajax.onreadystatechange = function( )
	{
		var a, aZ, asw, b, bZ, chgX;

		if( ajax.readyState !== 4 )
			{ return; }

		// ios bug?
		// hinders the onreadystatechange function to be
		// called multiple times
		ajax.onreadystatechange = null;

		// call was willingfull aborted
		if( ajax.$abort )
		{
			return;
		}

		self._$updateAjax = null;

		if( ajax.status !== 200 )
		{
			Jools.log(
				'iface',
				'update.status == ' + ajax.status
			);

			system.failScreen(
				'Connection with server failed.'
			);

			return;
		}

		try
		{
			asw = JSON.parse( ajax.responseText );
		}
		catch( e )
		{
			throw new Error(
				'Server answered no JSON!'
			);
		}

		Jools.log('iface', '<-u', asw);

		if( !asw.ok )
		{
			system.failScreen(
				'Server not OK: ' + asw.message
			);

			return;
		}

		var
			chgs =
				asw.chgs,

			report =
				new ChangeRay( ),

			gotOwnChgs =
				false,

			time =
				asw.time;

		// this wasn't an empty timeout?
		if( chgs && chgs.length > 0 )
		{
			var postbox =
				self.$postbox;

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

				var
					cid =
						chgs[ a ].cid;

				// changes the clients understanding of the server tree
				self.$rSpace =
					chgX.changeTree(
						self.$rSpace,
						meshverse
					).tree;

				if(
					postbox.length > 0
					&&
					postbox[ 0 ].cid === cid
				)
				{
					postbox.splice( 0, 1 );

					gotOwnChgs =
						true;

					continue;
				}

				// alters undo and redo queues.
				var
					tfxChgX,
					u,
					undo =
						self._$undo;

				for(
					b = 0, bZ = undo.length;
					b < bZ;
					b++
				)
				{
					u =
						undo[ b ];

					if( u.time < time + a )
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

								time :
									u.time
							} );
					}
				}

				var
					redo =
						self._$redo;

				for(
					b = 0, bZ = redo.length;
					b < bZ;
					b++
				)
				{
					u =
						redo[ b ];

					if( u.time < time + a )
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

								time :
									u.time
							} );
					}
				}

				report =
					report.append( chgX );
			}

			// adapts all queued changes
			// and rebuilds the clients understanding of its own tree
			var outbox =
				self._$outbox;

			var space =
				self.$rSpace;

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
					chgX.changeTree(
						space,
						meshverse
					).tree;
			}

			// transforms the outbox
			for(
				a = 0, aZ = outbox.length;
				a < aZ;
				a++
			)
			{
				var c =
					outbox[ a ];

				chgX =
					c.chgX;

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

							time :
								c.time
						}
					);

				space =
					chgX.changeTree(
						space,
						meshverse
					).tree;
			}

			self.$cSpace =
				space;
		}

		var msgs =
			asw.msgs;

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

		self.$remoteTime =
			asw.timeZ;

		var
			mseqZ =
				asw.mseqZ;

		if( Jools.is( mseqZ ) )
		{
			self.$mseq =
				mseqZ;
		}

		if( report.length > 0 )
		{
			system.asyncEvent(
				'update',
				self.$cSpace,
				report
			);
		}

		if( gotOwnChgs )
		{
			self._sendChanges( );
		}

		// issue the following update
		self._update( );
	};

	var request =
		{
			cmd :
				'update',

			passhash :
				self.$passhash,

			spaceUser :
				self.$spaceUser,

			spaceTag :
				self.$spaceTag,

			time :
				self.$remoteTime,

			mseq :
				self.$mseq,

			user :
				self.$user
		};

	Jools.log(
		'iface',
		'u->',
		request
	);

	request =
		JSON.stringify( request );

	ajax.send( request );
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
		result =
			new Change(
				new Sign( src ),
				new Sign( trg )
			).changeTree(
				this.$cSpace,
				meshverse
			);

	this.$cSpace =
		result.tree;

	var
		chgX =
			result.chgX,

		c =
			Jools.immute( {
				cid :
					Jools.uid( ),

				chgX :
					chgX,

				time :
					this.$remoteTime
			} );

	this._$outbox.push( c );

	this._$redo =
		[ ];

	var
		undo =
			this._$undo;

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
| Sends the stored changes to remote meshmashine
*/
IFace.prototype._sendChanges =
	function( )
{
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

	var ajax =
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
				asw =
					JSON.parse( ajax.responseText );
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

			time :
				this.$remoteTime,

			user :
				this.$user
		};

	Jools.log(
		'iface',
		'sc->',
		request
	);

	request =
		JSON.stringify( request );

	ajax.send( request );
};


/*
| Reverts actions from the undo chain.
*/
IFace.prototype.undo =
	function( )
{
	if( this._$undo.length === 0 )
	{
		return;
	}

	var
		chgX =
			this._$undo.pop( ).chgX.invert( ),

		result =
			chgX.changeTree(
				this.$cSpace,
				meshverse
			);

	if( result === null )
	{
		return;
	}

    this.$cSpace =
		result.tree;

	chgX =
		result.chgX;

	if( chgX === null )
	{
		return;
	}

	var c = Jools.immute(
		{
			cid :
				Jools.uid( ),

			chgX :
				chgX,

			time :
				this.$remoteTime
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
	if( this._$redo.length === 0 )
		{ return; }

	var
		chgX =
			this._$redo.pop( ).chgX.invert( ),

		result =
			chgX.changeTree(
				this.$cSpace,
				meshverse
			);

    this.$cSpace =
		result.tree;

	chgX =
		result.chgX;

	if( chgX === null )
	{
		return;
	}

	var c =
		Jools.immute(
			{
				cid :
					Jools.uid( ),

				chgX :
					chgX,

				time :
					this.$remoteTime
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