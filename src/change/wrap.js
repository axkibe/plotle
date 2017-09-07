/*
| A change wrapped for transport.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_wrap',
		attributes :
		{
			cid :
			{
				comment : 'change id',
				json : true,
				type : 'string'
			},
			changeList :
			{
				comment : 'change list',
				json : true,
				type : 'change_list'
			},
			seq :
			{
				comment : 'sequence number',
				json : true,
				type : [ 'undefined', 'number' ]
			}
		}
	};
}


var
	change_wrap,
	jion,
	session_uid;


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

	change_wrap = jion.this( module, 'source' );
}


prototype = change_wrap.prototype;


/*
| Creates a reversed changeWrap.
|
| This one has a distinct change id and no sequence id yet
*/
prototype.createReverse =
	function( )
{
	return(
		change_wrap.create(
			'cid', session_uid( ),
			'changeList', this.changeList.reverse
		)
	);
};


/*
| Transform cx on this wrapped change.
|
| cx can be a change, changeList, changeWrap or changeWrapList.
*/
prototype.transform =
	function(
		cx
	)
{
	return this.changeList.transform( cx );
};



/*
| Performes the wrapped changeList on a tree.
*/
prototype.changeTree =
	function(
		tree
	)
{
	return this.changeList.changeTree( tree );
};


/*
| Reversevly performes the wrapped changeList on a tree.
*/
prototype.changeTreeReverse =
	function(
		tree
	)
{
	return this.changeList.changeTreeReverse( tree );
};


}( ) );
