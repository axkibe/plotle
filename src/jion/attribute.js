/*
| An attribute description of a jion object.
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'jion_attribute',
		attributes :
			{
				allowsNull :
					{
						comment :
							'attribute may be null',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				allowsUndefined :
					{
						comment :
							'attribute may be undefined',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				assign :
					{
						comment :
							'variable name to assign to',
						type :
							'String',
						allowsNull :
							true
					},
				comment :
					{
						comment :
							'comment',
						type :
							'String'
					},
				concerns :
					{
						comment :
							'concerns function call',
						type :
							'jion_concern',
						defaultValue :
							'null'
					},
				defaultValue :
					{
						comment :
							'default value',
						type :
							'->astExpression',
						defaultValue :
							'undefined'
					},
				json :
					{
						comment :
							'include in JSON export/import',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				name :
					{
						comment :
							'attribute name',
						type :
							'String'
					},
				id :
					{
						comment :
							'attribute type id',
						type :
							[ 'jion_id', 'jion_idGroup' ]
					},
				v :
					{
						comment :
							'attribute variable used in generate',
							// FIXME name vVar
						type :
							'ast_var'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
