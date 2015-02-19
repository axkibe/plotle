/*
| A wrapper for ajax request.
*/


var
	catcher,
	net_requestWrap,
	root;


/*
| Capsule.
*/
(function( ) {
'use strict';

var
	_onReply,
	_onReplyCatcher;


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'net_requestWrap',
		attributes :
			{
				channelName :
					{
						comment :
							'name of the channel the request belongs to',
						type :
							'string'
					},
				request :
					{
						comment :
							'the actual request',
						type :
							'->request'
					},
				receiverFuncName :
					{
						comment :
							'name of the receiver function to call',
						type :
							'string'
					},
				_xhr :
					{
						comment :
							'the underlaying "XMLHttpRequest"',
						type :
							'protean',
						defaultValue :
							'null'
					}
			}
	};
}


/*
| Aborts the request if it is active.
|
| Returns true if the request has been aborted.
*/
net_requestWrap.prototype.abort =
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
| 'this' is the ajax request.
*/
_onReply =
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

	this.onreadystatechange = null;

	channel = root.ajax.get( wrap.channelName );

	if( this.status !== 200 )
	{
		channel.onReply(
			wrap,
			{
				ok : false,
				message : 'Lost server connection'
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
				ok : false,
				message : 'Server answered no JSON!'
			}
		);

		return;
	}

	channel.onReply( wrap, reply );
};


_onReplyCatcher = null;


/*
| Sends the wrapped request.
*/
net_requestWrap.prototype.send =
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

	if( !_onReplyCatcher )
	{
		_onReplyCatcher = catcher( _onReply );
	}

	xhr.onreadystatechange = _onReplyCatcher;

	xhr.send( JSON.stringify( this.request ) );

	return this.create( '_xhr', xhr );
};


} )( );
