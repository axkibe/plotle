/*
| A change wrapped for client/server transport.
*/
'use strict';



tim.define( module, ( def, change_wrap ) => {


if( TIM )
{
	def.attributes =
	{
		// change list
		changeList : { type : './list', json : true },

		// change id
		cid : { type : 'string', json : true },

		// sequence number
		seq : { type : [ 'undefined', 'number' ], json : true },
	};

	def.json = 'change_wrap';
}


const session_uid = tim.require( '../session/uid' );


/*
| Custom shortcut.
*/
def.static.createWrapped =
	function(
		changeList
	)
{
	return change_wrap.create( 'cid', session_uid.newUid( ), 'changeList', changeList );
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


/*
| Creates a reversed changeWrap.
|
| This one has a distinct change id and no sequence id yet
*/
def.proto.createReversed =
	function( )
{
	return(
		change_wrap.create(
			'cid', session_uid.newUid( ),
			'changeList', this.changeList.reversed
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


} );
