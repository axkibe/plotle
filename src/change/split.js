/*
| A text ( para ) is splited.
*/
'use strict';


tim.define( module, ( def, change_split ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// insert at this place begin
		at1 : { type : 'integer', json : true },

		// splits at this trace
		trace : { type : [ '< ../trace/change-types' ], json : true },

		// the split creates this new/next trace
		trace2 : { type : [ '< ../trace/change-types' ], json : true },
	};

	def.json = 'change_split';
}


const change_grow = tim.require( './grow' );

const change_insert = tim.require( './insert' );

const change_join = tim.require( './join' );

const change_list = tim.require( './list' );

const change_remove = tim.require( './remove' );

const change_shrink = tim.require( './shrink' );

const change_set = tim.require( './set' );

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

	if( typeof( text ) !== 'string' ) throw error.make( 'split.trace yields no string' );

	let pivot = trace.traceDoc.pick( tree );

	if( !pivot.getKey ) throw error.make( 'split.pivot not ranked' );

	if( at1 > text.length ) throw error.make( 'split.at1 > text.length' );

	const key = trace.tracePara.key;

	const key2 = trace2.tracePara.key;

	if( pivot.get( key2 ) ) throw error.make( 'split.trace2 already exists' );

	let para1 = pivot.get( key );

	const rank1 = pivot.rankOf( key );

	if( rank1 < 0 ) throw error.make( 'split has no rank' );

	para1 = para1.create( 'text', text.substring( 0, at1 ) );

	const para2 = para1.create( 'text', text.substring( at1 ) );

	pivot =
		pivot.create(
			'twig:set', key, para1,
			'twig:insert', key2, rank1 + 1, para2
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
		change_join.create(
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
	if( this.at1 < 0 ) throw error.make( 'split.at1 negative' );
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

	// FUTURE fix ranks
	map.set( change_grow,   '_transformSame' );
	map.set( change_shrink, '_transformSame' );

	map.set( change_set,    '_transformSame' );

	map.set( change_join,   '_transformJoinSplit' );
	map.set( change_split,  '_transformJoinSplit' );

	map.set( change_insert, '_transformInsert' );
	map.set( change_remove, '_transformRemove' );

	map.set( change_list,     '_transformChangeList' );
	map.set( change_wrap,     '_transformChangeWrap' );
	map.set( change_wrapList, '_transformChangeWrapList' );

	return map;
};


/*
| Transforms an insert change
| considering this split actually came first.
*/
def.proto._transformInsert =
	function(
		cx
	)
{
/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_insert ) throw new Error( );
/**/}

	if( !this.trace.equals( cx.trace ) ) return cx;

	if( cx.at1 <= this.at1 ) return cx;

	// insert is changed to happen
	// in the splitted line
	return(
		cx.create(
			'trace', this.trace2,
			'at1', cx.at1 - this.at1,
			'at2', cx.at2 - this.at1
		)
	);
};


/*
| Transforms a join/split change
| considering this split actually came first.
*/
def.proto._transformJoinSplit =
	function(
		cx
	)
{
/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_join && cx.timtype !== change_split )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !this.trace.equals( cx.trace ) ) return cx;

	if( cx.at1 <= this.at1 ) return cx;

	// join/split is changed to happen
	// in the splitted line
	return(
		cx.create(
			'trace', this.trace2,
			'at1', cx.at1 - this.at1
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
	if( !this.trace.equals( offset.last.chopRoot ) ) return offset;

	// is the offset trace before this split?
	if( offset.at < this.at1 ) return offset;

	return this.trace2.prependRoot.appendOffset( offset.at - this.at1 );
};


/*
| Transforms a remove change
| considering this split actually came first.
*/
def.proto._transformRemove =
	function(
		cx
	)
{
/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_remove ) throw new Error( );
/**/}

	// text    ttttttttttttt
	// split         ^
	// case 0    xxx '          remove left
	// case 1      xxxxx        remove is split
	// case 2        ' xxxx     remove right

	if( !this.trace.equals( cx.trace ) ) return cx;

	if( cx.at2 <= this.at1 )
	{
		// case 0, the remove is not affect

		return cx;
	}
	else if( cx.at1 >= this.at1 )
	{
		// case 2, the remove happend in splited line

		return cx.create(
			'trace', this.trace2,
			'at1', cx.at1 - this.at1,
			'at2', cx.at2 - this.at1
		);
	}
	else
	{
		// case 1, the remove is split into two removes
		return(
			change_list.create(
				'list:init',
				[
					cx.create(
						'at2', this.at1,
						'val', cx.val.substring( 0, this.at1 - cx.at1 )
					),
					cx.create(
						'at1', 0,
						'at2', cx.at2 - this.at1,
						'trace', this.trace2,
						'val', cx.val.substring( this.at1 - cx.at1 )
					)
				]
			)
		);
	}
};


} );
