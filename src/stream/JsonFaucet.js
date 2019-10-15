/*
| A tool to create a json as a stream.
*/
'use strict';

const { Readable } = require( 'stream' );

class JsonFaucet extends Readable
{
	/*
	| Constructor.
	*/
	constructor( options )
	{
		super( options );
		let indent;
		if( options ) indent = options.indent;
		if( !indent ) indent = false;
		this._indent = indent;
		// current indent level and beautiful vs. compact spacing
		if( indent ) { this._ci = ''; this._sp = ' ' }
		else { this._ci = undefined; this._sp = ''; }
		this._stack = [ ];
	}

	/*
	| Dennotes an attribute,
	|
	| Must either:
	|    use two parameters and hand obj to be stringified.
	|    or use one parameter followed by beginArray or beginObject
	*/
	async attribute(
		name,	// name of the attribute
		obj     // if specified use this right away
	)
	{
		this._check( '-obj', '+obj' );
		await this._comma( );
		const sp = this._sp;
		await this._push( JSON.stringify( name ) + sp + ':' );
		if( arguments.length > 1 ) await this._push( sp + JSON.stringify( obj ) );
		else this._stack.push( 'attr' );
	}

	/*
	| Begins an Array.
	*/
	async beginArray( )
	{
		this._check( '-arr', '+arr', 'attr' );
		await this._comma( );
		await this._push( this._sp + '[' );
		const st = this._stack;
		st.push( '-arr' );
	}

	/*
	| Begins the document.
	*/
	async beginDocument( )
	{
		this._check( );
		const st = this._stack;
		if( st.length ) throw new Error( 'JsonFaucet: document already begun' );
		st.push( '-obj' );
		await this._push( '{' );
	}

	/*
	| Begins an object.
	*/
	async beginObject( )
	{
		this._check( 'attr', '-arr', '+arr' );
		await this._comma( );
		await this._push( '{' );
		const st = this._stack;
		st.push( '-obj' );
	}

	/*
	| Ends an array.
	*/
	async endArray( )
	{
		this._check( '-arr', '+arr' );
		await  this._push( ']' );
		const st = this._stack;
		st.pop( );
		const last = st[ st.length - 1 ];
		if( last === 'attr' ) st.pop( );
	}

	/*
	| Ends the document.
	*/
	async endDocument(
		suffix // if defined puts this on the end ( like a newline )
	)
	{
		this._check( '-obj', '+obj' );
		if( this._stack.length > 1 ) throw new Error( 'JsonFaucet: unexpected end.' );
		this._stack = undefined;
		await this._push( '}' );
		if( suffix ) await this._push( suffix );
	}

	/*
	| Ends an object.
	*/
	async endObject( )
	{
		this._check( '-obj', '+obj' );
		await  this._push( '}' );
		const st = this._stack;
		st.pop( );
		const last = st[ st.length - 1 ];
		if( last === 'attr' ) st.pop( );
	}

	//////////////
	// Internal //
	//////////////


	// general checks for user functions.
	_check(
		// ... a list of expects this on the bottom of the stack
	)
	{
		if( this._hold ) throw new Error( 'JsonFaucet: called albeit it is stalled.' );
		const st = this._stack;
		if( !st ) throw new Error( 'JsonFaucet: document has already ended.' );
		const last = st[ st.length - 1 ];
		if( arguments.length )
		{
			for( let a of arguments ) if( a === last ) return last;
			throw new Error( 'JsonFaucet: unexpected call.' );
		}
		return last;
	}

	// if this isn't the first element this pushes a comma on the stream
	// if it is the first, it changes the state from - to + to remember
	// the next one isn't
	async _comma( )
	{
		const st = this._stack;
		const l = st[ st.length - 1];
		switch( l[ 0 ] )
		{
			case '-' :
				st[ st.length - 1 ] = '+' + st[ st.length - 1 ].substr( 1 );
				this._indentR( );
				break;
			case '+' :
				await this._push( ',' );
				await this._indentC( );
				break;
		}
	}

	// pushes current indent level onto stream.
	async _indentC( )
	{
		if( !this._indent ) return;
		await this._push( '\n' + this._ci );
	}

	// decreased indent level and pushes it onto stream.
	async _indentL( )
	{
		if( !this._indent ) return;
		this._ci = this._ci.substr( this._indent.length );
		await this._indentC( );
	}

	// increased indent level and pushes it onto stream.
	async _indentR( )
	{
		if( !this._indent ) return;
		this._ci += this._indent;
		await this._indentC( );
	}

	// push respecting flow control.
	async _push( data )
	{
		if( !this.push( data ) )
		{
			// if push is false waits until stream pressure gets okay again
			await new Promise( ( resolve ) => { this._hold = resolve; } );
			this._hold = undefined;
		}
	}

	// handles flow control.
	_read( size ) { const h = this._hold; if( h ) h( ); }
}

module.exports = JsonFaucet;
