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
	Net;

Net = Net || { };


/*
| Imports
*/
var
	catcher,
	Jools,
	shell;

/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Channel',
		unit :
			'Net',
		attributes :
			{
				path :
					{
						comment :
							'the channels path in data tree',
						type :
							'String'
					},
				fifo :
					{
						comment :
							'the request buffer',
						type :
							'Object'
					}
			},
		init :
			[ ]
	};
}


var Channel = Net.Channel;


/*
| Initializer.
*/
Channel.prototype._init =
	function( )
{
	this.name = this.path.get( -1 );

/**/	// FUTURE allow arbitrary paths.
/**/	if( CHECK )
/**/	{
/**/		if(
/**/			this.path.get( 0 ) !== 'shell'
/**/			||
/**/			this.path.get( 1 ) !== 'ajax'
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
				.ajax[ name ]
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
	if( this.fifo )
	{
		// nothing pending
		return;
	}

	this.fifo.aborted = true;

	this.fifo.abort( );

	// FUTURE shell.create
	shell.ajax =
		shell.ajax.create(
			'twig:set',
			this.name,
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
|    when the shell became a JOOBJ allow receiverPaths
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
	if( this.request )
	{
		console.log( 'already a request active' );

		return false;
	}

	xhr = new XMLHttpRequest( );

	xhr.channelName = this.name;

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

	xhr.onreadystatechange =
		this._readyHandler;

	rs = JSON.stringify( request );

	Jools.log(
		'iface',
		'->',
		rs
	);

	// FUTURE shell.create
	shell.ajax =
		shell.ajax.create(
			'twig:set',
			this.name,
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

	channel = shell.ajax[ this.channelName ];

	if(
		this.readyState !== 4
		||
		this.aborted
	)
	{
		return;
	}

	// FUTURE shell.create
	shell.ajax =
		shell.ajax.create(
			'twig:set',
			channel.name,
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
		Jools.log(
			'iface',
			request.cmd,
			'status: ',
			this.status
		);

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

	Jools.log( 'iface', '<-', reply );

	if( receiverFunc )
	{
		shell.link[ receiverFunc ]( request, reply );
	}
};


} )( );
