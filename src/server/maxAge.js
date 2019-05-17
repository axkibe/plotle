/*
| Maps a maxage setting to a cache control.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


/*
| cache control mappings for max age
*/
const mapping =
	Object.freeze( {
		none : 'no-cache',
		short : 'max-age=' + ( 60 * 60 ),
		long : 'max-age=' + ( 60 * 60 * 24 * 365 )
	} );


/*
| Maps a maxage setting to a cache control.
*/
def.static.map =
	function(
		desc
	)
{
	const cc = mapping[ desc ];

	if( !cc ) throw new Error( 'invalid max-age mapping' );

	return cc;
};


} );

