/*
| A list of changes.
*/
'use strict';


// FIXME
var
	change_generic,
	change_wrap,
	change_wrapList;


if( NODE )
{
	change_generic = require( './generic' );
	change_wrap = require( './wrap' );
	change_wrapList = require( './wrapList' );
}


tim.define( module, 'change_list', ( def, change_list ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.list =
	[
		'change_grow',
		'change_insert',
		'change_listAppend',
		'change_listShorten',
		'change_join',
		'change_remove',
		'change_set',
		'change_shrink',
		'change_split'
	];

	def.json = true;
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Returns a change list with reversed changes.
*/
def.lazy.reverse =
	function( )
{
	const arr = [ ];

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		arr[ a ] = this.get( aZ - 1 - a ).reverse;
	}

	const result = change_list.create( 'list:init', arr );

	tim.aheadValue( result, 'reverse', this );

	return result;
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns the result of a change
| transformed by this change_list as if it
| actually came first.
|
| The result can be a change or a change_list.
*/
def.func._transformSingle =
	function(
		c
	)
{
	let cx = c;

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		cx = this.get( a ).transform( cx );
	}

	return cx;
};


/*
| Returns the result of a changeray
| transformed by this change_list.
|
| The result is a change_list.
*/
def.func._transformChangeList =
	function(
		cList
	)
{
	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		cList = this.get( a ).transform( cList );
	}

	return cList;
};


/*
| Returns a change wrap transformed by this change.
*/
def.func._transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeList', this.transform( cw.changeList ) );
};


/*
| Returns a change wrap transformed by this change.
*/
def.func._transformChangeWrapList =
	function(
		cwList
	)
{
	const tList = [ ];

	for( let r = 0, rZ = cwList.length; r < rZ; r++ )
	{
		tList[ r ] = this._transformChangeWrap( cwList.get( r ) );
	}

	return cwList.create( 'list:init', tList );
};


/*
| Returns the result of a
| change, change_list, change_wrap or change_wrapList
| transformed by this change_list.
*/
def.func.transform =
	function(
		co
	)
{
	switch( co.timtype )
	{
		case change_list :

			return this._transformChangeList( co );

		case change_wrap :

			return this._transformChangeWrap( co );

		case change_wrapList :

			return this._transformChangeWrapList( co );

		default :

			return this._transformSingle( co );
	}
};


/*
| Performes this change list on a tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	// iterates through the change list
	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		// the tree returned by op-handler is the new tree
		tree = this.get( a ).changeTree( tree );
	}

	return tree;
};


/*
| Reversevly performes this change list on a tree.
*/
def.func.changeTreeReverse =
	function(
		tree
	)
{
	for( let a = this.length - 1; a >= 0; a-- )
	{
		tree = this.get( a ).changeTreeReverse( tree );
	}

	return tree;
};


} );
