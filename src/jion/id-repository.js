/*
| A jion id repository.
|
| Is a set of units and names.
|
| Authors: Axel Kittenberger
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
			'jion.idRepository',
		node :
			true,
		attributes :
			{
				'units' :
					{
						comment :
							'a set of all units with all names',
						type :
							'Object',
						defaultValue :
							undefined
					}
			},
		init :
			[ ]
	};
}


var
	idRepository,
	jools;


idRepository =
module.exports =
	require( '../jion/this' )( module );

jools = require( '../jools/jools' );


/*
| Initializer.
*/
idRepository.prototype._init =
	function( )
{
	if( !this.units )
	{
		this.units = { };

/**/	if( CHECK )
/**/	{
/**/		Object.freeze( this.units );
/**/	}
/**/}
};


/*
| Returns a repository with an id added
*/
idRepository.prototype.addID =
	function(
		id
	)
{
	var
		unit,
		units;

/**/if( CHECK )
/**/{
/**/	if( id.reflect !== 'jion.id' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !id.unit )
	{
		// simplistic ids are not stored in the repository.
		return this;
	}

	unit = this.units[ id.unit ];

	// this repository already has the id.
	if( unit && unit[ id.name ] )
	{
		return this;
	}

	units = jools.copy( this.units );

	unit =
		unit
		?  jools.copy( unit )
		: { };

	unit[ id.name ] = id;

	units[ id.unit ] = unit;

/**/if( CHECK )
/**/{
/**/	Object.freeze( unit );
/**/
/**/	Object.freeze( units );
/**/}

	return this.create( 'units', units );
};


/*
| Returns all units as alphasorted list.
*/
jools.lazyValue(
	idRepository.prototype,
	'unitList',
	function( )
{
	var
		ul;

	ul = Object.keys( this.units ).sort( );

/**/if( CHECK )
/**/{
/**/	Object.freeze( ul );
/**/}

	return ul;
}
);


/*
| Returns all id strings as alphasorted list.
*/
jools.lazyValue(
	idRepository.prototype,
	'idStringList',
	function( )
{
	var
		id,
		ids,
		idsl,
		nn,
		un,
		units,
		unit;

	units = this.units;

	ids = { };

	for( un in units )
	{
		unit = units[ un ];

		for( nn in unit )
		{
			id = unit[ nn ];

			ids[ id.string ] = true;
		}
	}

	idsl = Object.keys( ids ).sort( );

/**/if( CHECK )
/**/{
/**/	Object.freeze( idsl );
/**/}

	return idsl;
}
);


} )( );
