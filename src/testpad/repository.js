/*
| The repository simulator does not talk to a server.
*/
'use strict';


tim.define( module, 'testpad_repository', ( def, testpad_repository ) => {


const change_wrapList = require( '../change/wrapList' );

const fabric_doc = require( '../fabric/doc' );

const fabric_note = require( '../fabric/note' );

const fabric_para = require( '../fabric/para' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const limit = require( '../math/root' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		seq :
		{
			// current sequence numer
			type : 'integer',
			defaultValue : '0'
		},
		_changeWrapList :
		{
			// history of all changes
			type : [ 'undefined', 'change_wrapList' ]
		},
		_note :
		{
			// the note
			type : [ 'undefined', 'fabric_note' ]
		}
	};

	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
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

	this.seq = limit( 0, this.seq, this._changeWrapList.length );
};


/*
| Gets a twig.
*/
def.func.get =
	function(
		path,
		len
	)
{
	const cwList = this._changeWrapList;

	const cZ = cwList.length;

	const seq = this.seq;

	let note = this._note;

	if( seq < 0 || seq > cZ )
	{
		throw new Error( 'invalid seq' );
	}

	// if the requested seq is not latest,
	// rewinds stuff
	for( let a = cZ - 1; a >= seq; a-- )
	{
		const changeList = cwList.get( a ).changeList;

		note = changeList.changeTreeReverse( note );
	}

	// returns the path requested
	return note.getPath( path, len );
};


/*
| Alters the tree.
*/
def.func.alter =
	function(
		cw  // changeWrap
	)
{
	const cwList = this._changeWrapList;

	const seq = this.seq;

	for( let s = seq, sZ = cwList.length; s < sZ; s++ )
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


} );
