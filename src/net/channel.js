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
	catcher,
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
				fifo :
					{
						comment :
							'the request buffer',
						type :
							'Object',
						defaultValue :
							null
					}
			},
		init :
			[ ]
	};
}


var channel = net.channel;


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

	this._readyHandler =
		catcher(
			function( )
			{
				root
				.ajax
				.twig[ channelName ]
				._onReply
				.apply( this, arguments );
			}
		);
};


/*
| Aborts all pending requests.
*/
channel.prototype.abortAll =
	function( )
{
	if( !this.fifo )
	{
		// nothing pending
		return;
	}

	this.fifo.aborted = true;

	this.fifo.abort( );

	// FUTURE root.Create
	root.ajax =
		root.ajax.create(
			'twig:set',
			this.channelName,
			this.create(
				'fifo',
					null
			)
		);
};


/*
| Issues a general purpose AJAX request.
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
		cmd,
		rs,
		xhr;

	cmd = request.cmd;

/**/if( CHECK )
/**/{
/**/	if( !cmd )
/**/	{
/**/		throw new Error( 'ajax request.cmd missing' );
/**/	}
/**/}

	// FUTURE make a real fifo
	if( this.fifo )
	{
		console.log( 'already a request active' );

		return false;
	}

	xhr = new XMLHttpRequest( );

	xhr.channelName = this.channelName;

	xhr.request = request;

	xhr.receiverFunc = receiverFunc;

	xhr.open(
		'POST',
		'/mm',
		true
	);

	xhr.setRequestHeader(
		'Content-type',
		'application/x-www-form-urlencoded'
	);

	xhr.onreadystatechange = this._readyHandler;

	rs = JSON.stringify( request );

	// FUTURE root.Create
	root.ajax =
		root.ajax.create(
			'twig:set',
			this.channelName,
			this.create(
				'fifo',
					xhr
			)
		);

	xhr.send( rs );
};


/*
| A request has been replied.
|
| 'this' is the ajax request.
*/
channel.prototype._onReply =
	function( )
{
	var
		channel,
		request,
		reply,
		receiverFunc;

	channel = root.ajax.twig[ this.channelName ];

	if(
		this.readyState !== 4
		||
		this.aborted
	)
	{
		return;
	}

	// FUTURE root.Create
	root.ajax =
		root.ajax.create(
			'twig:set',
			channel.channelName,
			channel.create(
				'fifo',
					null
			)
		);

	this.onreadystatechange = null;

	receiverFunc = this.receiverFunc;

/**/if( CHECK )
/**/{
/**/	if( !receiverFunc )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	request = this.request;

	if( this.status !== 200 )
	{
		root.link[ receiverFunc ](
			request,
			{
				ok :
					false,
				message :
					'Lost server connection'
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
		root.link[ receiverFunc ](
			request,
			{
				ok :
					false,
				message :
					'Server answered no JSON!'
			}
		);

		return;
	}

	root.link[ receiverFunc ]( request, reply );
};


} )( );
