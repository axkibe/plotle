/*
| The repository simulator does not talk to a server.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'testpad_repository',
		attributes :
		{
			seq :
			{
				comment : 'current sequence numer',
				type : 'integer',
				defaultValue : '0'
			},
			_changeWrapList :
			{
				comment : 'history of all changes',
				type : [ 'undefined', 'change_wrapList' ]
			},
			_note :
			{
				comment : 'the note',
				type : [ 'undefined', 'fabric_note' ]
			}
		},
		init : [ ]
	};
}


var
	change_wrapList,
	fabric_doc,
	fabric_note,
	fabric_para,
	gleam_point,
	gleam_rect,
	math_limit,
	root,
	testpad_repository;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	nextcid;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


nextcid = 1001;

/*
| Initializer.
*/
testpad_repository.prototype._init =
	function( )
{
	// the current note;
	if( !this._note )
	{
		this._note =
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
							fabric_para.create( 'text', 'Ameno' ),
						'twig:add', '2',
							fabric_para.create( 'text', 'Latire' ),
						'twig:add', '3',
							fabric_para.create( 'text', 'Dorime' )
					),
				'zone',
					gleam_rect.create(
						'pnw', gleam_point.create( 'x', 0, 'y', 0 ),
						'pse', gleam_point.create( 'x', 100, 'y', 100 )
					),
				'fontsize', 13
			);
	}

	if( !this._changeWrapList )
	{
		this._changeWrapList = change_wrapList.create( );
	}

	this.seq = math_limit( 0, this.seq, this._changeWrapList.length );
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
		cwList,
		changeList,
		cZ,
		note,
		seq;

	cwList = this._changeWrapList;

	cZ = cwList.length;

	seq = this.seq;

	note = this._note;

	if( seq < 0 || seq > cZ )
	{
		throw new Error( 'invalid seq' );
	}

	// if the requested seq is not latest,
	// rewinds stuff
	for( a = cZ - 1; a >= seq; a-- )
	{
		changeList = cwList.get( a ).changeList;

		note = changeList.changeTreeReverse( note );
	}

	// returns the path requested
	return note.getPath( path, len );
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
		cwList,
		s,
		sZ,
		seq;

	cwList = this._changeWrapList;

	seq = this.seq;

	for( s = seq, sZ = cwList.length; s < sZ; s++ )
	{
		cw = cwList.get( s ).transform( cw );
	}

	root.create(
		'repository',
			this.create(
				'_changeWrapList', cwList.append( cw ),
				'_note', cw.changeTree( this._note )
			)
	);
};


} )( );
