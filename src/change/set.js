/*
| Sets a tree node.
*/

var
	change_generic,
	change_error,
	change_set,
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
			'change_set',
		attributes :
			{
				path :
					{
						comment :
							'set at this path',
						json :
							'true',
						type :
							'jion_path'
					},
				val :
					{
						comment :
							'value to set',
						json :
							'true',
						type :
							'->spaceVal',
						allowsNull :
							true
					},
				prev :
					{
						comment :
							'value tree had',
						json :
							'true',
						type :
							'->spaceVal',
						defaultValue :
							null
					},
				rank :
					{
						comment :
							'rank of new node',
						json :
							'true',
						type :
							'Integer',
						allowsUndefined :
							true
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
	change_set = require( '../jion/this' )( module );

	change_generic = require( './generic' );

	change_error = require( './error' );

	jools = require( '../jools/jools' );

	result_changeTree = require( '../result/changeTree' );
}


/*
| Initializer.
*/
change_set.prototype._init =
	function ( )
{
	// FUTURE make "NotNegativeInteger" a json type

	if( this.rank !== undefined && this.rank < 0 )
	{
		throw change_error( 'set.rank negative' );
	}
};


/*
| Performs the insertion change on a tree.
*/
change_set.prototype.changeTree =
	function(
		tree,
		resultModality
	)
{
	var
		key,
		pivot,
		prev,
		rank;

	// Stores the old value for history tracking.
	prev = tree.getPath( this.path );

	if( prev === undefined )
	{
		prev = null;
	}

	if(
		prev !== this.prev
		&&
		(
			!this.prev
			||
			JSON.stringify( this.prev ) !== JSON.stringify( prev )
		)
	)
	{
		throw change_error( 'set.prev doesn\'t match' );
	}

	if( this.rank === undefined )
	{
		tree = tree.setPath( this.path, this.val );
	}
	else
	{
		if( this.path.get( -2 ) !== 'twig' )
		{
			throw change_error( 'set.path( -2 ) with rank not twig' );
		}

		pivot = tree.getPath( this.path.shorten( 2 ) );

		key = this.path.get( -1 );

		rank = pivot.rankOf( key );

		if( rank < 0 )
		{
			rank = pivot.length;
		}

		if( rank !== this.rank )
		{
			throw change_error( 'set.rank doesn\'t match' );
		}

		if( this.val !== null )
		{
			pivot = pivot.create( 'twig:insert', key, this.rank, this.val );
		}
		else
		{
			pivot = pivot.create( 'twig:remove', key );
		}

		if( this.path.length > 2 )
		{
			tree = tree.setPath( this.path.shorten( 2 ), pivot );
		}
		else
		{
			tree = pivot;
		}
	}

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
	change_set.prototype,
	'invert',
	function( )
	{
		var
			inv;

		inv =
			change_set.create(
				'path', this.path,
				'val', this.prev,
				'prev', this.val
			);

		// FIXME aheadValue inv to be this

		return inv;
	}
);


/*
| Returns a change* transformed on this change.
*/
change_set.prototype.transform =
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
		case 'mark_range' :
		case 'mark_item' :

			return this._transformMark( cx );

		case 'mark_widget' :

			return cx;

		case 'change_join' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :

			return cx;

		case 'change_set' :

			// FIXME change prev val of change_set
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
| Transforms a mark by this set.
*/
change_set.prototype._transformMark =
	function(
		mark
	)
{
	if( !this.path.equals( mark.path.chop ) )
	{
		return mark;
	}

	// this change removes the item.
	if( this.val === null )
	{
		return null;
	}

	// this shouldnt ever happen
	throw new Error( );
};


/*
| Returns a change ray transformed by this change.
*/
change_set.prototype._transformChangeRay =
	change_generic.transformChangeRay;


/*
| Returns a change wrap transformed by this change.
*/
change_set.prototype._transformChangeWrap =
	change_generic.transformChangeWrap;


/*
| Returns a change wrap transformed by this change.
*/
change_set.prototype._transformChangeWrapRay =
	change_generic.transformChangeWrapRay;



}( ) );
