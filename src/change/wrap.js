/*
| A change wrapped for client/server transport.
*/
'use strict';



tim.define( module, ( def, change_wrap ) => {


if( TIM )
{
	def.attributes =
	{
		// change id
		cid : { json : true, type : 'string' },

		// change list
		changeList : { json : true, type : './list' },

		// sequence number
		seq : { json : true, type : [ 'undefined', 'number' ] },
	};

	def.json = 'change_wrap';
}


const session_uid = require( '../session/uid' );


/*
| Creates a reversed changeWrap.
|
| This one has a distinct change id and no sequence id yet
*/
def.proto.createReverse =
	function( )
{
	return(
		change_wrap.create(
			'cid', session_uid.newUid( ),
			'changeList', this.changeList.reverse
		)
	);
};


/*
| Transform cx on this wrapped change.
|
| cx can be a change, changeList, changeWrap or changeWrapList.
*/
def.proto.transform =
	function(
		cx
	)
{
	return this.changeList.transform( cx );
};



/*
| Performes the wrapped changeList on a tree.
*/
def.proto.changeTree =
	function(
		tree
	)
{
	return this.changeList.changeTree( tree );
};


/*
| Reversevly performes the wrapped changeList on a tree.
*/
def.proto.changeTreeReverse =
	function(
		tree
	)
{
	return this.changeList.changeTreeReverse( tree );
};


} );
