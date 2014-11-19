/*
| Maps a maxage setting to a cache control.
|
| FIXME capital MaxAge
*/


/*
| Capsule
*/
( function( ) {
'use strict';


var
	MaxAge =
		{ },

	/*
	| cache control mappings for max age
	*/
	_mapping =
		{
			none :
				'no-cache',
			short :
				'max-age=' + ( 60 * 60 ),
			long :
				'max-age=' + ( 60 * 60 * 24 * 365 )
		};


/*
| Maps a maxage setting to a cache control.
*/
MaxAge.map =
	function(
		desc
	)
{
	var
		cc;

	cc = _mapping[ desc ];

	if( !cc )
	{
		throw new Error( 'invalid max-age mapping' );
	}

	return cc;
};


/*
| Node export.
*/
module.exports = MaxAge;


} )( );
