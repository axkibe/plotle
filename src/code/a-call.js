/*
| A code term to be generated
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
			'aCall',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				'func' :
					{
						comment :
							'the function to call',
						type :
							'Object' // Expression
					},
			},
		twig :
			'expression',
	};
}

/*
| Node imports.
*/
var
	aCall =
		require( '../jion/this' )( module ),
	Jools =
		require( '../jools/jools' );

/*
| Returns a call with a parameter appended
*/
aCall.prototype.Append =
	function(
		expr
	)
{
	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
			expr
		)
	);
};


/*
| Node export.
*/
module.exports = aCall;


} )( );