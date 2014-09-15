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
		name :
			'TestPad',
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
	testPad =
		null,

	_noteDocPath =
		jion
		.path
		.empty
		.append( 'space' )
		.append( 'testnote' )
		.append( 'doc' );


/*
| Binds an event handler to the
| latest instance of testPad.
*/
var _bind =
	function(
		handler  // the handler of testPad
	)
{
	return (
		function( )
		{
			testPad[ handler ].apply(
				testPad,
				arguments
			);
		}
	);
};


/*
| Initializer.
*/
TestPad.prototype._init =
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

		elements.pad.innerHTML =
			TestPad.noDataScreen( );
	}
	else
	{
		elements.pad.innerHTML =
			this.makeScreen( doc );
	}

	testPad =
		this;
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
TestPad.prototype.onMouseDown =
	function(
		event
	)
{
	if( event.button !== 0 )
	{
		return;
	}

	event.preventDefault( );

	testPad.captureEvents( );

	testPad.create(
		'mouseDown',
			true
	);

	testPad.elements.input.focus( );

	var
		pad =
			testPad.elements.pad,
		measure =
			testPad.elements.measure,
		doc =
			testPad._doc,
		x =
			event.pageX - pad.offsetLeft,
		y =
			event.pageY - pad.offsetTop;

	if( !doc )
	{
		testPad.beep( );

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

	testPad.create(
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
TestPad.prototype.captureEvents =
	function( )
{
	var
		pad =
			testPad.elements.pad;

	if( pad.setCapture )
	{
		pad.setCapture( pad );
	}
	else
	{
		document.onmouseup =
			_bind( 'onMouseUp' );

		document.onmousemove =
			_bind( 'onMouseMove' );
	}
};


/*
| Stops capturing all mouse events.
*/
TestPad.prototype.releaseEvents =
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
TestPad.prototype.onMouseUp =
	function(
		event
	)
{
	if( event.button !==  0)
	{
		return;
	}

	event.preventDefault( );

	testPad.create(
		'mouseDown',
			false
	);

	testPad.releaseEvents( );
};



/*
| Mouse clicked on pad.
*/
TestPad.prototype.onMouseClick =
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
TestPad.prototype.onMouseMove =
	function(
		event
	)
{
	if( testPad.mouseDown )
	{
		testPad.onMouseDown( event );
	}
};


/*
| Key down event to ( hidden ) input.
*/
TestPad.prototype.onKeyDown =
	function(
		event
	)
{
	if( _isSpecialKey( event.keyCode ) )
	{
		event.preventDefault( );

		testPad.inputSpecialKey(
			event.keyCode,
			event.ctrlKey
		);
	}
	else
	{
		testPad.testInput( );
	}
};


/*
| Press event to (hidden) input.
*/
TestPad.prototype.onKeyPress =
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
TestPad.prototype.onKeyUp =
	function(
		// event
	)
{
	testPad.testInput( );
};


/*
| Hidden input got focus.
*/
TestPad.prototype.onFocus =
	function( )
{
	testPad.create(
		'haveFocus',
			true
	);
};


/*
| Hidden input lost focus.
*/
TestPad.prototype.onBlur =
	function( )
{
	testPad.create(
		'haveFocus',
			false
	);
};


/*
| Sends the current action.
*/
TestPad.prototype.send =
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

	testPad.create(
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
TestPad.prototype.onCancelButton =
	function( )
{
	testPad.create(
		'action',
			null
	);
};


/*
| Displays a beep message.
*/
TestPad.prototype.beep =
	function( )
{
	testPad.elements.beep.innerHTML =
		'BEEP!';

	if( testPad.beepTimer )
	{
		clearInterval( testPad.beepTimer );
	}

	testPad.create(
		'beepTimer',
			setInterval( _bind( 'clearBeep' ), 540 )
	);
};


/*
| Clears the beep message.
*/
TestPad.prototype.clearBeep =
	function( )
{
	testPad.elements.beep.innerHTML =
		'';

	clearInterval( testPad.beepTimer );

	testPad.create(
		'beepTimer',
			null
	);
};


/*
| Aquires non-special input from (hidden) input.
*/
TestPad.prototype.testInput =
	function( )
{
	var
		action =
			testPad.action,
		cursorLine =
			testPad.cursorLine,
		cursorAt =
			testPad.cursorAt,
		elements =
			testPad.elements,
		text =
			elements.input.value;

	elements.input.value =
		'';

	if( text === '' )
	{
		return;
	}

	if( !testPad._doc )
	{
		testPad.beep( );

		return;
	}

	if( action === null )
	{
		testPad.create(
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
		testPad.create(
			'action',
			action.create(
				'value',
					action.value + text
			)
		);

		return;
	}

	testPad.beep( );
};


/*
| Handles all kind of special keys.
*/
TestPad.prototype.inputSpecialKey =
	function(
		keyCode,
		ctrl
	)
{
	var
		action =
			testPad.action,
		cursorLine =
			testPad.cursorLine,
		cursorAt =
			testPad.cursorAt,
		doc =
			testPad._doc;

	switch( keyCode )
	{
		case  8 :
			// backspace

			if( !doc )
			{
				testPad.beep( );

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
					testPad.beep( );

					return;
				}

				testPad.create(
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
				testPad.create(
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
				testPad.beep( );

				return;
			}

			testPad.create(
				'action',
					testPad.action.create(
						'at',
							testPad.action.at - 1
					),
				'cursorAt',
					cursorAt - 1
			);

			return;

		case 13 :
			// return

			if( !doc )
			{
				testPad.beep( );

				return;
			}

			if( ctrl )
			{
				testPad.send( );

				return;
			}

			if( action )
			{
				testPad.beep( );

				return;
			}

			testPad.create(
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

			testPad.create(
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

			testPad.create(
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

			testPad.create(
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

			testPad.create(
				'cursorAt',
					cursorAt - 1
			);

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

			testPad.create(
				'cursorLine',
					cursorLine - 1
			);

			return;

		case 39 :
			// right

			if( !doc )
			{
				this.beep( );

				return;
			}

			testPad.create(
				'cursorAt',
					cursorAt + 1
			);

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

			testPad.create(
				'cursorLine',
					cursorLine + 1
			);

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
				testPad.create(
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

			testPad.create(
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
TestPad.prototype.onUpNowButton =
	function( )
{
	testPad.create(
		'seq',
			jools.MAX_INTEGER
	);

	this.elements.input.focus( );
};


/*
| Button one-up-the-sequence has been clicked.
*/
TestPad.prototype.onUpButton =
	function( )
{
	testPad.create(
		'seq',
			this.seq + 1
	);

	this.elements.input.focus( );
};


/*
| Button one-down-the-sequence has been clicked.
*/
TestPad.prototype.onDownButton =
	function( )
{
	testPad.create(
		'seq',
			testPad.seq - 1
	);

	this.elements.input.focus( );
};


/*
| Cretes a screen for current data.
*/
TestPad.prototype.makeScreen =
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
TestPad.noDataScreen =
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

	return (
		lines.join( '\n' )
	);
};


/*
| Window.
*/
window.onload =
	function( )
{
	TestPad.create( );
	testPad.elements.input.focus( );
};


} )( );
