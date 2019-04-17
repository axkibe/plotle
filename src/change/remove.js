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
		path : { json : true, type : 'tim.js/path' },

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


const change_grow = tim.require( './grow' );

const change_insert = tim.require( './insert' );

const change_join = tim.require( './join' );

const change_list = tim.require( './list' );

const change_set = tim.require( './set' );

const change_shrink = tim.require( './shrink' );

const change_split = tim.require( './split' );

const change_wrap = tim.require( './wrap' );

const change_wrapList = tim.require( './wrapList' );

const error = tim.require( './error' );

const mark_caret = tim.require( '../mark/caret' );

const mark_items = tim.require( '../mark/items' );

const mark_pat = tim.require( '../mark/pat' );

const mark_range = tim.require( '../mark/range' );

const mark_widget = tim.require( '../mark/widget' );


/*
» Exta checking
*/
def.proto._check =
	function( )
{
	if( this.at1 + this.val.length !== this.at2 )
	{
		throw error.make( 'remove.at1 + remove.val.length !== remove.at2' );
	}

	if( this.at1 < 0 || this.at2 < 0 ) throw error.make( 'remove.at1|at2 negative' );
};


/*
| Returns the inversion to this change.
*/
def.lazy.reversed =
	function( )
{
	const inv =
		change_insert.create(
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
| Maps transformables to transform functions
*/
def.staticLazy._transformers = ( ) =>
{
	const map = new Map( );

	const tSame           = ( c ) => c;
	const tMarkPat        = function( c ) { return this._transformMarkPat( c ); };
	const tMarkCaret      = function( c ) { return this._transformMarkCaret( c ); };
	const tMarkRange      = function( c ) { return this._transformMarkRange( c ); };
	const tJoinSplit      = function( c ) { return this._transformJoinSplit( c ); };
	const tInsert         = function( c ) { return this._transformInsert( c ); };
	const tRemove         = function( c ) { return this._transformRemove( c ); };
	const tChangeList     = function( c ) { return this._transformChangeList( c ); };
	const tChangeWrap     = function( c ) { return this._transformChangeWrap( c ); };
	const tChangeWrapList = function( c ) { return this._transformChangeWrapList( c ); };

	map.set( mark_pat,    tMarkPat );
	map.set( mark_caret,  tMarkCaret );
	map.set( mark_range,  tMarkRange );
	map.set( mark_items,  tSame );
	map.set( mark_widget, tSame );

	map.set( change_grow,      tSame );
	map.set( change_shrink,    tSame );
	map.set( change_set,       tSame );

	map.set( change_join,      tJoinSplit );
	map.set( change_split,     tJoinSplit );

	map.set( change_insert,    tInsert );
	map.set( change_remove,    tRemove );

	map.set( change_list,      tChangeList );
	map.set( change_wrap,      tChangeWrap );
	map.set( change_wrapList,  tChangeWrapList );

	return map;
};


/*
| Transforms an insert change
| considering this remove actually came first.
*/
def.proto._transformInsert =
	function(
		c
	)
{
/**/if( CHECK )
/**/{
/**/	if( c.timtype !== change_insert ) throw new Error( );
/**/}

	if( !this.path.equals( c.path ) ) return c;

	if( c.at1 < this.at1 ) return c;
	else if( c.at1 <= this.at2 )
	{
		return c.create( 'at1', this.at1, 'at2', this.at1 + c.val.length );
	}
	else
	{
		const len = this.val.length;

		return c.create( 'at1', c.at1 - len, 'at2', c.at2 - len );
	}
};


/*
| Transforms a text mark by this insert.
*/
def.proto._transformMarkPat =
	function(
		mark
	)
{
	if( !this.path.equals( mark.path.chop ) ) return mark;

	if( mark.at < this.at1 ) return mark;
	else if( mark.at <= this.at2 ) return mark.create( 'at', this.at1 );
	else return mark.create( 'at', mark.at - this.val.length );
};


/*
| Transforms another remove change.
| considering this remove actually came first.
*/
def.proto._transformRemove =
	function(
		c
	)
{

/**/if( CHECK )
/**/{
/**/	if( c.timtype !== change_remove ) throw new Error( );
/**/}

	if( !this.path.equals( c.path ) ) return c;

	const len = this.at2 - this.at1;

	// text            tttttttttttt
	// this remove        ######
	// case 0:        xxx '    '      c to left, no effect
	// case 1:            '    ' xxx  c to right, move to left
	// case 2:          xx******x     c both sides reduced
	// case 3:            ' ** '      c fully gone
	// case 4:          xx**   '      c partially reduced
	// case 5:            '   **xx    c partially reduced

	if( c.at2 <= this.at1 )
	{
		return c;
	}
	else if( c.at1 >= this.at2 )
	{
		return(
			c.create(
				'at1', c.at1 - len,
				'at2', c.at2 - len
			)
		);
	}
	else if( c.at1 < this.at1 && c.at2 > this.at2 )
	{
		return(
			c.create(
				'at2', c.at2 - len,
				'val',
					c.val.substring( 0, this.at1 - c.at1 )
					+ c.val.substring( this.at2 - c.at1 )
			)
		);
	}
	else if( c.at1 >= this.at1 && c.at2 <= this.at2 )
	{
		return undefined;
	}
	else if( c.at1 < this.at1 && c.at2 <= this.at2 )
	{
		return(
			c.create(
				'at2', this.at1,
				'val', c.val.substring( 0, this.at1 - c.at1 )
			)
		);
	}
	else if( c.at1 <= this.at2 && c.at2 > this.at2 )
	{
		return(
			c.create(
				'at1', this.at1,
				'at2', this.at1 + c.at2 - this.at2,
				'val', c.val.substring( this.at2 - c.at1 )
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
def.proto._transformJoinSplit =
	function(
		c
	)
{
	// console.log( 'transform join/split by remove' );

/**/if( CHECK )
/**/{
/**/	if( c.timtype !== change_join && c.timtype !== change_split ) throw new Error( );
/**/}

	if( !this.path.equals( c.path ) ) return c;

	// text    ttttttttttttt
	// remove     ' xxxx '
	// case 0     ^   '  '      split left
	// case 1         ^  '      split middle
	// case 2            ^      split right


	if( this.at1 >= c.at1 )
	{
		// case 0
		// the remove happens fully in the line to be
		// splitted so no change
		return c;
	}
	else if( this.at2 > c.at1 )
	{
		// case 1
		// the remove shifts the split on its left end
		return c.create( 'at1', this.at1 );
	}
	else
	{
		// case 2
		// the remove shifts the split by its length
		// joins are always case 2 since join.at1 == text.length
		const len = this.val.length;

		return c.create( 'at1', c.at1 - len );
	}
};


} );
