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
| Creates an inverted changeWrapList.
*/
def.proto.createReversed =
	function( )
{
	const iList = [ ];

	for( let cw of this.reverse( ) ) iList.push( cw.createReversed( ) );

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
	for( let cw of this ) tree = cw.changeTree( tree );

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
	for( let cw of this ) cx = cw.transform( cx );

	return cx;
};


} );
