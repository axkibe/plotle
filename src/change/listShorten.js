/*
| Shortens a list.
|
| As reversal of append this drops the last element.
|
| FUTURE, path is missing!
*/
'use strict';


tim.define( module, ( def, change_listShorten ) => {


def.extend = './generic';

if( TIM )
{
	def.attributes =
	{
		// value been shortened
		val : { type : [ '< ./value-types' ], json : true },
	};

	def.json = 'change_listShorten';
}


const error = require( './error' );


/*
| Returns the inversion to this change.
*/
def.lazy.reverse =
	function( )
{
	const inv = change_listShorten.create( 'val', this.val );

	tim.aheadValue( inv, 'reverse', this );

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
	const llen = list.length;

	if( llen === 0 )
	{
		throw error.make( 'cannot shorten an empty list' );
	}

	if( list.get( llen - 1 ).equals( this.val ) )
	{
		throw error.make( 'listShorten not shortening correct value' );
	}

	return list.remove( llen - 1 );
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
