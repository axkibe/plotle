/*
| A testing pad for meshcraft.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	IFaceSym,
	Path,
	Peer;

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
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'TestPad',
		attributes :
			{
				action :
					{
						comment :
							'the action the user is prepariing',
						type :
							'Action',
						defaultVal :
							'null'
					},
				elements :
					{
						comment :
							'DOM elements',
						type :
							'Object',
						defaultVal :
							'undefined'
					},
				cursorAt :
					{
						comment :
							'offset cursor is at',
						type :
							'Integer',
						defaultVal :
							'0'
					},
				cursorLine :
					{
						comment :
							'line cursor is in',
						type :
							'Integer',
						defaultVal :
							'0'
					},
				haveFocus :
					{
						comment :
							'true when having focus',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				iface :
					{
						comment :
							'the interface',
						type :
							'Object',
						defaultVal:
							'undefined'
					},
				mouseDown :
					{
						comment :
							'true when mouse button is held down',
						type :
							'Boolean',
						defaultVal :
							'true'
					},
				peer :
					{
						comment :
							'the peer',
						type :
							'Object',
						defaultVal:
							'undefined'
					},
				seq :
					{
						comment :
							'current sequence pos',
						type :
							'Integer',
						defaultVal :
							'-1'
					}
			},
		init :
			[ ]
	};
}

var
	testPad =
		null,

	_notePath =
		Path.empty.append( 'testnote' );

/*
| Binds an event handler to the
| latest instance of testPad.
*/
var
	_bind =
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

		send.disabled =
			true;

		send.onclick =
			_bind( 'onSendButton' );

		cancel.disabled =
			true;

		cancel.onclick =
			_bind( 'onCancelButton' );

		down.onclick =
			_bind( 'onDownButton' );

		up.onclick =
			_bind( 'onUpButton' );

		upnow.onclick =
			_bind( 'onUpNowButton' );
	}

	if( !this.iface )
	{
		this.iface =
			new IFaceSym( );
	}
	else
	{
		this.iface.goToSeq( this.seq );
	}

	if( !this.peer )
	{
		this.peer =
			new Peer( this.iface );
	}

	var
		note =
			this.peer.get( _notePath );

	elements.now.innerHTML =
		'' + this.seq;

	//if( !ranks )
	if( true || !note )
	{

		elements.pad.innerHTML =
			TestPad.noDataScreen( );
	}
	else
	{
		elements.pad.innerHtml =
			this.makeScreen( note );
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
| Blinks the cursor on/off.
*/
/*
TestPad.prototype.blink =
	function( self )
{
	$cursor.blink = !self.$cursor.blink;
	testinput( );
	elements.beep.innerHTML = '';
};
*/


/*
| Resets the blink timer
*/
/*
TestPad.prototype.resetBlink =
	function( )
{
	testPad.$cursor.blink =
		false;

	elements.beep.innerHTML =
		'';

	if( testPad.$blinkTimer )
	{
		clearInterval( testPad.$blinkTimer );
		testPad.$blinkTimer = null;
	}

	if( testPad.$haveFocus )
	{
		testPad.$blinkTimer = setInterval( testPad.blink, 540, testPad );
	}
};
*/


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

	/*

	testPad.captureEvents( );

	testPad.create(
		'mouseDown',
			true
	);

	this.elements.input.focus( );

	var
		pad =
			this.elements.pad,
		measure =
			this.elements.measure,
		cursor =
			testPad.$cursor,
		copse =
			testPad.$copse,
		ranks =
			testPad.$ranks,
		x =
			event.pageX - pad.offsetLeft,
		y =
			event.pageY - pad.offsetTop;

	if( !ranks )
	{
		testPad.beep( );

		return;
	}

	testPad.create(
		'cursorLine',
			Jools.limit(
				0,
				Math.floor( y / measure.offsetHeight ),
				ranks.length - 1
			)
	);

	var
		text =
			copse[ ranks[ cursor.line ] ].text;

	testPad.create(
		'cursorAt',
			Jools.limit(
				0,
				Math.floor( x / measure.offsetWidth ),
				text.length
			)
	);

	testPad.resetBlink( );
	*/
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
	function( event )
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
		testPad.testinput( );
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
	/*
	setTimeout(
		testinput,
		0,
		this
	);
	*/
};


/*
| Up event to (hidden) input.
*/
TestPad.prototype.onKeyUp =
	function(
		// event
	)
{
	testPad.testinput( );
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
| Clears the current action
*/
/*
TestPad.prototype.clearAction =
	function( )
{
	elements.cancel.disabled = true;
	elements.send.disabled   = true;

	this.$action = null;
};
*/


/*
| Sends the current action to server.
*/
TestPad.prototype.onSendButton =
	function( )
{
	/*
	var path;
	var action   = this.$action;
	var copse    = this.$copse;
	var cursor   = this.$cursor;
	var ranks    = this.$ranks;
	var notepath = this.notepath;

	if( !action )
	{
		this.beep( );
		return;
	}

	switch( action.type )
	{
		case 'insert' :

			path = new Path(
				this.notepath,
				'++',
				'doc',
				ranks[ action.line ],
				'text'
			);

			this.peer.insertText(
				path,
				action.at1,
				action.val
			);

			cursor.offset += action.val.length;

			break;

		case 'remove' :

			path = new Path(
				notepath,
				'++',
				'doc',
				ranks[action.line],
				'text'
			);

			this.peer.removeText(
				path,
				action.at1,
				action.at2 - action.at1
			);

			if( cursor.offset >= action.at2 )
			{
				cursor.offset -= action.at2 - action.at1;
			}
			break;

		case 'split' :

			path = new Path(
				notepath,
				'++',
				'doc',
				ranks[ action.line ],
				'text'
			);

			this.peer.split( path, action.at1 );
			break;

		case 'join' :

			path = new Path(
				notepath,
				'++',
				'doc',
				ranks[ action.line - 1 ],
				'text'
			);

			this.peer.join(
				path,
				copse[ ranks[ action.line - 1 ] ].text.length
			);

			break;

		default :
			throw new Error( 'invalid action.type' );
	}

	this.clearAction( );

	this.update( -1 );

	this.resetBlink( );

	elements.input.focus( );
	*/
};


/*
| Cancels the current action
*/
TestPad.prototype.onCancelButton =
	function( )
{
	/*
	this.clearAction( );
	this.resetBlink( );
	elements.input.focus( );
	*/
};


/*
| Displays a beep message.
*/
TestPad.prototype.beep =
	function( )
{
	/*
	this.resetBlink( );
	elements.beep.innerHTML = 'BEEP!';
	*/
};


/*
| Starts an action.
*/
/*
TestPad.prototype.startAction =
	function( newAction )
{
	if (this.$action)
	{
		throw new Error('double action');
	}

	this.$action = newAction;

	elements.send.disabled =
		false;

	elements.cancel.disabled =
		false;
};
*/


/*
| Aquires non-special input from (hidden) input.
*/
TestPad.prototype.testinput =
	function( )
{
	/*
	var action   = self.$action;
	var cursor   = self.$cursor;

	var elements = self.elements;
	var text     = elements.input.value;

	elements.input.value = '';

	if( text === '' )
	{
		return;
	}

	if( !self.$ranks )
	{
		this.beep( );
		return;
	}

	if( action === null )
	{
		self.startAction(
			{
				type : 'insert',
				line : cursor.line,
				at1  : cursor.offset,
				val  : text
			}
		);

		self.resetBlink( );
		return;
	}

	if( action.type === 'insert' )
	{
		if( cursor.line === action.line &&
			cursor.offset === action.at1
		)
		{
			action.val = action.val + text;
			self.resetBlink( );
			return;
		}
	}

	self.beep( );
	*/
};


/*
| Handles all kind of special keys.
*/
TestPad.prototype.inputSpecialKey =
	function(
//		keyCode,
//		ctrlKey
	)
{
	/*
	var
		action =
			this.action,
		cursorLine =
			this.cursorLine,
		cursorAt =
			this.cursorAt;

	switch( keyCode )
	{
		case  8 :
			// backspace

			if( !ranks )
			{
				this.beep( );
				return;
			}

			if( cursor.offset <= 0 )
			{
				if( action )
				{
					this.beep( );
					return;
				}

				if( cursor.line <= 0 )
				{
					this.beep( );
					return;
				}

				this.startAction(
					{
						type : 'join',
						line : cursor.line
					}
				);
				break;
			}

			if( !action )
			{
				this.startAction(
					{
						type : 'remove',
						line : cursor.line,
						at1  : cursor.offset - 1,
						at2  : cursor.offset
					}
				);

				cursor.offset--;
				break;
			}

			if( action.type !== 'remove' )
			{
				this.beep( );
				return;
			}

			if( cursor.offset !== action.at1 )
			{
				this.beep();
				return;
			}
			action.at1--;
			cursor.offset--;
			break;

		case 13 :
			// return

			if( !ranks )
			{
				this.beep();
				return;
			}

			if( ctrlKey )
			{
				this.send( );
				break;
			}

			if( action )
			{
				this.beep( );
				return;
			}

			this.startAction(
				{
					type : 'split',
					line : cursor.line,
					at1  : cursor.offset
				}
			);
			break;

		case 27 :
			// esc

			this.cancel( );
			break;

		case 35 :
			// end

			if( !ranks )
			{
				this.beep( );
				return;
			}
			cursor.offset =
				this.$copse[ ranks[ cursor.line ] ].text.length;
			break;

		case 36 :
			// pos1

			if( !ranks )
			{
				this.beep( );
				return;
			}
			cursor.offset = 0;
			break;

		case 37 :
			// left

			if( !ranks )
			{
				this.beep( );
				return;
			}
			if( cursor.offset <= 0 )
			{
				this.beep( );
				return;
			}
			cursor.offset--;
			break;

		case 38 :
			// up

			if( cursor.line <= 0 )
			{
				this.beep( );
				return;
			}
			if( !ranks )
			{
				this.beep( );
				return;
			}
			cursor.line--;
			break;

		case 39 :
			// right

			if( !ranks )
			{
				this.beep( );
				return;
			}

			cursor.offset ++;
			break;

		case 40 :
			// down

			if( !ranks )
			{
				this.beep( );
				return;
			}

			if (cursor.line >= ranks.length)
			{
				this.beep( );
				return;
			}

			cursor.line++;
			break;

		case 46 :
			// del

			if( !ranks )
			{
				this.beep( );
				return;
			}

			var text =
				this.$copse[ ranks[ cursor.line ] ].text;

			if (cursor.offset >= text.length)
			{
				this.beep( );
				return;
			}

			if (!action )
			{
				this.startAction(
					{
						type : 'remove',
						line : cursor.line,
						at1  : cursor.offset,
						at2  : cursor.offset + 1
					}
				);
				cursor.offset++;
				break;
			}

			if( action.type !== 'remove' )
			{
				this.beep( );
				return;
			}

			if( cursor.offset !== action.at2 )
			{
				this.beep( );
				return;
			}
			action.at2++;
			cursor.offset++;
			break;
	}

	*/
};


/*
| Updates data from server.
|
| TODO remove
*/
/*
TestPad.prototype.update =
	function(
		seq
	)
{
	if( space )
	{
		var note  = space.copse.testnote;
		this.$ranks = note.doc.ranks;
		this.$copse = note.doc.copse;
	}
	else
	{
		this.$ranks = null;
		this.$copse = null;
	}
};
*/


/*
| Button update-to-now has been clicked.
*/
TestPad.prototype.onButtonUpToNow =
	function( )
{
	testPad.create(
		'seq',
			-1
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
	function( )
{
	return '';
	/*
	for(a = 0, aZ = ranks.length; a < aZ; a++)
	{
		lines.push(
			copse[ ranks[ a ] ].text.split( '' )
		);
	}

	// replaces HTML entities
	for( a = 0, aZ = lines.length; a < aZ; a++ )
	{
		line = lines[ a ];
		for( b = 0, bZ = line.length; b < bZ; b++ )
		{
			switch( line[ b ] )
			{
				case '&' :
					line[ b ] = '&amp;';
					break;

				case '"' :
					line[ b ] = '&quot;';
					break;

				case '<' :
					line[ b ] = '&lt;';
					break;

				case '>' :
					line[ b ] = '&gt;';
					break;
			}
		}
	}

	// inserts the cursor
	if( focus )
	{
		var
			cLine =
				this.cursorLine;
			ctext = lines[ cline ];
			coff  = cursor.offset;
			clen  = lines[ cline ].length;

		if( coff >= ctext.length )
		{
			coff = cursor.offset = ctext.length;
			lines[ cline ][ coff ] = ' ';
		}

		lines[ cline ][ coff ] =
			'<span id="cursor">'+lines[ cline ][ coff ] +
			'</span>';

		if( coff === clen )
		{
			lines[ cline ].push( ' ' );
		}
	}

	// inserts the action
	switch( action && action.type )
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
					action.at1, 0, '<span id="split">⤶</span>'
				);
			break;

		case 'insert' :
			lines[ action.line ].
				splice(
					action.at1,
					0,
					'<span id="insert">',
					action.val,
					'</span>'
				);
			break;

		case 'remove' :
			if( action.at1 > action.at2 )
			{
				throw new Error( 'Invalid remove action' );
			}

			lines[ action.line ].splice(
				action.at1,
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
			throw new Error( 'Unknown action.type' );
	}

	// transforms to HTML
	for( a = 0, aZ = lines.length; a < aZ; a++ )
	{
		lines[ a ] = lines[ a ].join( '' );
	}

	return (
		lines.join( '\n' )
	);
	*/
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

//	testPad.update( -1 ); TODO
//	testPad.elements.input.focus( );
};

} )( );


