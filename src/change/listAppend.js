/*
| Appends to a list.
*/
'use strict';


tim.define( module, ( def, change_listAppend ) => {


def.extend = './generic';


if( TIM )
{
	def.attributes =
	{
		// value to append
		val : { type : [ '< ./value-types' ], json : true },
	};

	def.json = 'change_listAppend';
}


const change_listShorten = tim.require( './listShorten' );


/*
| Returns the inversion to this change.
*/
def.lazy.reversed =
	function( )
{
	const inv = change_listShorten.create( 'val', this.val );

	tim.aheadValue( inv, 'reversed', this );

	return inv;
};


/*
| Performs the list app change on a tree.
*/
def.proto.changeTree =
	function(
		list
	)
{
	return list.append( this.val );
};


/*
| Returns a change* transformed on this change.
*/
def.proto.transform =
	function(
		cx
	)
{
	return cx;
};


} );
