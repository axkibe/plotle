/*
| Capsule
|
| (to make jshint happy)
*/
( function( ) {
'use strict';


/*
| Sorts the mangle list
*/

var
	fs =
		require( 'fs' ),

	// mangle definitions:
	// a file that looks like this
	// ". value"  <-- this will be mangled
	// "> value"  <-- this will not be mangled
	mangleDefs =
		(
			fs.readFileSync(
				'./mangle.txt'
			) + ''
		).split( '\n' );

// cuts away empty lines
while( mangleDefs.indexOf( '' ) >= 0 )
{
	mangleDefs.splice( mangleDefs.indexOf( '' ), 1 );
}

mangleDefs.sort(
	function( a, b )
	{
		a =
			a.substring( 2 );

		b =
			b.substring( 2 );

		if( a === b )
		{
			return 0;
		}

		if( a < b )
		{
			return -1;
		}

		return 1;
	}
);

fs.writeFileSync(
	'mangle.txt',
	mangleDefs.join( '\n' )
);

} )( );
