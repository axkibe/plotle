/*
| Sets a tree node.
*/
'use strict';


// FIXME
var
	change_generic,
	change_error;


if( NODE )
{
	change_generic = require( './generic' );
	change_error = require( './error' );
}


tim.define( module, 'change_set', ( def, change_set ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// set at this path
			type : 'jion$path',
			json : true,
		},
		val :
		{
			// value to set
			type : require( './typemap-value' ),
			json : true,
		},
		prev :
		{
			// the value tree had
			type : require( './typemap-value' ),
			json : true,
		}
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Returns the inversion to this change.
*/
def.lazy.reverse =
	function( )
{
	const inv =
		change_set.create(
			'path', this.path,
			'val', this.prev,
			'prev', this.val
		);

	tim.aheadValue( inv, 'reverse', this );

	return inv;
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Performs the insertion change on a tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	// Stores the old value for history tracking.
	const prev = tree.getPath( this.path );

	if( !this.val ) throw new Error( );

	if( prev !== this.prev && !prev.equalsJSON( this.prev ) )
	{
		console.log( 'set.prev mismatch', prev, this.prev );

		throw change_error( 'set.prev doesn\'t match' );
	}

	return tree.setPath( this.path, this.val );
};


/*
| Reversivly performs this change on a tree.
*/
def.func.changeTreeReverse = change_generic.changeTreeReverse;


/*
| Returns a change* transformed on this change.
*/
def.func.transform =
	function(
		cx
	)
{
	if( !cx ) return cx;

	switch( cx.reflect )
	{
		case 'change_grow' :
		case 'change_join' :
		case 'change_shrink' :
		case 'change_split' :
		case 'change_insert' :
		case 'change_remove' :
		case 'change_mark_text' :
		case 'change_mark_node' :

			return cx;

		case 'change_set' :

			return this._transformChangeSet( cx );

		case 'change_list' :

			return this._transformChangeList( cx );

		case 'change_wrap' :

			return this._transformChangeWrap( cx );

		case 'change_wrapList' :

			return this._transformChangeWrapList( cx );

		default :

			throw new Error( );
	}
};


/*
| Transforms a set by this set actually
| happening first.
*/
def.func._transformChangeSet =
	function(
		cx
	)
{
	if( !this.path.equals( cx.path ) ) return cx;

	if( cx.prev.equalsJSON( this.prev ) ) return cx.create( 'prev', this.val );

	return cx;
};


/*
| Returns a change list transformed by this change.
*/
def.func._transformChangeList = change_generic.transformChangeList;


/*
| Returns a change wrap transformed by this change.
*/
def.func._transformChangeWrap = change_generic.transformChangeWrap;


/*
| Returns a change wrap list transformed by this change.
*/
def.func._transformChangeWrapList = change_generic.transformChangeWrapList;

} );
