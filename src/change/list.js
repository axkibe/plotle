/*
| A list of changes.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_list',
		json : true,
		list :
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
		]
	};
}


var
	change_generic,
	change_list,
	jion;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	change_list = jion.this( module, 'source' );

	change_generic = require( './generic' );
}


prototype = change_list.prototype;


/*
| Returns a change list with reversed changes.
*/
jion.lazyValue(
	prototype,
	'reverse',
	function( )
{
	var
		a,
		aZ,
		arr,
		result;

	arr = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		arr[ a ] = this.get( aZ - 1 - a ).reverse;
	}

	result = change_list.create( 'list:init', arr );

	jion.aheadValue( result, 'reverse', this );

	return result;
}
);


/*
| Returns the result of a change
| transformed by this change_list as if it
| actually came first.
|
| The result can be a change or a change_list.
*/
prototype._transformSingle =
	function(
		c
	)
{
	var
		a,
		aZ,
		cx;

	cx = c;

	for(
		a = 0, aZ = this.length;
		a < aZ;
		a++)
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
prototype._transformChangeList =
	function(
		cList
	)
{
	var
		a,
		aZ;

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		cList = this.get( a ).transform( cList );
	}

	return cList;
};


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeList', this.transform( cw.changeList ) );
};


/*
| Returns a change wrap transformed by this change.
*/
prototype._transformChangeWrapList =
	function(
		cwList
	)
{
	var
		r,
		rZ,
		tList;

	tList = [ ];

	for( r = 0, rZ = cwList.length; r < rZ; r++ )
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
prototype.transform =
	function(
		co
	)
{
	switch( co.reflect )
	{
		case 'change_list' :

			return this._transformChangeList( co );

		case 'change_wrap' :

			return this._transformChangeWrap( co );

		case 'change_wrapList' :

			return this._transformChangeWrapList( co );

		default :

			return this._transformSingle( co );
	}
};


/*
| Performes this change list on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	var
		a,
		aZ;

	// iterates through the change list
	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		// the tree returned by op-handler is the new tree
		tree = this.get( a ).changeTree( tree );
	}

	return tree;
};


/*
| Reversevly performes this change list on a tree.
*/
prototype.changeTreeReverse =
	function(
		tree
	)
{
	var
		a;

	for( a = this.length - 1; a >= 0; a-- )
	{
		tree = this.get( a ).changeTreeReverse( tree );
	}

	return tree;
};


}( ) );
