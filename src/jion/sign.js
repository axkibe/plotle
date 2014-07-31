/*
| Signates an entry, string index or string span.
|
| Authors: Axel Kittenberger
*/

/*
| Exports
*/
var
	Jion;


/*
| Imports
*/
var
	Euclid,
	Jools,
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
			'Sign',
		unit :
			'Jion',
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
							'Jion',
						type :
							'Path',
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
	Jools =
		require( '../jools/jools' );
	Euclid =
		{
			Point :
				require( '../euclid/point' ),
			Rect :
				require( '../euclid/rect' )
		};
	Jion =
		{
			Sign :
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
	Sign;

Sign = Jion.Sign;


/*
| Initializer.
*/
Sign.prototype._init =
	function( )
{
	// FUTURE remove this hack and enable
	//        optinal types in fromJSON

	var
		val;

	val = this.val;

	if( val && !val.reflect && val.type )
	{
		switch( val.type )
		{
			case 'Label' :

				this.val =
					Visual.Label.CreateFromJSON( val );

				break;

			case 'Note' :

				this.val =
					Visual.Note.CreateFromJSON( val );

				break;

			case 'Point' :

				this.val =
					Euclid.Point.CreateFromJSON( val );

				break;

			case 'Portal' :

				this.val =
					Visual.Portal.CreateFromJSON( val );

				break;


			case 'Rect' :

				this.val =
					Euclid.Rect.CreateFromJSON( val );

				break;

			case 'Relation' :

				this.val =
					Visual.Relation.CreateFromJSON( val );

				break;

			default :

				throw new Error( 'invalid val type: ' + val.type );
		}
	}

	Jools.immute( this );
};


/*
| Returns a sign with an additional value.
|
| If this sign has the new value already set,
| it is checked for equality.
|
| TODO rename Affix and simplify
*/
Sign.prototype.affix =
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
		if( !Jools.matches( val, this[ key ] ) )
		{
			throw Jools.reject(
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
		this.Create(
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
	module.exports = Sign;
}

}( ) );
