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
		const maxBuf = 1;
		let key = undefined;
		this._start = undefined;
		let first = true;
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
					this._start = undefined;
					return;
				case 'endArray' :
					this._start = undefined;
					bf.push( { array : 'end' } );
					break;
				case 'startArray' :
				{
					let chunk;
					this._start = 'array';
					if( key )
					{
						chunk = { attribute : key, array : 'start' };
						key = undefined;
					}
					else
					{
						if( first ) { first = false; chunk = { array : 'start' }; }
						else chunk = { array : 'cascade' };
					}
					bf.push( chunk );
					break;
				}
				case 'endObject' :
					this._start = undefined;
					bf.push( { object : 'end' } );
					break;
				case 'startObject' :
				{
					this._start = 'object';
					let chunk;
					if( key )
					{
						chunk = { attribute : key, object : 'start' };
						key = undefined;
					}
					else
					{
						if( first ) { first = false; chunk = { object : 'start' }; }
						else chunk = { array : 'value', object : 'start' };
					}
					bf.push( chunk );
					break;
				}
				case 'keyValue' :
					this._start = undefined;
					key = value;
					return;
				case 'falseValue' :
				case 'nullValue' :
				case 'numberValue' :
				case 'stringValue' :
				case 'trueValue' :
				{
					this._start = undefined;
					let chunk;
					if( key )
					{
						chunk = { attribute : key, value : value };
						key = undefined;
					}
					else chunk = { array : 'value', value : value };
					bf.push( chunk );
					break;
				}
				default :
					throw new Error( 'JsonDrain: unexpected data ' + data.name );
			}
			if( bf.length >= maxBuf ) parser.pause( );
			if( this._semaphore ) this._semaphore( );
		} );

		parser.on( 'end',
			( ) =>
		{
				this._buffer.push( { endofstream : true } );
				if( this._semaphore ) this._semaphore( );
		} );

		stream.pipe( parser );
	}

	/*
	| Gets the next chunk.
	| Stalls if the stream is empty.
	*/
	async next( )
	{
		const s = this._semamphore;
		if( s ) throw new Error( 'JsonDrain: semaphore violation.' );
		for(;;)
		{
			const r = this._get( );
			if( r ) return r;
			await new Promise( ( resolve, reject )  => { this._semaphore = resolve; } );
		}
	}

	/*
	| Retrieves the current object as whole building it in memory.
	| Must be called only after {array:'begin'}, {array:'cascade'} or {object:begin}.
	*/
	async retrieve( )
	{
		const stack = [ ];
		let o;
		switch( this._start )
		{
			case 'array' : stack.push( o = [ ] ); break;
			case 'object' : stack.push( o = { } ); break;
			default : throw new Error( 'JsonDrain: invalid retrieve.' );
		}
		for(;;)
		{
			const chunk = await this.next( );
			const attr = chunk.attribute;
			const array = chunk.array;
			const object = chunk.object;
			const value = chunk.value;
			if( attr )
			{
				if( value !== undefined ) { o[ attr ] = value; continue; }
				if( object === 'start' )
				{
					const co = { };
					o[ attr ] = co;
					stack.push( o = co );
					continue;
				}
				if( array === 'start' )
				{
					const ca = [ ];
					o[ attr ] = ca;
					stack.push( o = ca );
					continue;
				}
				throw new Error( 'JsonDrain: this should not happen.' );
			}
			if( object === 'end' )
			{
				stack.pop( );
				if( stack.length === 0 ) return o;
				o = stack[ stack.length - 1 ];
				continue;
			}
			switch( array )
			{
				case 'value' :
					if( value !== undefined ) { o.push( value ); continue; }
					if( object === 'start' )
					{
						const ca = { };
						o.push( ca );
						stack.push( o = ca );
						continue;
					}
					throw new Error( 'JsonDrain: this should not happen.' );
				case 'cascade' :
				{
					const ca = [ ];
					o.push( ca );
					stack.push( o = ca );
					continue;
				}
				case 'end' :
					stack.pop( );
					if( stack.length === 0 ) return o;
					o = stack[ stack.length - 1 ];
					continue;
			}
			throw new Error( 'JsonDrain: this should not happen.' );
		}
	}

	/*
	| Skits the current object.
	| Must be called only after {array:'begin'}, {array:'cascade'} or {object:begin}.
	*/
	async skip( )
	{
		let level = 1;
		if( !this._start ) throw new Error( 'JsonDrain: invalid skip.' );
		for(;;)
		{
			const chunk = await this.next( );
			switch( chunk.object )
			{
				case 'start' : level++; break;
				case 'end' : level--; break;
			}
			switch( chunk.array )
			{
				case 'start' : level++; break;
				case 'cascade' : level++; break;
				case 'end' : level--; break;
			}
			if( level <= 0 ) return;
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
