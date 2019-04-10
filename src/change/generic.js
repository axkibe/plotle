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

	for( let r = 0, rl = cList.length; r < rl; r++ )
	{
		const c = this.transform( cList.get( r ) );

		// changes that transformed away are sliced out.
		if( !c ) continue;

		if( c.timtype === change_list )
		{
			for( let a = 0, al = c.length; a < al; a++ )
			{
				tList.push( c.get( a ) );
			}
		}
		else
		{
			tList.push( c );
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

	for( let r = 0, rl = cwList.length; r < rl; r++ )
	{
		tList[ r ] = this._transformChangeWrap( cwList.get( r ) );
	}


	return cwList.create( 'list:init', tList );
};


} );
