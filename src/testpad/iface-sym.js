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
	Jion,
	Jools,
	MeshMashine,
	Visual;


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
	this.space  =
		// FUTURE FIX
		Visual.Space.create(
			'twig:add',
			'testnote',
			Visual.Note.create(
				'doc',
					Visual.Doc.create(
						'twig:add',
						'1',
							Visual.Para.create(
								'text',
									'Why would I want to know that?'
							),
						'twig:add',
						'$new',
							Visual.Para.create(
								'text',
									'Can we have Bender Burgers again?'
							),
						'twig:add',
						'$new',
							Visual.Para.create(
								'text',
									'And so we say goodbye to ' +
									'our beloved pet, Nibbler.'
							)
					),
				'zone',
					Visual.Rect.create(
						'pnw',
							Visual.Point.create(
								'x',
									0,
								'y',
									0
							),
						'pse',
							Visual.Point.create(
								'x',
									100,
								'y',
									100
							)
					),
				'fontsize',
					13
			)
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
			this.space;

	if( seq < 0 || seq > cZ )
	{
		throw new Error(
			'invalid seq'
		);
	}

	// if the requested seq is not latest,
	// rewinds stuff
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
			space =
				chgX
				.get( 0 )
				.invert( )
				.changeTree( space )
				.tree;
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
		a,
		aZ,
		chgX =
			new Change(
				Jion.Sign.CreateFromJSON( src ),
				Jion.Sign.CreateFromJSON( trg )
			),
		changes =
			this.$changes,
		cZ =
			changes.length,
		s,
		seq =
			this.$seq;

	for(
		s = seq;
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
			chgX
			.changeTree( this.space );

	chgX =
		r.chgX;

	for(
		a = 0, aZ = chgX.length;
		a < aZ;
		a++
	)
	{
		this.$changes.push( chgX.get( a ) );
	}

	this.space =
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

	seq =
	this.$seq =
		Jools.limit(
			0,
			seq,
			cZ
		);

	return seq;
};


} )( );
