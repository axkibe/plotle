/*
| Signates an entry, string index or string span.
|
| Authors: Axel Kittenberger
*/

/*
| Exports
*/
var
	Sign;


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


/*
| Constructor
*/
Sign =
	function(
		model
		/*, ...*/
	)
{
	var
		k;

	// first properties from the model are inherited

	if( model )
	{
		for( k in model )
		{
			// ignores inherited properties
			if( !Object.hasOwnProperty.call( model, k ) )
			{
				continue;
			}

			if( !Sign.field[ k ] )
			{
				throw Jools.reject(
					'invalid Sign property: ' + k
				);
			}

			this[ k ] =
				model[ k ];
		}
	}

	// then properties from arguments are applied

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		k =
			arguments[ a ];

		if( !Sign.field[ k ] )
		{
			throw Jools.reject(
				'invalid Sign property: ' + k
			);
		}

		this[ k ] =
			arguments[ a + 1 ];
	}

	// FUTURE:
	//    somehow have position depended twig creation
	//    handle this
	//
	if( this.val && this.val.type )
	{
		switch( this.val.type )
		{
			case 'Label' :

				this.val =
					Visual.Label.CreateFromJSON( this.val );

				break;

			case 'Note' :

				this.val =
					Visual.Note.CreateFromJSON( this.val );

				break;

			case 'Point' :

				this.val =
					Euclid.Point.CreateFromJSON( this.val );

				break;

			case 'Portal' :

				this.val =
					Visual.Portal.CreateFromJSON( this.val );

				break;


			case 'Rect' :

				this.val =
					Euclid.Rect.CreateFromJSON( this.val );

				break;

			case 'Relation' :

				this.val =
					Visual.Relation.CreateFromJSON( this.val );

				break;

			default :

				throw new Error( 'invalid val type: ' + this.val.type );
		}
	}

	Jools.immute( this );
};


/*
| List of keys allowed in a signature
*/
Sign.field =
	Jools.immute({
		'at1' :
			true,
		'at2' :
			true,
		'path' :
			true,
		'proc' :
			true,
		'rank' :
			true,
		'space' :
			true,
		'val' :
			true
	});


/*
| Returns a sign with an additional value.
|
| If this sign has the new value already set,
| it is checked for equality.
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
		if( !Jools.matches( val, this[ key ] ) )
		{
			throw new Jools.reject(
				[
					cm, ' ',
					base, '.', key,
					' faulty preset ',
					val, ' !== ', this[ key ]
				].join( '' )
			);
		}

		return this;
	}

	return new Sign(
		this,
		key,
		val
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Sign;
}

}( ) );
