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
	Visual;


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
		name :
			'sign',
		unit :
			'jion',
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
						unit :
							'jion',
						type :
							'path',
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
					/*
				space :
					{
						comment :
							'TODO: no idea',
						defaultValue :
							undefined
					},
					*/
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
			Point :
				require( '../euclid/point' ),
			Rect :
				require( '../euclid/rect' )
		};
	jion =
		{
			sign :
				require( '../jion/this' )( module )
		};
	Visual =
		{
			Label :
				require( '../visual/label' ),
			Note :
				require( '../visual/note' ),
			Portal :
				require( '../visual/portal' ),
			Relation :
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

	if( val && !val.reflex && val.type )
	{
		switch( val.type )
		{
			case 'Label' :

				this.val =
					Visual.Label.createFromJSON( val );

				break;

			case 'Note' :

				this.val =
					Visual.Note.createFromJSON( val );

				break;

			case 'Point' :

				this.val =
					euclid.Point.createFromJSON( val );

				break;

			case 'Portal' :

				this.val =
					Visual.Portal.createFromJSON( val );

				break;


			case 'Rect' :

				this.val =
					euclid.Rect.createFromJSON( val );

				break;

			case 'Relation' :

				this.val =
					Visual.Relation.createFromJSON( val );

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
| TODO rename Affix and simplify
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
