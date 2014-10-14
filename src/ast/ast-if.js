/*
| Optional checks for abstact syntax tree.
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
			'ast.astIf',
		attributes :
			{
				condition :
					{
						comment :
							'the if condition',
						type :
							'Object'
					},
				then :
					{
						comment :
							'the then code',
						type :
							'ast.astBlock'
					},
				elsewise :
					{
						comment :
							'the else wise',
						type :
							'ast.astBlock',
						defaultValue :
							null
					}
			},
		node :
			true,
		init :
			[ ]
	};
}


var
	astIf;

astIf =
module.exports =
	require( '../jion/this' )( module );


/*
| Initializer.
*/
astIf.prototype._init =
	function( )
{
	// automatic block convertion for comfort.
	if(
		this.then.reflect !== 'ast.astBlock'
	)
	{
		this.then = astBlock.create( ).append( this.then );
	}

	if(
		this.elsewise
		&&
		this.elsewise.reflect !== 'ast.astBlock'
	)
	{
		this.elsewise = astBlock.create( ).append( this.elsewise );
	}
};


/*
| Creates an if with the elsewise block set.
*/
astIf.prototype.astElsewise =
	function(
		block
	)
{
	return this.create( 'elsewise', block );
};


} )( );
