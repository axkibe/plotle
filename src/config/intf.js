/*
| Interface to the server config.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Provides only static functions.
*/
def.abstract = true;


const server_config_root = tim.require( './root' );

// the actual current configuration
let config;


/*
| Helper to intf.set
*/
const _set =
	function(
		path,    // path to be set
		value,   // last value to set
		entry,   // the entry to be set
		pos      // position in the path
	)
{
	if( pos + 1 >= path.length )
	{
		return entry.create( path[ pos ], value );
	}
	else
	{
		return entry.create( path[ pos ], _set( path, value, entry[ path[ pos ] ], pos + 1 ) );
	}
};


/*
| Interface for config.js
*/
def.static.set =
	function(
		// path
		// value
	)
{
	let path = Array.prototype.slice.call( arguments );

	let value = path.pop( );

	if( !config ) config = server_config_root.create( );

	config = _set( path, value, config, 0 );
};


/*
| Returns a config setting.
*/
def.static.get =
	function(
		// path
	)
{
	let entry = config;

	for( let a of arguments )
	{
		entry = entry[ a ];
	}

/**/if( CHECK )
/**/{
/**/	if( entry === undefined ) throw new Error( );
/**/}

	return entry;
};


} );
