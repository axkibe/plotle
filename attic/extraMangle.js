/*
| Makes additional mangles
*/
def.proto.extraMangle =
	function(
		ast
	)
{
	log( '  extra mangling the bundle' );

	// unknown properties / keys
	// that are missed in both lists
	let missed = { };

	// mangle definitions:
	// a file that looks like this
	// ". value"  <-- this will be mangled
	// "> value"  <-- this will not be mangled
	const mangleDefs = ( fs.readFileSync( './mangle.txt') + '' ).split( '\n' );

	// associative of all mangles
	const mangle = { };

	// associative of all no-mangles
	const noMangle = { };

	// no mangles for the tim catalog
	const timNoMangle = tim.catalog.getBrowserNoMangle( );

	// associative of all mangles not used
	let useMangle = { };

	// associative of all no-mangles not used
	let useNoMangle = { };

	// ast properties mangled
	const astProps =
		{
			'property' : 'p',
			'key' : 'p',
			// string values are mangled
			// but do not flag properties missed
			'value' : 's'
		};

	// cuts away empty lines
	while( mangleDefs.indexOf( '' ) >= 0 )
	{
		mangleDefs.splice( mangleDefs.indexOf( '' ), 1 );
	}

	// creates associativs and lists
	for( let a = 0, aZ = mangleDefs.length; a < aZ; a++ )
	{
		const at = mangleDefs[ a ];

		const e = at.substring( 2 );

		if(
			e.length === 0 ||
			e.indexOf( ' ' ) >= 0 ||
			at[ 1 ] !== ' ' ||
			( at[ 0 ] !== '.' && at[ 0 ] !== '>' )
		)
		{
			throw new Error( 'malformed mangle entry "' + at + '"' );
		}

		if( mangle[ e ] || noMangle[ e ] )
		{
			throw new Error( 'double entry: "' + e + '"' );
		}

		switch( at[ 0 ] )
		{
			case '.' : mangle[ e ] = true; break;

			case '>' : noMangle[ e ] = true; break;
		}

	}

	// also mangles the timIDs
	/*
	for( let id in timIDs )
	{
		// only mangle those not used in json
		if( timIDs[ id ] === false && !noMangle[ id ] ) mangle[ id ] = true;
	}
	*/

	// an array of all mangles
	const mangleList = Object.keys( mangle ).sort( );

	// allots all mangles a value
	for( let a = 0, al = mangleList.length; a < al; a++ )
	{
		const at = mangleList[ a ];

		mangle[ at ] = '$' + server_tools.b64Encode( a );
	}

	if( config.get( 'server', 'report' ) )
	{
		fs.writeFileSync( 'report/manglemap.txt', util.inspect( mangle ) );
	}

	// marks all mangles and no-mangles as unused so far
	for( let a in mangle )
	{
		useMangle[ a ] = true;
	}

	for( let a in noMangle )
	{
		useNoMangle[ a ] = true;
	}

	// walks the syntax tree
	ast.walk( new terser.TreeWalker(
		function( node )
	{
		let k, p;

		for( k in astProps )
		{
			p = node[ k ];

			if( p !== undefined ) break;
		}

		if( !k ) return false;

		if( typeof( node[ k ] ) !== 'string' ) return false;

		// checks if this property will not be mangled
		if( noMangle[ p ] !== undefined )
		{
			delete useNoMangle[ p ];

			return false;
		}

		// checks
		if( timNoMangle[ p ] !== undefined ) return false;

		// checks if this property will be mangled
		if( mangle[ p ] !== undefined )
		{
			delete useMangle[ p ];

			node[ k ] = mangle[ p ];

			return false;
		}

		// if this is a property it is marked as missed
		if( astProps[ k ] === 'p' )
		{
			missed[ p ] = true;
		}

		return false;
	}
	));

	// turns check lists into arrays and sorts them
	missed = Object.keys( missed ).sort( );

	useMangle = Object.keys( useMangle ).sort( );

	useNoMangle = Object.keys( useNoMangle ).sort( );

	if( missed.length > 0 )
	{
		log( 'extraMangle missed ' + missed.length + ' properties: ', missed );
	}

	if( useMangle.length > 0 )
	{
		log( 'extraMangle not used mangles: ', useMangle );
	}

	if( useNoMangle.length > 0 )
	{
		log( 'extraMangle not used no-mangles: ', useNoMangle );
	}
};
