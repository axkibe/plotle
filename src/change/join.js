/*
| A text ( para ) is joined.
*/

var
	change_generic,
	change_error,
	change_split,
	change_join,
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
			'change_join',
		attributes :
			{
				path :
					{
						comment :
							'join at this path',
						json :
							'true',
						type :
							'jion_path'
					},
				at1 :
					{
						comment :
							'join at this place ( must be length of text )',
						json :
							'true',
						type :
							'Integer'
					},
				path2 :
					{
						comment :
							'join this ( must be after path )',
						json :
							'true',
						type :
							'jion_path'
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
	change_join = require( '../jion/this' )( module );

	change_generic = require( './generic' );

	change_error = require( './error' );

	change_split = require( './remove' );

	jools = require( '../jools/jools' );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Initializer.
*/
change_join.prototype._init =
	function ( )
{
	if( this.at1 < 0 || this.at2 < 0 )
	{
		throw change_error( 'split.at1 negative' );
	}
};


/*
| Returns the inversion to this change.
*/
jools.lazyValue(
	change_join.prototype,
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

		// FIXME aheadValue inv to be this

		return inv;
	}
);


/*
| Returns a change ray transformed by this change.
*/
change_join.prototype._transformChangeRay =
	change_generic.transformChangeRay;


/*
| Return a change wrap transformed by this change.
*/
change_join.prototype._transformChangeWrap =
	change_generic.transformChangeWrap;


/*
| Return a change wrap transformed by this change.
*/
change_join.prototype._transformChangeWrapRay =
	change_generic.transformChangeWrapRay;


/*
| Returns a change, changeRay, changeWrap or changeWrapRay
| transformed on this change.
*/
change_join.prototype.transform =
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
		case 'change_split' :
		case 'change_join' :

			// XXX TODO
			return cx;

		case 'change_insert' :
		case 'change_remove' :

			return cx;

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
| Performs the insertion change on a tree.
*/
change_join.prototype.changeTree =
	function(
		tree,
		resultModality
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

	pivot = tree.getPath( path.shorten( 3 ) );

	if( !pivot.ranks )
	{
		throw change_error( 'join.pivot not ranked' );
	}

	if( at1 !== text.length )
	{
		throw change_error( 'join.at1 !== text.length' );
	}

	if( !path2.shorten( 2 ).subPathOf( path ) )
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

	tree = tree.setPath( path.shorten( 3 ), pivot );

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


}( ) );
