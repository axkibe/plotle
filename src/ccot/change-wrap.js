/*
| A change wrapped for transport.
*/


var
	ccot,
	result;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'ccot.changeWrap',
		attributes :
			{
				cid :
					{
						comment :
							'change id',
						json :
							true,
							// FIXME it accepted 'true',
							// jion validator shouldn't
						type :
							'String'
					},
				chgX :
					{
						comment :
							'change or change ray',
						json :
							true,
						type :
							[ 'ccot.change', 'ccot.changeRay' ]
					},
				seq :
					{
						comment :
							'sequence number',
						json :
							true,
						type :
							'Number',
						defaultValue :
							undefined
					}
			}
	};
}


var
	changeWrap,
	jools,
	result_changeTree;


if( SERVER )
{
	changeWrap = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );

	result_changeTree = require( '../result/change-tree' );
}
else
{
	changeWrap = ccot.changeWrap;

	result_changeTree = result.changeTree;
}


/*
| Creates an inverted changeWrap.
|
| This one has a distinct change id and no sequence id
*/
changeWrap.prototype.invert =
	function( )
{
	return(
		changeWrap.create(
			'cid', jools.uid( ),
			'chgX', this.chgX.invert
		)
	);
};


/*
| Transform cx on this wrapped change.
|
| cx can be a change, changeRay, changeWrap or changeWrapRay.
*/
changeWrap.prototype.transform =
	function(
		cx
	)
{
	return this.chgX.transform( cx );
};



/*
| Performes the wrapped change on a tree.
*/
changeWrap.prototype.changeTree =
	function(
		tree
	)
{
	var
		result;

	result = this.chgX.changeTree( tree );

	return(
		result_changeTree.create(
			'reaction', this.create( 'chgX', result.reaction ),
			'tree', result.tree
		)
	);
};



}( ) );
