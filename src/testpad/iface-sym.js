/*
| The interface simulator simulates a server without ever
| talking to one. Used for debugging.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	IFaceSym;


/*
| Imports
*/
var
	Change,
	MeshMashine,
	meshverse,
	Sign;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Constructor.
*/
IFaceSym =
	function( )
{
	// the current space;
	this.$space  =
		meshverse.grow(
			{
				type :
					'Space',
				twig :
				{
					'testnote' :
					{
						type :
							'Note',
						doc :
						{
							type :
								'Doc',
							twig :
							{
								'1' :
								{
									type :
										'Para',
									text :
										'muhkuh'
								}
							},
							ranks :
							[
								'1'
							]
						},
						zone     :
						{
							type :
								'Rect',
							pnw  :
							{
								type :
									'Point',
								x :
									0,
								y :
									0
							},
							pse  :
							{
								type :
									'Point',
								x :
									100,
								y :
									100
							}
						},
						fontsize :
							13
					}
				},
				ranks :
				[
					'testnote'
				]
			}
		);

	// current update request
	this.$changes =
		[ ];

	this.$seq = 0;
};


/*
| Sets the current user
*/
IFaceSym.prototype.setUser =
	function(
		user,
		passhash
	)
{
	this.$user =
		user;

	this.$passhash =
		passhash;
};


/*
| Gets a twig.
*/
IFaceSym.prototype.get =
	function(
		path,
		len
	)
{
	var
		changes =
			this.$changes,
		cZ =
			changes.length,
		seq =
			this.$seq,
		space =
			this.$space;

	if( seq < 0 || seq > cZ )
	{
		throw new Error(
			'invalid seq'
		);
	}

	// if the requested tree is not the latest,
	// it is replayed backwards
	for(
		var a = cZ - 1;
		a >= seq;
		a--
	)
	{
		var
			chgX =
				changes[ a ];

		for (
			var b = 0;
			b < chgX.length;
			b++
		)
		{
			space = chgX.
				get( 0 ).
				invert( ).
				changeTree( space ).
				tree;
		}
	}

	// returns the path requested
	return space.getPath( path, len );
};


/*
| Alters the tree
*/
IFaceSym.prototype.alter =
	function(
		src,
		trg
	)
{
    var
		chgX =
			new Change(
				new Sign( src ),
				new Sign( trg )
			),

		changes =
			this.$changes,
		cZ =
			changes.length,
		seq =
			this.$seq;

	for(
		var s = seq;
		s < cZ;
		s++
	)
	{
		chgX =
			MeshMashine.tfxChgX( chgX, changes[ s ] );

		if( chgX === null )
		{
			return null;
		}
	}

	var
		r =
			chgX.changeTree( this.$space );

	chgX =
		r.chgX;

	for(
		var a = 0;
		a < chgX.length;
		a++
	)
	{
		this.$changes.push( chgX.get( a ) );
	}

    this.$space =
		r.tree;

    return r.chgX;
};


/*
| Sets the seq 'alter' and 'get' will react on
*/
IFaceSym.prototype.goToSeq =
	function(
		seq
	)
{
	var
		cZ =
			this.$changes.length;

	if( seq > cZ || seq < 0 )
	{
		seq = cZ;
	}

	this.$seq =
		seq;

	return seq;
};


} )( );
