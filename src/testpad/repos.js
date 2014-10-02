/*
| The repository simulator does not talk to a server.
|
| Authors: Axel Kittenberger
*/

/*
| Export
*/
var
	testpad;

testpad = testpad || { };


/*
| Imports
*/
var
	euclid,
	jools,
	root,
	visual;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'testpad.repos',
		attributes :
			{
				space :
					{
						comment :
							'the action the user is preparing',
						type :
							'visual.space',
						defaultValue :
							null
					},
				changes :
					{
						comment :
							'history of the space changes',
						type :
							// FIXME make it a change-wrap-ray
							'Object',
						defaultValue :
							null
					},
				seq :
					{
						comment :
							'current sequence numer',
						type :
							'Integer',
						defaultValue :
							null
					}
			},
		init :
			[ ]
	};
}


var
	proto,
	repos;

repos = testpad.repos;

proto = repos.prototype;

/*
| Initializer.
*/
proto._init =
	function( )
{
	// the current space;
	if( this.space === null )
	{
		this.space  =
			visual.space.create(
				'twig:add',
				'testnote',
				visual.note.create(
					'doc',
						visual.doc.create(
							'twig:add',
							'1',
								visual.para.create(
									'text',
										'Why would I want to know that?'
								),
							'twig:add',
							'2',
								visual.para.create(
									'text',
										'Can we have Bender Burgers again?'
								),
							'twig:add',
							'3',
								visual.para.create(
									'text',
										'And so we say goodbye to ' +
										'our beloved pet, Nibbler.'
								)
						),
					'zone',
						euclid.rect.create(
							'pnw',
								euclid.point.create(
									'x', 0,
									'y', 0
							),
						'pse',
							euclid.point.create(
								'x', 100,
								'y', 100
							)
					),
				'fontsize', 13
			)
		);
	}

	if( this.changes === null )
	{
		this.changes = [ ];
	}

	if( this.seq === null )
	{
		this.seq = 0;
	}

	this.seq = jools.limit( 0, this.seq, this.changes.length );
};


/*
| Gets a twig.
*/
proto.get =
	function(
		path,
		len
	)
{
	var
		a,
		b,
		changes,
		chgX,
		cZ,
		seq,
		space;

	changes = this.changes;

	cZ = changes.length;

	seq = this.seq;

	space = this.space;


	if( seq < 0 || seq > cZ )
	{
		throw new Error( 'invalid seq' );
	}

	// if the requested seq is not latest,
	// rewinds stuff
	for( a = cZ - 1; a >= seq; a-- )
	{
		chgX = changes[ a ];

		for( b = 0; b < chgX.length; b++ )
		{
			space =
				chgX
				.get( 0 )
				.invert
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
proto.alter =
	function(
		chg
	)
{
	var
		a,
		aZ,
		chgX,
		changes,
		cZ,
		r,
		s,
		seq;

	changes = this.changes;

	cZ = changes.length;

	chgX = chg;

	seq = this.seq;

	for(
		s = seq;
		s < cZ;
		s++
	)
	{
		chgX = chgX.transformChangeX( changes[ s ] );

		if( chgX === null )
		{
			return null;
		}
	}

	r = chgX.changeTree( this.space );

	chgX = r.chgX;

	for(
		a = 0, aZ = chgX.length;
		a < aZ;
		a++
	)
	{
		// FIXME changes = changes.append( chgX.get( a ) );
		changes = changes.slice( );
		changes.push( chgX.get( a ) );
	}

	root.create(
		'link',
			this.create(
				'changes',
					changes,
				'space',
					r.tree
			)
	);

	return r.chgX;
};


} )( );
