/*
| A call in an abstract syntax tree.
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
			'ast',
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
	jools =
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
			jools.uid( ), // FIXME
			expr
		)
	);
};


/*
| Node export.
*/
module.exports = aCall;


} )( );
