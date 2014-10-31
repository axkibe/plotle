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
	id,
	idRepository,
	jools;


idRepository =
module.exports =
	require( '../jion/this' )( module );

id = require( './id' );

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
| Creates an id repository from an
| array of id strings.
*/
idRepository.createFromIDStrings =
	function(
		idStrings
	)
{
	var
		i,
		iZ,
		n,
		d,
		unit,
		units;

	units = { };

/**/if( CHECK )
/**/{
/**/	if( !Array.isArray( idStrings ) )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	for(
		i = 0, iZ = idStrings.length;
		i < iZ;
		i++
	)
	{
		d = id.createFromString( idStrings[ i ] );

		unit = units[ d.unit ];

		if( !unit )
		{
			units[ d.unit ] =
			unit =
				{ };
		}

		unit[ d.name ] = d;
	}

/**/if( CHECK )
/**/{
/**/	for( n in units )
/**/	{
/**/		Object.freeze( units[ n ] );
/**/	}
/**/
/**/	Object.freeze( units );
/**/}

	return idRepository.create( 'units', units );
};




/*
| Returns a repository with an id added
*/
idRepository.prototype.add =
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
| Returns all ids as alphasorted list.
*/
jools.lazyValue(
	idRepository.prototype,
	'idList',
	function( )
{
	var
		ids,
		name,
		unitStr,
		units,
		unit;

	units = this.units;

	ids = [ ];

	for( unitStr in units )
	{
		unit = units[ unitStr ];

		for( name in unit )
		{
			ids.push( unit[ name ] );
		}
	}

	ids.sort( id.compare );

/**/if( CHECK )
/**/{
/**/	Object.freeze( ids );
/**/}

	return ids;
}
);


/*
| Returns the id names as list of an unit.
*/
idRepository.prototype.nameListOfUnit =
	function(
		unitStr
	)
{
	var
		unit,
		nameList;

	unit = this.units[ unitStr ];

	nameList = Object.keys( unit ).sort( );

	if( CHECK )
	{
		Object.freeze( nameList );
	}

	return nameList;
};


} )( );
