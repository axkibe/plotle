/*
| Sets a tree node.
*/
'use strict';


tim.define( module, ( def, change_set ) => {


const change_generic = require( './generic' );

const change_grow = require( './grow' );

const change_insert = require( './insert' );

const change_join = require( './join' );

const change_list = require( './list' );

const change_mark_node = require( './mark/node' );

const change_mark_text = require( './mark/text' );

const change_remove = require( './remove' );

const change_shrink = require( './shrink' );

const change_split = require( './split' );

const change_wrap = require( './wrap' );

const change_wrapList = require( './wrapList' );

const error = require( './error' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// set at this path
		path : { type : 'tim.js/path', json : true },

		// value to set
		val : { type : tim.typemap( module, './val' ), json : true },

		// the value tree had
		prev : { type : tim.typemap( module, './val' ), json : true }
	};

	def.json = 'change_set';
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

		throw error.make( 'set.prev doesn\'t match' );
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

	switch( cx.timtype )
	{
		case change_grow :
		case change_join :
		case change_shrink :
		case change_split :
		case change_insert :
		case change_remove :
		case change_mark_text :
		case change_mark_node :

			return cx;

		case change_set :

			return this._transformChangeSet( cx );

		case change_list :

			return this._transformChangeList( cx );

		case change_wrap :

			return this._transformChangeWrap( cx );

		case change_wrapList :

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
