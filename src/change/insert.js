/*
| A text insertion change.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_insert',
		attributes :
		{
			path :
			{
				comment : 'insert at this path',
				json : true,
				type : 'jion$path'
			},
			val :
			{
				comment : 'source sign',
				json : true,
				type : 'string'
			},
			at1 :
			{
				comment : 'insert at this place begin',
				json : true,
				type : 'integer'
			},
			at2 :
			{
				comment : 'insert ends here',
				// must be at1 + val.length
				// FUTURE have it lazyEval
				json : true,
				type : 'integer'
			}
		},
		init : [ ]
	};
}


var
	change_generic,
	change_error,
	change_insert,
	change_remove,
	jion;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	prototype;


/*
| Node includes.
*/
if( NODE )
{
	jion = require( 'jion' );

	change_insert = jion.this( module, 'source' );

	change_generic = require( './generic' );

	change_error = require( './error' );

	change_remove = require( './remove' );
}


prototype = change_insert.prototype;


/*
| Initializer.
*/
prototype._init =
	function ( )
{
	if( this.at1 + this.val.length !== this.at2 )
	{
		throw change_error(
			'insert.at1 + insert.val.length '
			+ '!== insert.at2'
		);
	}

	if( this.at1 < 0 || this.at2 < 0 )
	{
		throw change_error( 'insert.at1|at2 negative' );
	}
};


/*
| Performs the insertion change on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	var
		text;

	text = tree.getPath( this.path );

	if( !jion.isString( text ) )
	{
		throw change_error( 'insert.path signates no string' );
	}

	if( this.at1 > text.length )
	{
		throw change_error( 'insert.at1 invalid' );
	}

	tree =
		tree.setPath(
			this.path,
			text.substring( 0, this.at1 )
			+ this.val
			+ text.substring( this.at1 )
		);

	return tree;
};


/*
| Reversivly performs this change on a tree.
*/
prototype.changeTreeReverse = change_generic.changeTreeReverse;


/*
| Returns the inversion to this change.
*/
jion.lazyValue(
	prototype,
	'reverse',
	function( )
{
	var
		inv;

	inv =
		change_remove.create(
			'path', this.path,
			'val', this.val,
			'at1', this.at1,
			'at2', this.at2
		);

	jion.aheadValue( inv, 'reverse', this );

	return inv;
}
);


/*
| Returns a change, changeRay, changeWrap or changeWrapRay
| transformed on this change.
*/
prototype.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.reflect )
	{
		case 'change_mark_text' :

			return this._transformTextMark( cx );

		case 'change_grow' :
		case 'change_shrink' :
		case 'change_split' :
		case 'change_set' :
		case 'change_mark_node' :

			return cx;

		case 'change_join' :
		case 'change_split' :

			return this._transformJoinSplit( cx );

		case 'change_insert' :
		case 'change_remove' :

			return this._transformInsertRemove( cx );

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
prototype._transformChangeRay = change_generic.transformChangeRay;


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrap = change_generic.transformChangeWrap;


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrapRay = change_generic.transformChangeWrapRay;



/*
| Transforms another insert/remove change
| considering this insert actually came first.
*/
prototype._transformInsertRemove =
	function(
		cx
	)
{
	var
		len;

/**/if( CHECK )
/**/{
/**/	if(
/**/		cx.reflect !== 'change_insert'
/**/		&& cx.reflect !== 'change_remove'
/**/	)
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
	else
	{
		len = this.val.length;

		return(
			cx.create(
				'at1', cx.at1 + len,
				'at2', cx.at2 + len
			)
		);
	}
};


/*
| Transforms a range mark by this insert.
*/
prototype._transformRangeMark = change_generic.transformRangeMark;


/*
| Transforms a text mark by this insert.
*/
prototype._transformTextMark =
	function(
		mark
	)
{
	return(
		(
			!this.path.equals( mark.path )
			|| mark.at < this.at1
		)
		? mark
		: mark.create( 'at', mark.at + this.val.length )
	);
};


/*
| Transforms a join or split change.
| considering this insert actually came first.
*/
prototype._transformJoinSplit =
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

	if( !this.path.equals( cx.path ) )
	{
		return cx;
	}

	if( this.at1 > cx.at1 )
	{
		// this insert is in the line to be splited
		// so no need to change the split

		// for joins this cannot happen anyway

		return cx;
	}
	else
	{
		len = this.val.length;

		return cx.create( 'at1', cx.at1 + len );
	}
};


}( ) );
