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
	return{
		id : 'net_channel',
		attributes :
		{
			path :
			{
				comment : 'the channels path in data tree',
				type : 'jion_path'
			},
			_fifo :
			{
				comment : 'the fifo of requests',
				type : 'net_requestWrapRay',
				defaultValue : 'net_requestWrapRay.create( )'
			}
		},
		init : [ ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
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

/**/if( CHECK )
/**/{
/**/	if(	this.path.get( 0 ) !== 'ajax' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

};


/*
| Aborts all pending requests.
|
| If receiverFuncName is not undefined only aborts requests
| with this receiverFuncName
*/
net_channel.prototype.abortAll =
	function(
		receiverFuncName // if not undefined aborts these
	)
{
	var
		f,
		fZ,
		fifo,
		r;

	fifo = this._fifo;

	if( fifo.length === 0 )
	{
		// nothing pending
		return;
	}

	if( receiverFuncName === undefined )
	{
		for(
			f = 0, fZ = fifo.length;
			f < fZ;
			f++
		)
		{
			fifo.get( f ).abort( );
		}

		fifo = net_requestWrapRay.create( );
	}
	else
	{
		for(
			f = 0, fZ = fifo.length;
			f < fZ;
			f++
		)
		{
			r = fifo.get( f ) ;

			if( r.receiverFuncName === receiverFuncName )
			{
				r.abort( );

				fifo = fifo.remove( f );

				fZ--;

				f--;
			}
		}
	}

	root.create(
		'ajax',
			root.ajax.create(
				'twig:set',
				this.channelName,
				this.create( '_fifo', fifo )
			)
	);
};


/*
| Issues a request.
|
| FIXME currently the receiver is hardcoded to be 'root.link'.
|    when the root became a JION allow receiverPaths
*/
net_channel.prototype.request =
	function(
		request,         // request
		receiverFuncName // the receivers func name to call
	)
{
	var
		reqWrap;

	reqWrap =
		net_requestWrap.create(
			'channelName', this.channelName,
			'receiverFuncName', receiverFuncName,
			'request', request
		);

	if( this._fifo.length === 0 )
	{
		reqWrap = reqWrap.send( );
	}

	root.create(
		'ajax',
			root.ajax.create(
				'twig:set',
				this.channelName,
				this.create( '_fifo', this._fifo.append( reqWrap ) )
			)
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

	root.create(
		'ajax',
			root.ajax.create(
				'twig:set',
				channel.channelName,
				channel
			)
	);

	root.link[ wrap.receiverFuncName ]( wrap.request, reply );
};


} )( );
