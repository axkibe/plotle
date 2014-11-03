/*
| A jion id.
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
			'jion.id',
		node :
			true,
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

	split = string.split( '.' );

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
| This id as string
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
| This id as astVariable
*/
jools.lazyValue(
	id.prototype,
	'astVar',
	function( )
	{
		if( this.unit )
		{
			return shorthand.astVar( this.unit ).astDot( this.name );
		}
		else
		{
			return shorthand.astVar( this.name );
		}
	}
);


} )( );
