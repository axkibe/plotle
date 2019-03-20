/*
| An ajax channel.
|
| Multiple calls into one channel are stacked.
|
| Requests to multiple channels are send parallel.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the channels path in data tree
		path : { type : 'tim.js/path' },

		// the fifo of requests
		_fifo :
		{
			type : './requestWrapList',
			defaultValue : 'require( "./requestWrapList" ).create( )'
		}
	};
}


const net_requestWrap = tim.require( './requestWrap' );

const net_requestWrapList = tim.require( './requestWrapList' );


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		if(	this.path.get( 0 ) !== 'ajax' ) throw new Error( );
/**/	};
/**/}


/*
| The channel name.
*/
def.lazy.channelName =
	function( )
{
	return this.path.get( -1 );
};


/*
| Aborts all pending requests.
|
| If receiverFuncName is not undefined only aborts requests
| with this receiverFuncName
*/
def.proto.abortAll =
	function(
		receiverFuncName // if not undefined aborts these
	)
{
	let fifo = this._fifo;

	// nothing pending?
	if( fifo.length === 0 ) return;

	if( receiverFuncName === undefined )
	{
		for( let f = 0, fZ = fifo.length; f < fZ; f++ )
		{
			fifo.get( f ).abort( );
		}

		fifo = net_requestWrapList.create( );
	}
	else
	{
		for( let f = 0, fZ = fifo.length; f < fZ; f++ )
		{
			const r = fifo.get( f ) ;

			if( r.receiverFuncName === receiverFuncName )
			{
				r.abort( );

				fifo = fifo.remove( f );

				f--; fZ--;
			}
		}
	}

	root.alter(
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
*/
def.proto.request =
	function(
		request,         // request
		receiverFuncName // the receivers func name to call
	)
{
	let reqWrap =
		net_requestWrap.create(
			'channelName', this.channelName,
			'receiverFuncName', receiverFuncName,
			'request', request
		);

	if( this._fifo.length === 0 ) reqWrap = reqWrap.send( );

	root.alter(
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
def.proto.onReply =
	function(
		wrap,
		reply
	)
{
	let channel = this;

	let fifo = channel._fifo;

	fifo = fifo.remove( 0 );

	if( fifo.length > 0 )
	{
		fifo = fifo.set( 0, fifo.get( 0 ).send( ) );
	}

	channel = channel.create( '_fifo', fifo );

	root.alter(
		'ajax',
			root.ajax.create(
				'twig:set',
				channel.channelName,
				channel
			)
	);

	root.link[ wrap.receiverFuncName ]( wrap.request, reply );
};


} );
