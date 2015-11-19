/*
| Creates font objects by size and code.
*/


var
	gruga_fonts,
	shell_fontPool;


/*
| Capsule
*/
(function() {
'use strict';


var
	pool;

pool = { };


/*
| Constructor.
*/
shell_fontPool = { };


/*
| Gets a fontstlye by size and its code
*/
shell_fontPool.get =
	function(
		size,
		code
	)
{
	var
		af,
		c,
		f;

	c = pool[ code ];

	if( c )
	{
		f = c[ size ];

		if( f ) return f;
	}
	else
	{
		c = pool[ code ] = { };
	}

	af = gruga_fonts[ code ];

/**/if( CHECK )
/**/{
/**/	if( !af ) throw new Error( );
/**/}

	f = c[ size ] = af.create( 'size', size );

	return f;
};


/**/if( FREEZE )
/**/{
/**/	Object.freeze( shell_fontPool );
/**/}


} )( );
