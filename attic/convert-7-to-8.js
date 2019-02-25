/*
| Converts a v7 repository to v8.
*/


// deactivated
return false;


/*
| This tool is configered directly here
*/
var
config,

config =
{
	src :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-7'
	},
	trg :
	{
		host : '127.0.0.1',
		port : 27017,
		name : 'ideoloom-8'
	}
};


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| Turn on checking on server side by default.
*/
GLOBAL.CHECK = true;

GLOBAL.JION = false;

GLOBAL.SERVER = true;


/*
| Imports
*/
var
	mongodb,
	resume,
	run,
	sus;

mongodb = require( 'mongodb' );

sus = require( 'suspend' );

resume = sus.resume;


/*
| Translates a spaces entry.
*/
function translateSpacesEntry( o )
{
	var
		id,
		r,
		split;

	id = o._id;

	split = id.split( ':' );

	r =
		{
			_id : id,
			username : split[ 0 ],
			tag : split[ 1 ]
		};

	return r;
}


function translateTypes( o )
{
	var
		a, aZ,
		key,
		keys;

	try
	{
		keys = Object.keys( o );
	}
	catch( err )
	{
		return o;
	}

	if( o.type )
	{
		o.type = o.type.replace( /\./g, '_' );

		switch( o.type )
		{
			case 'Note' : o.type = 'fabric_note'; break;

			case 'Doc' : o.type = 'fabric_doc'; break;

			case 'Para' : o.type = 'fabric_para'; break;

			case 'Point' : o.type = 'euclid_point'; break;

			case 'Rect' : o.type = 'euclid_rect'; break;

			case 'visual_doc' : o.type = 'fabric_doc'; break;

			case 'visual_label' : o.type = 'fabric_label'; break;

			case 'visual_note' : o.type = 'fabric_note'; break;

			case 'visual_para' : o.type = 'fabric_para'; break;

			case 'visual_portal' : o.type = 'fabric_portal'; break;

			case 'visual_relation' : o.type = 'fabric_relation'; break;
		}
	}

	var extra =
	{
		'Label' : true,
		'Note' : true,
		'Para' : true,
		'Portal' : true,
		'Relation' : true
	};

	if( o.twig && extra[ o.twig.type ] === true )
	{
		for( key in o.twig )
		{
			if( key === 'type' )
			{
				console.log( 'Extra translate', o.type, o.twig.type );
			}
			else
			{
				o[ key ] = o.twig[ key ];
			}
		}

		delete o.twig;

		keys = Object.keys( o );
	}


	for(
		a = 0, aZ = keys.length;
		a < aZ;
		a++
	)
	{
		key = keys[ a ];

		if( key === 'type' )
		{
			continue;
		}

		translateTypes( o[ key ] );
	}
}


/*
| Translates a change.
*/
function translateChange( o )
{
	var
		chgX;

	chgX = o.chgX,

	delete o.chgX;

	o.type = 'database_changeSkid';

	o.changeRay = {
		type : 'ccot_changeRay',
		ray :
			Array.isArray( chgX )
			? chgX
			: [ chgX ]
	};

	translateTypes( o );

	return o;
}



/*
| The main runner.
*/
run =
	function*( )
{
	var
		cursor,
		o,
		sc,
		spaces,
		src,
		tc,
		trg,
		users;

	src = { };

	trg = { };

	// initializes the mongodb databases access
	src.server =
		new mongodb.Server(
			config.src.host,
			config.src.port,
			{ }
		);

	trg.server =
		new mongodb.Server(
			config.trg.host,
			config.trg.port,
			{ }
		);

	src.connector =
		new mongodb.Db(
			config.src.name,
			src.server,
			{ w : 1 }
		);

	trg.connector =
		new mongodb.Db(
			config.trg.name,
			trg.server,
			{ w : 1 }
		);

	console.log( '* connecting to src' );

	src.connection =
		yield src.connector.open( resume( ) );

	console.log( '* connecting to trg' );

	trg.connection =
		yield trg.connector.open( resume( ) );

	console.log( '* dropping trg' );
		yield trg.connection.dropDatabase( resume( ) );

	src.global = yield src.connection.collection( 'global',  resume( ) );

	src.spaces = yield src.connection.collection( 'spaces', resume( ) );

	src.users = yield src.connection.collection( 'users', resume( ) );

	trg.global = yield trg.connection.collection( 'global', resume( ) );

	trg.users = yield trg.connection.collection( 'users', resume( ) );

	trg.spaces = yield trg.connection.collection( 'spaces', resume( ) );

	if( ( yield src.global.count( resume( ) ) ) === 0 )
	{
		console.log( 'ERROR: src has a no "global" collection' );

		process.exit( 1 );
	}

	o =
		yield src.global.findOne(
			{ _id : 'version' },
			resume( )
		);

	if( o.version !== 7 )
	{
		throw new Error( 'src is not a v7 repository' );
	}

	console.log( '* creating trg.global' );

	yield trg.global.insert(
		{
			_id : 'version',
			version : 8
		},
		resume( )
	);

	console.log( '* copying src.users -> trg.users' );

	cursor = yield src.users.find( resume( ) );

	users = { };

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		users[ o._id ] = o;

		yield trg.users.insert( o, resume( ) );
	}

	console.log( '* translating src.spaces -> trg.spaces' );

	cursor = yield src.spaces.find( resume( ) );

	spaces = { };

	for(
		o = yield cursor.nextObject( resume( ) );
		o !== null;
		o = yield cursor.nextObject( resume( ) )
	)
	{
		o = translateSpacesEntry( o );

		spaces[ o._id ] = o;

		yield trg.spaces.insert( o, resume( ) );
	}

	console.log( '* copying src.changes.* -> trg.changes.*' );

	for( var spaceName in spaces )
	{
		console.log(
			' * copying src.changes.' + spaceName +
			' -> trg.changes.' + spaceName
		);

		sc =
			yield src.connection.collection(
				'changes:' + spaceName,
				resume( )
			);

		tc =
			yield trg.connection.collection(
				'changes:' + spaceName,
				resume( )
			);

		cursor = yield sc.find( resume( ) );

		for(
			o = yield cursor.nextObject( resume( ) );
			o !== null;
			o = yield cursor.nextObject( resume( ) )
		)
		{
			o = translateChange( o );

			yield tc.insert( o, resume( ) );
		}
	}

	console.log( '* closing connections' );

	src.connection.close( );

	trg.connection.close( );

	console.log( '* done' );
};

sus( run )( );

} )( );

