/*
| Common Javascript Tools for Meshcraft.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Jools;


/*
| Imports
*/
var
	config,
	sha1hex;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Config variables
*/
var devel;


/*
| Returns boolean parameter for shell or server.
*/
var configSwitch =
	function(
		param,  // the parameter
		side    // 'shell' or 'server'
	)
{
	if(
		side !== 'shell' &&
		side !== 'server'
	)
	{
		throw new Error( 'configSwitch side must be shell or server' );
	}

	return (
		param === true ||
		param === 'both' ||
		param === side
	);
};


/*
| Running in node or browser?
*/
if( typeof( window ) === 'undefined' )
{
	// in node
	config =
		require( '../config' );

	sha1hex =
		require( './sha1' ).sha1hex;

	devel =
		configSwitch(
			config.devel,
			'server'
		);
}
else
{
	// in browser
	devel =
		configSwitch(
			config.devel,
			'shell'
		);
}


var
	puffed =
		config.debug.puffed,


	/*
	| Returns true if o is defined
	*/
	is =
		function( o )
	{
		return typeof( o ) !== 'undefined';
	},


	/*
	| Returns true if o is defined and not null
	*/
	isnon =
		function( o )
	{
		return (
			typeof( o ) !== 'undefined' &&
			o !== null
		);
	},


	/*
	| Returns true if o is an integer number
	*/
	isInteger =
		function( o )
	{
		return (
			typeof( o ) === 'number' &&
			Math.floor( o ) === o
		);
	},


	/*
	| Returns true if o is an Array
	*/
	isArray =
		function( o )
	{
		if( !o )
		{
			return false;
		}

		return o.constructor === Array;
	},


	/*
	| Returns true if o is a String
	*/
	isString  =
		function( o )
	{
		return (
			typeof( o ) === 'string' ||
			( o instanceof String )
		);
	},


	/*
	| Limits value to be between min and max
	*/
	limit =
		function(
			min,
			val,
			max
		)
	{
		if( min > max )
		{
			throw new Error('limit() min > max');
		}

		if( val < min )
		{
			return min;
		}

		if( val > max )
		{
			return max;
		}

		return val;
	},


	/*
	| buils a fail message
	*/
	fail =
		function(
			args,
			aoffset
		)
	{
		var
			a =
				Array.prototype.slice.call(
					args,
					aoffset,
					args.length
				);

		for(
			var i = 2;
			i < arguments.length;
			i++
		)
		{
			a.push( arguments[ i ] );
		}

		var
			b =
				a.slice( );

		b.unshift( 'fail' );

		log.apply(
			null,
			b
		);

		throw reject( a.join(' ') );
	},


	/*
	| Throws a reject if condition is not met.
	*/
	check =
		function( condition )
	{
		if( !condition )
		{
			fail(
				arguments,
				1
			);
		}
	},


	/*
	| Throws a reject if v is not within limits
	*/
	checkLimits =
		function(
			v,
			low,
			high
		)
	{
		if ( v < low || v > high )
		{
			fail(
				arguments,
				3,
				low,
				'<=',
				v,
				'<=',
				high
			);
		}
	},


	/*
	| Hashes the password.
	*/
	passhash =
		function( pass )
	{
		return sha1hex( pass + '-meshcraft-8833' );
	},


	/*
	| Returns a rejection error.
	*/
	reject =
		function( message )
	{
		// in devel mode any failure is fatal.{
		if ( Jools.devel )
		{
			throw new Error( message );
		}

		log(
			'reject',
			'reject',
			message
		);

		return {
			ok :
				false,

			message :
				message
		};
	},


	/*
	| Returns an unique identifier
	*/
	uid =
		function( )
	{
		var
			mime =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

			ua =
				[ ];

		for(
			var a = 0;
			a < 3;
			a++
		)
		{
			var
				r32 =
					Math.floor( 0x100000000 * Math.random( ) );

			for( var b = 0; b < 6; b++ )
			{
				ua.push( mime[ r32 & 0x3F ] );

				r32 = r32 >>> 6;
			}
		}

		return ua.join( '' );
	},


	/*
	| Creates a random password with only numbers and lower case alphas.
	*/
	randomPassword =
		function( length )
	{
		var
			ch =
				'abcdefghijklmnopqrstuvwxyz0123456789',

			ua =
				[ ];

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


/*
| Legacy (for opera browser)
*/
if( !Object.defineProperty )
{
	console.log(
		'Using legacy Object.defineProperty'
	);

	Object.defineProperty = function(obj, label, funcs) {
		if (typeof(funcs.value) !== 'undefined') {
			obj[label] = funcs.value;
			return;
		}
		if (funcs.get) obj.__defineGetter__(label, funcs.get);
		if (funcs.set) obj.__defineSetter__(label, funcs.set);
	};
}


if( !Object.freeze )
{
	console.log(
		'Using legacy Object.freeze'
	);

	Object.freeze =
		function( )
		{
		};
}


/*
| Subclassing helper.
|
*/
var subclass =
	function(
		sub,   // prototype to become a subclass.
		base   // either a prototype to become the base.
		//     //   or a table of prototypes to become the base for multiple
		//     //   inheritance.
	)
{
	function Inherit( ) { }

	if( base.constructor === Object )
	{
		// multiple inheritance
		for( var name in base )
		{
			for( var k in base[name].prototype )
			{
				if( k === 'constructor' )
					continue;

				if( Inherit.prototype[ k ] )
				{
					throw new Error(
						'Multiple inheritance clash for ' + sub + ' :' + k
					);
				}
				Inherit.prototype[ k ] = base[ name ].prototype[ k ];
			}
		}
	}
	else
	{
		// single inheritance
		Inherit.prototype = base.prototype;
	}

	sub.prototype =
		new Inherit( );

	sub.prototype.constructor =
		sub;
};


/*
| Throws an error if any argument is not an integer.
*/
var ensureInt =
	function(
		// integers
	)
{
	for( var a in arguments )
	{
		var arg = arguments[ a ];

		if( Math.floor( arg ) - arg !== 0 )
		{
			throw new Error( arg + ' not an integer' );
		}
	}
};


/*
| Checks the definedness of a list of variables
| and throws an arguments error if not.
*/
var ensureArgs =
	function(
		// list of:
		//   argument name, defined variable
	)
{
	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		var arg =
			arguments[ a + 1 ];

		if(! Jools.is( arg ) )
		{
			throw new Error(
				'Argument missing: ' + arguments[ a ]
			);
		}
	}
};

/*
| Fixates a value to an object (not changeable)
*/
var fixate =
	function(
		obj,
		key,
		value
	)
{
    Object.defineProperty(
		obj,
		key,
		{
			enumerable: true,
			value: value
		}
	);

    return value;
};


/*
| Sets an not enumerable value
|
| if writable is undefined, defaults to false
*/
var innumerable =
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
			value    : value,
			writable : typeof( writable ) === 'undefined' ? false : writable
		}
	);

    return value;
};


/*
* A value is computed and fixated only when needed.
*/
var lazyFixate =
	function(
		proto,
		key,
		getter
	)
{
	Object.defineProperty(
		proto,
		key,
		{
			// this clever overriding does not work in IE9 :-( or Android 2.2 Browser
			// get : function() { return fixate(this, key, getter.call(this)); },

			get : function( )
			{
				var ckey = '_lazy_' + key;

				return is( this[ ckey ] ) ?
					this[ ckey ] :
					innumerable(
						this,
						ckey,
						getter.call( this )
					);
			}
		}
	);
};


/*
| Copies one object (not deep!)
*/
var copy =
	function(
		o,  // the object to copy from
		c   // the object to copy into
	)
{
	for( var k in o )
	{
		if( !Object.hasOwnProperty.call( o, k ) )
			{ continue; }

		c[ k ] = o[ k ];
	}

	return c;
};


/*
| Returns true if a node matches another node
*/
var matches =
	function(
		// o1,
		// o2
	)
{
	// TODO fix this
	return true;

	/*
	if( o1 === o2 )
	{
		return true;
	}

	// numbers or strings would have matched before
	switch( o1.constructor )
	{
		case String :
			return false;

		case Number :
			return false;
	}

	// also if either is null an not equal
	if(
		o1 === null ||
		o2 === null
	)
	{
		return false;
	}

	var
		k1 =
			Object.keys( o1 );

	var
		k2 =
			Object.keys( o2 );

	if( k1.length !== k2.length )
	{
		return false;
	}

	for(
		var a = 0, aZ = k1.length;
		a < aZ;
		a++
	)
	{
		var k =
			k1[ a ];

		if(
			!matches(
				o1[ k ],
				o2[ k ]
			)
		)
		{
			return false;
		}
	}

	return true;
	*/
};


/*
| Pushes a 2-decimal number on an string-array.
*/
var _pushpad =
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

	a.push( n );
	a.push( s );

	return a;
};


/*
| Creates a timestamp
| which will be returned as joinable array.
*/
var _timestamp =
	function( a )
{
	var now =
		new Date( );

	_pushpad( a, now.getMonth( ) + 1, '-' );
	_pushpad( a, now.getDate( ),      ' ' );
	_pushpad( a, now.getHours( ),     ':' );
	_pushpad( a, now.getMinutes( ),   ':' );
	_pushpad( a, now.getSeconds( ),   ' ' );

	return a;
};


/*
| Pushes spaces into array for indentation.
*/
var _pushindent =
	function(
		indent,  // the amount of spaces to push on the array
		a        // the array
	)
{
	for( var i = 0; i < indent; i++ )
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
	if( circle.indexOf( o ) !== -1 )
	{
		array.push('^circle^');
		return;
	}

	circle = circle.slice( );
	circle.push( o );

	if( !indent )
		{ indent = 0; }

	if( o && o.toJSON )
		{ o = o.toJSON(); }

	var to = typeof( o );

	if( to === 'undefined' )
	{
	}
	else if( o === null )
	{
		to = 'null';
	}
	else
	{
		switch( o.constructor )
		{
			case String :
				to = 'string';
				break;

			case Array :
				to = 'array';
				break;
		}
	}

	var k, first;

	switch( to )
	{
		case 'undefined' :

			array.push( 'undefined' );
			return;

		case 'boolean' :

			array.push(o ? 'true' : 'false');
			return;

		case 'function' :

			array.push('function '); if (o.name) array.push(o.name);
			return;

		case 'string' :

			array.push('"', o, '"');
			return;

		case 'number' :

			array.push(o);
			return;

		case 'null' :

			array.push('null');
			return;

		case 'array' :

			array.push( '[' );
			if( puffed )
				{ array.push( '\n' ); }

			for( var a = 0, aZ = o.length; a < aZ; a++)
			{
				if( a > 0 )
				{
					array.push( ',' );
					array.push( puffed ? '\n' : ' ' );
				}

				if( puffed )
					{ _pushindent( indent + 1, array ); }

				_inspect(
					o[ a ],
					array,
					indent + 1,
					circle
				);
			}

			first = true;
			for( k in o )
			{
				if(
					typeof(k) === 'number' ||
					parseInt(k, 10) == k ||
					!o.hasOwnProperty(k)
				){
					continue;
				}

				if( first )
				{
					array.push(puffed ? '\n' : ' ');
					if (puffed) _pushindent(indent + 1, array);
					array.push('|');
					array.push(puffed ? '\n' : ' ');
					first = false;
				}
				else
				{
					array.push(',');
					array.push(puffed ? '\n' : ' ');
					if (puffed) _pushindent(indent + 1, array);
				}
				array.push(k);
				array.push(': ');
				_inspect(o[k], array, indent + 1, circle);
				array.push(puffed ? '\n' : ' ');
			}
			array.push(puffed ? '\n' : ' ');

			if( puffed )
				{ _pushindent( indent, array ); }

			array.push( ']' );
			return;

		case 'object' :

			array.push(
				'{',
				puffed ? '\n' : ' '
			);

			first = true;

			for( k in o )
			{
				if( !o.hasOwnProperty(k) )
					{ continue; }
				if (!first) array.push(',', puffed ? '\n' : ' '); else first = false;
				if (puffed) _pushindent(indent + 1, array);
				array.push(k, ': ');

				if ( k === 'parent' )
				{
					array.push('###');
					continue;
				}

				_inspect(o[k], array, indent + 1, circle);
			}

			array.push(
				puffed ? '\n' : ' '
			);

			if( puffed )
			{
				_pushindent(
					indent,
					array
				);
			}

			array.push( '}' );

			return;

		default :
			array.push( '!!Unknown Type: ', to, '!!' );

		}
};


/*
| Logs a number of inspected argument if category is configured to be logged.
*/
var log =
	function(
		category
	)
{
	if(
		category !== true &&
		!config.log.all &&
		!config.log[category]
	)
	{
		return;
	}

	var a = _timestamp( [ ] );

	if( category !== true )
	{
		a.push( '(' );
		a.push( category );
		a.push( ') ' );
	}

	for( var i = 1; i < arguments.length; i++ )
	{
		if( i > 1 )
		{
			a.push(' ');
		}

		_inspect(
			arguments[ i ],
			a,
			0,
			[ ]
		);
	}

	console.log(
		a.join( '' )
	);
};


/*
| Shortcut for log('debug', ...);
*/
function debug( )
{
	if( !config.log.debug )
	{
		return;
	}

	var a =
		_timestamp( [ ] );

	a.push( '(debug) ' );

	for( var i = 0; i < arguments.length; i++ )
	{
		if (i > 0)
		{
			a.push(' ');
		}

		_inspect(
			arguments[ i ],
			a,
			0,
			[ ]
		);
	}

	console.log(
		a.join( '' )
	);
}


/*
| Returns a descriptive string for an object.
*/
var inspect = function( o )
{
	var a = [ ];

	_inspect(
		o,
		a,
		0,
		[ ]
	);

	return a.join( '' );
};


/*
| Makes an object immutable
*/
var immute =
	function(
		obj
	)
{
	// for releases immute checking is disabled in favor of speed
	if( !config.debug.immute )
	{
		return obj;
	}

	var names =
		Object.getOwnPropertyNames( obj );

	for(
		var a = 0, aZ = names.length;
		a < aZ;
		a++
	)
	{
		var name =
			names[ a ];

		if(
			name.substring( 0, 1 ) === '$' ||
			name.substring( 0, 2 ) === '_$'
		)
		{
			continue;
		}

		var desc =
			Object.getOwnPropertyDescriptor(
				obj,
				names[ a ]
			);

		if( !desc.configurable )
		{
			continue;
		}

		desc.configurable =
			false;

		desc.writable =
			false;

		Object.defineProperty(
			obj,
			name,
			desc
		);
	}

	return obj;
};


/*
| Makes a key not to be accessed.
|
| Used for developing during changes
*/
var keyNonGrata =
	function(
		obj,
		key
	)
{
	Object.defineProperty(
		obj,
		key,
		{
			get :
				function( )
				{
					throw new Error( 'accessed key non grata! ' + key );
				},

			set :
				function(
					// v
				)
				{
					throw new Error( 'accessed key non grata! ' + key );
				}
		}
	);
};

// divides by 2 and rounds up
var half =
	function( v )
{
	return Math.round( v / 2 );
};


/*
| Parses free string.
|
| TODO remove
*/
var parseFreeStrings =
	function(
		freeType, // a type object, or an array of type objects
		args,     // the arguments used to create this
		recurse   // true if recursing
	)
{
	var
		a =
			0,

		aZ =
			args.length,

		f, fZ,

		arg,

		type,

		property,

		ret =
			null;

	// TODO ensure null-ness of params in non recursive calls

	while( a < aZ )
	{
		arg =
			args[ a ];

		if( !isArray( freeType ) )
		{
			type =
				freeType[ arg ];
		}
		else
		{
			for(
				f = 0, fZ = freeType.length;
				f < fZ;
				f++
			)
			{
				var fi =
					freeType[ f ];

				if( fi[ arg ] )
				{
					type =
						fi[ arg ];

					break;
				}
			}
		}

		if( !type )
		{
			throw new Error(
				'unknown argument: ' + arg
			);
		}

		property =
			type.property || arg;

		switch( type.type )
		{
			case 'param' :

				this[ property ] =
					args[ a + 1 ];

				a += 2;

				break;

			case 'return' :

				if( ret !== null )
				{
					throw new Error(
						'multiple return values to free-strings'
					);
				}

				ret =
					args[ a + 1 ];

				a += 2;

				break;

			default :

				throw new Error(
					'invalid freestring type ' + type.type +
					' for ' + arg
				);
		}

	}

	// checks if all required params are there
	// but not when recursing, since its not yet finished
	if( !recurse )
	{
		for(
			f = 0, fZ = isArray( freeType ) ? freeType.length : 1;
			f < fZ;
			f++
		)
		{
			var ft =
				isArray( freeType ) ?
					freeType[ f ] :
					freeType;

			for( arg in ft )
			{
				type =
					ft[ arg ];

				property =
					type.property || arg;

				if(
					type.required &&
					this[ property ] === null
				)
				{
					throw new Error(
						'required param ' + arg + ' missing.'
					);
				}
			}
		}
	}

	return ret;
};


/*
| Extens a free strings typification
*/
var extentFreeType =
	function(
		base,
		sub
	)
{
	if( !sub )
	{
		return base;
	}

	if( isArray( sub ) )
	{
		throw new Error(
			'Cannot extent freeType by Array'
		);
	}

	if( isArray( base ) )
	{
		base.push( sub );
		return;
	}

	return [ base, sub ];
};

/*
| Exports
*/
Jools =
{
	check            : check,
	checkLimits      : checkLimits,
	configSwitch     : configSwitch,
	copy             : copy,
	debug            : debug,
	devel            : devel,
	ensureInt        : ensureInt,
	ensureArgs       : ensureArgs,
	extentFreeType   : extentFreeType,
	fixate           : fixate,
	half             : half,
	inspect          : inspect,
	innumerable      : innumerable,
	is               : is,
	isnon            : isnon,
	isArray          : isArray,
	isInteger        : isInteger,
	isString         : isString,
	immute           : immute,
	keyNonGrata      : keyNonGrata,
	lazyFixate       : lazyFixate,
	limit            : limit,
	log              : log,
	matches          : matches,
	parseFreeStrings : parseFreeStrings,
	passhash         : passhash,
	randomPassword   : randomPassword,
	reject           : reject,
	subclass         : subclass,
	uid              : uid
};


if( typeof( window ) === 'undefined' )
{
	module.exports = Jools;
}


} )( );


