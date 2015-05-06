/*
| A text ( para ) is splited.
*/

var
	change_generic,
	change_error,
	change_ray,
	change_split,
	change_join,
	jion;


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
	return{
		id : 'change_split',
		attributes :
		{
			path :
			{
				comment : 'split at this path',
				json : true,
				type : 'jion$path'
			},
			at1 :
			{
				comment : 'insert at this place begin',
				json : true,
				type : 'integer'
			},
			path2 :
			{
				comment : 'split created this new/next path',
				json : true,
				type : 'jion$path'
			}
		},
		init : [ ]
	};
}


var
	prototype;


/*
| Node includes.
*/
if( NODE )
{
	jion = require( 'jion' );

	change_split = jion.this( module, 'source' );

	change_generic = require( './generic' );

	change_error = require( './error' );

	change_ray = require( './ray' );

	change_join = require( './remove' );
}


prototype = change_split.prototype;


/*
| Initializer.
*/
prototype._init =
	function ( )
{
	if( this.at1 < 0 )
	{
		throw change_error( 'split.at1 negative' );
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
		at1,
		key,
		key2,
		path,
		path2,
		para1,
		para2,
		pivot,
		rank1,
		text;

	at1 = this.at1;

	path = this.path;

	path2 = this.path2;

	text = tree.getPath( path );

	if( !jion.isString( text ) )
	{
		throw change_error( 'split.path signates no string' );
	}

	pivot = tree.getPath( path.shorten.shorten.shorten );

	if( !pivot.getKey )
	{
		throw change_error( 'split.pivot not ranked' );
	}

	if( at1 > text.length )
	{
		throw change_error( 'split.at1 > text.length' );
	}

	if( !path2.shorten.shorten.subPathOf( path ) )
	{
		throw change_error( 'split.path2 not a subPath' );
	}

	key = path.get( -2 );

	key2 = path2.get( -2 );

	if( pivot.get( key2 ) )
	{
		throw change_error( 'split.path2 already exists' );
	}

	para1 = pivot.get( key );

	rank1 = pivot.rankOf( key );

	if( rank1 < 0 )
	{
		throw change_error( 'split has no rank' );
	}

	para1 = para1.create( 'text', text.substring( 0, at1 ) );

	para2 = para1.create( 'text', text.substring( at1 ) );

	pivot =
		pivot.create(
			'twig:set', key, para1,
			'twig:insert', key2, rank1 + 1, para2
		);

	tree = tree.setPath( path.shorten.shorten.shorten, pivot );

	return tree;
};


/*
| Returns the inversion to this change.
*/
jion.lazyValue(
	prototype,
	'invert',
	function( )
	{
		var
			inv;

		inv =
			change_join.create(
				'path', this.path,
				'at1', this.at1,
				'path2', this.path2
			);

		jion.aheadValue( inv, 'invert', this );

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

			// FIXME change ranks
			// but right now this never happens
			return cx;

		case 'change_set' :
		case 'change_mark_node' :

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
| Transforms an insert change
| considering this split actually came first.
*/
prototype._transformInsert =
	function(
		cx
	)
{
	//console.log( 'transform insert by split' );

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

	if( cx.at1 <= this.at1 )
	{
		return cx;
	}
	else
	{
		// insert is changed to happen
		// in the splitted line
		return(
			cx.create(
				'path', this.path2,
				'at1', cx.at1 - this.at1,
				'at2', cx.at2 - this.at1
			)
		);
	}
};


/*
| Transforms a join/split change
| considering this split actually came first.
*/
prototype._transformJoinSplit =
	function(
		cx
	)
{
	//console.log( 'transform join by split' );

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

	if( cx.at1 <= this.at1 )
	{
		return cx;
	}
	else
	{
		// join/split is changed to happen
		// in the splitted line
		return(
			cx.create(
				'path', this.path2,
				'at1', cx.at1 - this.at1
			)
		);
	}
};


/*
| Transforms a text mark by this split.
*/
prototype._transformTextMark =
	function(
		mark
	)
{
	if( !this.path.equals( mark.path ) ) return mark;

	if( mark.at < this.at1 ) return mark;

	return(
		mark.create(
			'path', this.path2,
			'at', mark.at - this.at1
		)
	);
};


/*
| Transforms a remove change
| considering this split actually came first.
*/
prototype._transformRemove =
	function(
		cx
	)
{
	//console.log( 'transform remove by split' );

/**/if( CHECK )
/**/{
/**/	if( cx.reflect !== 'change_remove' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	// text    ttttttttttttt
	// split         ^
	// case 0    xxx '          remove left
	// case 1      xxxxx        remove is split
	// case 2        ' xxxx     remove right

	if( !this.path.equals( cx.path ) )
	{
		return cx;
	}

	if( cx.at2 <= this.at1 )
	{
		// case 0, the remove is not affect

		return cx;
	}
	else if( cx.at1 >= this.at1 )
	{
		// case 2, the remove happend in splited line

		return cx.create(
			'path', this.path2,
			'at1', cx.at1 - this.at1,
			'at2', cx.at2 - this.at1
		);
	}
	else
	{
		// case 1, the remove is split into two removes
		return change_ray.create(
			'ray:init',
			[
				cx.create(
					'at2', this.at1,
					'val', cx.val.substring( 0, this.at1 - cx.at1 )
				),
				cx.create(
					'at1', 0,
					'at2', cx.at2 - this.at1,
					'path', this.path2,
					'val', cx.val.substring( this.at1 - cx.at1 )
				)
			]
		);
	}
};


}( ) );
