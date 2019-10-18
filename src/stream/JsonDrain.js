/*
| A tool to handle streamed json data.
*/
'use strict';

const streamJson = require( 'stream-json' );

class JsonDrain
{
	/*
	| Constructor.
	*/
	constructor(
		stream // the stream to handle
	)
	{
		const parser = this._parser = streamJson.parser( );
		const bf = this._buffer = [ ];
		this._semaphore = undefined;
		this._maxBuf = 5;
		this._key = undefined;
		parser.on( 'data',
			( data ) =>
		{
			const name = data.name;
			let value = data.value;
			if( name === 'numberValue' ) value = parseInt( value, 10 );
			switch( data.name )
			{
				case 'endNumber' :
				case 'endKey' :
				case 'endString' :
				case 'numberChunk' :
				case 'startKey' :
				case 'startNumber' :
				case 'startString' :
				case 'stringChunk' :
					return;
				case 'endArray' :
					bf.push( { array : 'end' } );
					break;
				case 'startArray' :
				{
					let chunk;
					if( this._key )
					{
						chunk = { attribute : this._key, array : 'start' };
						this._key = undefined;
					}
					else chunk = { array : 'cascade' };
					break;
				}
				case 'endObject' :
					bf.push( { object : 'end' } );
					break;
				case 'startObject' :
				{
					let chunk;
					if( this._key )
					{
						chunk = { attribute : this._key, object : 'start' };
						this._key = undefined;
					}
					else chunk = { array : 'value', object : 'start' };
					break;
				}
				case 'keyValue' :
					this._key = value;
					return;
				case 'falseValue' :
				case 'nullValue' :
				case 'numberValue' :
				case 'stringValue' :
				case 'trueValue' :
				{
					let chunk;
					if( this._key )
					{
						chunk = { attribute : this._key, value : value };
						this._key = undefined;
					}
					else
					{
						chunk = { array : 'value', value : value };
					}
					// otherwise it must be in an array
					bf.push( chunk );
					break;
				}
				default :
					console.log( 'JsonDrain: unexpected data ' + data.name );
					break;
			}
			if( bf.length >= this._maxBuf ) parser.pause( );
			if( this._semaphore ) this._semaphore( );
		} );

		parser.on( 'end',
			( ) =>
		{
				this._buffer.push( 'eos' );
				if( this._semaphore ) this._semaphore( );
		} );

		stream.pipe( parser );
	}

	async next( )
	{
		const s = this._semamphore;
		if( s ) throw new Error( 'JsonDrain semaphore violation' );
		for(;;)
		{
			const r = this._get( );
			if( r ) return r;
			await new Promise( ( resolve, reject )  => { this._semaphore = resolve; } );
		}
	}

	_get( )
	{
		const bf = this._buffer;
		if( bf.length === 0 ) return;
		const r = bf.shift( );
		this._parser.resume( );
		return r;
	}
}

module.exports = JsonDrain;
