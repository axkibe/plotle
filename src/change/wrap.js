/*
| A change wrapped for transport.
*/
'use strict';



tim.define( module, 'change_wrap', ( def, change_wrap ) => {


const session_uid = require( '../session/uid' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
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
	};
}


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Creates a reversed changeWrap.
|
| This one has a distinct change id and no sequence id yet
*/
def.func.createReverse =
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
def.func.transform =
	function(
		cx
	)
{
	return this.changeList.transform( cx );
};



/*
| Performes the wrapped changeList on a tree.
*/
def.func.changeTree =
	function(
		tree
	)
{
	return this.changeList.changeTree( tree );
};


/*
| Reversevly performes the wrapped changeList on a tree.
*/
def.func.changeTreeReverse =
	function(
		tree
	)
{
	return this.changeList.changeTreeReverse( tree );
};


} );
