var
	a,
	aZ,
	fs,
	fsTrace,
	io,
	line,
	map,
	r,
	SourceMap,
	smc,
	trace;

if( process.argv.length !== 4 )
{
	console.log( 'Usage: ' + process.argv[ 0 ] + ' ' + process.argv[ 1 ] + ' sourceMap traceFile' );

	return 1;
}

fs = require( 'fs' );

SourceMap = require( 'source-map' );

trace = [ ];

fsTrace = fs.readFileSync( process.argv[ 3 ] ) + '';

fsTrace = fsTrace.split( /[ \n]/ );

for( a = 0, aZ = fsTrace.length; a < aZ; a++ )
{
	line = fsTrace[ a ];

	r = line.match( ':([0-9]*):([0-9]*)' );

	if( !r ) continue;

	trace.push(
		{
			line : parseInt( r[ 1 ], 10 ),
			column : parseInt( r[ 2 ], 10 )
		}
	);
}

map = fs.readFileSync( process.argv[ 2 ] );

map = JSON.parse( map );

smc = new SourceMap.SourceMapConsumer( map );

for(
	a = 0, aZ = trace.length;
	a < aZ;
	a++
)
{
	io = smc.originalPositionFor( trace[ a ] );

	console.log( io.source + ':' + io.line + ':' + io.column );
}
