/*
| Constructor.
*/
server_root =
	function( )
	{
		// pass
	};


prototype = server_root.prototype;

/*
| create replacement until root is a JION
*/
prototype.create =
	function( )
{
	var
		a,
		arg,
		aZ,
		replace;

	replace = new server_root( );

	for( arg in this )
	{
		if( this.hasOwnProperty( arg ) )
		{
			replace[ arg ] = this[ arg ];
		}
	}

	for(
		a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		replace[ arguments[ a ] ] = arguments[ a + 1 ];
	}

	root = replace;

	return replace;
};



} )( );
