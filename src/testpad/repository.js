/*
| The repository simulator does not talk to a server.
*/

var
	change_wrapRay,
	euclid_point,
	euclid_rect,
	fabric_doc,
	fabric_note,
	fabric_para,
	fabric_space,
	jools,
	root,
	testpad_repository;


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
			'testpad_repository',
		attributes :
			{
				seq :
					{
						comment :
							'current sequence numer',
						type :
							'integer',
						defaultValue :
							'null'
					},
				_changeWrapRay :
					{
						comment :
							'history of all changes',
						type :
							'change_wrapRay',
						defaultValue :
							'null'
					},
				// TODO _space
				space :
					{
						comment :
							'the action the user is preparing',
						type :
							'fabric_space',
						defaultValue :
							'null'
					}
			},
		init :
			[ ]
	};
}


var
	nextcid;

nextcid = 1001;

/*
| Initializer.
*/
testpad_repository.prototype._init =
	function( )
{
	// the current space;
	if( this.space === null )
	{
		this.space  =
			fabric_space.create(
				'twig:add',
				'testnote',
				fabric_note.create(
					'doc',
						/*
						fabric_doc.create(
							'twig:add', '1',
								fabric_para.create(
									'text', 'Why would I want to know that?'
								),
							'twig:add', '2',
								fabric_para.create(
									'text', 'Can we have Bender Burgers again?'
								),
							'twig:add', '3',
								fabric_para.create(
									'text', 'And so we say goodbye to '
									+ 'our beloved pet, Nibbler.'
								)
						),
						*/
						fabric_doc.create(
							'twig:add', '1',
								fabric_para.create(
									'text', 'Ameno'
								),
							'twig:add', '2',
								fabric_para.create(
									'text', 'Latire'
								),
							'twig:add', '3',
								fabric_para.create(
									'text', 'Dorime'
								)
						),
					'zone',
						euclid_rect.create(
							'pnw',
								euclid_point.create( 'x', 0, 'y', 0 ),
							'pse',
								euclid_point.create( 'x', 100, 'y', 100 )
						),
					'fontsize', 13
			)
		);
	}

	if( this._changeWrapRay === null )
	{
		this._changeWrapRay = change_wrapRay.create( );
	}

	if( this.seq === null )
	{
		this.seq = 0;
	}

	this.seq = jools.limit( 0, this.seq, this._changeWrapRay.length );
};


/*
| Gets a twig.
*/
testpad_repository.prototype.get =
	function(
		path,
		len
	)
{
	var
		a,
		cwRay,
		changeRay,
		cZ,
		seq,
		space;

	cwRay = this._changeWrapRay;

	cZ = cwRay.length;

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
		changeRay = cwRay.get( a ).changeRay;

		space = changeRay.invert.changeTree( space );
	}

	// returns the path requested
	return space.getPath( path, len );
};


/*
| Alters the tree.
*/
testpad_repository.prototype.alter =
	function(
		cw  // changeWrap
	)
{
	var
		cwRay,
		s,
		sZ,
		seq,
		tree;

	cwRay = this._changeWrapRay;

	seq = this.seq;

	for(
		s = seq, sZ = cwRay.length;
		s < sZ;
		s++
	)
	{
		cw = cwRay.get( s ).transform( cw );
	}

	tree = cw.changeTree( this.space );

	root.create(
		'link',
			this.create(
				'_changeWrapRay', cwRay,
				'space', tree
			)
	);
};


} )( );
