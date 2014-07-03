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
	Path,
	shell;


/*
| Capsule
*/
(function( ) {
'use strict';

Peer = { };


/*
| authenticates a user or visitor.
|
| FIXME remove
*/
Peer.auth =
	function(
		user,
		passhash
	)
{
	if(
		user === 'visitor' &&
		passhash === null
	)
	{
		passhash = Jools.uid( );
	}

	shell.iface.auth(
		user,
		passhash
	);
};


/*
| Gets a tree.
*/
Peer.get =
	function(
		path, // path to tree
		len
	)
{
	return shell.iface.get(
		path.chop( 1 ) ,
		len
	);
};


/*
| Creates a new note.
*/
Peer.newNote =
	function(
		spaceUser,
		spaceTag,
		zone
	)
{
	return (
		shell.iface.alter(
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
					Path
					.empty
					.append( 'twig' )
					.append( '$new' ),
				rank :
					0
			}
		)
	);
};


/*
| Creates a new portal.
*/
Peer.newPortal =
	function(
		spaceUser,      // the space the portal is to be created in
		spaceTag,       // the space the portal is to be created in
		zone,           // the zone of the potal
		destSpaceUser,  // the user of the space the portal leads to
		destSpaceTag    // the tag of the space the portal leads to
	)
{
	return (
		shell.iface.alter(
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
					Path
					.empty
					.append( 'twig' )
					.append( '$new' ),
				rank :
					0
			}
		)
	);
};


/*
| Sets the zone for item.
*/
Peer.setZone =
	function(
		itemPath,
		zone
	)
{
	return (
		shell.iface.alter(
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
Peer.setFontSize =
	function(
		itemPath,
		fontsize
	)
{
	return (
		shell.iface.alter(
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
Peer.setPNW =
	function(
		itemPath,
		pnw
	)
{
	return (
		shell.iface.alter(
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
Peer.newLabel =
	function(
		spaceUser,
		spaceTag,
		pnw,
		text,
		fontsize
	)
{
	return (
		shell.iface.alter(
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
					Path
					.empty
					.append( 'twig' )
					.append( '$new' ),
				rank :
					0
			}
		)
	);
};


/*
| Creates a new relation.
*/
Peer.newRelation =
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
		shell.iface.alter(
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
					Path
					.empty
					.append( 'twig' )
					.append( '$new' ),
				rank :
					0
			}
		)
	);
};


/*
| Moves an item's z-index up to top.
*/
Peer.moveToTop =
	function(
		path
	)
{
	shell.iface.alter(
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
Peer.insertText =
	function(
		path,
		offset,
		text
	)
{
	return (
		shell.iface.alter(
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
Peer.removeText =
	function(
		path,
		at1,
		len
	)
{
	if( len === 0 )
	{
		return null;
	}

	if( len < 0 )
	{
		throw new Error( 'malformed removeText' );
	}

	return (
		shell.iface.alter(
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
Peer.removeRange =
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
		Peer.removeText(
			path1,
			at1,
			at2 - at1
		);

		return;
	}

	k1 = path1.get( -2 );

	k2 = path2.get( -2 );

	pivot = shell.iface.get( path1.chop( 1 ).shorten( 3 ) );

	r1 = pivot.rankOf( k1 );

	r2 = pivot.rankOf( k2 );

	for(
		r = r1;
		r < r2 - 1;
		r++
	)
	{
		Peer.join(
			path1,
			shell.iface.get( path1.chop( 1 ) ).length
		);
	}

	len2 = shell.iface.get( path1.chop( 1 ) ).length;

	Peer.join(
		path1,
		len2
	);

	if( len2 - at1 + at2 === 0 )
	{
		return;
	}

	Peer.removeText(
		path1,
		at1,
		len2 - at1 + at2
	);
};


/*
| Splits a text node.
*/
Peer.split =
	function(
		path,
		offset
	)
{
	return (
		shell.iface.alter(
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
Peer.join =
	function(
		path,
		at1
	)
{
	return (
		shell.iface.alter(
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
Peer.removeItem =
	function(
		path
	)
{
	var
		key,
		pivot,
		r1;

	key = path.get( -1 );

	pivot =
		shell.iface.get(
			path.chop( 1 ).shorten( 2 )
		);

	r1 = pivot.rankOf( key );

	return (
		shell.iface.alter(
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
