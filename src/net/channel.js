/*
| An ajax channel.
|
| Multiple calls into one channel are stacked.
| Requests to multiple channel are send in parallel.
*/


var
	net_channel,
	net_requestWrap,
	net_requestWrapRay,
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
			'net_channel',
		attributes :
			{
				path :
					{
						comment :
							'the channels path in data tree',
						type :
							'jion_path'
					},
				_fifo :
					{
						comment :
							'the fifo of requests',
						type :
							'net_requestWrapRay',
						defaultValue :
							'null'
					}
			},
		init :
			[ ]
	};
}


/*
| Initializer.
*/
net_channel.prototype._init =
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
		this._fifo = net_requestWrapRay.create( );
	}
};


/*
| Aborts all pending requests.
*/
net_channel.prototype.abortAll =
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
				'_fifo', net_requestWrapRay.create( )
			)
		);
};


/*
| Issues a request.
|
| FUTURE currently the receiver is hardcoded to be 'root.link'.
|    when the root became a JION allow receiverPaths
*/
net_channel.prototype.request =
	function(
		request,       // request
		receiverFunc   // the receivers func to call
	)
{
	var
		reqWrap;

	reqWrap =
		net_requestWrap.create(
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
net_channel.prototype.onReply =
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
