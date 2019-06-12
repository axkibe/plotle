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
		// insert at this place begin
		at1 : { type : 'integer', json : true },

		// insert ends here
		// must be at1 + val.length
		// FUTURE have this be a lazy
		at2 : { type : 'integer', json : true },

		// insert this
		val : { type : 'string', json : true },

		// insert at this path
		path : { type : 'tim.js/path', json : true },
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

const change_wrap = tim.require( './wrap' );

const change_wrapList = tim.require( './wrapList' );

const error = tim.require( './error' );

const mark_caret = tim.require( '../mark/caret' );

const mark_items = tim.require( '../mark/items' );

const mark_range = tim.require( '../mark/range' );

const mark_widget = tim.require( '../mark/widget' );

const trace_offset = tim.require( '../trace/offset' );


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
| Exta checking
*/
def.proto._check =
	function( )
{
	if( this.at1 + this.val.length !== this.at2 )
	{
		throw error.make( 'insert.at1 + insert.val.length !== insert.at2' );
	}

	if( this.at1 < 0 || this.at2 < 0 ) throw error.make( 'insert.at1|at2 negative' );
};


/*
| Maps transformables to transform functions
*/
def.staticLazy._transformers = ( ) =>
{
	const map = new Map( );

	map.set( mark_caret,  '_transformMarkCaret' );
	map.set( mark_range,  '_transformMarkRange' );
	map.set( mark_items,  '_transformSame' );
	map.set( mark_widget, '_transformSame' );

	map.set( change_grow,   '_transformSame' );
	map.set( change_shrink, '_transformSame' );
	map.set( change_set,    '_transformSame' );

	map.set( change_join,  '_transformJoinSplit' );
	map.set( change_split, '_transformJoinSplit' );

	map.set( change_insert, '_transformInsertRemove' );
	map.set( change_remove, '_transformInsertRemove' );

	map.set( change_list,     '_transformChangeList' );
	map.set( change_wrap,     '_transformChangeWrap' );
	map.set( change_wrapList, '_transformChangeWrapList' );

	return map;
};


/*
| Transforms another insert/remove change
| considering this insert actually came first.
*/
def.proto._transformInsertRemove =
	function(
		c
	)
{
/**/if( CHECK )
/**/{
/**/	if( c.timtype !== change_insert && c.timtype !== change_remove ) throw new Error( );
/**/}

	if( !this.path.equals( c.path ) ) return c;

	if( c.at1 < this.at1 ) return c;

	const len = this.val.length;

	return c.create( 'at1', c.at1 + len, 'at2', c.at2 + len );
};


/*
| Transforms a pat mark by this insert.
*/
def.proto._transformOffset =
	function(
		offset
	)
{
/**/if( CHECK )
/**/{
/**/	if( offset.timtype !== trace_offset ) throw new Error( );
/**/
/**/	if( !offset.traceRoot ) throw new Error( );
/**/}

	// the insert is on another paragraph or after the offset trace
	if( !this.trace.equals( offset.tracePara.chopRoot ) || offset.at < this.at1 ) return offset;

	return offset.create( 'at', offset.at + this.val.length );
};


/*
| Transforms a join or split change.
| considering this insert actually came first.
*/
def.proto._transformJoinSplit =
	function(
		c
	)
{
/**/if( CHECK )
/**/{
/**/	if( c.timtype !== change_join && c.timtype !== change_split ) throw new Error( );
/**/}

	if( !this.path.equals( c.path ) ) return c;

	if( this.at1 > c.at1 )
	{
		// this insert is in the line to be splited
		// so no need to change the split

		// for joins this cannot happen anyway
		return c;
	}

	return c.create( 'at1', c.at1 + this.val.length );
};


} );
