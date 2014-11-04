/*
| An ajax channel.
|
| Multiple calls into one channel are stacked.
| Requests to multiple channel are send in parallel.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	net;

net = net || { };


/*
| Imports
*/
var
	root;

/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'net.channel',
		attributes :
			{
				path :
					{
						comment :
							'the channels path in data tree',
						type :
							'jion.path'
					},
				_fifo :
					{
						comment :
							'the fifo of requests',
						type :
							'net.requestWrapRay',
						defaultValue :
							null
					}
			},
		init :
			[ ]
	};
}


var
	channel;

channel = net.channel;


/*
| Initializer.
*/
channel.prototype._init =
	function( )
{
	var
		channelName;

	channelName =
	this.channelName =
		this.path.get( -1 );

/**/	// FUTURE allow arbitrary paths.
/**/	if( CHECK )
/**/	{
/**/		if(
/**/			this.path.get( 0 ) !== 'ajax'
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

	if( !this._fifo )
	{
		this._fifo = net.requestWrapRay.create( );
	}
};


/*
| Aborts all pending requests.
*/
channel.prototype.abortAll =
	function( )
{
	if( this._fifo.length === 0 )
	{
		// nothing pending
		return;
	}

	this._fifo.ray[ 0 ].abort( );

	// FUTURE root.Create
	root.ajax =
		root.ajax.create(
			'twig:set',
			this.channelName,
			this.create(
				'_fifo',
					net.requestWrapRay.create( )
			)
		);
};


/*
| Issues a request.
|
| FUTURE currently the receiver is hardcoded to be 'root.link'.
|    when the root became a JION allow receiverPaths
*/
channel.prototype.request =
	function(
		request,       // request
		receiverFunc   // the receivers func to call
	)
{
	var
		reqWrap;

	reqWrap =
		net.requestWrap.create(
			'channelName', this.channelName,
			'receiverFunc', receiverFunc,
			'request', request
		);

	if( this._fifo.length === 0 )
	{
		reqWrap = reqWrap.send( );
	}

	// FUTURE root.Create
	root.ajax =
		root.ajax.create(
			'twig:set',
			this.channelName,
			this.create( '_fifo', this._fifo.append( reqWrap ) )
		);
};


/*
| The top request on the channel has received a reply
*/
channel.prototype.onReply =
	function(
		wrap,
		reply
	)
{
	var
		channel,
		fifo;

	channel = this;

	fifo = channel._fifo;

	fifo = fifo.remove( 0 );

	if( fifo.length > 0 )
	{
		fifo = fifo.set( 0, fifo.get( 0 ).send( ) );
	}

	channel = channel.create( '_fifo', fifo );

	// FUTURE root.Create
	root.ajax =
		root.ajax.create(
			'twig:set',
			channel.channelName,
			channel
		);

	root.link[ wrap.receiverFunc ]( wrap.request, reply );
};


} )( );
