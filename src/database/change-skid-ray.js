/*
| A ray of changeSkids.
|
| This is not to be inserted directly into the
| database where changeSkids are a collection.
|
| It is used to chache changeSkids in memory.
*/


var
	database_changeSkid,
	database_changeSkidRay;


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
			'database_changeSkidRay',
		ray :
			[ 'database_changeSkid' ],
		json :
			true,
	};
}


database_changeSkidRay = require( '../jion/this' )( module );

database_changeSkid = require( './change-skid' );


/*
| Creates a changeSkid from a changeWrap.
|
| FUTURE aheadValue changeWrap asChangeWrap
*/
database_changeSkidRay.createFromChangeWrapRay =
	function(
		changeWrapRay, // the change wrap ray to turn into a skid ray
		user,          // the user that sent the changeWrapRay
		seq            // if undefined assign this seq
		               // as start to changeSkidRay
	)
{
	var
		a, aZ,
		ray;

	ray = [ ];


	for(
		a = 0, aZ = changeWrapRay.length;
		a < aZ;
		a++
	)
	{
		ray.push(
			database_changeSkid.createFromChangeWrap(
				changeWrapRay.get( a ),
				user,
				seq++
			)
		);
	}

	return database_changeSkidRay.create( 'ray:init', ray );
};


}( ) );
