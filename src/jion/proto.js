/*
| Common functions for jion-ects.
|
| Authors: Axel Kittenberger
*/

var
	Jools,
	JoobjProto =
		{ };


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	Jools = require( '../jools/jools' );
}


/*
| Sets a key of a sub node described by a path.
*/
JoobjProto.setPath =
	function(
		path,  // path to set
		value, // value to set to
		pos    // position in the path
	)
{
	var
		key,
		pZ;

	if( pos === undefined )
	{
		pos = 0;
	}

/**/if( CHECK )
/**/{
/**/	if( typeof( pos ) !== 'number' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( path.length === pos )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	pZ = path.length;

	key = path.get( pos );

	if( key === 'twig' )
	{
		if( pos + 1 === pZ )
		{
			throw new Error( );
		}

		key = path.get( pos + 1 );

		if( pos + 2 === pZ )
		{
			return (
				this.Create(
					'twig:set',
					key,
					value
				)
			);
		}

		return (
			this.Create(
				'twig:set',
				key,
				this.twig[ key ].setPath(
					path,
					value,
					pos + 2
				)
			)
		);
	}

	if( pos + 1 === pZ )
	{
		return (
			this.Create(
				key,
				value
			)
		);
	}

	return (
		this.Create(
			key,
			this[ key ].setPath(
				path,
				value,
				pos + 1
			)
		)
	);
};


/*
| Gets a key of a sub node described by a path.
*/
JoobjProto.getPath =
	function(
		path,  // path to set
		pos    // position in the path
	)
{
	var
		key,
		pZ;

	if( pos === undefined )
	{
		pos = 0;
	}

	if( path.length === pos )
	{
		return this;
	}

	pZ = path.length,

	key = path.get( pos );

	if( key === 'twig' )
	{
		if( pos + 1 === pZ )
		{
			throw new Error( );
		}

		key = path.get( pos + 1 );

		if( pos + 2 === pZ )
		{
			return this.twig[ key ];
		}

		return (
			this.twig[ key ].getPath(
				path,
				pos + 2
			)
		);
	}

	if( pos + 1 === pZ )
	{
		return this[ key ];
	}

	return (
		this[ key ].getPath(
			path,
			pos + 1
		)
	);
};


/*
| Returns a twig node by its rank.
*/
JoobjProto.atRank =
	function(
		rank
	)
{
	return this.twig[ this.ranks[ rank ] ];
};


/*
| Creates a new unique identifier.
*/
JoobjProto.newUID =
	function( )
{
	var
		u;

	u = Jools.uid( );

	return (
		( this.twig[ u ] === undefined )
		?  u
		: this.newUID( )
	);
};


/*
| Returns the rank of the key
|
| This means it returns the index of key in the ranks array.
|
| FIXME make a joolsLazyfunc
*/
JoobjProto.rankOf =
	function(
		key
	)
{
	var
		rank,
		ranks,
		rof;
		
	ranks = this.ranks;

/**/if( CHECK )
/**/{
/**/	if( !Jools.isArray( ranks ) )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( !Jools.isString( key ) )
/**/	{
/**/		throw new Error(
/**/			'key no string'
/**/		);
/**/	}
/**/}

	// checks ranking cache
	rof = this._$rof;

	if( !rof )
	{
		Object.defineProperty(
			this,
			'_$rof',
			rof = { }
		);
	}

	rank = rof[ key ];

	if( rank !== undefined )
	{
		return rank;
	}

	rank =
	rof[ key ] =
		this.twig[ key ] !== undefined ?
			ranks.indexOf( key ) :
			-1;

	return rank;
};


/*
| Node export
*/
if( SERVER )
{
	module.exports = JoobjProto;
}


} )( );
