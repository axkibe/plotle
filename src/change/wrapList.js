/*
| A list of wraped change(lists).
*/
'use strict';


tim.define( module, ( def, change_wrapList ) => {


if( TIM )
{
	def.list = [ './wrap' ];

	def.json = 'change_wrapList';
}


/*
| Creates an invertes changeWrapList
*/
def.proto.createReverse =
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
def.proto.changeTree =
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
def.proto.changeTreeReverse =
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
def.proto.transform =
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

