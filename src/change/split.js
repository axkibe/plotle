/*
| A text ( para ) is splited.
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
			'change_split',
		attributes :
			{
				path :
					{
						comment :
							'split at this path',
						json :
							'true',
						type :
							'jion_path'
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
				path2 :
					{
						comment :
							'split created this new/next path',
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
	change_split = require( '../jion/this' )( module );

	change_generic = require( './generic' );

	change_error = require( './error' );

	change_join = require( './remove' );

	jools = require( '../jools/jools' );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Initializer.
*/
change_split.prototype._init =
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
	change_split.prototype,
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

		// FIXME aheadValue inv to be this

		return inv;
	}
);


/*
| Returns a change ray transformed by this change.
*/
change_split.prototype._transformChangeRay =
	change_generic.transformChangeRay;


/*
| Return a change wrap transformed by this change.
*/
change_split.prototype._transformChangeWrap =
	change_generic.transformChangeWrap;


/*
| Return a change wrap transformed by this change.
*/
change_split.prototype._transformChangeWrapRay =
	change_generic.transformChangeWrapRay;


/*
| Returns a change, changeRay, changeWrap or changeWrapRay
| transformed on this change.
*/
change_split.prototype.transform =
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
change_split.prototype.changeTree =
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
		text;

	at1 = this.at1;

	path = this.path;

	path2 = this.path2;

	text = tree.getPath( path );

	if( !jools.isString( text ) )
	{
		throw change_error( 'split.path signates no string' );
	}

	pivot = tree.getPath( path.shorten( 3 ) );

	if( !pivot.ranks )
	{
		throw change_error( 'split.pivot not ranked' );
	}

	if( at1 > text.length )
	{
		throw change_error( 'split.at1 > text.length' );
	}

	if( !path2.shorten( 2 ).subPathOf( path ) )
	{
		throw change_error( 'split.path2 not a subPath' );
	}

	key = path.get( -2 );

	key2 = path2.get( -2 );

	if( pivot.twig[ key2 ] )
	{
		throw change_error( 'split.path2 already exists' );
	}

	para1 = pivot.twig[ key ];

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
