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
| The joobj definition.
*/
if( JOOBJ )
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
							'null'
					}
			},
		twig :
			{
				'VarDec' :
					'Code.VarDec'
			}
	};
}

/*
| Node imports.
*/
var
	VList =
		require( '../joobj/this' )( module ),
	Code =
		{
			Assign :
				require( './assign' ),
			Term :
				require( './term' ),
			VarDec :
				require( './var-dec' ),
		},
	Jools =
		require( '../jools/jools' );


/*
| Returns the vlist with a variable decleration appended.
*/
VList.prototype.VarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	var
		varDec =
			Code.VarDec.create(
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