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
	shell;

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
		name :
			'Channel',
		unit :
			'net',
		attributes :
			{
				path :
					{
						comment :
							'the channels path in data tree',
						type :
							'path'
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


var Channel = net.Channel;


/*
| Initializer.
*/
Channel.prototype._init =
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
				shell
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
Channel.prototype.abortAll =
	function( )
{
	if( !this.fifo )
	{
		// nothing pending
		return;
	}

	this.fifo.aborted = true;

	this.fifo.abort( );

	// FUTURE shell.Create
	shell.ajax =
		shell.ajax.create(
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
| FUTURE currently the receiver is hardcoded to be 'shell.link'.
|    when the shell became a JION allow receiverPaths
*/
Channel.prototype.request =
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

	// FUTURE shell.Create
	shell.ajax =
		shell.ajax.create(
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
Channel.prototype._onReply =
	function( )
{
	var
		channel,
		request,
		reply,
		receiverFunc;

	channel = shell.ajax.twig[ this.channelName ];

	if(
		this.readyState !== 4
		||
		this.aborted
	)
	{
		return;
	}

	// FUTURE shell.Create
	shell.ajax =
		shell.ajax.create(
			'twig:set',
			channel.channelName,
			channel.create(
				'fifo',
					null
			)
		);

	this.onreadystatechange = null;

	receiverFunc = this.receiverFunc;

	request = this.request;

	if( this.status !== 200 )
	{
		throw new Error(
			'Lost server connection'
		);
	}

	try
	{
		reply = JSON.parse( this.responseText );
	}
	catch( e )
	{
		throw new Error(
			'Server answered no JSON!'
		);
	}

	if( receiverFunc )
	{
		shell.link[ receiverFunc ]( request, reply );
	}
};


} )( );
