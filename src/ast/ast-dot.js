/*
| Gets a member of a table specified by a literal.
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
			'ast.astDot',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to get the member of',
						type :
							'Object' // FUTURE ->expression
					},
				member :
					{
						comment :
							'the members name',
						type :
							'String'
					}
			},
		init :
			[ ]
	};
}



/*
| Import
*/
var
	astDot,
	astMember;


astDot = require( '../jion/this' )( module );

astMember = require( './ast-member' );


/*
| Initializer.
*/
astDot.prototype._init =
	function( )
{
	var
		regex;

/**/if( CHECK )
/**/{
/**/	regex =
/**/		/^([a-zA-Z_])([a-zA-Z0-9_])*$/;
/**/
/**/	if( !regex.test( this.member ) )
/**/	{
/**/		throw new Error( 'invalid member name' );
/**/	}
/**/
/**/	switch( this.name )
/**/	{
/**/		case 'true' :
/**/		case 'false' :
/**/
/**/			throw new Error( 'member must not be a literal' );
/**/	}
/**/}
};


/*
| Creates a dot member access of a dot.
*/
astDot.prototype.astDot =
	function(
		member // member string
	)
{
	// checks if member is a string is done in 'astDot'

	return (
		astDot.create(
			'expr',
				this,
			'member',
				member
		)
	);
};


/*
| Creates a generic member access of a variable.
*/
astDot.prototype.astMember =
	function(
		member // member expression
	)
{
	return(
		astMember.create(
			'expr',
				this,
			'member',
				member
		)
	);
};


/**/if( CHECK )
/**/{
/**/	var
/**/		util;
/**/
/**/	util = require( 'util' );
/**/
/***	/
****	| Custom inspect
****	/
***/	astDot.prototype.inspect =
/**/		function(
/**/			depth,
/**/			opts
/**/		)
/**/	{
/**/		var
/**/			postfix,
/**/			result;
/**/
/**/		if( !opts.ast )
/**/		{
/**/			result = 'ast{ ';
/**/
/**/			postfix = ' }';
/**/		}
/**/		else
/**/		{
/**/			result = postfix = '';
/**/		}
/**/
/**/		opts.ast = true;
/**/
/**/		result += '( ' + util.inspect( this.expr, opts ) + ' )';
/**/
/**/		result += '.' + this.member;
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
