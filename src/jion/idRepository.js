/*
| A jion id repository.
|
| Is a set of units and names.
|
| FUTURE change it to idRay
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
			'jion_idRepository',
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
	jion_id,
	jion_idRepository,
	jools;


jion_idRepository = require( '../jion/this' )( module );

jion_id = require( './id' );

jools = require( '../jools/jools' );


/*
| Initializer.
*/
jion_idRepository.prototype._init =
	function( )
{
	if( !this.units )
	{
		this.units = { };

/**/	if( FREEZE )
/**/	{
/**/		Object.freeze( this.units );
/**/	}
	}
};


/*
| Creates an id repository from an
| array of id strings.
*/
jion_idRepository.createFromIDStrings =
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
		d = jion_id.createFromString( idStrings[ i ] );

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

/**/if( FREEZE )
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
		jion_idRepository.create(
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
jion_idRepository.prototype.add =
	function(
		o
	)
{
	switch( o.reflect )
	{
		case 'jion_id' :

			return this._addID( o );

		case 'jion_idRepository' :

			return this._addIDRepository( o );

		default :

			throw new Error( );
	}
};


/*
| Returns all units as alphasorted list.
*/
jools.lazyValue(
	jion_idRepository.prototype,
	'unitList',
	function( )
{
	var
		ul;

	ul = Object.keys( this.units ).sort( );

/**/if( FREEZE )
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
	jion_idRepository.prototype,
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

	ids.sort( jion_id.compare );

/**/if( FREEZE )
/**/{
/**/	Object.freeze( ids );
/**/}

	return ids;
}
);


/*
| Returns the id names as list of an unit.
*/
jion_idRepository.prototype.nameListOfUnit =
	function(
		unitStr
	)
{
	var
		unit,
		nameList;

	unit = this.units[ unitStr ];

	nameList = Object.keys( unit ).sort( );

/**/if( FREEZE )
/**/{
/**/	Object.freeze( nameList );
/**/}

	return nameList;
};


/*
| Returns a repository with an id added.
*/
jion_idRepository.prototype._addID =
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
/**/	if( d.reflect !== 'jion_id' )
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

/**/	if( FREEZE )
/**/	{
/**/		Object.freeze( primitives );
/**/	}

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

/**/if( FREEZE )
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
jion_idRepository.prototype._addIDRepository =
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
/**/	if( idr.reflect !== 'jion_idRepository' )
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

/**/			if( FREEZE )
/**/			{
/**/				Object.freeze( unit );
/**/			}

				units[ unitStr ] = unit;
			}

		}

/**/	if( FREEZE )
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
