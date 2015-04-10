/*
| Common Javascript Tools for ideoloom.
*/


var
	config,
	jools;


/*
| Capsule
*/
( function( ) {
'use strict';


if( SERVER )
{
	jools = module.exports;

	config = require( '../../config' );

	jools.devel = config.server_devel;
}
else
{
	jools = { };

	jools.devel = config.shell_devel;
}


var
	puffed,
	pushpad,
	pushindent,
	timestamp;


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
| Creates a timestamp
| which will be returned as joinable array.
*/
timestamp =
	function( a )
{
	var
		now;
	
	now = new Date( );

	pushpad( a, now.getMonth( ) + 1, '-' );

	pushpad( a, now.getDate( ), ' ' );

	pushpad( a, now.getHours( ), ':' );

	pushpad( a, now.getMinutes( ), ':' );

	pushpad( a, now.getSeconds( ), ' ' );

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
| Inspects an object and creates a descriptive string for it.
|
| Self-written instead of node.JS' since not available in browser.
| Not using toJSON since that fails on circles.
| This is the jools-internal version that pushes data directly on the array stack.
*/
var _inspect =
	function(
		o,
		array,
		indent,
		circle
	)
{
	var
		a,
		aZ,
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

	var k, first;

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

				_inspect( o[ a ], array, indent + 1, circle );
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

				_inspect( o[ k ], array, indent + 1, circle );

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

				_inspect( o[ k ], array, indent + 1, circle );
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


/*
| Logs a number of inspected argument
| if category is configured to be logged.
*/
jools.log =
	function(
		category
	)
{
	var
		a,
		i;

	if(
		category !== true
		&& !config.log.all
		&& !config.log[ category ]
	)
	{
		return;
	}

	a = timestamp( [ ] );

	if( category !== true )
	{
		a.push( '(' );
		a.push( category );
		a.push( ') ' );
	}

	for( i = 1; i < arguments.length; i++ )
	{
		if( i > 1 )
		{
			a.push(' ');
		}

		_inspect( arguments[ i ], a, 0, [ ] );
	}

	console.log( a.join( '' ) );
};


/*
| Shortcut for log('debug', ...);
*/
jools.debug =
	function( )
{
	var a;

	if( !config.log.debug )
	{
		return;
	}

	a = timestamp( [ ] );

	a.push( '(debug) ' );

	for( var i = 0; i < arguments.length; i++ )
	{
		if (i > 0)
		{
			a.push(' ');
		}

		_inspect( arguments[ i ], a, 0, [ ] );
	}

	console.log( a.join( '' ) );
};


} )( );
