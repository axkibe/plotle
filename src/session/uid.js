/*
| Unique identifier.
*/
'use strict';


tim.define( module, ( def ) => {


const mime = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';


/*
| Returns an unique identifier.
*/
def.static.newUid =
	function( )
{
	const ua = [ ];

	for( let a = 0; a < 3; a++ )
	{
		let r32 = Math.floor( 0x100000000 * Math.random( ) );

		for( let b = 0; b < 6; b++ )
		{
			ua.push( mime[ r32 & 0x3F ] );

			r32 = r32 >>> 6;
		}
	}

	return ua.join( '' );
};


} );

