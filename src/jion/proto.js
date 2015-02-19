/*
| Common functions for jion-ects.
*/

var
	jools,
	jion, // FUTURE remove
	jion_proto;


jion = jion || { };


/*
| Capsule.
*/
(function( ) {
'use strict';


jion.proto =
jion_proto =
	{ };

/*
| Node export.
*/
if( SERVER )
{
	module.exports = jion_proto;
}



/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );
}


/*
| Sets a key of a sub node described by a path.
*/
jion_proto.setPath =
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
			return(
				this.create(
					'twig:set',
					key,
					value
				)
			);
		}

		return(
			this.create(
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
			this.create(
				key,
				value
			)
		);
	}

	return (
		this.create(
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
jion_proto.getPath =
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
| Creates a new unique identifier.
*/
jion_proto.newUID =
	function( )
{
	var
		u;

	u = jools.uid( );

	return (
		( this.twig[ u ] === undefined )
		?  u
		: this.newUID( )
	);
};


/*
| Gets one entry from the group.
*/
jion_proto.groupGet =
	function(
		key
	)
{
	return this.group[ key ];
};


/*
| Returns the group with another group added,
| overwriting collisions.
*/
jion_proto.groupAddGroup =
	function(
		group
	)
{
	var
		g,
		k;

/**/if( CHECK )
/**/{
/**/	if( this.reflect !== group.reflect )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	g = jools.copy( this.group );

	for( k in group.group )
	{
		g[ k ] = group.group[ k ];
	}

	return this.create( 'group:init', g );
};


/*
| Returns the keys of the group.
*/
jion_proto.groupKeys =
	function( )
{
	var
		keys;

	keys = Object.keys( this.group );

	if( FREEZE )
	{
		Object.freeze( keys );
	}

	return keys;
};


/*
| Returns the sorted keys of the group.
*/
jion_proto.groupSortedKeys =
	function( )
{
	var
		keys;

	keys = this.keys;

	keys = keys.slice( ).sort( );

	if( FREEZE )
	{
		Object.freeze( keys );
	}

	return keys;
};


/*
| Returns the jion with one entry of the ray set.
*/
jion_proto.groupSet =
	function(
		key,
		e
	)
{
	return this.create( 'group:set', key, e );
};


/*
| Returns the size of the group.
*/
jion_proto.groupSize =
	function( )
{
	return this.keys.length;
};


/*
| Returns a jion with one entry from the ray removed.
*/
jion_proto.groupRemove =
	function(
		key
	)
{
	return this.create( 'group:remove', key );
};


/*
| Appends an element to a ray.
*/
jion_proto.rayAppend =
	function(
		e
	)
{
	return this.create( 'ray:append', e );
};


/*
| Appends an element to a ray.
*/
jion_proto.rayAppendRay =
	function(
		ray
	)
{

/**/if( CHECK )
/**/{
/**/	if( this.reflect !== ray.reflect )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.create( 'ray:init', this.ray.concat( ray.ray ) );
};


/*
| Returns the length of a ray.
*/
jion_proto.rayLength =
	function( )
{
	return this.ray.length;
};


/*
| Gets one element of a ray.
*/
jion_proto.rayGet =
	function(
		idx
	)
{
	if( idx < 0 )
	{
		idx += this.length;
	}

/**/if( CHECK )
/**/{
/**/	if( idx < 0 || idx >= this.length )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.ray[ idx ];
};


/*
| Returns a ray with one element inserted.
*/
jion_proto.rayInsert =
	function(
		idx,
		e
	)
{
	return this.create( 'ray:insert', idx, e );
};


/*
| Returns a ray with one element removed.
*/
jion_proto.rayRemove =
	function(
		idx
	)
{
	return this.create( 'ray:remove', idx );
};


/*
| Returns a ray with one element altered.
*/
jion_proto.raySet =
	function(
		idx,
		e
	)
{
	if( idx < 0 )
	{
		idx += this.length;
	}

/**/if( CHECK )
/**/{
/**/	if( idx < 0 || idx >= this.length )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.create( 'ray:set', idx, e );
};



/*
| Returns a twig node by its rank.
*/
jion_proto.twigAtRank =
	function(
		rank
	)
{
	return this.twig[ this.ranks[ rank ] ];
};



/*
| Returns the twig by key.
*/
jion_proto.twigGet =
	function(
		key
	)
{
	return this.twig[ key ];
};


/*
| Returns the key at a rank.
*/
jion_proto.twigGetKey =
	function(
		idx
	)
{
	return this.ranks[ idx ];
};


/*
| Returns the length of a ray.
*/
jion_proto.twigLength =
	function( )
{
	return this.ranks.length;
};


/*
| Returns the rank of the key.
|
| This means it returns the index of key in the ranks array.
*/
jion_proto.twigRankOf =
	function(
		key
	)
{

/**/if( CHECK )
/**/{
/**/	if( !jools.isString( key ) )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		this.twig[ key ] !== undefined
		?  this.ranks.indexOf( key )
		: -1
	);
};




} )( );
