/*
| Maps a maxage setting to a cache control.
*/


var
	server_maxAge;

/*
| Capsule
*/
( function( ) {
'use strict';


server_maxAge =
module.exports =
	{ };


var
	_mapping;

/*
| cache control mappings for max age
*/
_mapping =
	{
		none : 'no-cache',
		short : 'max-age=' + ( 60 * 60 ),
		long : 'max-age=' + ( 60 * 60 * 24 * 365 )
	};


/**/if( FREEZE )
/**/{
/**/	Object.freeze( _mapping );
/**/}

/*
| Maps a maxage setting to a cache control.
*/
server_maxAge.map =
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



} )( );
