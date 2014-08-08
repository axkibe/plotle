/*
| A var dec list.
|
| Only to be used in for loop initializers.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'VList',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				// FIXME check if necessary
				'path' :
					{
						comment :
							'the path',
						type :
							'Path',
						defaultValue :
							null
					}
			},
		twig :
			{
// FUTURE
//				'aVarDec' :
//					'Code.aVarDec'
			}
	};
}

/*
| Node imports.
*/
var
	VList =
		require( '../jion/this' )( module ),
	Code =
		{
			anAssign :
				require( './an-assign' ),
			aVarDec :
				require( './a-var-dec' ),
		},
	Jools =
		require( '../jools/jools' );


/*
| Returns the vlist with a variable decleration appended.
*/
VList.prototype.aVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	var
		varDec =
			Code.aVarDec.create(
				'name',
					name,
				'assign',
					assign || null
			);

	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
			varDec
		)
	);
};


/*
| Node export.
*/
module.exports =
	VList;


} )( );
