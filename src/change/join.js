/*
| A text ( para ) is joined.
*/
'use strict';


tim.define( module, ( def, change_join ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// join at this place
		// must be length of text
		at1 : { type : 'integer', json : true },

		// join at this trace
		trace : { type : '../trace/text', json : true },

		// join this
		// must be after trace
		trace2 : { type : '../trace/text', json : true },
	};

	def.json = 'change_join';
}


const change_grow = tim.require( './grow' );

const change_insert = tim.require( './insert' );

const change_list = tim.require( './list' );

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
	const at1 = this.at1;

	const trace = this.trace;

	const trace2 = this.trace2;

	if( !trace2.traceDoc.equals( trace.traceDoc ) )
	{
		throw error.make( 'split.trace/2 not on same doc' );
	}

	const text = trace.pick( tree );

	const text2 = trace2.pick( tree );

	if( typeof( text ) !== 'string' ) throw error.make( 'join.trace yields no string' );

	if( typeof( text2 ) !== 'string' ) throw error.make( 'join.trace2 yields no string' );

	let pivot = trace.traceDoc.pick( tree );

	if( !pivot.getKey ) throw error.make( 'join.pivot not ranked' );

	if( at1 !== text.length ) throw error.make( 'join.at1 !== text.length' );

	const key = trace.tracePara.key;

	const key2 = trace2.tracePara.key;

	let para1 = pivot.get( key );

	const para2 = pivot.get( key2 );

	const rank1 = pivot.rankOf( key );

	const rank2 = pivot.rankOf( key2 );

	if( rank1 < 0 ) throw error.make( 'join.trace has no rank' );

	if( rank2 < 0 ) throw error.make( 'join.trace2 has no rank' );

	if( rank1 + 1 !== rank2 ) throw error.make( 'join ranks not sequential' );

	para1 = para1.create( 'text', para1.text + para2.text );

	pivot =
		pivot.create(
			'twig:set', key, para1,
			'twig:remove', key2
		);

	return trace.traceDoc.graft( tree, pivot );
};


/*
| Returns the inversion to this change.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_split.create(
			'at1', this.at1,
			'trace', this.trace,
			'trace2', this.trace2
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
	if( this.at1 < 0 ) throw error.make( 'join.at1 negative' );
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

	// FUTURE might be para
	map.set( change_set,  '_transformSame' );

	// FUTURE change ranks
	// but right now this can never happen
	// since for text split/join is excl. used
	// and grow/shrink excl. for items
	map.set( change_grow,   '_transformSame' );
	map.set( change_shrink, '_transformSame' );

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
| Transforms an insert/remove change
| considering this join actually came first.
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

	if( !this.trace2.equals( cx.trace ) ) return cx;

	return(
		cx.create(
			'trace', this.trace,
			'at1', cx.at1 + this.at1,
			'at2', cx.at2 + this.at1
		)
	);
};


/*
| Transforms an join/split change
| considering this join actually came first.
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

	if( !this.trace2.equals( cx.trace ) ) return cx;

	return(
		cx.create(
			'trace', this.trace,
			'at1', cx.at1 + this.at1
		)
	);
};


/*
| Transforms an offset.
*/
def.proto._transformOffset =
	function(
		offset
	)
{
/**/if( CHECK )
/**/{
/**/	if( offset.timtype !== trace_offset ) throw new Error( );
/**/}

	// is the offset trace on another paragraph?
	// since the offset stores para key there is no change
	// needed even it is below the split
	if( !this.trace2.equals( offset.last.chopRoot ) ) return offset;

	return this.trace.prependRoot.appendOffset( offset.at + this.at1 );
};


} );
