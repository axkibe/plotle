/*
| Formatter context
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
			'Context',
		attributes :
			{
				indent :
					{
						comment :
							'the indentation',
						type :
							'Integer',
						defaultValue :
							'0'
					},
				check :
					{
						comment :
							'true if within optinal CHECK code',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
			},
		node :
			true
	};
}


/*
| Node imports.
*/
var
	Context =
		require( '../joobj/this' )( module ),
	Jools =
		require( '../jools/jools' );


/*
| Transforms the context into a tab indentation.
*/
Jools.lazyValue(
	Context.prototype,
	'tab',
	function( )
	{
		var
			indent =
				this.indent,
			tab =
				'';

		if( this.check )
		{
			indent--;

			tab += '/**/';
		}

		for( var a = 0; a < indent; a++ )
		{
			tab += '\t';
		}

		return tab;
	}
);


/*
| Node export.
*/
module.exports =
	Context;


} )( );
