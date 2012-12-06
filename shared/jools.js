/*
| Common Javascript Tools for Meshcraft.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Jools;


/*
| Imports
*/
var config;
var sha1hex;


/*
| Capsule
*/
( function( ) {

"use strict";


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
	if( side !== 'shell' &&
		side !== 'server'
	)
	{
		throw new Error( 'configSwitch side must be shell or server' );
	}

	return (
		param === true   ||
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
	config =  require('../config');
	sha1hex = require('./sha1').sha1hex;
	devel   = configSwitch(config.devel, 'server');
}
else
{
	// in browser
	devel  = configSwitch(config.devel, 'shell');
}


var puffed = config.debug.puffed;


/*
| Returns true if o is defined
*/
var is =
	function( o )
{
	return typeof( o ) !== 'undefined';
};


/*
| Returns true if o is defined and not null
*/
var isnon =
	function( o )
{
	return typeof( o ) !== 'undefined' && o !== null;
};


/*
| Returns true if o is an integer number
*/
var isInteger =
	function( o )
{
	return typeof( o ) === 'number' && Math.floor( o ) === o;
};


/*
| Returns true if o is an Array
*/
var isArray =
	function( o )
{
	return o.constructor === Array;
};


/*
| Returns true if o is a String
*/
var isString  =
	function( o )
{
	return typeof( o ) === 'string' || o instanceof String;
};


/*
| Limits value to be between min and max
*/
var limit = function(min, val, max) {
	if (min > max) throw new Error('limit() min > max');
	if (val < min) return min;
	if (val > max) return max;
	return val;
};

/**
| buils a fail message
*/
var fail = function(args, aoffset) {
	var a = Array.prototype.slice.call(args, aoffset, args.length);
	for(var i = 2; i < arguments.length; i++) { a.push(arguments[i]); }
	var b = a.slice();
	b.unshift('fail');
	log.apply(null, b);
	throw reject(a.join(' '));
};

/**
| Throws a reject if condition is not met.
*/
var check = function(condition) {
	if (!condition) fail(arguments, 1);
};

/**
| Throws a reject if v is not within limits
*/
var checkLimits = function(v, low, high) {
	if (v < low || v > high) fail(arguments, 3, low, '<=', v, '<=', high);
};

/**
| hashes the password
*/
var passhash = function(pass) {
	return sha1hex(pass + '-meshcraft-8833');
};

/**
| Returns a rejection error.
*/
var reject = function(message) {
	// in devel mode any failure is fatal.{
	if (Jools.devel) throw new Error(message);
	log('reject', 'reject', message);
	return {ok: false, message: message};
};

/**
| Returns an unique identifier.
*/
var uid = function() {
	var mime ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	var ua   = [];
	for(var a = 0; a < 3; a++) {
		var r32  = Math.floor(0x100000000 * Math.random());
		for(var b = 0; b < 6; b++) {
			ua.push(mime[r32 & 0x3F]);
			r32 = r32 >>> 6;
		}
	}
	return ua.join('');
};

/**
| Creates a random password with only numbers and lower case alphas.
*/
var randomPassword = function(length) {
	var ch ='abcdefghijklmnopqrstuvwxyz0123456789';
	var ua   = [];
	for(var a = 0; a < length; a++)
		{ ua.push(ch[Math.floor(36 * Math.random())]); }
	return ua.join('');
};

/**
| Legacy (for opera browser)
*/
if (!Object.defineProperty) {
	console.log('Using legacy Object.defineProperty');
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
	console.log( 'Using legacy Object.freeze' );
	Object.freeze = function( ) { };
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

	sub.prototype = new Inherit( );
	sub.prototype.constructor = sub;
};


/*
| Throws an error if any argument is not an integer.
*/
var ensureInt = function( )
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
| Returns true if this node matches a master or a node of equal class
*/
var matches =
	function(
		twig1,
		twig2
	)
{
	if( twig1 === twig2 )
		{ return true; }

	// numbers or strings would have matched before
	switch( twig1.constructor )
	{
		case String :
			return false;

		case Number :
			return false;
	}

	// also if either is null an not equal
	if(
		twig1 === null ||
		twig2 === null
	)
		{ return false; }

	var k1 = Object.keys( twig1 );
	var k2 = Object.keys( twig2 );

	if( k1.length !== k2.length )
		{ return false; }

	for( var a = 0, aZ = k1.length; a < aZ; a++ )
	{
		var k = k1[ a ];
		if( !matches( twig1[ k ], twig2[ k ] ) )
			{ return false; }
	}

	return true;
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
		{ a.push('0'); }

	a.push(n);
	a.push(s);

	return a;
};


/*
| Creates a timestamp
| which will be returned as joinable array.
*/
var _timestamp =
	function( a )
{
	var now = new Date( );

	_pushpad( a, now.getMonth() + 1, '-' );
	_pushpad( a, now.getDate(),      ' ' );
	_pushpad( a, now.getHours(),     ':' );
	_pushpad( a, now.getMinutes(),   ':' );
	_pushpad( a, now.getSeconds(),   ' ' );

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
		{ a.push('  '); }
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

				if (k === 'parent') {
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
		a.push('(');
		a.push(category);
		a.push(') ');
	}

	for( var i = 1; i < arguments.length; i++ )
	{
		if( i > 1 )
			{ a.push(' '); }

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
		{ return; }

	var a = _timestamp( [ ] );

	a.push( '(debug) ' );

	for( var i = 0; i < arguments.length; i++ )
	{
		if (i > 0)
			{ a.push(' '); }

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
	if( !config.debug.immute )
		{ return obj; }

	var names = Object.getOwnPropertyNames( obj );

	for( var a = 0, aZ = names.length; a < aZ; a++ )
	{
		var desc = Object.getOwnPropertyDescriptor(
			obj,
			names[ a ]
		);

		if( !desc.configurable )
			{ continue; }

		desc.configurable = false;
		desc.writable = false;

		Object.defineProperty(
			obj,
			names[ a ],
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
			function( /* v */ )
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
| Exports
*/
Jools =
{
	check          : check,
	checkLimits    : checkLimits,
	configSwitch   : configSwitch,
	copy           : copy,
	debug          : debug,
	devel          : devel,
	ensureInt      : ensureInt,
	fixate         : fixate,
	half           : half,
	inspect        : inspect,
	innumerable    : innumerable,
	is             : is,
	isnon          : isnon,
	isArray        : isArray,
	isInteger      : isInteger,
	isString       : isString,
	immute         : immute,
	keyNonGrata    : keyNonGrata,
	lazyFixate     : lazyFixate,
	limit          : limit,
	log            : log,
	matches        : matches,
	passhash       : passhash,
	randomPassword : randomPassword,
	reject         : reject,
	subclass       : subclass,
	uid            : uid
};


if( typeof( window ) === 'undefined' )
{
	module.exports = Jools;
}


} )( );


