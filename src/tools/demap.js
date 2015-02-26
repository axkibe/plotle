var
	fs,
	map,
	SourceMap,
	trace;

fs = require( 'fs' );

// NodeJS
SourceMap = require( 'source-map' );

trace =
	[
		{ line: 11, column : 12865 },
	];

map = fs.readFileSync( process.argv[ 2 ] );

map = JSON.parse( map );

var smc = new SourceMap.SourceMapConsumer( map );

for(
		var a = 0, aZ = trace.length;
		a < aZ;
		a++
)
{
	console.log(
		smc.originalPositionFor( trace[ a ] )
	);
}
