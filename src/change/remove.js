/*
| A text insertion change.
*/

var
	change_generic,
	change_error,
	change_insert,
	change_remove,
	result_changeTree,
	jools;


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
			'change_remove',
		attributes :
			{
				path :
					{
						comment :
							'insert at this path',
						json :
							'true',
						type :
							'jion_path'
					},
				val :
					{
						comment :
							'source sign',
						json :
							'true',
						type :
							'String'
					},
				at1 :
					{
						comment :
							'insert at this place begin',
						json :
							'true',
						type :
							'Integer'
					},
				at2 :
					{
						comment :
							'insert ends here ( must be at1 + val.length )',
						json :
							'true',
						type :
							'Integer'
					}
			},
		init :
			[ ]
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	change_remove = require( '../jion/this' )( module );

	change_generic = require( './generic' );

	change_error = require( './error' );

	change_insert = require( './insert' );

	jools = require( '../jools/jools' );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Initializer.
*/
change_remove.prototype._init =
	function ( )
{
	if( this.at1 + this.val.length !== this.at2 )
	{
		throw change_error(
			'remove.at1 + remove.val.length !== remove.at2'
		);
	}

	if( this.at1 < 0 || this.at2 < 0 )
	{
		throw change_error( 'remove.at1|at2 negative' );
	}
};


/*
| Performs the insertion change on a tree.
*/
change_remove.prototype.changeTree =
	function(
		tree,
		resultModality
	)
{
	var
		text,
		val;

	text = tree.getPath( this.path );

	if( !jools.isString( text ) )
	{
		throw change_error( 'remove.path signates no string' );
	}

	val = text.substring( this.at1, this.at2 );

	if( val !== this.val )
	{
		throw change_error( 'remove.val wrong: ' + val + ' !== ' + this.val );
	}


	tree =
		tree.setPath(
			this.path,
			text.substring( 0, this.at1 )
			+ text.substring( this.at2 )
		);

	// FIXME remove
	switch( resultModality )
	{
		case 'combined' :

			return(
				result_changeTree.create(
					'reaction', this,
					'tree', tree
				)
			);

		case 'reaction' :

			return this;

		case 'tree' :

			return tree;

		default :

			throw new Error( );
	}
};


/*
| Returns the inversion to this change.
*/
jools.lazyValue(
	change_remove.prototype,
	'invert',
	function( )
	{
		var
			inv;

		inv =
			change_insert.create(
				'path', this.path,
				'val', this.val,
				'at1', this.at1,
				'at2', this.at2
			);

		// FIXME aheadValue inv to be this

		return inv;
	}
);


/*
| Returns a change, changeRay, changeWrap or changeWrapRay
| transformed on this change.
*/
change_remove.prototype.transform =
	function(
		cx
	)
{
	if( cx === null )
	{
		return null;
	}

	switch( cx.reflect )
	{
		case 'marks_caret' :
		case 'marks_range' :

			return this._transformMark( cx );

		case 'marks_item' :
		case 'marks_widget' :

			return cx;

		case 'change_join' :
		case 'change_split' :

			return this._transformJoinSplit( cx );

		case 'change_insert' :

			return this._transformInsert( cx );

		case 'change_remove' :

			return this._transformRemove( cx );

		case 'change_ray' :

			return this._transformChangeRay( cx );

		case 'change_wrap' :

			return this._transformChangeWrap( cx );

		case 'change_wrapRay' :

			return this._transformChangeWrapRay( cx );

		default :

			throw new Error( );
	}
};


/*
| Returns a change ray transformed by this change.
*/
change_remove.prototype._transformChangeRay =
	change_generic.transformChangeRay;


/*
| Returns a change wrap transformed by this change.
*/
change_remove.prototype._transformChangeWrap =
	change_generic.transformChangeWrap;


/*
| Returns a change wrap transformed by this change.
*/
change_remove.prototype._transformChangeWrapRay =
	change_generic.transformChangeWrapRay;


/*
| Transforms an insert change
| considering this remove actually came first.
*/
change_remove.prototype._transformInsert =
	function(
		cx
	)
{
	var
		len;

/**/if( CHECK )
/**/{
/**/	if( cx.reflect !== 'change_insert' )
/**/	{
/**/		throw new Error( );
/**/	}
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
		len = this.val.length;

		return cx.create( 'at1', cx.at1 - len, 'at2', cx.at2 - len );
	}
};


/*
| Transforms a mark by this insert.
*/
change_remove.prototype._transformMark =
	function(
		mark
	)
{
	var
		len;

	if( !this.path.equals( mark.path.chop( ) ) )
	{
		return mark;
	}

	if( mark.at1 < this.at1 )
	{
		return mark;
	}
	else if( mark.at1 <= this.at2 )
	{
		if( mark.at2 === undefined )
		{
			return mark.create( 'at1', this.at1 );
		}
		else
		{
			len = this.val.length;

			return mark.create( 'at1', this.at1, 'at2', mark.at2 - len );
		}
	}
	else
	{
		len = this.val.length;

		if( mark.at2 === undefined )
		{
			return mark.create( 'at1', mark.at1 - len );
		}
		else
		{
			return mark.create( 'at1', mark.at1 - len, 'at2', mark.at2 - len );
		}
	}
};


/*
| Transforms another remove change.
| considering this remove actually came first.
*/
change_remove.prototype._transformRemove =
	function(
		cx
	)
{
	var
		len;

/**/if( CHECK )
/**/{
/**/	if( cx.reflect !== 'change_remove' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !this.path.equals( cx.path ) )
	{
		return cx;
	}

	len = this.at2 - this.at1;

	// text            tttttttttttt
	// this remove        ######
	// case 0:        xxx '    '      cx to left, no effect
	// case 1:            '    ' xxx  cx to right, move to left
	// case 2:          xxXXXXXXx     cx both sides reduced
	// case 3:            ' XX '      cx fully gone
	// case 4:          xxXX   '      cx partially reduced
	// case 5:            '   XXxx    cx partially reduced

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

		return null;
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
	else
	{
		throw new Error( );
	}
};


/*
| Transforms a join or split change.
| considering this remove actually came first.
*/
change_remove.prototype._transformJoinSplit =
	function(
		cx
	)
{
	var
		len;

/**/if( CHECK )
/**/{
/**/	if(
/**/		cx.reflect !== 'change_join'
/**/		&& cx.reflect !== 'change_split'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	console.log( 'TJS' );

	if( !this.path.equals( cx.path ) )
	{
		return cx;
	}

	// text    ttttttttttttt
	// remove     ' XXXX '
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

		len = this.val.length;

		return cx.create( 'at1', cx.at1 - len );
	}
};



}( ) );
