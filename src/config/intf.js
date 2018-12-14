/*
| Interface to the server config.
*/
'use strict';


const intf = module.exports;

const server_config_root = require( './root' );

// the actual current configuration
let config = server_config_root.create( );


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
intf.set =
	function(
		// path
		// value
	)
{
	let path = Array.prototype.slice.call( arguments );

	let value = path.pop( );

	config = _set( path, value, config, 0 );
};


/*
| Returns a config setting.
*/
intf.get =
	function(
		// path
	)
{
	let entry = config;

	for( let a = 0, aZ = arguments.length; a < aZ; a++ )
	{
		entry = entry[ arguments[ a ] ];
	}

/**/if( CHECK )
/**/{
/**/	if( entry === undefined ) throw new Error( );
/**/}

	return entry;
};
