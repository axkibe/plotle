/*
| Creates font objects by size and code.
*/
'use strict';


// FIXME
var
	gruga_fonts;


tim.define( module, 'shell_fontPool', ( def, shell_fontPool ) => {


const pool = { };


def.static.get =
	function(
		size,
		code
	)
{
	let c = pool[ code ];

	let f;

	if( c )
	{
		f = c[ size ];

		if( f ) return f;
	}
	else
	{
		c = pool[ code ] = { };
	}

	const af = gruga_fonts[ code ];

/**/if( CHECK )
/**/{
/**/	if( !af ) throw new Error( );
/**/}

	f = c[ size ] = af.create( 'size', size );

	return f;
};


} );

