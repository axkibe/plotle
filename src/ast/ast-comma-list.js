/*
| A comma operator list
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
			'ast_astCommaList',
		ray :
			// '->expression' FUTURE
			[ ]
	};
}


var
	astAssign,
	astCommaList,
	jools,
	tools;


astCommaList = require( '../jion/this' )( module );

astAssign = require( './ast-assign' );

jools = require( '../jools/jools' );

tools = require( './tools' );


/*
| Returns the list with an assignment appended.
*/
astCommaList.prototype.astAssign =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		this.append(
			astAssign.create(
				'left', left,
				'right', right
			)
		)
	);
};


} )( );
