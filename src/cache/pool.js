/*
| Caches stuff.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'cache_pool',
		attributes :
		{
			maxSize :
			{
				comment : 'maximum size of pool',
				type : [ 'number' ]
			}
		},
		init : [ ]
	};
}


var
	cache_pool,
	jion;

/*
| Capsule.
*/
(function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	cache_pool = jion.this( module, 'source' );
}


prototype = cache_pool.prototype;


/*
| Initialization.
*/
prototype._init =
	function( )
{
	this._pool = { };

	this._fifo = { };

	this._fifo._next = 1;
};


/*
| Stores a key/value pair in the pool.
*/
prototype.store =
	function( key, val )
{
	var
		e,
		idx,
		fifo,
		pool;

	fifo = this._fifo;

	pool = this._pool;

	idx = pool[ key ];

	if( idx )
	{
		e = fifo[ idx ];

		fifo[ idx ] = undefined;

		idx = fifo._next++;

		fifo[ idx ] = val;

		pool[ key ] = idx;
	}
	else
	{
		idx = fifo._next++;

		fifo[ idx ] = val;

		pool[ key ] = idx;

		// FIXME reduce if > maxSize
	}
};


/*
| Retrieves a value by it's key from the pool
*/
prototype.retrieve =
	function( key )
{
	var
		e,
		idx,
		fifo,
		pool;

	fifo = this._fifo;

	pool = this._pool;

	idx = pool[ key ];

	if( !idx ) return undefined;

	e = fifo[ idx ];

	// pushes the retrieved element up.

	fifo[ idx ] = undefined;

	idx = fifo._next++;

	pool[ key ] = idx;

	fifo[ idx ] = e;

	return e;
};


} )( );
