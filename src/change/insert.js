/*
| A text insertion change.
*/
'use strict';


tim.define( module, ( def, change_insert ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// insert at this path
		path : { type : 'tim.js/path', json : true },

		// insert this
		val : { type : 'string', json : true },

		// insert at this place begin
		at1 : { type : 'integer', json : true },

		// insert ends here
		// must be at1 + val.length
		// FUTURE have this be a lazy
		at2 : { type : 'integer', json : true },
	};

	def.json = 'change_insert';
}


const change_grow = tim.require( './grow' );

const change_list = tim.require( './list' );

const change_join = tim.require( './join' );

const change_remove = tim.require( './remove' );

const change_set = tim.require( './set' );

const change_shrink = tim.require( './shrink' );

const change_split = tim.require( './split' );

const change_mark_node = tim.require( './mark/node' );

const change_mark_text = tim.require( './mark/text' );

const change_wrap = tim.require( './wrap' );

const change_wrapList = tim.require( './wrapList' );

const error = tim.require( './error' );


/*
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.at1 + this.val.length !== this.at2 )
/**/	{
/**/		throw error.make( 'insert.at1 + insert.val.length !== insert.at2' );
/**/	}
/**/
/**/	if( this.at1 < 0 || this.at2 < 0 )
/**/	{
/**/		throw error.make( 'insert.at1|at2 negative' );
/**/	}
/**/}
};


/*
| Returns the inversion to this change.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_remove.create(
			'path', this.path,
			'val', this.val,
			'at1', this.at1,
			'at2', this.at2
		);

	tim.aheadValue( inv, 'reversed', this );

	return inv;
};


/*
| Performs the insertion change on a tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	const text = tree.getPath( this.path );

	if( typeof( text ) !== 'string' ) throw error.make( 'insert.path signates no string' );

	if( this.at1 > text.length ) throw error.make( 'insert.at1 invalid' );

	return(
		tree.setPath(
			this.path,
			text.substring( 0, this.at1 )
			+ this.val
			+ text.substring( this.at1 )
		)
	);
};


/*
| Maps transformables to transform functions
*/
def.staticLazy._transformers = ( ) =>
{
	const map = new Map( );

	const tSame           = ( c ) => c;
	const tTextmark       = function( c ) { return this._transformTextMark( c ); };
	const tJoinSplit      = function( c ) { return this._transformJoinSplit( c ); };
	const tInsertRemove   = function( c ) { return this._transformInsertRemove( c ); };
	const tChangeList     = function( c ) { return this._transformChangeList( c ); };
	const tChangeWrap     = function( c ) { return this._transformChangeWrap( c ); };
	const tChangeWrapList = function( c ) { return this._transformChangeWrapList( c ); };

	map.set( change_mark_text, tTextmark );

	map.set( change_grow,      tSame );
	map.set( change_shrink,    tSame );
	map.set( change_set,       tSame );
	map.set( change_mark_node, tSame );

	map.set( change_join,      tJoinSplit );
	map.set( change_split,     tJoinSplit );

	map.set( change_insert,    tInsertRemove );
	map.set( change_remove,    tInsertRemove );

	map.set( change_list,      tChangeList );
	map.set( change_wrap,      tChangeWrap );
	map.set( change_wrapList,  tChangeWrapList );

	return map;
};


/*
| Transforms another insert/remove change
| considering this insert actually came first.
*/
def.proto._transformInsertRemove =
	function(
		cx
	)
{
/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_insert && cx.timtype !== change_remove ) throw new Error( );
/**/}

	if( !this.path.equals( cx.path ) ) return cx;

	if( cx.at1 < this.at1 ) return cx;

	const len = this.val.length;

	return cx.create( 'at1', cx.at1 + len, 'at2', cx.at2 + len );
};


/*
| Transforms a text mark by this insert.
*/
def.proto._transformTextMark =
	function(
		mark
	)
{
	return(
		( !this.path.equals( mark.path ) || mark.at < this.at1 )
		? mark
		: mark.create( 'at', mark.at + this.val.length )
	);
};


/*
| Transforms a join or split change.
| considering this insert actually came first.
*/
def.proto._transformJoinSplit =
	function(
		cx
	)
{

/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_join && cx.timtype !== change_split ) throw new Error( );
/**/}

	if( !this.path.equals( cx.path ) ) return cx;

	if( this.at1 > cx.at1 )
	{
		// this insert is in the line to be splited
		// so no need to change the split

		// for joins this cannot happen anyway
		return cx;
	}

	return cx.create( 'at1', cx.at1 + this.val.length );
};


} );
