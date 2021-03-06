/*
| Demaps a backtrace from uglified pack.
*/

if( process.argv.length !== 4 )
{
	console.log( 'Usage: ' + process.argv[ 0 ] + ' ' + process.argv[ 1 ] + ' sourceMap traceFile' );

	return 1;
}

const fs = require( 'fs' );

const SourceMap = require( 'source-map' );

const trace = [ ];

let fsTrace = fs.readFileSync( process.argv[ 3 ] ) + '';

fsTrace = fsTrace.split( /[ \n]/ );

for( let line of fsTrace )
{
	const r = line.match( ':([0-9]*):([0-9]*)' );

	if( !r ) continue;

	trace.push(
		{
			line : parseInt( r[ 1 ], 10 ),
			column : parseInt( r[ 2 ], 10 )
		}
	);
}

let map = fs.readFileSync( process.argv[ 2 ] );

map = JSON.parse( map );

const smc = new SourceMap.SourceMapConsumer( map );

for( let t of trace )
{
	const io = smc.originalPositionFor( t );

	console.log( io.source + ':' + io.line + ':' + io.column );
}
