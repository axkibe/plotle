/*
| A list of changes.
*/
'use strict';


tim.define( module, ( def, change_list ) => {


if( TIM )
{
	def.list =
	[
		'./grow',
		'./insert',
		'./listAppend',
		'./listShorten',
		'./join',
		'./remove',
		'./set',
		'./shrink',
		'./split'
	];

	def.json = 'change_list';
}


const change_wrap = tim.require( './wrap' );

const change_wrapList = tim.require( './wrapList' );

const string_set = tim.require( 'tim.js/stringSet' );


/*
| The set of twig keys affected by this change list.
*/
def.lazy.affectedTwigItems =
	function( )
{
	const affected = new Set( );

	for( let change of this )
	{
		const path = change.path;

		if( path.length < 2 ) continue;

		if( path.get( 0 ) !== 'twig' ) continue;

		const iKey = path.get( 1 );

		affected.add( iKey );
	}

	return string_set.create( 'set:init', affected );
};


/*
| Performes this change list on a tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	// iterates through the change list
	for( let change of this )
	{
		// the tree returned by op-handler is the new tree
		tree = change.changeTree( tree );
	}

	return tree;
};


/*
| Reversevly performes this change list on a tree.
*/
def.proto.changeTreeReverse =
	function(
		tree
	)
{
	for( let change of this.reverse( ) )
	{
		tree = change.changeTreeReverse( tree );
	}

	return tree;
};


/*
| An empty list.
*/
def.staticLazy.empty = ( ) => change_list.create( );


/*
| Returns the result of a
| change, change_list, change_wrap or change_wrapList
| transformed by this change_list.
*/
def.proto.transform =
	function(
		co
	)
{
	switch( co.timtype )
	{
		case change_list : return this._transformChangeList( co );

		case change_wrap : return this._transformChangeWrap( co );

		case change_wrapList : return this._transformChangeWrapList( co );

		default : return this._transformSingle( co );
	}
};


/*
| Returns a change list with reversed changes.
*/
def.lazy.reversed =
	function( )
{
	const arr = [ ];

	for( let a = 0, al = this.length; a < al; a++ )
	{
		arr[ a ] = this.get( al - 1 - a ).reversed;
	}

	const result = change_list.create( 'list:init', arr );

	tim.aheadValue( result, 'reversed', this );

	return result;
};


/*
| Returns the result of a change
| transformed by this change_list as if it
| actually came first.
|
| The result can be a change or a change_list.
*/
def.proto._transformSingle =
	function(
		cx
	)
{
	for( let ch of this ) cx = ch.transform( cx );

	return cx;
};


/*
| Returns the result of a changeray
| transformed by this change_list.
|
| The result is a change_list.
*/
def.proto._transformChangeList =
	function(
		cList
	)
{
	for( let change of this ) cList = change.transform( cList );

	return cList;
};


/*
| Returns a change wrap transformed by this change.
*/
def.proto._transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeList', this.transform( cw.changeList ) );
};


/*
| Returns a change wrap transformed by this change.
*/
def.proto._transformChangeWrapList =
	function(
		cwList
	)
{
	const tList = [ ];

	for( let cw of cwList )
	{
		tList.push( this._transformChangeWrap( cw ) );
	}

	return cwList.create( 'list:init', tList );
};


} );
