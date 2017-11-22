/*
| A wrapper for ajax request.
*/
'use strict';


// FIXME
var
	transmitter;


tim.define( module, 'net_requestWrap', ( def, net_requestWrap ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		channelName :
		{
			comment : 'name of the channel the request belongs to',
			type : 'string'
		},
		request :
		{
			comment : 'the actual request',
			type : require( '../request/typemap' )
		},
		receiverFuncName :
		{
			comment : 'name of the receiver function to call',
			type : 'string'
		},
		_xhr :
		{
			comment : 'the underlaying "XMLHttpRequest"',
			type : [ 'undefined', 'protean' ]
		}
	};
}


// FIXME
let onReplyTransmitter;


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Aborts the request if it is active.
|
| Returns true if the request has been aborted.
*/
def.func.abort =
	function( )
{
	if( this._xhr )
	{
		this._xhr.aborted = true;

		this._xhr.abort( );

		return true;
	}

	return false;
};


/*
| A request has been replied.
|
| 'this' is the _xhr ajax request.
*/
const onReply =
	function( )
{
	if( this.readyState !== 4 || this.aborted ) return;

	const wrap = this.wrap;

	this.onreadystatechange = undefined;

	const channel = root.ajax.get( wrap.channelName );

	if( this.status !== 200 )
	{
		channel.onReply(
			wrap,
			{
				type: 'reply_error',
				message: 'Lost server connection'
			}
		);

		return;
	}

	let reply;

	try
	{
		reply = JSON.parse( this.responseText );
	}
	catch( e )
	{
		channel.onReply(
			wrap,
			{
				type: 'reply_error',
				message: 'Server answered no JSON!'
			}
		);

		return;
	}

	channel.onReply( wrap, reply );
};


/*
| Sends the wrapped request.
*/
def.func.send =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this._xhr ) throw new Error( );
/**/}

	const xhr = new XMLHttpRequest( );

	xhr.wrap = this;

	xhr.open( 'POST', '/mm', true );

	xhr.setRequestHeader(
		'Content-type',
		'application/x-www-form-urlencoded'
	);

	if( !onReplyTransmitter )
	{
		onReplyTransmitter = transmitter( onReply );
	}

	xhr.onreadystatechange = onReplyTransmitter;

	xhr.send( JSON.stringify( this.request ) );

	return this.create( '_xhr', xhr );
};


} );
