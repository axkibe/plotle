/*
| Collection of generic change functions.
*/

var
	change_generic;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Node includes.
*/
if( NODE )
{
	change_generic = module.exports;
}
else
{
	change_generic = { };
}


/*
| Reversivly performs this change on a tree.
*/
change_generic.changeTreeReverse =
	function(
		tree
	)
{
	return this.reverse.changeTree( tree );
};


/*
| Returns a change list transformed by this change.
*/
change_generic.transformChangeList =
	function(
		cList
	)
{
	var
		a,
		aZ,
		c,
		r,
		rZ,
		tList,
		tZ;

/**/if( CHECK )
/**/{
/**/	if( cList.reflect !== 'change_list' ) throw new Error( );
/**/}

	tList = [ ];

	for( r = 0, rZ = cList.length, tZ = 0; r < rZ; r++ )
	{
		c = this.transform( cList.get( r ) );

		// changes that transformed away are sliced out.
		if( !c ) continue;

		if( c.reflect === 'change_list' )
		{
			for( a = 0, aZ = c.length; a < aZ; a++ )
			{
				tList[ tZ++ ] = c.get( a );
			}
		}
		else
		{
			tList[ tZ++ ] = c;
		}
	}

	return cList.create( 'list:init', tList );
};


/*
| Returns a change wrap transformed by this change.
*/
change_generic.transformChangeWrap =
	function(
		cw
	)
{
	return cw.create( 'changeList', this._transformChangeList( cw.changeList ) );
};


/*
| Returns a change wrap transformed by this change.
*/
change_generic.transformChangeWrapList =
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


}( ) );
