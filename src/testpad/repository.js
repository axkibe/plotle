/*
| The repository simulator does not talk to a server.
*/
'use strict';


tim.define( module, ( def, testpad_repository ) => {


if( TIM )
{
	def.attributes =
	{
		// current sequence numer
		seq : { type : 'integer' },

		// history of all changes
		_changeWrapList : { type : [ 'undefined', '../change/wrapList' ] },

		// the space
		space : { type : [ 'undefined', '../fabric/note' ] }
	};
}


const change_wrapList = tim.require( '../change/wrapList' );

const fabric_doc = tim.require( '../fabric/doc' );

const fabric_note = tim.require( '../fabric/note' );

const fabric_para = tim.require( '../fabric/para' );

const fabric_space = tim.require( '../fabric/space' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );


/*
| Creates the start of the repository.
*/
def.static.init =
	function( )
{
	return(
		testpad_repository.create(
			'seq', 0,
			'_changeWrapList',  change_wrapList.create( ),
			'space',
				fabric_space.create(
					'twig:add', 'note',
					fabric_note.create(
						'doc',
							fabric_doc.create(
								'twig:add', '1', fabric_para.create( 'text', 'a' ),
//								'twig:add', '1', fabric_para.create( 'text', 'Ameno' ),
//								'twig:add', '2', fabric_para.create( 'text', 'Latire' ),
//								'twig:add', '3', fabric_para.create( 'text', 'Dorime' )
							),
						'zone', gleam_rect.zero,
						'fontsize', 13,
						'scrollPos', gleam_point.zero
					)
			)
		)
	);
};


/*
| Extra checking.
*/
def.proto._check =
	function( )
{
	if( this.seq < 0 || this.seq > this._changeWrapList.length ) throw new Error( );
};


/*
| The maximum sequence number.
*/
def.lazy.maxSeq =
	function( )
{
	return this._changeWrapList.length;
};


/*
| Gets a twig.
*/
/*

FIXME remove

def.proto.get =
	function(
		path,
		len
	)
{
	const cwList = this._changeWrapList;

	const cwListLen = cwList.length;

	const seq = this.seq;

	let note = this._note;

	if( seq < 0 || seq > cwListLen ) throw new Error( 'invalid seq' );

	// if the requested seq is not latest,
	// rewinds stuff
	for( let a = cwListLen - 1; a >= seq; a-- )
	{
		const changeList = cwList.get( a ).changeList;

		note = changeList.changeTreeReverse( note );
	}

	// returns the path requested
	return note.getPath( path, len );
};
*/


/*
| Alters the tree.
*/
def.proto.alter =
	function(
		cw  // changeWrap
	)
{
	const cwList = this._changeWrapList;

	const seq = this.seq;

	for( let s = seq, slen = cwList.length; s < slen; s++ )
	{
		cw = cwList.get( s ).transform( cw );
	}

	root.create(
		'repository',
			this.create(
				'_changeWrapList', cwList.append( cw ),
				'space', cw.changeTree( this.space )
			)
	);
};


} );
