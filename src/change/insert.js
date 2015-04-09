/*
| A text insertion change.
*/

var
	change_generic,
	change_error,
	change_insert,
	change_remove,
	jion,
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
			'change_insert',
		attributes :
			{
				path :
					{
						comment : 'insert at this path',
						json : 'true',
						type : 'jion_path'
					},
				val :
					{
						comment : 'source sign',
						json : 'true',
						type : 'string'
					},
				at1 :
					{
						comment : 'insert at this place begin',
						json : 'true',
						type : 'integer'
					},
				at2 :
					{
						comment : 'insert ends here',
						// must be at1 + val.length
						json : 'true',
						type : 'integer'
					}
			},
		init :
			[ ]
	};
}


var
	prototype;


/*
| Node includes.
*/
if( SERVER )
{
	jion = require( 'jion' );

	change_insert = jion.this( module, 'source' );

	change_generic = require( './generic' );

	change_error = require( './error' );

	change_remove = require( './remove' );

	jools = require( '../jools/jools' );
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
| Returns the inversion to this change.
*/
jools.lazyValue(
	prototype,
	'invert',
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

		jools.aheadValue( inv, 'invert', this );

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
		case 'mark_caret' :

			return this._transformTextMark( cx );

		case 'mark_range' :

			return this._transformRangeMark( cx );

		case 'change_grow' :
		case 'change_shrink' :
		case 'change_split' :
		case 'change_set' :
		case 'mark_item' :
		case 'mark_widget' :

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
	var
		len;

	if( !this.path.equals( mark.path.chop ) )
	{
		return mark;
	}

	if( mark.at < this.at1 )
	{
		return mark;
	}
	else
	{
		len = this.val.length;

		return mark.create( 'at', mark.at + len );
	}
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
