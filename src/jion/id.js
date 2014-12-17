/*
| A jion id.
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
			'jion_id',
		attributes :
			{
				'name' :
					{
						comment :
							'the name part of the id if applicable',
						type :
							'String',
						defaultValue :
							undefined
					},
				'unit' :
					{
						comment :
							'the unit part of the id if applicable',
						type :
							'String',
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
	jools,
	shorthand;

jion_id = require( '../jion/this' )( module );

jools = require( '../jools/jools' );

shorthand = require( '../ast/shorthand' );

/*
| Initializer.
*/
jion_id.prototype._init =
	function( )
{
	// FIXME?
};


/*
| Create the id from a string specifier.
*/
jion_id.createFromString =
	function(
		string
	)
{
	var
		split;

	split = string.split( '_' );

	if( split.length <= 1 )
	{
		return jion_id.create( 'name', string );
	}

	if( split.length > 2 )
	{
		throw new Error( );
	}

	return(
		jion_id.create(
			'unit', split[ 0 ],
			'name', split[ 1 ]
		)
	);
};


/*
| Compares two ids.
*/
jion_id.compare =
	function(
		o1,
		o2
	)
{
	if( o1.unit === o2.unit )
	{
		if( o1.name === o2.name )
		{
			return 0;
		}
		else if( o1.name > o2.name )
		{
			return 1;
		}
		else
		{
			return -1;
		}
	}

	if( !o1.unit && o2.unit )
	{
		return 1;
	}

	if( o1.unit && !o2.unit )
	{
		return -1;
	}

	if( o1.unit > o2.unit )
	{
		return 1;
	}
	else
	{
		return -1;
	}
};



/*
| This id as string.
*/
jools.lazyValue(
	jion_id.prototype,
	'string',
	function( )
	{
		if( this.unit )
		{
			return this.unit + '_' + this.name;
		}
		else
		{
			return this.name;
		}
	}
);


/*
| This id as ast string.
*/
jools.lazyValue(
	jion_id.prototype,
	'$string',
	function( )
	{
		return shorthand.$string( this.string );
	}
);



/*
| This id as global varname
*/
jools.lazyValue(
	jion_id.prototype,
	'global',
	function( )
	{
		if( this.unit )
		{
			return this.unit + '_' + this.name;
		}
		else
		{
			return this.name;
		}
	}
);



/*
| This id as ast variable
|
| FIXME rename $global
*/
jools.lazyValue(
	jion_id.prototype,
	'$var',
	function( )
	{
		return shorthand.$var( this.global );
	}
);


} )( );
