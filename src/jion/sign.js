/*
| Signates an entry, string index or string span.
|
| Authors: Axel Kittenberger
*/

/*
| Exports
*/
var
	jion;


/*
| Imports
*/
var
	euclid,
	jools,
	visual;


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
			'jion.sign',
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
							'jion.path',
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
		node :
			true,
		init :
			[ ]
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools' );
	euclid =
		{
			point :
				require( '../euclid/point' ),
			rect :
				require( '../euclid/rect' )
		};
	jion =
		{
			sign :
				require( '../jion/this' )( module )
		};
	visual =
		{
			label :
				require( '../visual/label' ),
			note :
				require( '../visual/note' ),
			portal :
				require( '../visual/portal' ),
			relation :
				require( '../visual/relation' )
		};
}


var
	sign;

sign = jion.sign;


/*
| Initializer.
*/
sign.prototype._init =
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
			case 'euclid.point' :

				this.val = euclid.point.createFromJSON( val );

				break;

			case 'euclid.rect' :

				this.val = euclid.rect.createFromJSON( val );

				break;

			case 'visual.label' :

				this.val = visual.label.createFromJSON( val );

				break;

			case 'visual.note' :

				this.val = visual.note.createFromJSON( val );

				break;

			case 'visual.portal' :

				this.val = visual.portal.createFromJSON( val );

				break;

			case 'visual.relation' :

				this.val = visual.relation.createFromJSON( val );

				break;

			default :

				throw new Error( 'invalid val type: ' + val.type );
		}
	}

	jools.immute( this );
};


/*
| Returns a sign with an additional value.
|
| If this sign has the new value already set,
| it is checked for equality.
|
| FUTURE simplify
*/
sign.prototype.affix =
	function(
		test, // function to test existence of key (is or isnon)
		cm,   // checks message for failed checks
		base, // base message for failed checks
		key,  // key to affix at
		val   // value to affix
	)
{
	if( test( this[ key ] ) )
	{
		/* FUTURE
		if( !jools.matches( val, this[ key ] ) )
		{
			throw jools.reject(
				[
					cm, ' ',
					base, '.', key,
					' faulty preset ',
					val, ' !== ', this[ key ]
				].join( '' )
			);
		}
		*/

		return this;
	}

	return (
		this.create(
			key,
				val
		)
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = sign;
}

}( ) );
