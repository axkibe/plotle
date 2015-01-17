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
			'change_insert',
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
	change_insert = require( '../jion/this' )( module );

	change_generic = require( './generic' );

	change_error = require( './error' );

	change_remove = require( './remove' );

	jools = require( '../jools/jools' );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Initializer.
*/
change_insert.prototype._init =
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
change_insert.prototype.changeTree =
	function(
		tree,
		resultModality
	)
{
	var
		text;

	text = tree.getPath( this.path );

	if( !jools.isString( text ) )
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
	change_insert.prototype,
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

		// FIXME aheadValue inv to be this

		return inv;
	}
);


/*
| Returns a change, changeRay, changeWrap or changeWrapRay
| transformed on this change.
*/
change_insert.prototype.transform =
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
change_insert.prototype._transformChangeRay =
	change_generic.transformChangeRay;


/*
| Returns a change wrap transformed by this change.
*/
change_insert.prototype._transformChangeWrap =
	change_generic.transformChangeWrap;


/*
| Returns a change wrap transformed by this change.
*/
change_insert.prototype._transformChangeWrapRay =
	change_generic.transformChangeWrapRay;



/*
| Transforms another insert/remove change
| considering this insert actually came first.
*/
change_insert.prototype._transformInsertRemove =
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
| Transforms a mark by this insert.
*/
change_insert.prototype._transformMark =
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

	if( mark.at < this.at1 )
	{
		return mark;
	}
	else
	{
		len = this.val.length;

		if( mark.at2 === undefined )
		{
			return mark.create( 'at', mark.at + len );
		}
		else
		{
			throw new Error( 'XXX TODO' );
		}
	}
};


/*
| Transforms a join or split change.
| considering this insert actually came first.
*/
change_insert.prototype._transformJoinSplit =
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
