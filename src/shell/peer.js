/*
| A peer to a repository.
*/


var
	ccot_change,
	ccot_sign,
	jion_path,
	peer,
	root,
	visual;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	alter,
	newItemSign,
	spliceSign;


/*
| sign for a new item
*/
newItemSign =
	ccot_sign.create(
		'path',
			jion_path.empty
			.append( 'twig' )
			.append( '$new' ),
		'rank',
			0
	);

/*
| sign for split/join.
*/
spliceSign = ccot_sign.create( 'proc', 'splice' );

peer = { };


/*
| Alters the tree.
|
| Feeds the dochains.
*/
alter =
	function(
		src,
		trg
	)
{
	return(
		root.link.alter(
			ccot_change.create(
				'src', src,
				'trg', trg
			)
		)
	);
};


/*
| Creates a new note.
*/
peer.newNote =
	function(
		zone
	)
{
	var
		src;

	src =
		ccot_sign.create(
			'val',
				visual.note.create(
					'fontsize', 13,
					'zone', zone,
					'doc',
						visual.doc.create(
							'twig:add',
							'1',
							visual.para.create(
								'text', ''
							)
						)
				),
			'rank',
				null
		);

	return alter( src, newItemSign );
};


/*
| Creates a new portal.
*/
peer.newPortal =
	function(
		zone,           // the zone of the potal
		destSpaceUser,  // the user of the space the portal leads to
		destSpaceTag    // the tag of the space the portal leads to
	)
{
	var
		src;

	src =
		ccot_sign.create(
			'val',
				visual.portal.create(
					'zone', zone,
					'spaceUser', destSpaceUser,
					'spaceTag', destSpaceTag
				),
			'rank',
				null
		);

	return alter( src, newItemSign );
};


/*
| Sets the zone for item.
*/
peer.setZone =
	function(
		itemPath,
		zone
	)
{
	return(
		alter(
			ccot_sign.create( 'val', zone ),
			ccot_sign.create( 'path', itemPath.chop( ).append( 'zone' ) )
		)
	);
};


/*
| Sets an items fontsize.
*/
peer.setFontSize =
	function(
		itemPath,
		fontsize
	)
{
	return(
		alter(
			ccot_sign.create( 'val', fontsize ),
			ccot_sign.create( 'path', itemPath.chop( ).append( 'fontsize' ) )
		)
	);
};


/*
| Sets an items pnw (point in north-west)
*/
peer.setPNW =
	function(
		itemPath,
		pnw
	)
{
	return(
		alter(
			ccot_sign.create( 'val', pnw ),
			ccot_sign.create( 'path', itemPath.chop( ).append( 'pnw' ) )
		)
	);
};


/*
| Creates a new label.
*/
peer.newLabel =
	function(
		pnw,
		text,
		fontsize
	)
{
	var
		src;

	src =
		ccot_sign.create(
			'val',
				visual.label.create(
					'fontsize', fontsize,
					'pnw', pnw,
					'doc',
						visual.doc.create(
							'twig:add',
							'1',
							visual.para.create( 'text', text )
						)
				),
			'rank',
				null
		);

	return alter( src, newItemSign );
};


/*
| Creates a new relation.
*/
peer.newRelation =
	function(
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
		ccot_sign.create(
			'val',
				visual.relation.create(
					'item1key', item1key,
					'item2key', item2key,
					'pnw', pnw,
					'fontsize', fontsize,
					'doc',
						visual.doc.create(
							'twig:add',
							'1',
							visual.para.create( 'text', text )
						)
				),
			'rank',
				null
		);

	return alter( src, newItemSign );
};


/*
| Moves an item's z-index up to top.
*/
/*
peer.moveToTop =
	function(
		path
	)
{
	return(
		alter(
			ccot_sign.create( 'path', path.chop( )),
			ccot_sign.create( 'rank', 0 )
		)
	);
};
*/


/*
| Inserts some text.
*/
peer.insertText =
	function(
		path,
		offset,
		text
	)
{
	return(
		alter(
			ccot_sign.create( 'val', text ),
			ccot_sign.create(
				'path', path.chop( 1 ),
				'at1', offset
			)
		)
	);
};


/*
| Removes some text within one node.
*/
peer.removeText =
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

	return(
		alter(
			ccot_sign.create(
				'path', path.chop( 1 ),
				'at1', at1,
				'at2', at1 + len
			),
			ccot_sign.create( )
		)
	);
};


/*
| Removes a text spawning over several entities.
*/
peer.removeRange =
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
		peer.removeText(
			path1,
			at1,
			at2 - at1
		);

		return;
	}

	k1 = path1.get( -2 );

	k2 = path2.get( -2 );

	pivot = root.space.getPath( path1.chop( 1 ).shorten( 3 ) );

	r1 = pivot.rankOf( k1 );

	r2 = pivot.rankOf( k2 );

	for(
		r = r1;
		r < r2 - 1;
		r++
	)
	{
		peer.join(
			path1,
			root.space.getPath( path1.chop( 1 ) ).length
		);
	}

	len2 = root.space.getPath( path1.chop( 1 ) ).length;

	peer.join(
		path1,
		len2
	);

	if( len2 - at1 + at2 === 0 )
	{
		return;
	}

	peer.removeText(
		path1,
		at1,
		len2 - at1 + at2
	);
};


/*
| Splits a text node.
*/
peer.split =
	function(
		path,
		offset
	)
{
	return(
		alter(
			ccot_sign.create(
				'path', path.chop( 1 ),
				'at1', offset
			),
			spliceSign
		)
	);
};


/*
| Joins a text node with its next one.
*/
peer.join =
	function(
		path,
		at1
	)
{
	return(
		alter(
			spliceSign,
			ccot_sign.create(
				'path', path.chop( 1 ),
				'at1', at1
			)
		)
	);
};


/*
| Removes an item.
*/
peer.removeItem =
	function(
		path
	)
{
	var
		key,
		pivot,
		r1;

	key = path.get( -1 );

	pivot = root.space.getPath( path.chop( 1 ).shorten( 2 ) );

	r1 = pivot.rankOf( key );

	return(
		alter(
			ccot_sign.create(
				'val', null,
				'rank', r1
			),
			ccot_sign.create(
				'path', path.chop( 1 ),
				'rank', null
			)
		)
	);
};


} )( );
