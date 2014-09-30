/*
| A testing pad for the CC/OT engine.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	IFaceSym,
	jion,
	jools,
	peer,
	testpad;

/*
| Export
*/
var
	TestPad;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'testpad.root',
		attributes :
			{
				action :
					{
						comment :
							'the action the user is preparing',
						type :
							'testpad.action',
						defaultValue :
							'null'
					},
				beepTimer :
					{
						comment :
							'removed the beep',
						type :
							'Object',
						defaultValue :
							'null'
					},
				cursorAt :
					{
						comment :
							'offset cursor is at',
						type :
							'Integer',
						defaultValue :
							'0'
					},
				cursorLine :
					{
						comment :
							'line cursor is in',
						type :
							'Integer',
						defaultValue :
							'0'
					},
				elements :
					{
						comment :
							'DOM elements',
						type :
							'Object',
						defaultValue :
							'undefined'
					},
				haveFocus :
					{
						comment :
							'true when having focus',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				iface :
					{
						comment :
							'the interface',
						type :
							'Object',
						defaultValue :
							'undefined'
					},
				mouseDown :
					{
						comment :
							'true when mouse button is held down',
						type :
							'Boolean',
						defaultValue :
							'false'
					},
				seq :
					{
						comment :
							'current sequence pos',
						type :
							'Integer',
						defaultValue :
							'0'
					}
			},
		init :
			[ ]
	};
}

var
	proto,
	root,
	_noteDocPath;

proto = testpad.root.prototype;

root = null;

_noteDocPath =
	jion.path.empty
	.append( 'space' )
	.append( 'testnote' )
	.append( 'doc' );


/*
| Binds an event handler to the
| latest instance of testpads root.
*/
var _bind =
	function(
		handler  // the handler of testpad
	)
{
	return(
		function( )
		{
			root[ handler ].apply( root, arguments );
		}
	);
};


/*
| Initializer.
*/
proto._init =
	function( )
{
	var
		elements =
			this.elements;

	if( !elements )
	{
		elements =
		this.elements =
			{
				measure :
					null,
				pad :
					null,
				input :
					null,
				beep :
					null,
				send :
					null,
				cancel :
					null,
				upnow :
					null,
				up :
					null,
				now :
					null,
				down :
					null
			};

		for( var id in elements )
		{
			elements[ id ] =
				document.getElementById( id );
		}

		var
			pad =
				elements.pad,
			input =
				elements.input,
			send =
				elements.send,
			cancel =
				elements.cancel,
			down =
				elements.down,
			up =
				elements.up,
			upnow =
				elements.upnow;

		pad.onmousedown =
			_bind( 'onMouseDown' );

		pad.onmousemove =
			_bind( 'onMouseMove' );

		pad.onmouseup =
			_bind( 'onMouseUp' );

		pad.onclick =
			_bind( 'onMouseClick' );

		input.onkeypress =
			_bind( 'onKeyPress' );

		input.onkeydown =
			_bind( 'onKeyDown' );

		input.onkeyup =
			_bind( 'onKeyUp' );

		input.onfocus =
			_bind( 'onFocus' );

		input.onblur =
			_bind( 'onBlur' );

		send.onclick =
			_bind( 'send' );

		cancel.onclick =
			_bind( 'onCancelButton' );

		down.onclick =
			_bind( 'onDownButton' );

		up.onclick =
			_bind( 'onUpButton' );

		upnow.onclick =
			_bind( 'onUpNowButton' );
	}

	elements.send.disabled =
	elements.cancel.disabled =
		!this.action;

	if( !this.iface )
	{
		this.iface =
			new IFaceSym( );
	}
	else
	{
		this.seq =
			this.iface.goToSeq( this.seq );
	}

	var
		doc =
		this._doc =
			this.iface.get( _noteDocPath );

	elements.now.innerHTML =
		'' + this.seq;

	this.cursorLine =
		jools.limit(
			0,
			this.cursorLine,
			doc.ranks.length - 1
		);

	this.cursorAt =
		jools.limit(
			0,
			this.cursorAt,
			doc.twig[ doc.ranks[ this.cursorLine ] ].text.length
		);

	if( !doc )
	{

		elements.pad.innerHTML = root.noDataScreen( );
	}
	else
	{
		elements.pad.innerHTML = this.makeScreen( doc );
	}

	root = this;
};


/*
| Returns true if a keyCode is known to be a "special key".
*/
var _isSpecialKey =
	function( keyCode )
{
	switch( keyCode )
	{
		case  8 : // backspace
		case 13 : // return
		case 27 : // esc
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
		case 46 : // del
			return true;

		default :
			return false;
	}
};


/*
| Mouse down event on pad -> focuses the hidden input,
*/
proto.onMouseDown =
	function(
		event
	)
{
	if( event.button !== 0 )
	{
		return;
	}

	event.preventDefault( );

	root.captureEvents( );

	root.create( 'mouseDown', true );

	root.elements.input.focus( );

	var
		pad =
			root.elements.pad,
		measure =
			root.elements.measure,
		doc =
			root._doc,
		x =
			event.pageX - pad.offsetLeft,
		y =
			event.pageY - pad.offsetTop;

	if( !doc )
	{
		root.beep( );

		return;
	}

	var
		cLine =
			jools.limit(
				0,
				Math.floor( y / measure.offsetHeight ),
				doc.ranks.length - 1
			),
		cText =
			doc.twig[ doc.ranks[ cLine ] ].text;

	root.create(
		'cursorLine',
			cLine,
		'cursorAt',
			jools.limit(
				0,
				Math.floor( x / measure.offsetWidth ),
				cText.length
			)
	);
};


/*
| Captures all mouse events.
*/
proto.captureEvents =
	function( )
{
	var
		pad =

	pad = root.elements.pad;

	if( pad.setCapture )
	{
		pad.setCapture( pad );
	}
	else
	{
		document.onmouseup = _bind( 'onMouseUp' );

		document.onmousemove = _bind( 'onMouseMove' );
	}
};


/*
| Stops capturing all mouse events.
*/
proto.releaseEvents =
	function( )
{
	var
		pad =
			this.elements.pad;

	if( pad.setCapture )
	{
		pad.releaseCapture( pad );
	}
	else
	{
		document.onmouseup =
		document.onmousemove =
			null;
	}
};


/*
| Mouse button released.
*/
proto.onMouseUp =
	function(
		event
	)
{
	if( event.button !==  0)
	{
		return;
	}

	event.preventDefault( );

	root.create( 'mouseDown', false );

	root.releaseEvents( );
};



/*
| Mouse clicked on pad.
*/
proto.onMouseClick =
	function(
		event
	)
{
	event.preventDefault( );
};


/*
| Mouse moved over pad
| (or while dragging around it).
*/
proto.onMouseMove =
	function(
		event
	)
{
	if( root.mouseDown )
	{
		root.onMouseDown( event );
	}
};


/*
| Key down event to ( hidden ) input.
*/
proto.onKeyDown =
	function(
		event
	)
{
	if( _isSpecialKey( event.keyCode ) )
	{
		event.preventDefault( );

		root.inputSpecialKey( event.keyCode, event.ctrlKey );
	}
	else
	{
		root.testInput( );
	}
};


/*
| Press event to (hidden) input.
*/
proto.onKeyPress =
	function(
		// event
	)
{
	setTimeout(
		_bind( 'testInput' ),
		0
	);
};


/*
| Up event to (hidden) input.
*/
proto.onKeyUp =
	function(
		// event
	)
{
	root.testInput( );
};


/*
| Hidden input got focus.
*/
proto.onFocus =
	function( )
{
	root.create( 'haveFocus', true );
};


/*
| Hidden input lost focus.
*/
proto.onBlur =
	function( )
{
	root.create( 'haveFocus', false );
};


/*
| Sends the current action.
*/
proto.send =
	function( )
{
	var
		action =
			this.action,
		cursorAt,
		doc =
			this._doc,
		path;

	/*
	var copse    = this.$copse;
	var cursor   = this.$cursor;
	var ranks    = this.$ranks;
	var notepath = this.notepath;
	*/

	if( !action )
	{
		this.beep( );

		return;
	}

	switch( action.command )
	{
		case 'insert' :

			path =
				_noteDocPath
				.append( doc.ranks[ action.line ] )
				.append( 'text' );

			peer.insertText(
				path,
				action.at,
				action.value
			);

			cursorAt =
				this.cursorAt + action.value.length;

			break;

		case 'remove' :

			path =
				_noteDocPath
				.append( doc.ranks[ action.line ] )
				.append( 'text' );

			peer.removeText(
				path,
				action.at,
				action.at2 - action.at
			);

			if( this.cursorLine == action.line
				&&
				this.cursorAt >= action.at2
			)
			{
				cursorAt =
					this.cursorAt - ( action.at2 - action.at );
			}

			break;

		case 'split' :

			path =
				_noteDocPath
				.append( doc.ranks[ action.line ] )
				.append( 'text' );

			peer.split(
				path,
				action.at
			);

			break;

		case 'join' :

			path =
				_noteDocPath
				.append( doc.ranks[ action.line - 1] )
				.append( 'text' );

			peer.join(
				path,
				doc.twig[ doc.ranks[ action.line - 1 ] ].text.length
			);

			break;

		default :

			throw new Error(
				'invalid action.command'
			);
	}

	root.create(
		'action',
			null,
		'cursorAt',
			cursorAt,
		'seq',
			jools.MAX_INTEGER
	);
};


/*
| Cancels the current action.
*/
proto.onCancelButton =
	function( )
{
	root.create( 'action', null );
};


/*
| Displays a beep message.
*/
proto.beep =
	function( )
{
	root.elements.beep.innerHTML = 'BEEP!';

	if( root.beepTimer )
	{
		clearInterval( root.beepTimer );
	}

	root.create(
		'beepTimer',
			setInterval( _bind( 'clearBeep' ), 540 )
	);
};


/*
| Clears the beep message.
*/
proto.clearBeep =
	function( )
{
	root.elements.beep.innerHTML = '';

	clearInterval( root.beepTimer );

	root.create( 'beepTimer', null );
};


/*
| Aquires non-special input from (hidden) input.
*/
proto.testInput =
	function( )
{
	var
		action =
			root.action,
		cursorLine =
			root.cursorLine,
		cursorAt =
			root.cursorAt,
		elements =
			root.elements,
		text =
			elements.input.value;

	elements.input.value = '';

	if( text === '' )
	{
		return;
	}

	if( !root._doc )
	{
		root.beep( );

		return;
	}

	if( action === null )
	{
		root.create(
			'action',
			testpad.action.create(
				'command',
					'insert',
				'line',
					cursorLine,
				'at',
					cursorAt,
				'value',
					text
			)
		);

		return;
	}

	if(
		action.command === 'insert'
		&&
		cursorLine === action.line
		&&
		cursorAt === action.at
	)
	{
		root.create(
			'action',
			action.create(
				'value',
					action.value + text
			)
		);

		return;
	}

	root.beep( );
};


/*
| Handles all kind of special keys.
*/
proto.inputSpecialKey =
	function(
		keyCode,
		ctrl
	)
{
	var
		action =
			root.action,
		cursorLine =
			root.cursorLine,
		cursorAt =
			root.cursorAt,
		doc =
			root._doc;

	switch( keyCode )
	{
		case  8 :
			// backspace

			if( !doc )
			{
				root.beep( );

				return;
			}

			if( cursorAt <= 0 )
			{
				if(
					action
					||
					cursorLine <= 0
				)
				{
					root.beep( );

					return;
				}

				root.create(
					'action',
						testpad.action.create(
							'command',
								'join',
							'line',
								cursorLine
						)
				);

				return;
			}

			if( !action )
			{
				root.create(
					'action',
						testpad.action.create(
							'command',
								'remove',
							'line',
								cursorLine,
						'at',
							cursorAt - 1,
						'at2',
							cursorAt
					),
					'cursorAt',
						cursorAt - 1
				);

				return;
			}

			if(
				action.command !== 'remove'
				||
				cursorAt !== action.at
			)
			{
				root.beep( );

				return;
			}

			root.create(
				'action',
					root.action.create( 'at', root.action.at - 1 ),
				'cursorAt',
					cursorAt - 1
			);

			return;

		case 13 :
			// return

			if( !doc )
			{
				root.beep( );

				return;
			}

			if( ctrl )
			{
				root.send( );

				return;
			}

			if( action )
			{
				root.beep( );

				return;
			}

			root.create(
				'action',
					testpad.action.create(
						'command',
							'split',
						'line',
							cursorLine,
						'at',
							cursorAt
					)
			);

			return;

		case 27 :
			// esc

			root.create(
				'action',
					null
			);

			return;

		case 35 :
			// end

			if( !doc )
			{
				this.beep( );

				return;
			}

			root.create(
				'cursorAt',
					doc.twig[ doc.ranks[ cursorLine ] ].text.length
			);

			return;

		case 36 :
			// pos1

			if( !doc )
			{
				this.beep( );

				return;
			}

			root.create(
				'cursorAt',
					0
			);

			return;

		case 37 :
			// left

			if( !doc )
			{
				this.beep( );

				return;
			}

			if( cursorAt <= 0 )
			{
				this.beep( );

				return;
			}

			root.create( 'cursorAt', cursorAt - 1 );

			return;

		case 38 :
			// up

			if(
				!doc
				||
				cursorLine <= 0
			)
			{
				this.beep( );

				return;
			}

			root.create( 'cursorLine', cursorLine - 1 );

			return;

		case 39 :
			// right

			if( !doc )
			{
				this.beep( );

				return;
			}

			root.create( 'cursorAt', cursorAt + 1 );

			return;

		case 40 :
			// down

			if(
				!doc
				||
				cursorLine >= doc.ranks.length - 1
			)
			{
				this.beep( );

				return;
			}

			root.create( 'cursorLine', cursorLine + 1 );

			return;

		case 46 :
			// del

			if( !doc )
			{
				this.beep( );

				return;
			}

			var
				text =
					doc.twig[ doc.ranks[ cursorLine ] ].text;

			if( cursorAt >= text.length )
			{
				this.beep( );

				return;
			}

			if( !action )
			{
				root.create(
					'action',
						testpad.action.create(
							'command',
								'remove',
							'line',
								cursorLine,
							'at',
								cursorAt,
							'at2',
								cursorAt + 1
						),
					'cursorAt',
						cursorAt + 1
				);

				return;
			}

			if(
				action.command !== 'remove'
				||
				cursorAt !== action.at2
			)
			{
				this.beep( );

				return;
			}

			root.create(
				'action',
					action.create(
						'at2',
							action.at2 + 1
					),
				'cursorAt',
					cursorAt + 1
			);

			return;
	}
};


/*
| Button update-to-now has been clicked.
*/
proto.onUpNowButton =
	function( )
{
	root.create( 'seq', jools.MAX_INTEGER );

	this.elements.input.focus( );
};


/*
| Button one-up-the-sequence has been clicked.
*/
root.prototype.onUpButton =
	function( )
{
	root.create( 'seq', this.seq + 1 );

	this.elements.input.focus( );
};


/*
| Button one-down-the-sequence has been clicked.
*/
root.prototype.onDownButton =
	function( )
{
	root.create( 'seq', root.seq - 1 );

	this.elements.input.focus( );
};


/*
| Cretes a screen for current data.
*/
root.prototype.makeScreen =
	function(
		doc
	)
{
	var
		a,
		action =
			this.action,
		aZ,
		b,
		bZ,
		line,
		lines =
			[ ],
		ranks =
			doc.ranks,
		twig =
			doc.twig;

	// splits up the doc into
	// an array of lines which are
	// an array of chars
	for(
		a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		lines.push(
			twig[ ranks[ a ] ].text.split( '' )
		);
	}

	// replaces HTML entities
	for(
		a = 0, aZ = lines.length;
		a < aZ;
		a++
	)
	{
		line =
			lines[ a ];

		for(
			b = 0, bZ = line.length;
			b < bZ;
			b++
		)
		{
			switch( line[ b ] )
			{
				case '&' :

					line[ b ] =
						'&amp;';

					break;

				case '"' :

					line[ b ] =
						'&quot;';

					break;

				case '<' :

					line[ b ] =
						'&lt;';

					break;

				case '>' :

					line[ b ] =
						'&gt;';

					break;
			}
		}
	}

	// inserts the cursor
	if( this.haveFocus )
	{
		var
			cLine =
				this.cursorLine,
			cText =
				lines[ cLine ],
			cAt =
				this.cursorAt,
			cLen =
				lines[ cLine ].length;

		if( cAt >= cText.length )
		{
			cAt =
				cText.length;

			lines[ cLine ][ cAt ] = ' ';
		}

		lines[ cLine ][ cAt ] =
			'<span id="cursor">'
				+ lines[ cLine ][ cAt ] +
			'</span>';

		if( cAt === cLen )
		{
			lines[ cLine ].push( ' ' );
		}
	}

	// inserts the action
	switch( action && action.command )
	{
		case null :

			break;

		case 'join' :

			lines[ action.line ].
				unshift( '<span id="join">↰</span>' );

			break;

		case 'split' :

			lines[ action.line ].
				splice(
					action.at,
					0,
					'<span id="split">⤶</span>'
				);

			break;

		case 'insert' :

			lines[ action.line ].
				splice(
					action.at,
					0,
					'<span id="insert">',
					action.value,
					'</span>'
				);

			break;

		case 'remove' :

			if( action.at > action.at2 )
			{
				throw new Error(
					'Invalid remove action'
				);
			}

			lines[ action.line ].splice(
				action.at,
				0,
				'<span id="remove">'
			);

			lines[ action.line ].splice(
				action.at2 + 1,
				0,
				'</span>'
			);

			break;

		default :

			throw new Error(
				'Unknown action.command: ' + action.command
			);
	}

	// transforms lines to a HTML string

	for(
		a = 0, aZ = lines.length;
		a < aZ;
		a++
	)
	{
		lines[ a ] =
			lines[ a ].join( '' );
	}

	return lines.join( '\n' );
};


/*
| Generates the noDataScreen.
| FIXME lazyFixate
*/
root.noDataScreen =
	function( )
{
	// no data
	var
		a,
		line =
			[ ],
		lines =
			[ ];

	for(
		a = 0;
		a < 100;
		a++
	)
	{
		line.push( '{}  ' );
	}

	line =
		line.join( '' );

	var
		line2 =
			'  ' + line;

	for(
		a = 0;
		a < 50;
		a++
	)
	{
		lines.push(
			line,
			line2
		);
	}

	return lines.join( '\n' );
};


/*
| Window.
*/
window.onload =
	function( )
{
	testpad.root.create( );

	root.elements.input.focus( );
};


} )( );
