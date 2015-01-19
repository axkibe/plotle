/*
| Routines to alter the data tree.
*/


var
	shell_alter;

/*
| Capsule
*/
(function( ) {
'use strict';


shell_alter = { };


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


} )( );
