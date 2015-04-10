/*
| Inspects stuff.
|
| FUTURE:
|   this has hughe overlap with node.util.inspect
|   historically written since early browsers didn't
|   have usuful inspections. Maybe be removed, but right
|   now I want to keep it a little before scrapping it,
|   in case browser inspect / node.util.inspect have
|   troubles in some case.
*/


var
	config,
	log_inspect;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	config = require( '../../config' );
}


var
	puffed,
	pushpad,
	pushindent;


puffed = config.debug.puffed;


/*
| Pushes a 2-decimal number on an string-array.
*/
pushpad =
	function(
		a,   // the array
		n,   // the number to push
		s    // the separator
	)
{
	if( n < 10 )
	{
		a.push( '0' );
	}

	a.push( n, s );

	return a;
};



/*
| Pushes spaces into array for indentation.
*/
pushindent =
	function(
		indent,  // the amount of spaces to push on the array
		a        // the array
	)
{
	var
		i;

	for( i = 0; i < indent; i++ )
	{
		a.push( '  ' );
	}
};


/*
| Inspects an object and pushes a descriptive string on array.
*/
log_inspect =
	function(
		o,       // object to inspect
		array,   // arraw to push stuff to
		indent,  // indentation
		circle   // array of parents to detect circles
	)
{
	var
		a,
		aZ,
		k,
		first,
		to;

	if( circle.indexOf( o ) !== -1 )
	{
		array.push('^circle^');

		return;
	}

	circle = circle.slice( );

	circle.push( o );

	if( !indent ) indent = 0;

	if( o && o.toJSON ) o = o.toJSON();

	to = typeof( o );

	if( to === 'undefined' )
	{ }
	else if( o === null )
	{
		to = 'null';
	}
	else
	{
		switch( o.constructor )
		{
			case String : to = 'string'; break;

			case Array : to = 'array'; break;
		}
	}

	switch( to )
	{
		case 'undefined' :

			array.push( 'undefined' );

			return;

		case 'boolean' :

			array.push( o ? 'true' : 'false' );

			return;

		case 'function' :

			array.push('function ');
			
			if( o.name ) array.push( o.name );

			return;

		case 'string' :

			array.push( '"', o, '"' );

			return;

		case 'number' :

			array.push( o );

			return;

		case 'null' :

			array.push( 'null' );

			return;

		case 'array' :

			array.push( '[' );

			if( puffed )
			{
				array.push( '\n' );
			}

			for( a = 0, aZ = o.length; a < aZ; a++ )
			{
				if( a > 0 )
				{
					array.push( ',' );

					array.push( puffed ? '\n' : ' ' );
				}

				if( puffed )
				{
					pushindent( indent + 1, array );
				}

				log_inspect( o[ a ], array, indent + 1, circle );
			}

			first = true;

			for( k in o )
			{
				if(
					typeof( k ) === 'number'
					|| parseInt( k, 10 ) == k
					|| !o.hasOwnProperty(k)
				){
					continue;
				}

				if( first )
				{
					array.push( puffed ? '\n' : ' ' );

					if( puffed ) pushindent( indent + 1, array );

					array.push( '|' );

					array.push( puffed ? '\n' : ' ' );

					first = false;
				}
				else
				{
					array.push( ',' );

					array.push( puffed ? '\n' : ' ' );

					if( puffed ) pushindent( indent + 1, array );
				}

				array.push( k );

				array.push( ': ' );

				log_inspect( o[ k ], array, indent + 1, circle );

				array.push( puffed ? '\n' : ' ' );
			}
			array.push( puffed ? '\n' : ' ' );

			if( puffed )
			{
				pushindent( indent, array );
			}

			array.push( ']' );

			return;

		case 'object' :

			array.push( '{', puffed ? '\n' : ' ' );

			first = true;

			for( k in o )
			{
				if( !o.hasOwnProperty( k ) ) continue;

				if (!first)
				{
					array.push(',', puffed ? '\n' : ' ');
				}
				else
				{
					first = false;
				}

				if( puffed ) pushindent(indent + 1, array);

				array.push( k, ': ' );

				log_inspect( o[ k ], array, indent + 1, circle );
			}

			array.push( puffed ? '\n' : ' ' );

			if( puffed )
			{
				pushindent( indent, array );
			}

			array.push( '}' );

			return;

		default :

			array.push( '!!Unknown Type: ', to, '!!' );
	}
};


if( NODE )
{
	module.exports = log_inspect;
}


} )( );
