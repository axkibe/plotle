/*
| Common functions for joobj-ects.
|
| Authors: Axel Kittenberger
*/

var
	JoobjProto =
		{ };

/*
| Capsule.
*/
(function( ) {
'use strict';


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
	if( pos === undefined )
	{
		pos =
			0;
	}

	var
		pZ =
			path.length,

		key =
			path.get( pos );

	if( key === 'twig' )
	{
		if( pos + 1 === pZ )
		{
			throw new Error( );
		}

		key =
			path.get( pos + 1 );

		if( pos + 2 === pZ )
		{
			console.log( 'SP1', key, value );

			return (
				this.create(
					'twig:set',
					key,
					value
				)
			);
		}

		console.log( 'SP2', key, path, value, pos + 2);

		return (
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
		console.log( 'SP3', key, value );

		return (
			this.create(
				key,
				value
			)
		);
	}

	console.log( 'SP4', path, value, pos + 1 );

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
JoobjProto.getPath =
	function(
		path,  // path to set
		pos    // position in the path
	)
{
	if( pos === undefined )
	{
		pos =
			0;
	}

	var
		pZ =
			path.length,

		key =
			path.get( pos );

	if( key === 'twig' )
	{
		if( pos + 1 === pZ )
		{
			throw new Error( );
		}

		key =
			path.get( pos + 1 );

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

	console.log( '1', this );
	console.log( '2', key );
	console.log( '3', this[ key ] );


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
| Node export
*/
if( SERVER )
{
	module.exports =
		JoobjProto;
}


} )( );
