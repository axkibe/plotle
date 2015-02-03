/*
| A jion id group.
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
			'jion_idGroup',
		group :
			[ 'jion_id' ]
	};
}


var
	jion_id,
	jion_idGroup,
	jools;


jion_idGroup = require( '../jion/this' )( module );

jion_id = require( './id' );

jools = require( '../jools/jools' );


/*
| Creates an id repository from an
| array of id strings.
*/
jion_idGroup.createFromIDStrings =
	function(
		idStrings
	)
{
	var
		i,
		id,
		ids,
		iZ;

/**/if( CHECK )
/**/{
/**/	if( !Array.isArray( idStrings ) )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	ids = { };

	for(
		i = 0, iZ = idStrings.length;
		i < iZ;
		i++
	)
	{
		id = jion_id.createFromString( idStrings[ i ] );

		if( ids[ id.string ] )
		{
			throw new Error( 'double id' );
		}

		ids[ id.string ] = id;
	}

	return jion_idGroup.create( 'group:init', ids );
};


/*
| Returns an idGroup with an id added.
*/
jion_idGroup.prototype.add =
	function(
		id
	)
{
	return(
		this.create(
			'group:set',
			id.string,
			id
		)
	);
};


/*
| Returns all units as alphasorted list.
*/
jools.lazyValue(
	jion_idGroup.prototype,
	'idList',
	function( )
{
	var
		a,
		aZ,
		il,
		keys;

	keys = this.sortedKeys;

	for(
		a = 0, aZ = keys.length;
		a < aZ;
		a++
	)
	{
		il[ a ] = this.get[ keys[ a ] ];
	}

/**/if( FREEZE )
/**/{
/**/	Object.freeze( il );
/**/}

	return il;
}
);


/*
| Returns all units as alphasorted list.
*/
jools.lazyValue(
	jion_idGroup.prototype,
	'unitList',
	function( )
{
	var
		a,
		aZ,
		id,
		keys,
		units,
		ul;

	keys = this.keys;

	units = { };

	for(
		a = 0, aZ = keys.length;
		a < aZ;
		a++
	)
	{
		id = this.get( keys[ a ] );

		if( id.unit )
		{
			units[ id.unit ] = true;
		}
	}


	ul = Object.keys( this.units ).sort( );

/**/if( FREEZE )
/**/{
/**/	Object.freeze( ul );
/**/}

	return ul;
}
);


/*
| Returns the id names as list of an unit.
|
| FIXME jools.lazyStringFunc
*/
jion_idGroup.prototype.nameListOfUnit =
	function(
		unit
	)
{
	var
		a,
		aZ,
		id,
		keys,
		nameList;

	keys = this.sortedKeys;

	for(
		a = 0, aZ = keys.length;
		a < aZ;
		a++
	)
	{
		id = this.get( keys[ a ] );

		if( id.unit === unit )
		{
			nameList.push( id.name );
		}
	}

/**/if( FREEZE )
/**/{
/**/	Object.freeze( nameList );
/**/}

	return nameList;
};


} )( );
