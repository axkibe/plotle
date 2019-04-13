/*
| Collection of generic change functions.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Needs to be extended.
*/
def.abstract = true;


const change_list = tim.require( './list' );


/*
| Reversivly performs this change on a tree.
*/
def.proto.changeTreeReverse =
	function(
		tree
	)
{
	return this.reversed.changeTree( tree );
};


/*
| Returns a change, changeList, changeWrap or changeWrapList
| transformed on this change.
*/
def.proto.transform =
	function(
		c     // anything transformable
	)
{
	if( !c ) return c;

	const t = this.timtype._transformers.get( c.timtype );

	if( !t ) throw new Error( );

	return t.call( this, c );
};


/*
| Returns a change list transformed by this change.
*/
def.proto._transformChangeList =
	function(
		cList
	)
{
/**/if( CHECK )
/**/{
/**/	if( cList.timtype !== change_list ) throw new Error( );
/**/}

	const tList = [ ];

	for( let c of cList )
	{
		const cr = this.transform( c );

		// changes that transformed away are sliced out.
		if( !cr ) continue;

		if( cr.timtype === change_list )
		{
			for( let ch of cr ) tList.push( ch );
		}
		else
		{
			tList.push( cr );
		}
	}

	return cList.create( 'list:init', tList );
};


/*
| Returns a change wrap transformed by this change.
*/
def.proto._transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeList', this._transformChangeList( cw.changeList ) );
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

	for( let cw of cwList ) tList.push( this._transformChangeWrap( cw ) );

	return cwList.create( 'list:init', tList );
};


} );
