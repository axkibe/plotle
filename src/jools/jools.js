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


if( SERVER )
{
/*
| Creates a random password with only numbers and lower case alphas.
*/
jools.randomPassword =
	function(
		length
	)
{
	var
		ch,
		ua;

	ch = 'abcdefghijklmnopqrstuvwxyz0123456789';

	ua = [ ];

	for(
		var a = 0;
		a < length;
		a++
	)
	{
		ua.push( ch[ Math.floor( 36 * Math.random( ) ) ] );
	}

	return ua.join( '' );
};
}


/*
| Throws an error if any argument is not an integer.
*/
jools.ensureInt =
	function(
		// integers
	)
{
	for( var a in arguments )
	{
		var arg = arguments[ a ];

		if( Math.floor( arg ) - arg !== 0 )
		{
			throw new Error( );
		}
	}
};


/*
| Sets an not enumerable value
|
| if writable is undefined, defaults to false
*/
jools.innumerable =
	function(
		obj,
		key,
		value,
		writable
	)
{
	Object.defineProperty(
		obj,
		key,
		{
			value : value,
			writable : typeof( writable ) === 'undefined' ? false : writable
		}
	);

	return value;
};


/*
| A value is computed and fixated only when needed.
*/
jools.lazyValue =
	function(
		proto,
		key,
		getter
	)
{

/**/if( FREEZE )
/**/{
/**/	proto.__have_lazy = true;
/**/}

/**/if( CHECK )
/**/{
/**/	// lazy valued stuff must be jions
/**/
/**/	if( !proto.create )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	Object.defineProperty(
		proto,
		key,
		{
			// this clever overriding does not work in IE9 :-(
			// or Android 2.2 Browser
			// get : function() { return fixate(this, key, getter.call(this)); },
			get : function( )
			{
				var
					ckey;

/**/			if( FREEZE )
/**/			{
/**/				if( this.__lazy[ key ] !== undefined )
/**/				{
/**/					return this.__lazy[ key ];
/**/				}
/**/
/**/				return(
/**/					this.__lazy[ key ] = getter.call( this )
/**/				);
/**/			}
/**/			else
				{
					ckey = '__lazy_' + key;

					if( this[ ckey ] !== undefined )
					{
						return this[ ckey ];
					}

					return(
						jools.innumerable(
							this,
							ckey,
							getter.call( this )
						)
					);
				}
			}
		}
	);
};


/*
| Tests if the object has a lazy value set.
*/
jools.hasLazyValueSet =
	function(
		obj,
		key
	)
{
	var
		ckey;

/**/if( FREEZE )
/**/{
/**/	return obj.__lazy[ key ] !== undefined;
/**/}
/**/else
	{
		ckey = '__lazy_' + key;

		return obj[ ckey ] !== undefined;
	}
};


/*
| A lazy value is computed and fixated before it is needed.
*/
jools.aheadValue =
	function(
		obj,
		key,
		value
	)
{
	var
		ckey;

/**/if( CHECK )
/**/{
/**/	if( value === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

/**/if( FREEZE )
/**/{
/**/	if( obj.__lazy[ key ] !== undefined )
/**/	{
/**/		return value;
/**/	}
/**/
/**/	return(
/**/		obj.__lazy[ key ] = value
/**/	);
/**/}
/**/else
	{
		ckey = '__lazy_' + key;

		if( obj[ ckey ] !== undefined )
		{
			return value;
		}

		return jools.innumerable( obj, ckey, value );
	}
};


/*
| A value is computed and fixated only when needed.
*/
jools.lazyFunctionString =
	function(
		proto,
		key,
		getter
	)
{
/**/if( FREEZE )
/**/{
/**/	proto.__have_lazy = true;
/**/}

	proto[ key ] =
		function( str )
	{
		var
			ckey;

/**/	if( FREEZE )
/**/	{
/**/		ckey = key + '__' + str;
/**/
/**/		if( this.__lazy[ ckey ] !== undefined )
/**/		{
/**/			return this.__lazy[ ckey ];
/**/		}
/**/
/**/		return(
/**/			this.__lazy[ ckey ] = getter.call( this, str )
/**/		);
/**/	}
/**/	else
		{
			ckey = '__lazy_' + key + '__' + str;

			if( this[ ckey ] !== undefined )
			{
				return this[ ckey ];
			}

			return(
				jools.innumerable(
					this,
					ckey,
					getter.call( this, str )
				)
			);
		}
	};
};


/*
| Copies one object (not deep!)
*/
jools.copy =
	function(
		o  // the object to copy from
	)
{
	var
		c;

	c = { };

	for( var k in o )
	{
		if( !Object.hasOwnProperty.call( o, k ) )
		{
			continue;
		}

		c[ k ] = o[ k ];
	}

	return c;
};


/*
| Returns true if a node matches another node
*/
jools.matches =
	function(
		o1,
		o2
	)
{
	if( o1 === o2 )
	{
		return true;
	}

	if( !o1.equals || !o2.equals )
	{
		return false;
	}

	return o1.equals( o2 );
};


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


/*
| Returns a descriptive string for an object.
*/
jools.inspect =
	function( o )
{
	var
		a;

	a = [ ];

	_inspect( o, a, 0, [ ] );

	return a.join( '' );
};


} )( );
