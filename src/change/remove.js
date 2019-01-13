/*
| A text removal change.
*/
'use strict';


tim.define( module, ( def, change_remove ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// removes at this path
		path : { json : true, type : 'tim.js/src/path' },

		// source sign
		val : { json : true, type : 'string' },

		// remove at this place begin
		at1 : { json : true, type : 'integer' },

		// remove ends here
		// must be at1 + val.length
		// FUTURE have it lazyEval
		at2 : { json : true, type : 'integer' },
	};

	def.json = 'change_remove';
}


const change_grow = require( './grow' );

const change_insert = require( './insert' );

const change_join = require( './join' );

const change_list = require( './list' );

const change_mark_node = require( './mark/node' );

const change_mark_text = require( './mark/text' );

const change_set = require( './set' );

const change_shrink = require( './shrink' );

const change_split = require( './split' );

const change_wrap = require( './wrap' );

const change_wrapList = require( './wrapList' );

const error = require( './error' );




/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.func._check =
/**/		function( )
/**/	{
/**/		if( this.at1 + this.val.length !== this.at2 )
/**/		{
/**/			throw error.make( 'remove.at1 + remove.val.length !== remove.at2' );
/**/		}
/**/
/**/		if( this.at1 < 0 || this.at2 < 0 )
/**/		{
/**/			throw error.make( 'remove.at1|at2 negative' );
/**/		}
/**/	};
/**/}


/*
| Returns the inversion to this change.
*/
def.lazy.reverse =
	function( )
{
	const inv =
		change_insert.create(
			'path', this.path,
			'val', this.val,
			'at1', this.at1,
			'at2', this.at2
		);

	tim.aheadValue( inv, 'reverse', this );

	return inv;
};



/*
| Performs the insertion change on a tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	const text = tree.getPath( this.path );

	if( typeof( text ) !== 'string' )
	{
		throw error.make( 'remove.path signates no string' );
	}

	const val = text.substring( this.at1, this.at2 );

	if( val !== this.val )
	{
		throw error.make( 'remove.val wrong: ' + val + ' !== ' + this.val );
	}

	return(
		tree.setPath(
			this.path,
			text.substring( 0, this.at1 )
			+ text.substring( this.at2 )
		)
	);
};


/*
| Returns a change, changeList, changeWrap or changeWrapList
| transformed on this change.
*/
def.func.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.timtype )
	{
		case change_mark_text :

			return this._transformTextMark( cx );

		case change_grow :
		case change_shrink :
		case change_set :
		case change_mark_node :

			return cx;

		case change_join :
		case change_split :

			return this._transformJoinSplit( cx );

		case change_insert :

			return this._transformInsert( cx );

		case change_remove :

			return this._transformRemove( cx );

		case change_list :

			return this._transformChangeList( cx );

		case change_wrap :

			return this._transformChangeWrap( cx );

		case change_wrapList :

			return this._transformChangeWrapList( cx );

		default :

			throw new Error( );
	}
};


/*
| Transforms an insert change
| considering this remove actually came first.
*/
def.func._transformInsert =
	function(
		cx
	)
{
/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_insert ) throw new Error( );
/**/}

	if( !this.path.equals( cx.path ) )
	{
		return cx;
	}

	if( cx.at1 < this.at1 )
	{
		return cx;
	}
	else if( cx.at1 <= this.at2 )
	{
		return cx.create( 'at1', this.at1, 'at2', this.at1 + cx.val.length );
	}
	{
		const len = this.val.length;

		return cx.create( 'at1', cx.at1 - len, 'at2', cx.at2 - len );
	}
};


/*
| Transforms a text mark by this insert.
*/
def.func._transformTextMark =
	function(
		mark
	)
{
	if( !this.path.equals( mark.path ) ) return mark;

	if( mark.at < this.at1 )
	{
		return mark;
	}
	else if( mark.at <= this.at2 )
	{
		return mark.create( 'at', this.at1 );
	}
	else
	{
		return mark.create( 'at', mark.at - this.val.length );
	}
};


/*
| Transforms another remove change.
| considering this remove actually came first.
*/
def.func._transformRemove =
	function(
		cx
	)
{

/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_remove ) throw new Error( );
/**/}

	if( !this.path.equals( cx.path ) ) return cx;

	const len = this.at2 - this.at1;

	// text            tttttttttttt
	// this remove        ######
	// case 0:        xxx '    '      cx to left, no effect
	// case 1:            '    ' xxx  cx to right, move to left
	// case 2:          xx******x     cx both sides reduced
	// case 3:            ' ** '      cx fully gone
	// case 4:          xx**   '      cx partially reduced
	// case 5:            '   **xx    cx partially reduced

	if( cx.at2 <= this.at1 )
	{
		// console.log( 'case 0' );

		return cx;
	}
	else if( cx.at1 >= this.at2 )
	{
		// console.log( 'case 1' );

		return(
			cx.create(
				'at1', cx.at1 - len,
				'at2', cx.at2 - len
			)
		);
	}
	else if( cx.at1 < this.at1 && cx.at2 > this.at2 )
	{
		// console.log( 'case 2' );

		return(
			cx.create(
				'at2', cx.at2 - len,
				'val',
					cx.val.substring( 0, this.at1 - cx.at1 )
					+ cx.val.substring( this.at2 - cx.at1 )
			)
		);
	}
	else if( cx.at1 >= this.at1 && cx.at2 <= this.at2 )
	{
		// console.log( 'case 3' );

		return undefined;
	}
	else if( cx.at1 < this.at1 && cx.at2 <= this.at2 )
	{
		// console.log( 'case 4' );

		return(
			cx.create(
				'at2', this.at1,
				'val', cx.val.substring( 0, this.at1 - cx.at1 )
			)
		);
	}
	else if( cx.at1 <= this.at2 && cx.at2 > this.at2 )
	{
		// console.log( 'case 5' );

		return(
			cx.create(
				'at1', this.at1,
				'at2', this.at1 + cx.at2 - this.at2,
				'val', cx.val.substring( this.at2 - cx.at1 )
			)
		);
	}

	// one of the above cases should have been applied
	throw new Error( );
};


/*
| Transforms a join or split change.
| considering this remove actually came first.
*/
def.func._transformJoinSplit =
	function(
		cx
	)
{
	// console.log( 'transform join/split by remove' );

/**/if( CHECK )
/**/{
/**/	if( cx.timtype !== change_join && cx.timtype !== change_split )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !this.path.equals( cx.path ) ) return cx;

	// text    ttttttttttttt
	// remove     ' xxxx '
	// case 0     ^   '  '      split left
	// case 1         ^  '      split middle
	// case 2            ^      split right


	if( this.at1 >= cx.at1 )
	{
		// case 0

		// the remove happens fully in the line to be
		// splitted so no change
		return cx;
	}
	else if( this.at2 > cx.at1 )
	{
		// case 1

		// the remove shifts the split on its left end

		return cx.create( 'at1', this.at1 );
	}
	else
	{
		// case 2

		// the remove shifts the split by its length
		// joins are always case 2 since join.at1 == text.length

		const len = this.val.length;

		return cx.create( 'at1', cx.at1 - len );
	}
};


} );
