/*
| Sets a tree node.
*/

var
	change_generic,
	change_error,
	change_set,
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
							'->spaceVal'
					},
				prev :
					{
						comment :
							'value tree had',
						json :
							'true',
						type :
							'->spaceVal'
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
}


/*
| Initializer.
*/
change_set.prototype._init =
	function ( )
{
	// FUTURE make "nonnegativeInteger" a json type
};


/*
| Performs the insertion change on a tree.
*/
change_set.prototype.changeTree =
	function(
		tree
	)
{
	var
		prev;

	// Stores the old value for history tracking.
	prev = tree.getPath( this.path );

	if( !this.val )
	{
		throw new Error( );
	}

	if(
		prev !== this.prev
		&&
		!prev.equalsJSON( this.prev )
	)
	{
		throw change_error( 'set.prev doesn\'t match' );
	}

	tree = tree.setPath( this.path, this.val );

	return tree;
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
		case 'change_grow' :
		case 'change_join' :
		case 'change_shrink' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :
		case 'mark_caret' :
		case 'mark_item' :
		case 'mark_range' :
		case 'mark_widget' :

			return cx;

		case 'change_set' :

			return this._transformChangeSet( cx );

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
| Transforms a set by this set actually
| happening first.
*/
change_set.prototype._transformChangeSet =
	function(
		cx
	)
{
	if( !this.path.equals( cx.path ) )
	{
		return cx;
	}

	return cx.create( 'prev', this.val );
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
