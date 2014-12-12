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
	ast_assign,
	astCommaList,
	jools,
	tools;


astCommaList = require( '../jion/this' )( module );

ast_assign = require( './assign' );

jools = require( '../jools/jools' );

tools = require( './tools' );


/*
| Returns the list with an assignment appended.
*/
astCommaList.prototype.$assign =
	function(
		left,
		right
	)
{
	left = tools.convert( left );

	right = tools.convert( right );

	return(
		this.append(
			ast_assign.create(
				'left', left,
				'right', right
			)
		)
	);
};


} )( );
