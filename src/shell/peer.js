/*
| A peer to a meshcraft repository.
| Utilizes its own meshmashine.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Peer;


/*
| Imports
*/
var
	Jools,
	Path;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| Constructor
*/
Peer =
	function(
		iface
	)
{
	this._iface =
		iface;

	this._$visitUser =
		null;

	this._$visitPasshash =
		null;
};


/*
| Sets the current user.
*/
Peer.prototype.setUser =
	function(
		user,
		passhash
	)
{
	this._iface.setUser(
		user,
		passhash
	);
};


/*
| Logs out a registered users.
| Switches to visitor.
*/
Peer.prototype.logout =
	function(
		callback
	)
{
	if( this._$visitUser )
	{
		callback(
			{
				ok :
					true,
				user :
					this._$visitUser,
				passhash :
					this._$visitPasshash
			}
		);
	}
	else
	{
		this.auth(
			'visitor',
			null,
			this,
			callback,
			'logout'
		);
	}
};


/*
| Authentication completed of a visitor user on log out.
*/
Peer.prototype.onAuth =
	function(
		user,
		passhash,
		asw,
		callback,
		op
	)
{
	if( op !== 'logout' )
	{
		throw new Error(
			'onAuth unexpected operation: ' + op
		);
	}

	callback( asw );
};


/*
| authenticates a user or visitor.
*/
Peer.prototype.auth =
	function(
		user,
		passhash,
		onAuthReceiver,
		a1,
		a2
	)
{
	var self =
		this;

	if(
		user === 'visitor' &&
		passhash === null
	)
	{
		passhash = Jools.uid( );
	}

	self._iface.auth(
		user,
		passhash,
		function( asw )
		{
			if( asw.ok && user.substring( 0, 5 ) === 'visit' )
			{
				self._$visitUser =
					asw.user;

				self._$visitPasshash =
					asw.passhash;
			}

			onAuthReceiver.onAuth(
				user,
				passhash,
				asw,
				a1,
				a2
			);
		}
	);
};


/*
| sends a message.
*/
Peer.prototype.sendMessage =
	function( message )
{
	this._iface.sendMessage( message );
};


/*
| Registers a new user.
*/
Peer.prototype.register =
	function(
		user,
		mail,
		passhash,
		newsletter,
		onRegisterReceiver
	)
{
	this._iface.register(
		user,
		mail,
		passhash,
		newsletter,
		onRegisterReceiver
	);
};


/*
| Aquires a space.
*/
Peer.prototype.aquireSpace =
	function(
		spaceUser,
		spaceTag,
		create
	)
{
	this._iface.aquireSpace(
		spaceUser,
		spaceTag,
		create
	);
};


/*
| Gets a tree.
*/
Peer.prototype.get =
	function(
		path, // path to tree
		len
	)
{
	return this._iface.get(
		path.chop( 1 ) ,
		len
	);
};


/*
| Creates a new note.
*/
Peer.prototype.newNote =
	function(
		spaceUser,
		spaceTag,
		zone
	)
{
	return (
		this._iface.alter(
			{
				val :
				{
					type :
						'Note',
					fontsize :
						13,
					zone :
						zone,
					doc  :
					{
						type :
							'Doc',
						twig :
							{
								'1' :
								{
									type :
										'Para',
									text :
										''
								}
							},
						ranks :
							[ '1' ]
					}
				},
				rank :
					null
			},
			{
				path :
					Path.empty.append( '$new' ),
				rank :
					0
			}
		)
	);
};


/*
| creates a new portal.
*/
Peer.prototype.newPortal =
	function(
		spaceUser,  // the space the portal is to be created in
		spaceTag,   // the space the portal is to be created in
		zone,       // the zone of the potal
		destSpaceUser,  // the user of the space the portal leads to
		destSpaceTag    // the tag of the space the portal leads to
	)
{
	return (
		this._iface.alter(
			{
				val :
				{
					type :
						'Portal',
					zone :
						zone,
					spaceUser :
						destSpaceUser,
					spaceTag :
						destSpaceTag
				},
				rank :
					null
			},
			{
				path :
					Path.empty.append( '$new' ),
				rank :
					0
			}
		)
	);
};


/*
| Sets the zone for item.
*/
Peer.prototype.setZone =
	function(
		itemPath,
		zone
	)
{
	return (
		this._iface.alter(
			{
				val :
					zone
			},
			{
				path :
					itemPath.chop( ).append( 'zone' )
			}
		)
	);
};


/*
| Sets an items fontsize.
*/
Peer.prototype.setFontSize =
	function(
		itemPath,
		fontsize
	)
{
	return (
		this._iface.alter(
			{
				val :
					fontsize
			},
			{
				path :
					itemPath.chop( ).append( 'fontsize' )
			}
		)
	);
};


/*
| Sets an items pnw (point in north-west)
*/
Peer.prototype.setPNW =
	function(
		itemPath,
		pnw
	)
{
	return (
		this._iface.alter(
			{
				val :
					pnw
			},
			{
				path :
					itemPath.chop( ).append( 'pnw' )
			}
		)
	);
};


/*
| Creates a new label.
*/
Peer.prototype.newLabel =
	function(
		spaceUser,
		spaceTag,
		pnw,
		text,
		fontsize
	)
{
	return (
		this._iface.alter(
			{
				val :
				{
					type :
						'Label',
					fontsize :
						fontsize,
					pnw :
						pnw,
					doc :
					{
						type :
							'Doc',
						twig :
						{
							'1' :
							{
								type :
									'Para',
								text :
									text
							}
						},
						ranks : [
							'1'
						]
					}
				},

				rank :
					null
			},
			{
				path :
					Path.empty.append( '$new' ),
				rank :
					0
			}
		)
	);
};


/*
| Undoes a change.
*/
Peer.prototype.undo =
	function( )
{
	this._iface.undo( );
};


/*
| Redoes a change.
*/
Peer.prototype.redo =
	function( )
{
	this._iface.redo( );
};


/*
| Creates a new relation.
*/
Peer.prototype.newRelation =
	function(
		spaceUser,
		spaceTag,
		pnw,
		text,
		fontsize,
		item1key,
		item2key
	)
{
	return (
		this._iface.alter(
			{
				val :
				{
					type :
						'Relation',
					item1key :
						item1key,
					item2key :
						item2key,
					pnw :
						pnw,
					fontsize :
						fontsize,
					doc :
					{
						type :
							'Doc',
						twig :
						{
							'1' :
							{
								type :
									'Para',
								text :
									text
							}
						},
						ranks :
							[ '1' ]
					}
				},
				rank :
					null
			},
			{
				path :
					Path.empty.append( '$new' ),
				rank :
					0
			}
		)
	);
};


/*
| moves an item's z-index up to top.
*/
Peer.prototype.moveToTop =
	function(
		path
	)
{
	this._iface.alter(
		{
			path :
				path.chop( )
		},
		{
			rank :
				0
		}
	);
};


/*
| Inserts some text.
*/
Peer.prototype.insertText =
	function(
		path,
		offset,
		text
	)
{
	return (
		this._iface.alter(
			{
				val :
					text
			},
			{
				path :
					path.chop( 1 ),
				at1 :
					offset
			}
		)
	);
};


/*
| Removes some text within one node.
*/
Peer.prototype.removeText =
	function(
		path,
		at1,
		len
	)
{
	if( len === 0 )
	{
		return;
	}

	if( len < 0 )
	{
		throw new Error(
			'malformed removeText'
		);
	}

	return (
		this._iface.alter(
			{
				path :
					path.chop( 1 ),
				at1 :
					at1,
				at2 :
					at1 + len
			},
			{
				val :
					null
			}
		)
	);
};


/*
| Removes a text spawning over several entities.
*/
Peer.prototype.removeRange =
	function(
		path1,
		at1,
		path2,
		at2
	)
{
	var
		k1,
		k2,
		len2,
		pivot,
		r,
		r1,
		r2;

/**/if( CHECK )
/**/{
/**/	if(
/**/		path1.get( -1 ) !== 'text'
/**/		||
/**/		path2.get( -1 ) !== 'text'
/**/	)
/**/	{
/**/		throw new Error( 'invalid path' );
/**/	}
/**/}

	if ( path1.equals( path2 ) )
	{
		return (
			this.removeText(
				path1,
				at1,
				at2 - at1
			).tree
		);
	}

	k1 =
		path1.get( -2 );

	k2 =
		path2.get( -2 );

	pivot =
		this._iface.get( path1.chop( 1 ).shorten( 3 ) );

	r1 =
		pivot.rankOf( k1 );

	r2 =
		pivot.rankOf( k2 );

	for(
		r = r1;
		r < r2 - 1;
		r++
	)
	{
		this.join(
			path1,
			this._iface.get( path1.chop( 1 ) ).length
		);
	}

	len2 =
		this._iface.get( path1.chop( 1 ) ).length;

	this.join(
		path1,
		len2
	);

	return (
		this.removeText(
			path1,
			at1,
			len2 - at1 + at2
		).tree
	);
};


/*
| Splits a text node.
*/
Peer.prototype.split =
	function(
		path,
		offset
	)
{
	return (
		this._iface.alter(
			{
				path :
					path.chop( 1 ),
				at1 :
					offset
			},
			{
				proc :
					'splice'
			}
		)
	);
};


/*
| Joins a text node with its next one.
*/
Peer.prototype.join =
	function(
		path,
		at1
	)
{
	return (
		this._iface.alter(
			{
				proc :
					'splice'
			},
			{
				path :
					path.chop( 1 ),
				at1 :
					at1
			}
		)
	);
};


/*
| Removes an item.
*/
Peer.prototype.removeItem =
	function(
		path
	)
{
	var
		key =
			path.get( -1 ),

		pivot =
			this._iface.get(
				path.chop( 1 ),
				-1
			),

		r1 =
			pivot.rankOf( key );

	return (
		this._iface.alter(
			{
				val :
					null,
				rank :
					r1
			},
			{
				path :
					path.chop( 1 ),
				rank :
					null
			}
		)
	);
};


} )( );
