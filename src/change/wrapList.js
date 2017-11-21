/*
| A list of wraped change(lists).
*/
'use strict';


tim.define( module, 'change_wrapList', ( def, change_wrapList ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.list = [ 'change_wrap' ];

	def.json = true;
}


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Creates an invertes changeWrapList
*/
def.func.createReverse =
	function( )
{
	const iList = [ ];

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		iList[ a ] = this.get( aZ - 1 - a ).createReverse( );
	}

	return change_wrapList.create( 'list:init', iList );
};


/*
| Performes the wrapped change-(lists) on a tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	// iterates through the change list
	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		tree = this.get( a ).changeTree( tree );
	}

	return tree;
};

/*
| Performes the reversion of the
| wrapped-change (lists) on a tree.
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


/*
| Transform cx on this list of wrapped changes.
|
| cx can be a change, changeList, changeWrap or changeWrapList.
*/
def.func.transform =
	function(
		cx
	)
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		cx = this.get( r ).transform( cx );
	}

	return cx;
};


} );
