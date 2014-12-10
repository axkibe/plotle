/*
| Signates an entry, string index or string span.
*/

var
	ccot_sign,
	euclid_point,
	euclid_rect,
	fabric_note,
	fabric_portal,
	jools,
	visual_label,
	visual_relation;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'ccot_sign',
		attributes :
			{
				at1 :
					{
						comment :
							'offset or begin of range',
						json :
							'true',
						type :
							'Integer',
						defaultValue :
							undefined
					},
				at2 :
					{
						comment :
							'end of range',
						json :
							'true',
						type :
							'Integer',
						defaultValue :
							undefined
					},
				path :
					{
						comment :
							'path the signature affects',
						json :
							'true',
						type :
							'jion_path',
						defaultValue :
							undefined
					},
				proc :
					{
						comment :
							'procedure code of the operation',
						json :
							'true',
						type :
							'String',
						defaultValue :
							undefined
					},
				rank :
					{
						comment :
							'rank the procedure affects',
						json :
							'true',
						type :
							'Integer',
						allowsNull :
							true,
						defaultValue :
							undefined
					},
				val :
					{
						comment :
							'value set or removed',
						json :
							'true',
						type :
							'Object',
						allowsNull :
							true,
						defaultValue :
							undefined
					}
			},
		init :
			[ ]
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	ccot_sign = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );

	// FUTURE, remove this once createFromJSON is fixed.
	euclid_point = require( '../euclid/point' );

	euclid_rect = require( '../euclid/rect' );

	visual_label = require( '../visual/label' );

	fabric_note = require( '../fabric/note' );

	fabric_portal = require( '../fabric/portal' );

	visual_relation = require( '../visual/relation' );
}


/*
| Initializer.
*/
ccot_sign.prototype._init =
	function( )
{
	// FIXME remove this hack and enable
	//       optinal types in fromJSON

	var
		val;

	val = this.val;

	if( val && !val.reflect && val.type )
	{
		switch( val.type )
		{
			case 'euclid_point' :

				this.val = euclid_point.createFromJSON( val );

				break;

			case 'euclid_rect' :

				this.val = euclid_rect.createFromJSON( val );

				break;

			case 'visual_label' :

				this.val = visual_label.createFromJSON( val );

				break;

			case 'fabric_note' :

				this.val = fabric_note.createFromJSON( val );

				break;

			case 'fabric_portal' :

				this.val = fabric_portal.createFromJSON( val );

				break;

			case 'visual_relation' :

				this.val = visual_relation.createFromJSON( val );

				break;

			default :

				throw new Error( 'invalid val type: ' + val.type );
		}
	}
};


/*
| Returns a sign with an additional value.
|
| If this sign has the new value already set,
| it is checked for equality.
|
| FUTURE simplify
*/
ccot_sign.prototype.affix =
	function(
		key,  // key to affix at
		val   // value to affix
	)
{
	if( this[ key ] !== undefined )
	{
		if( !jools.matches( val, this[ key ] ) )
		{
			if( SERVER )
			{
				console.log(
					'\n',
					'faulty preset:\n',
					require( 'util' )
						.inspect( val, { depth : null } ), '\n',
					'!==\n',
					require( 'util' )
						.inspect( this[ key ], { depth : null } ), '\n'
				);
			}

			throw new Error( );
		}
	}

	return this.create( key, val );
};


}( ) );
