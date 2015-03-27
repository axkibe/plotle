/*
| A text ( para ) is joined.
*/

var
	change_generic,
	change_error,
	change_split,
	change_join,
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
			'change_join',
		attributes :
			{
				path :
					{
						comment : 'join at this path',
						json : 'true',
						type : 'jion_path'
					},
				at1 :
					{
						comment : 'join at this place ',
						// must be length of text
						json : 'true',
						type : 'integer'
					},
				path2 :
					{
						comment : 'join this',
						// must be after path
						json : 'true',
						type : 'jion_path'
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
	change_join = require( '../jion/this' )( module );

	change_generic = require( './generic' );

	change_error = require( './error' );

	change_split = require( './remove' );

	jools = require( '../jools/jools' );
}


prototype = change_join.prototype;


/*
| Initializer.
*/
prototype._init =
	function ( )
{
	if( this.at1 < 0 )
	{
		throw change_error( 'join.at1 negative' );
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
		rank2,
		text,
		text2;

	at1 = this.at1;

	path = this.path;

	path2 = this.path2;

	text = tree.getPath( path );

	text2 = tree.getPath( path2 );

	if( !jools.isString( text ) )
	{
		throw change_error( 'join.path signates no string' );
	}

	if( !jools.isString( text2 ) )
	{
		throw change_error( 'join.path2 signates no string' );
	}

	pivot = tree.getPath( path.shorten.shorten.shorten );

	if( !pivot.ranks )
	{
		throw change_error( 'join.pivot not ranked' );
	}

	if( at1 !== text.length )
	{
		throw change_error( 'join.at1 !== text.length' );
	}

	if( !path2.shorten.shorten.subPathOf( path ) )
	{
		throw change_error( 'join.path2 not a subPath' );
	}

	key = path.get( -2 );

	key2 = path2.get( -2 );

	para1 = pivot.twig[ key ];

	para2 = pivot.twig[ key2 ];

	rank1 = pivot.rankOf( key );

	rank2 = pivot.rankOf( key2 );

	if( rank1 < 0 )
	{
		throw change_error( 'join.path has no rank' );
	}

	if( rank2 < 0 )
	{
		throw change_error( 'join.path2 has no rank' );
	}

	if( rank1 + 1 !== rank2 )
	{
		throw change_error( 'join ranks not sequential' );
	}

	para1 = para1.create( 'text', para1.text + para2.text );

	pivot =
		pivot.create(
			'twig:set', key, para1,
			'twig:remove', key2
		);

	tree = tree.setPath( path.shorten.shorten.shorten, pivot );

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
			change_split.create(
				'path', this.path,
				'at1', this.at1,
				'path2', this.path2
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
	if( cx === null )
	{
		return null;
	}

	switch( cx.reflect )
	{
		case 'mark_caret' :

			return this._transformTextMark( cx );

		case 'mark_range' :

			return this._transformRangeMark( cx );

		case 'change_set' :
		case 'mark_item' :
		case 'mark_widget' :

			return cx;

		case 'change_grow' :
		case 'change_shrink' :

			// FIXME change ranks
			// but right now this never happens
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
| Transforms an insert/remove change
| considering this join actually came first.
*/
prototype._transformInsertRemove =
	function(
		cx
	)
{

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

	if( !this.path2.equals( cx.path ) )
	{
		return cx;
	}

	return(
		cx.create(
			'path', this.path,
			'at1', cx.at1 + this.at1,
			'at2', cx.at2 + this.at1
		)
	);
};


/*
| Transforms an join/split change
| considering this join actually came first.
*/
prototype._transformJoinSplit =
	function(
		cx
	)
{

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

	if( !this.path2.equals( cx.path ) )
	{
		return cx;
	}

	return(
		cx.create(
			'path', this.path,
			'at1', cx.at1 + this.at1
		)
	);
};


/*
| Transforms a mark by this join.
*/
prototype._transformTextMark =
	function(
		mark
	)
{
	if( !this.path2.equals( mark.path.chop ) )
	{
		return mark;
	}

	return(
		mark.create(
			'path', this.path.prepend( mark.path.get( 0 ) ),
			'at', mark.at + this.at1
		)
	);
};


/*
| Transforms a range mark by this join.
*/
prototype._transformRangeMark =
	change_generic.transformRangeMark;


}( ) );
