/*
| A wrapper for ajax request.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'net_requestWrap',
		attributes :
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
		}
	};
}


var
	net_requestWrap,
	root,
	transmitter;


/*
| Capsule.
*/
(function( ) {
'use strict';


var
	onReply,
	onReplyTransmitter;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = net_requestWrap.prototype;


/*
| Aborts the request if it is active.
|
| Returns true if the request has been aborted.
*/
prototype.abort =
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
onReply =
	function( )
{
	var
		channel,
		reply,
		wrap;

	if( this.readyState !== 4 || this.aborted )
	{
		return;
	}

	wrap = this.wrap;

	this.onreadystatechange = undefined;

	channel = root.ajax.get( wrap.channelName );

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
prototype.send =
	function( )
{
	var
		xhr;

	if( this._xhr )
	{
		throw new Error( );
	}

	xhr = new XMLHttpRequest( );

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


} )( );
