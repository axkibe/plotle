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
					},
				'primitives' :
					{
						comment :
							'set of all primites, that is ids without unit',
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
		d,
		i,
		iZ,
		n,
		primitives,
		unit,
		units;

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

		if( d.unit )
		{
			if( !units )
			{
				units = { };
			}

			unit = units[ d.unit ];

			if( !unit )
			{
				units[ d.unit ] =
				unit =
					{ };
			}

			unit[ d.name ] = d;
		}
		else
		{
			if( !primitives )
			{
				primitives = { };
			}

			primitives[ d.name ] = d;
		}
	}

/**/if( CHECK )
/**/{
/**/	if( units )
/**/	{
/**/		for( n in units )
/**/		{
/**/			Object.freeze( units[ n ] );
/**/		}
/**/
/**/		Object.freeze( units );
/**/	}
/**/
/**/	if( primitives )
/**/	{
/**/		Object.freeze( primitives );
/**/	}
/**/}

	return(
		idRepository.create(
			'primitives', primitives,
			'units', units
		)
	);
};


/*
| Returns a repository with
| an id or another id repository
| added
*/
idRepository.prototype.add =
	function(
		o
	)
{
	switch( o.reflect )
	{
		case 'jion.id' :

			return this._addID( o );

		case 'jion.idRepository' :

			return this._addIDRepository( o );

		default :

			throw new Error( );
	}
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
		primitives,
		unitStr,
		units,
		unit;

	units = this.units;

	primitives = this.primitives;

	ids = [ ];

	if( units )
	{
		for( unitStr in units )
		{
			unit = units[ unitStr ];

			for( name in unit )
			{
				ids.push( unit[ name ] );
			}
		}
	}

	if( primitives )
	{
		for( name in primitives )
		{
			ids.push( primitives[ name ] );
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


/*
| Returns a repository with an id added.
*/
idRepository.prototype._addID =
	function(
		d
	)
{
	var
		primitives,
		unit,
		units;

/**/if( CHECK )
/**/{
/**/	if( d.reflect !== 'jion.id' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !d.unit )
	{
		if( this.primitives )
		{
			if( this.primitives[ d.name ] )
			{
				// this repository already has this id.
				return this;
			}

			primitives = jools.copy( this.primitives );
		}
		else
		{
			primitives = { };
		}

		primitives[ d.name ] = d;

		if( CHECK )
		{
			Object.freeze( primitives );
		}

		return this.create( 'primitives', primitives );
	}

	if( this.units )
	{
		unit = this.units[ d.unit ];

		// this repository already has the id.
		if( unit && unit[ d.name ] )
		{
			return this;
		}

		units = jools.copy( this.units );
	}
	else
	{
		units = { };
	}

	unit =
		unit
		?  jools.copy( unit )
		: { };

	unit[ d.name ] = d;

	units[ d.unit ] = unit;

/**/if( CHECK )
/**/{
/**/	Object.freeze( unit );
/**/
/**/	Object.freeze( units );
/**/}

	return this.create( 'units', units );
};


/*
| Returns a repository with an id repository added.
*/
idRepository.prototype._addIDRepository =
	function(
		idr
	)
{
	var
		idrUnit,
		name,
		primitives,
		unit,
		units,
		unitStr;

/**/if( CHECK )
/**/{
/**/	if( idr.reflect !== 'jion.idRepository' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( !this.primitives )
	{
		primitives = idr.primitives;
	}
	else if( idr.primitives )
	{
		primitives = jools.copy( this.primitives );

		for( name in idr.primitives )
		{
			primitives[ name ] = idr.primitives[ name ];
		}

/**/	if( CHECK )
/**/	{
/**/		Object.freeze( primitives );
/**/	}
	}

	if( !this.units )
	{
		units = idr.units;
	}
	else if( idr.units )
	{
		units = jools.copy( this.units );

		for( unitStr in idr.units )
		{
			idrUnit = idr.units[ unitStr ];

			if( !units[ unitStr ] )
			{
				units[ unitStr ] = idrUnit;
			}
			else
			{
				unit = jools.copy( units[ unitStr ] );

				for( name in idrUnit )
				{
					if( !unit[ name ] )
					{
						unit[ name ] = idrUnit[ name ];
					}
				}
			}

		}

/**/	if( CHECK )
/**/	{
/**/		Object.freeze( units );
/**/	}
	}

	return(
		this.create(
			'primitives', primitives,
			'units', units
		)
	);
};




} )( );
