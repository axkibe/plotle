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
		id :
			'ast.astCall',
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
			'->expression',
	};
}

var
	astCall,
	jools;


astCall =
module.exports =
	require( '../jion/this' )( module );

jools = require( '../jools/jools' );


/*
| Returns a call with a parameter appended
*/
astCall.prototype.addArgument =
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


} )( );
