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
							'ccot_sign'
					}
			}
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
				'at1', this.at1
			);

		// FIXME aheadValue inv to be this

		return inv;
	}
);


/*
| Returns a change ray transformed by this change.
*/
change_insert.prototype._transformChangeRay =
	change_generic.transformChangeRay;


/*
| Return a change wrap transformed by this change.
*/
change_insert.prototype._transformChangeWrap =
	change_generic.transformChangeWrap;


/*
| Return a change wrap transformed by this change.
*/
change_insert.prototype._transformChangeWrapRay =
	change_generic.transformChangeWrapRay;


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
		case 'change_insert' :

			return this._transformInsert( cx );

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
change_insert.prototype.changeTree =
	function(
		tree,
		resultModality
	)
{
	var
		s;

	s = tree.getPath( this.path );

	if( jools.isString( s ) )
	{
		throw change_error( 'insert path signates no string' );
	}

	if( this.at1 > s.length )
	{
		throw new Error( );
	}

	tree =
		tree.setPath(
			this.path,
			s.substring( 0, this.at1 )
			+ this.val
			+ s.substring( this.at1 )
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
| Transforms another insert considering this insert
| actually came first.
*/
change_insert.prototype._transformInsert =
	function(
		insert
	)
{
/**/if( CHECK )
/**/{
/**/	if( insert.reflect !== 'change_insert' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !this.path.equals( insert.path ) )
	{
		return insert;
	}

	if( insert.at1 < this.at1 )
	{
		return insert;
	}
	else
	{
		return insert.create( 'at1', insert.at1 + this.val.length );
	}
};


}( ) );
