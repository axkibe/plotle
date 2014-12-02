/*
| The repository simulator does not talk to a server.
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
	ccot_changeWrap,
	ccot_changeWrapRay,
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
				// TODO _space
				space :
					{
						comment :
							'the action the user is preparing',
						type :
							'visual.space',
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
					},
				_changes :
					{
						comment :
							'history of the space changes',
						type :
							'ccot.changeWrapRay',
						defaultValue :
							null
					},
			},
		init :
			[ ]
	};
}


var
	nextcid,
	proto,
	repos;

nextcid = 1001;

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

	if( this._changes === null )
	{
		this._changes = ccot_changeWrapRay.create( );
	}

	if( this.seq === null )
	{
		this.seq = 0;
	}

	this.seq = jools.limit( 0, this.seq, this._changes.length );
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

	changes = this._changes;

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
		chgX = changes.get( a ).chgX;

		for( b = 0; b < chgX.length; b++ )
		{
			space = chgX.get( 0 ).invert.changeTree( space ).tree;
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
		chgX,
		changes,
		cZ,
		r,
		s,
		seq;

	changes = this._changes;

	cZ = changes.length;

	chgX = chg;

	seq = this.seq;

	for(
		s = seq;
		s < cZ;
		s++
	)
	{
		chgX = changes.get( s ).chgX.transform( chgX );

		if( chgX === null )
		{
			return null;
		}
	}

	r = chgX.changeTree( this.space );

	changes =
		changes.append(
			ccot_changeWrap.create(
				'cid', '' + ( nextcid++ ),
				'chgX', r.reaction,
				'seq', seq + 1
			)
		);

	root.create(
		'link',
			this.create(
				'_changes',
					changes,
				'space',
					r.tree
			)
	);

	return r.reaction;
};


} )( );
