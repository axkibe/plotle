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
		{ line: 3, column : 12182 },
		{ line: 3, column : 19787 },
		{ line: 3, column : 19278 }
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
