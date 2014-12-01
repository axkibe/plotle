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
			'jion.id',
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
	id,
	jools,
	shorthand;

id = require( '../jion/this' )( module );

jools = require( '../jools/jools' );

shorthand = require( '../ast/shorthand' );

/*
| Initializer.
*/
id.prototype._init =
	function( )
{
	// FIXME?
};


/*
| Create the id from a string specifier.
*/
id.createFromString =
	function(
		string
	)
{
	var
		split;

	// split = string.split( '_' ); FUTURE
	split = string.split( /[_.]/g );

	if( split.length <= 1 )
	{
		return id.create( 'name', string );
	}

	if( split.length > 2 )
	{
		throw new Error( );
	}

	return(
		id.create(
			'unit', split[ 0 ],
			'name', split[ 1 ]
		)
	);
};


/*
| Compares two ids.
*/
id.compare =
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
	id.prototype,
	'string',
	function( )
	{
		if( this.unit )
		{
			return this.unit + '.' + this.name;
		}
		else
		{
			return this.name;
		}
	}
);


/*
| This id as string in new underscore format.
*/
jools.lazyValue(
	id.prototype,
	'string_',
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
| This id as astString
*/
jools.lazyValue(
	id.prototype,
	'astString',
	function( )
	{
		return shorthand.astString( this.string );
	}
);


/*
| This id as astString in new underscore forrmat.
*/
jools.lazyValue(
	id.prototype,
	'astString_',
	function( )
	{
		return shorthand.astString( this.string_ );
	}
);


/*
| This id as global varname
*/
jools.lazyValue(
	id.prototype,
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
| This id as astVariable
|
| FIXME rename astGlobal
*/
jools.lazyValue(
	id.prototype,
	'astVar',
	function( )
	{
		return shorthand.astVar( this.global );
	}
);


} )( );
