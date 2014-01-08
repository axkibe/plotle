/*
| Paths describe entities in a tree.
|
| Authors: Axel Kittenberger
|
| XXX isPath
*/


/*
| Import
*/
var
	Jools;


/*
| Exports
*/
var
	Path;


/*
| Capsule
*/
( function ( ) {
"use strict";


/*
| Node imports.
*/
if( typeof( window ) === 'undefined' )
{
	Jools =
		require( './jools' );
}


var
	_tag =
		'PATH-87085899';


/*
| Constructs a new Path.
|
| model can be an array or another path or null
| arguments followed by master are appended to the path
*/
Path =
	function(
		tag,
		_path
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'invalid tag'
/**/		);
/**/	}
/**/
/**/	if(
/**/		( !(_path instanceof Array ) )
/**/	)
/**/	{
/**/		throw new Error(
/**/			'invalid _path'
/**/		);
/**/	}
/**/}

	this.length =
		_path.length;

	this._path =
		Object.freeze( _path );

	Jools.immute( this );
};


/*
| Creates a new Array from an array
*/
Path.create =
	function(
		// free strings
	)
{
	var
		p =
			null,

		a, aZ;

	switch( arguments[ 0 ] )
	{
		case 'array' :

			p =
				arguments[ 1 ].slice( );

/**/		if( CHECK )
/**/		{
/**/			if( arguments.length !== 2 )
/**/			{
/**/				throw new Error(
/**/					'too many arguments'
/**/				);
/**/			}
/**/		}

			break;

		case 'list' :

			p =
				[ ];

			for(
				a = 1, aZ = arguments.legnth;
				a < aZ;
				a++
			)
			{
				p[ a - 1 ] =
					arguments[ a ];
			}

			break;

		default :

			throw new Error(
				'invalid argument'
			);
	}

	return new Path( _tag, p );
};


/*
| Refletion.
*/
Path.prototype.reflect =
	'Path';


/*
| Returns true is arc is a valid path arc.
*/
/*
var checkValidPathArc =
	function(
		arc
	)
{
	if( !Jools.isString( arc ) )
	{
		throw new Error(
			'Path arc not a string'
		);
	}

	if( arc[ 0 ] === '_' )
	{
		throw new Error(
			'Path arcs must not begin with "_"'
		);
	}
};
*/


/*
| Returns the arc at index i.
|
| TODO remove array base
*/
Path.prototype.get =
	function(
		idx
	)
{
	if( idx < 0 )
	{
		idx +=
			this.length;
	}

/**/if( CHECK )
/**/{
/**/	if( idx < 0 || idx >= this.length )
/**/	{
/**/		throw new Error( 'invalid get' );
/**/	}
/**/}

	return this._path[ idx ];
};


/*
| Returns a path with key appended
|
| TODO cache
*/
Path.prototype.append =
	function(
		key
	)
{
	var
		p =
			this._path.slice( );

	p.push( key );

	return new Path( _tag, p );
};


/*
| Same as append but without caching.
*/
Path.prototype.appendNC =
	Path.prototype.append;



/*
| Returns a path with the first item chopped of.
|
| TODO cache
*/
Path.prototype.chop =
	function( )
{
	var
		p =
			this._path.slice( );

	p.shift( );

	return new Path( _tag, p );
};



/*
| Returns a path with the last item(s) removed.
|
| TODO cache
*/
Path.prototype.shorten =
	function(
		n
	)
{
	var
		p =
			this._path.slice( );

	if( !Jools.is( n ) )
	{
		n =
			1;
	}

/**/if( CHECK )
/**/{
/**/	if( n > this.length )
/**/	{
/**/		throw new Error(
/**/			'invalid shorten'
/**/		);
/**/	}
/**/}

	if( n === this.length )
	{
		return Path.empty;
	}

	for(
		var a = 0;
		a < n;
		a++
	)
	{
		p.pop( );
	}

	return new Path( _tag, p );
};


/*
| Returns a path limited to a specific lenght.
*/
Path.prototype.limit =
	function(
		n
	)
{

/**/if( CHECK )
/**/{
/**/	if( n > this.length || n < 0 )
/**/	{
/**/		throw new Error(
/**/			'invalid shorten'
/**/		);
/**/	}
/**/}

	if( n === this.length )
	{
		return this;
	}

	if( n === 0 )
	{
		return Path.empty;
	}

	var
		p =
			this._path.slice( 0, n );

	return new Path( _tag, p );
};

/*
| Returns a path with the first item prepended.
|
| TODO cache
*/
Path.prototype.prepend =
	function(
		key
	)
{
	var
		p =
			this._path.slice( );

	if( p[ 0 ] === 'space' ) throw new Error( 'XXX' );

	p.unshift( key );

	return new Path( _tag, p );
};


/*
| Returns a path with key indexed by i set
*/
Path.prototype.set =
	function(
		idx,
		key
	)
{
	var
		p =
			this._path.slice( );

	if( idx < 0 )
	{
		idx +=
			this.length;
	}

/**/if( CHECK )
/**/{
/**/	if( idx < 0 || idx >= this.length )
/**/	{
/**/		throw new Error( 'invalid get' );
/**/	}
/**/}

	p[ idx ] =
		key;

	return new Path( _tag, p );
};


/*
| Returns true if this path is the same as another.
*/
Path.prototype.equals =
	function( o )
{
	if( !o )
	{
		return false;
	}

	if( this === o )
	{
		return true;
	}

	var
		tp =
			this._path,

		op =
			o._path;

	if( tp.length !== op.length )
	{
		return false;
	}

	for( var k in tp )
	{
		if( tp[ k ] !== op[ k ] )
		{
			return false;
		}
	}

	return true;
};


/*
| True if this path is a subPath of another.
|
| FIXME: optimize by using local variables
*/
Path.prototype.subPathOf =
	function(
		o,     // the other path
		len    // the length of this path to consider.
	)
{
	if( !Jools.is( len ) )
	{
		len =
			this.length;
	}
	else
	{
		if( len < 0 )
		{
			len +=
				this.length;
		}

		if( len < 0 )
		{
			throw new Error(
				'subPathOf out of range'
			);
		}
	}

	if( len > o.length )
	{
		return false;
	}

	for(
		var a = 0;
		a < len;
		a++
	)
	{
		if( this._path[ a ] !== o._path[ a ] )
		{
			return false;
		}
	}

	return true;
};


/*
| Turns the path to a string.
*/
Jools.lazyFixate(
	Path.prototype,
	'string',
	function( )
	{
		var
			b =
				[ '[' ];

		for(
			var a = 0, aZ = this.length;
			a < aZ;
			a++
		)
		{
			b.push(
				( a > 0 ?  ', ' : ' ' ),
				this._path[ a ]
			);
		}

		b.push(
			' ]'
		);

		return b.join( '' );
	}
);


/*
| Jsonfy.
*/
Path.prototype.toJSON =
	function( )
{
	return this._path;
};


/*
| Returns true is this path is empty
*/
Jools.lazyFixate(
	Path.prototype,
	'isEmpty',
	function( )
	{
		return this.length === 0;
	}
);


/*
| An empty path
*/
Path.empty =
	new Path(
		_tag,
		[ ]
	);

/*
| Node export
*/
if( typeof( window ) === 'undefined' )
{
	module.exports =
		Path;
}

} )( );

