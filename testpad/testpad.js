/*
| A testing pad for meshcraft.
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/


/*
| Imports
*/
var IFaceSym;
var Jools;
var Path;
var Peer;

/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined')
	{ throw new Error( 'testpad needs a browser!' ); }


/*
| Utility function, binds obj as this to func
*/
var bind = function( obj, func )
{
	return function( ) {
		func.apply( obj, arguments );
	};
};

/*
| Constructor
*/
var Testpad = function( )
{
	// current action
	this.$action    = null;

	// true when mouse is down
	this.$mousedown = false;

	/*
	| References to the pages html elements
	*/
	var elements = this.elements =
	{
		measure : null,
		pad     : null,
		input   : null,
		beep    : null,

		send    : null,
		cancel  : null,

		upnow   : null,
		up      : null,
		now     : null,
		down    : null
	};

	for( var id in elements )
	{
		elements[ id ] = document.getElementById( id );
	}

	var pad = elements.pad;
	pad.onmousedown   = bind( this, this.onmousedown  );
	pad.onmousemove   = bind( this, this.onmousemove  );
	pad.onmouseup     = bind( this, this.onmouseup    );
	pad.onclick       = bind( this, this.onmouseclick );

	var input = elements.input;
	input.onkeypress  = bind( this, this.onkeypress );
	input.onkeydown   = bind( this, this.onkeydown  );
	input.onkeyup     = bind( this, this.onkeyup    );
	input.onfocus     = bind( this, this.onfocus    );
	input.onblur      = bind( this, this.onblur     );

	elements.send.disabled    = true;
	elements.send.onclick     = bind( this, this.send );

	elements.cancel.disabled  = true;
	elements.cancel.onclick   = bind( this, this.cancel );

	elements.upnow.onclick     = bind( this, this.onButtonUpToNow );

	elements.up.onclick        = bind( this, this.onButtonUpClick );

	elements.down.onclick      = bind( this, this.onButtonDownClick );

	this.$ranks = null;
	this.$copse = null;

	// The current cursor position and blinking state
	this.$cursor = {
		line   : 0,
		offset : 0,
		blink  : false
	};

	// the blink timer.
	this.$blinkTimer = null;

	// true when having focus
	this.$haveFocus = false;

	this.notepath = new Path( [ 'testnote' ] );

	this.iface = new IFaceSym();
	this.peer  = new Peer( this.iface );

	this.update( -1 );
	this.updatePad( );
	this.resetBlink( );

	input.focus( );
};



/*
| Returns true if a keyCode is known to be a "special key".
*/
Testpad.prototype.isSpecialKey =
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
Testpad.prototype.blink =
	function( self )
{
	self.$cursor.blink = !self.$cursor.blink;

	self.testinput( self );
	self.updatePad( );

	self.elements.beep.innerHTML = '';
};


/*
| Resets the blink timer
*/
Testpad.prototype.resetBlink =
	function( )
{
	this.$cursor.blink = false;
	this.elements.beep.innerHTML = '';

	if( this.$blinkTimer )
	{
		clearInterval( this.$blinkTimer );
		this.$blinkTimer = null;
	}

	if( this.$haveFocus )
	{
		this.$blinkTimer = setInterval( this.blink, 540, this );
	}
};


/*
| Mouse down event on pad -> focuses the hidden input,
*/
Testpad.prototype.onmousedown =
	function( event )
{
	if( event.button !== 0 )
		{ return; }

	event.preventDefault( );
	this.captureEvents( );

	this.$mousedown = true;
	this.elements.input.focus( );

	var pad     = this.elements.pad;
	var measure = this.elements.measure;
	var cursor  = this.$cursor;
	var copse   = this.$copse;
	var ranks   = this.$ranks;

	var x = event.pageX - pad.offsetLeft;
	var y = event.pageY - pad.offsetTop;

	if( !ranks )
	{
		this.beep( );
		return;
	}


	cursor.line =
		Jools.limit(
			0,
			Math.floor( y / measure.offsetHeight ),
			ranks.length - 1
		);

	var text = copse[ ranks[ cursor.line ] ].text;

	cursor.offset =
		Jools.limit(
			0,
			Math.floor( x / measure.offsetWidth ),
			text.length
		);

	this.resetBlink( );
	this.updatePad( );
};


/*
| Captures all mouse events.
*/
Testpad.prototype.captureEvents =
	function( )
{
	var pad = this.elements.pad;

	if( pad.setCapture )
	{
		pad.setCapture( pad );
	}
	else
	{
		document.onmouseup   = bind( this, this.onmouseup   );
		document.onmousemove = bind( this, this.onmousemove );
	}
};


/*
| Stops capturing all mouse events
*/
Testpad.prototype.releaseEvents =
	function( )
{
	var pad = this.elements.pad;

    if( pad.setCapture )
	{
        pad.releaseCapture( pad );
    }
	else
	{
        document.onmouseup = null;
        document.onmousemove = null;
    }
};


/*
| Mouse button released
*/
Testpad.prototype.onmouseup =
	function( event )
{
	if( event.button !==  0)
		{ return; }

	event.preventDefault( );

	this.$mousedown = false;
	this.releaseEvents( );
};



/*
| Mouse clicked on pad.
| TODO remove?
*/
Testpad.prototype.onmouseclick =
	function( event )
{
	event.preventDefault( );
};


/*
| Mouse moved over pad (or while dragging around it);
*/
Testpad.prototype.onmousemove =
	function( event )
{
	if( this.$mousedown )
	{
		this.onmousedown( event );
	}
};


/*
| Down event to (hidden) input.
*/
Testpad.prototype.onkeydown =
	function( event )
{
	if( this.isSpecialKey( event.keyCode ) )
	{
		event.preventDefault( );

		this.inputSpecialKey(
			event.keyCode,
			event.ctrlKey
		);
	}
	else
	{
		this.testinput( this );
	}
};


/*
| Press event to (hidden) input.
*/
Testpad.prototype.onkeypress =
	function( event )
{
	setTimeout( this.testinput, 0, this );
};


/*
| Up event to (hidden) input.
*/
Testpad.prototype.onkeyup =
	function( event )
{
	this.testinput( this );
};


/*
| Hidden input got focus.
*/
Testpad.prototype.onfocus =
	function( )
{
	this.$haveFocus = true;
	this.resetBlink( );
	this.updatePad( );
};


/*
| Hidden input lost focus.
*/
Testpad.prototype.onblur =
	function( )
{
	this.$haveFocus = false;
	this.resetBlink( );
	this.updatePad( );
};


/*
| Clears the current action
*/
Testpad.prototype.clearAction =
	function( )
{
	var elements = this.elements;

	elements.cancel.disabled = true;
	elements.send.disabled   = true;

	this.$action = null;
};


/*
| Sends the current action to server.
*/
Testpad.prototype.send =
	function( )
{
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

	this.updatePad( );

	this.elements.input.focus( );
};


/*
| Cancels the current action
*/
Testpad.prototype.cancel =
	function( )
{
	this.clearAction( );
	this.resetBlink( );
	this.updatePad( );
	this.elements.input.focus( );
};


/*
| Displays a beep message.
*/
Testpad.prototype.beep =
	function( )
{
	this.resetBlink( );
	this.elements.beep.innerHTML = 'BEEP!';
};


/*
| Starts an action.
*/
Testpad.prototype.startAction =
	function( newAction )
{
	if (this.$action)
		{ throw new Error('double action'); }

	this.$action = newAction;

	var elements = this.elements;

	elements.send.disabled = false;
	elements.cancel.disabled = false;
};


/*
| Aquires non-special input from (hidden) input.
*/
Testpad.prototype.testinput =
	function( self )
{
	var action   = self.$action;
	var cursor   = self.$cursor;

	var elements = self.elements;
	var text     = elements.input.value;

	elements.input.value = '';

	if( text === '' )
		{ return; }

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
		self.updatePad( );
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
			self.updatePad( );
			return;
		}
	}

	self.beep( );
};


/*
| Handles all kind of special keys.
*/
Testpad.prototype.inputSpecialKey =
	function( keyCode, ctrlKey )
{
	var action = this.$action;
	var cursor = this.$cursor;
	var ranks  = this.$ranks;

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

	this.resetBlink( );
	this.updatePad( );
};


/*
| Updates data from server
*/
Testpad.prototype.update =
	function( time )
{
	this.$time = this.iface.goToTime( time );

	var space = this.peer.get( new Path( [ ] ) );

	this.elements.now.innerHTML = '' + time;

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


/*
| Button update-to-now has been clicked
*/
Testpad.prototype.onButtonUpToNow =
	function( )
{
	this.update( -1 );
	this.resetBlink( );
	this.updatePad( );

	this.elements.input.focus( );
};


/*
| Button one-up-the-timeline has been clicked.
*/
Testpad.prototype.onButtonUpClick =
	function( )
{
	this.update( this.$time + 1 );

	this.resetBlink( );
	this.updatePad( );
	this.elements.input.focus( );
};


/*
| Button one-down-the-timeline has been clicked.
*/
Testpad.prototype.onButtonDownClick =
	function( )
{
	this.update( this.$time - 1 );

	this.resetBlink( );
	this.updatePad( );
	this.elements.input.focus( );
};


/*
| (Re)Computes the pads contents to match the current data and action.
*/
Testpad.prototype.updatePad =
	function( )
{
	var action   = this.$action;
	var cursor   = this.$cursor;
	var elements = this.elements;
	var pad      = elements.pad;
	var copse    = this.$copse;
	var ranks    = this.$ranks;

	var lines = [ ];
	var a, aZ, b, bZ, line;

	if( !ranks )
	{
		// no data
		line = [ ];
		for(a = 0; a < 100; a++)
		{
			line.push('{}  ');
		}
		line = line.join('');

		var line2 = '  ' + line;

		for(a = 0; a < 50; a++)
		{
			lines.push(line, line2);
		}
		pad.innerHTML = lines.join( '\n' );
		return;
	}

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
	if( focus && !cursor.blink )
	{
		var cline = cursor.line;

		if( cline < 0 )
			{ cline = cursor.line = 0; }

		if( cline > ranks.length - 1 )
			{ cline = cursor.line = ranks.length - 1; }

		var ctext = lines[ cline ];
		var coff  = cursor.offset;
		var clen  = lines[ cline ].length;

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

	pad.innerHTML = lines.join( '\n' );
};


/*
| Window.
*/
window.onload =
	function( )
{
	new Testpad();
};

} )( );


