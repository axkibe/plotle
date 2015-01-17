/*
| Routines to alter the data tree.
*/


var
	change_join,
	shell_alter;

/*
| Capsule
*/
(function( ) {
'use strict';


var
	alter;


shell_alter = { };


/*
| Creates a new note.
*/
shell_alter.newNote =
	function(
		// zone
	)
{
	throw new Error( );
	/*
	var
		src;

	src =
		ccot_sign.create(
			'val',
				fabric_note.create(
					'fontsize', 13,
					'zone', zone,
					'doc',
						fabric_doc.create(
							'twig:add', '1',
							fabric_para.create( 'text', '' )
						)
				),
			'rank',
				null
		);

	return alter( src, newItemSign );
	*/
};


/*
| Creates a new portal.
*/
shell_alter.newPortal =
	function(
		// zone,           // the zone of the potal
		// destSpaceUser,  // the user of the space the portal leads to
		// destSpaceTag    // the tag of the space the portal leads to
	)
{
	throw new Error( );

	/*
	var
		src;

	src =
		ccot_sign.create(
			'val',
				fabric_portal.create(
					'zone', zone,
					'spaceUser', destSpaceUser,
					'spaceTag', destSpaceTag
				),
			'rank',
				null
		);

	return alter( src, newItemSign );
	*/
};


/*
| Sets the zone for item.
*/
shell_alter.setZone =
	function(
		// itemPath,
		// zone
	)
{
	throw new Error( );

	/*
	return(
		alter(
			ccot_sign.create( 'val', zone ),
			ccot_sign.create( 'path', itemPath.chop( ).append( 'zone' ) )
		)
	);
	*/
};


/*
| Sets an items fontsize.
*/
shell_alter.setFontSize =
	function(
		// itemPath,
		// fontsize
	)
{
	throw new Error( );

	/*
	return(
		alter(
			ccot_sign.create( 'val', fontsize ),
			ccot_sign.create( 'path', itemPath.chop( ).append( 'fontsize' ) )
		)
	);
	*/
};


/*
| Sets an items pnw (point in north-west)
*/
shell_alter.setPNW =
	function(
		// itemPath,
		// pnw
	)
{
	throw new Error( );

	/*
	return(
		alter(
			ccot_sign.create( 'val', pnw ),
			ccot_sign.create( 'path', itemPath.chop( ).append( 'pnw' ) )
		)
	);
	*/
};


/*
| Creates a new relation.
*/
shell_alter.newRelation =
	function(
		// pnw,
		// text,
		// fontsize,
		// item1key,
		// item2key
	)
{
	throw new Error( );

	/*
	var
		src;

	src =
		ccot_sign.create(
			'val',
				fabric_relation.create(
					'item1key', item1key,
					'item2key', item2key,
					'pnw', pnw,
					'fontsize', fontsize,
					'doc',
						fabric_doc.create(
							'twig:add',
							'1',
							fabric_para.create( 'text', text )
						)
				),
			'rank',
				null
		);

	return alter( src, newItemSign );
	*/
};


/*
| Moves an item's z-index up to top.
*/
/*
shell_alter.moveToTop =
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
| Removes a text spawning over several entities.
*/
shell_alter.removeRange =
	function(
		// path1,
		// at1,
		// path2,
		// at2
	)
{
	throw new Error( );

	/*
	var
		k1,
		k2,
		len2,
		pivot,
		r,
		r1,
		r2;

**if( CHECK )
**{
**	if(
**		path1.get( -1 ) !== 'text'
**		||
**		path2.get( -1 ) !== 'text'
**	)
**	{
**		throw new Error( 'invalid path' );
**	}
**}

	if ( path1.equals( path2 ) )
	{
		shell_alter.removeText(
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
		shell_alter.join(
			path1,
			root.space.getPath( path1.chop( 1 ) ).length
		);
	}

	len2 = root.space.getPath( path1.chop( 1 ) ).length;

	shell_alter.join( path1, len2 );

	if( len2 - at1 + at2 === 0 )
	{
		return;
	}

	shell_alter.removeText( path1, at1, len2 - at1 + at2 );
	*/
};


/*
| Joins a text node with its next one.
*/
shell_alter.join =
	function(
		path,
		path2,
		at1
	)
{
	return(
		alter(
			change_join.create(
				'path', path.chop( 1 ),
				'path2', path2.chop( 1 ),
				'at1', at1
			)
		)
	);
};


} )( );
