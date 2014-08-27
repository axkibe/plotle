/*
| A peer to a repository.
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
	jion,
	jools,
	root,
	visual;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	change,
	newItemSign,
	sign,
	spliceSign;


change = jion.change;

sign = jion.sign;

// sign for a new item
newItemSign =
	sign.create(
		'path',
			jion.path.empty
			.append( 'twig' )
			.append( '$new' ),
		'rank',
			0
	);

// sign for split/join
spliceSign =
	sign.create(
		'proc',
			'splice'
	);

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
		passhash = jools.uid( );
	}

	root.link.auth(
		user,
		passhash
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
	var
		src;

	src =
		sign.create(
			'val',
				visual.note.create(
					'fontsize',
						13,
					'zone',
						zone,
					'doc',
						visual.doc.create(
							'twig:add',
							'1',
							visual.para.create(
								'text',
									''
							)
						)
				),
			'rank',
				null
		);

	return (
		root.link.alter(
			change.create(
				'src',
					src,
				'trg',
					newItemSign
			)
		)
	);
};


/*
| Creates a new portal.
*/
Peer.newPortal =
	function(
						// TODO remove
		spaceUser,      // the space the portal is to be created in
						// TODO remove
		spaceTag,       // the space the portal is to be created in
		zone,           // the zone of the potal
		destSpaceUser,  // the user of the space the portal leads to
		destSpaceTag    // the tag of the space the portal leads to
	)
{
	var
		src;

	src =
		sign.create(
			'val',
				visual.portal.create(
					'zone',
						zone,
					'spaceUser',
						destSpaceUser,
					'spaceTag',
						destSpaceTag
				),
			'rank',
				null
		);

	return (
		root.link.alter(
			change.create(
				'src',
					src,
				'trg',
					newItemSign
			)
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
		root.link.alter(
			change.create(
				'src',
					sign.create(
						'val',
							zone
					),
				'trg',
					sign.create(
						'path',
							itemPath
							.Chop( )
							.append( 'zone' )
					)
			)
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
		root.link.alter(
			change.create(
				'src',
					sign.create(
						'val',
							fontsize
					),
				'trg',
					sign.create(
						'path',
							itemPath
							.Chop( )
							.append( 'fontsize' )
					)
			)
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
		root.link.alter(
			change.create(
				'src',
					sign.create(
						'val',
							pnw
					),
				'trg',
					sign.create(
						'path',
							itemPath
							.Chop( )
							.append( 'pnw' )
					)
			)
		)
	);
};


/*
| Creates a new label.
*/
Peer.newLabel =
	function(
		spaceUser,  // TODO remove
		spaceTag,   // TODO remove
		pnw,
		text,
		fontsize
	)
{
	var
		src;

	src =
		sign.create(
			'val',
				visual.label.create(
					'fontsize',
						fontsize,
					'pnw',
						pnw,
					'doc',
						visual.doc.create(
							'twig:add',
							'1',
							visual.para.create(
								'text',
									text
							)
						)
				),
			'rank',
				null
		);

	return (
		root.link.alter(
			change.create(
				'src',
					src,
				'trg',
					newItemSign
			)
		)
	);
};


/*
| Creates a new relation.
*/
Peer.newRelation =
	function(
		spaceUser,  // TODO remove
		spaceTag,   // TODO remove
		pnw,
		text,
		fontsize,
		item1key,
		item2key
	)
{
	var
		src;

	src =
		sign.create(
			'val',
				visual.relation.create(
					'item1key',
						item1key,
					'item2key',
						item2key,
					'pnw',
						pnw,
					'fontsize',
						fontsize,
					'doc',
						visual.doc.create(
							'twig:add',
							'1',
							visual.para.create(
								'text',
									text
							)
						)
				),
			'rank',
				null
		);

	return (
		root.link.alter(
			change.create(
				'src',
					src,
				'trg',
					newItemSign
			)
		)
	);
};


/*
| Moves an item's z-index up to top.
*/
/*
Peer.moveToTop =
	function(
		path
	)
{
	root.link.alter(
		{
			path :
				path.Chop( )
		},
		{
			rank :
				0
		}
	);
};
*/


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
		root.link.alter(
			change.create(
				'src',
					sign.create(
						'val',
							text
					),
				'trg',
					sign.create(
						'path',
							path.Chop( 1 ),
						'at1',
							offset
					)
			)
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
		root.link.alter(
			change.create(
				'src',
					sign.create(
						'path',
							path.Chop( 1 ),
						'at1',
							at1,
						'at2',
							at1 + len
					),
				'trg',
					sign.create(
						'val',
							null
					)
			)
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

	pivot = root.space.getPath( path1.Chop( 1 ).Shorten( 3 ) );

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
			root.space.getPath( path1.Chop( 1 ) ).length
		);
	}

	len2 = root.space.getPath( path1.Chop( 1 ) ).length;

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
		root.link.alter(
			change.create(
				'src',
					sign.create(
						'path',
							path.Chop( 1 ),
						'at1',
							offset
					),
				'trg',
					spliceSign
			)
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
		root.link.alter(
			change.create(
				'src',
					spliceSign,
				'trg',
					sign.create(
						'path',
							path.Chop( 1 ),
						'at1',
							at1
					)
			)
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

	pivot = root.space.getPath( path.Chop( 1 ).Shorten( 2 ) );

	/*pivot =
		root.link.get(
			path.Chop( 1 ).Shorten( 2 )
		);
	*/

	r1 = pivot.rankOf( key );

	return (
		root.link.alter(
			change.create(
				'src',
					sign.create(
						'val',
							null,
						'rank',
							r1
					),
				'trg',
					sign.create(
						'path',
							path.Chop( 1 ),
						'rank',
							null
					)
			)
		)
	);
};


} )( );
