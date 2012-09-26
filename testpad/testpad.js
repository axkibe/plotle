/*
| A testing pad for meshcraft.
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
*/


/*
| Imports
*/
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
| Current action
*/
var action    = null;


/*
| True when mouse is down
*/
var mousedown = false;


/*
| References to the pages html elements
*/
var element =
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


var peer;
var space;
var note;
var ranks;
var copse;
var time = -1;
var maxtime = -1;
var notepath = new Path( ['meshcraft:home', '1' ] );


/*
| The current cursor position and blinking state
*/
var cursor = {
	line   : 0,
	offset : 0,
	blink  : false
};

/*
| TODO
*/
var focus     = false;


/*
| Returns true if a keyCode is known to be a "special key".
*/
var isSpecialKey =
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
}


/*
| The blink timer.
*/
var blinkTimer = null;


/*
| Blinks the cursor on/off.
*/
var blink =
	function( )
{
	cursor.blink = !cursor.blink;
	testinput( );
	updatePad( );
	element.beep.innerHTML = '';
};


/*
| Resets the blink timer
*/
var resetBlink =
	function( )
{
	cursor.blink = false;
	element.beep.innerHTML = '';

	if( blinkTimer )
	{
		clearInterval( blinkTimer );
	}

	if( focus )
	{
		blinkTimer = setInterval( blink, 540 );
	}
};


/*
| Mouse down event on pad -> focuses the hidden input,
*/
var onmousedown =
	function( event )
{
	if( event.button !== 0 )
		{ return; }

	event.preventDefault( );
	captureEvents( );
	mousedown = true;
	element.input.focus( );
	var x = event.pageX - element.pad.offsetLeft;
	var y = event.pageY - element.pad.offsetTop;

	if( !ranks )
	{
		beep( );
		return;
	}

	cursor.line =
		Jools.limit(
			0,
			Math.floor( y / element.measure.offsetHeight ),
			ranks.length - 1
		);

	var text = copse[ ranks[ cursor.line ] ].text;

	cursor.offset =
		Jools.limit(
			0,
			Math.floor( x / element.measure.offsetWidth ),
			text.length
		);

	resetBlink( );
	updatePad( );
};


/*
| Captures all mouseevents event
*/
var captureEvents =
	function( )
{
	if( element.pad.setCapture )
	{
		element.pad.setCapture( element.pad );
	}
	else
	{
		document.onmouseup   = onmouseup;
		document.onmousemove = onmousemove;
	}
};


/*
| Stops capturing all mouseevents
*/
var releaseEvents =
	function( )
{
    if( element.pad.setCapture )
	{
        element.pad.releaseCapture( element.pad );
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
var onmouseup =
	function( event )
{
	if( event.button !==  0)
		{ return; }
	event.preventDefault( );
	mousedown = false;
	releaseEvents( );
};



/*
| Mouse clicked on pad -> move the cursor there.
*/
var onmouseclick =
	function( event )
{
	event.preventDefault( );
};


/*
| Mouse moved over pad (or while dragging around it);
*/
var onmousemove =
	function( event )
{
	if( mousedown )
		{ onmousedown(event); }
};


/*
| Down event to (hidden) input.
*/
var onkeydown =
	function( event )
{
	if( isSpecialKey( event.keyCode ) )
	{
		event.preventDefault( );

		inputSpecialKey(
			event.keyCode,
			event.ctrlKey
		);
	}
	else
	{
		testinput( );
	}
};


/*
| Press event to (hidden) input.
*/
var onkeypress =
	function( event )
{
	setTimeout( testinput, 0 );
};


/*
| Up event to (hidden) input.
*/
var onkeyup =
	function( event )
{
	testinput( );
};


/*
| Hidden input got focus.
*/
var onfocus =
	function( )
{
	focus = true;
	resetBlink( );
	updatePad( );
};


/*
| Hidden input lost focus.
*/
var onblur =
	function( )
{
	focus = false;
	resetBlink( );
	updatePad( );
};


/*
| Clears the current action
*/
var clearAction =
	function( )
{
	element.cancel.disabled = true;
	element.send.disabled   = true;
	action = null;
};


/*
| Sends the current action to server.
*/
var send =
	function( )
{
	if( !action )
	{
		beep( );
		return;
	}
	var path;

	switch( action.type )
	{
		case 'insert' :
			path = new Path(notepath, '++', 'doc', ranks[action.line], 'text');
			peer.insertText(path, action.at1, action.val);
			cursor.offset += action.val.length;
			break;

		case 'remove' :
			path = new Path(notepath, '++', 'doc', ranks[action.line], 'text');
			peer.removeText(path, action.at1, action.at2 - action.at1);
			if (cursor.offset >= action.at2) {
				cursor.offset -= action.at2 - action.at1;
			}
			break;

		case 'split' :
			path = new Path(notepath, '++', 'doc', ranks[action.line], 'text');
			peer.split(path, action.at1);
			break;

		case 'join' :
			path = new Path(notepath, '++', 'doc', ranks[action.line - 1], 'text');
			peer.join(path, copse[ranks[action.line - 1]].text.length);
			break;

		default :
			throw new Error('invalid action.type');
	}

	clearAction( );
	update( -1 );
	resetBlink( );
	updatePad( );
	element.input.focus( );
};


/*
| Cancels the current action
*/
var cancel =
	function( )
{
	clearAction( );
	resetBlink( );
	updatePad( );
	element.input.focus( );
};


/*
| Displays a beep message.
*/
var beep =
	function( )
{
	resetBlink( );
	element.beep.innerHTML = 'BEEP!';
};


/*
| TODO
*/
var startAction =
	function( newAction )
{
	if (action)
		{ throw new Error('double action'); }

	action = newAction;
	element.send.disabled = false;
	element.cancel.disabled = false;
};


/*
| Aquires non-special input from (hidden) input.
*/
var testinput =
	function( )
{
	var text = element.input.value;
	element.input.value = '';
	if( text === '' )
		{ return; }

	if( !ranks )
	{
		beep( );
		return;
	}

	if( action === null )
	{
		startAction(
			{
				type : 'insert',
				line : cursor.line,
				at1  : cursor.offset,
				val  : text
			}
		);

		resetBlink( );
		updatePad( );
		return;
	}
	else if( action.type === 'insert' )
	{
		if( cursor.line === action.line &&
			cursor.offset === action.at1
		)
		{
			action.val = action.val + text;
			resetBlink( );
			updatePad( );
			return;
		}
	}

	beep( );
};


/*
| Handles all kind of special keys.
*/
var inputSpecialKey =
	function( keyCode, ctrlKey )
{
	switch( keyCode )
	{
		case  8 :
			// backspace
			if( !ranks )
			{
				beep( );
				return;
			}

			if( cursor.offset <= 0 )
			{
				if (action){
					beep();
					return;
				}
				if (cursor.line <= 0)
				{
					beep();
					return;
				}

				startAction(
					{
						type : 'join',
						line : cursor.line
					}
				);
				break;
			}

			if( !action )
			{
				startAction(
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
				beep( );
				return;
			}

			if (cursor.offset !== action.at1)
			{
				beep();
				return;
			}
			action.at1--;
			cursor.offset--;
			break;

		case 13 :
			// return
			if( !ranks )
			{
				beep();
				return;
			}

			if( ctrlKey )
			{
				send();
				break;
			}

			if (action)
			{
				beep();
				return;
			}

			startAction(
				{
					type : 'split',
					line : cursor.line,
					at1  : cursor.offset
				}
			);
			break;

		case 27 :
			// esc
			cancel( );
			break;

		case 35 :
			// end
			if( !ranks )
			{
				beep( );
				return;
			}
			cursor.offset = copse[ ranks[ cursor.line ] ].text.length;
			break;

		case 36 :
			// pos1
			if( !ranks )
			{
				beep( );
				return;
			}
			cursor.offset = 0;
			break;

		case 37 :
			// left
			if (!ranks)
			{
				beep( );
				return;
			}
			if (cursor.offset <= 0)
			{
				beep( );
				return;
			}
			cursor.offset--;
			break;

		case 38 :
			// up
			if( cursor.line <= 0 )
			{
				beep( );
				return;
			}
			if( !ranks )
			{
				beep( );
				return;
			}
			cursor.line--;
			break;

		case 39 :
			// right
			if( !ranks )
			{
				beep( );
				return;
			}
			cursor.offset ++;
			break;

		case 40 :
			// down
			if( !ranks )
			{
				beep( );
				return;
			}
			if (cursor.line >= ranks.length)
			{
				beep( );
				return;
			}
			cursor.line++;
			break;

		case 46 :
			// del
			if( !ranks )
			{
				beep( );
				return;
			}

			var text = copse[ ranks[ cursor.line ] ].text;
			if (cursor.offset >= text.length)
			{
				beep();
				return;
			}

			if (!action)
			{
				startAction(
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
				beep();
				return;
			}

			if( cursor.offset !== action.at2 )
			{
				beep();
				return;
			}
			action.at2++;
			cursor.offset++;
			break;
	}

	resetBlink( );
	updatePad( );
};


/*
| Updates data from server
*/
var update =
	function( totime )
{
	var res;

	//peer.toTime( totime ); TODO

	res   = peer.get( new Path( [ 'testpad' ] ) );
	time  = res.time;
	space = res.node;

	maxtime = Math.max( time, maxtime );

	element.now.innerHTML = '' + time;

	if (space)
	{
		note  = space.copse[ 'testnote' ];
		ranks = note.doc.ranks;
		copse = note.doc.copse;
	}
	else
	{
		space = null;
		note  = null;
		ranks = null;
		copse = null;
	}
};


/*
| Button update-to-now has been clicked
*/
var onButtonUpToNow =
	function( )
{
	update( -1 );
	resetBlink( );
	updatePad( );
	element.input.focus( );
};


/*
| Button one-up-the-timeline has been clicked.
*/
var onButtonUpClick =
	function( )
{
	update(
		Math.min(
			time + 1,
			maxtime
		)
	);

	resetBlink( );
	updatePad( );
	element.input.focus( );
};


/*
| Button one-down-the-timeline has been clicked.
*/
var onButtonDownClick =
	function( )
{
	update(
		Math.max(
			time - 1,
			0
		)
	);

	resetBlink( );
	updatePad( );
	element.input.focus( );
};


/*
| (Re)Computes the pads contents to match the current data and action.
*/
var updatePad =
	function( )
{
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
		element.pad.innerHTML = lines.join( '\n' );
		return;
	}

	for(a = 0, aZ = ranks.length; a < aZ; a++)
	{
		lines.push(
			copse[ ranks[ a ] ].text.split( '' )
		);
	}

	// replaces HTML entities.
	for( a = 0, aZ = lines.length; a < aZ; a++ )
	{
		line = lines[ a ];
		for( b = 0, bZ = line.length; b < bZ; b++ )
		{
			switch( line[ b ] )
			{
				case '&' : line[ b ] = '&amp;';  break;
				case '"' : line[ b ] = '&quot;'; break;
				case '<' : line[ b ] = '&lt;';   break;
				case '>' : line[ b ] = '&gt;';   break;
			}
		}
	}

	// inserts the cursor
	if (focus && !cursor.blink)
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

		lines[ cline ][ coff ] = '<span id="cursor">'+lines[ cline ][ coff ]+'</span>';
		if (coff === clen)
		{
			lines[cline].push( ' ' );
		}
	}

	// inserts the action
	switch( action && action.type )
	{
		case null :
			break;

		case 'join' :
			lines[ action.line ].unshift( '<span id="join">↰</span>' );
			break;

		case 'split' :
			lines[ action.line ].splice(
				action.at1, 0, '<span id="split">⤶</span>'
			);
			break;

		case 'insert' :
			lines[ action.line ].splice(
				action.at1,
				0,
				'<span id="insert">',
				action.val,
				'</span>'
			);
			break;

		case 'remove' :
			if (action.at1 > action.at2)
				{ throw new Error('Invalid remove action'); }

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

	element.pad.innerHTML = lines.join( '\n' );
};


/*
| Window.
*/
window.onload =
	function( )
{
	for( var id in element )
	{
		element[ id ] = document.getElementById( id );
	}

	element.pad.onmousedown   = onmousedown;
	element.pad.onmousemove   = onmousemove;
	element.pad.onmouseup     = onmouseup;
	element.pad.onclick       = onmouseclick;
	element.input.onkeypress  = onkeypress;
	element.input.onkeydown   = onkeydown;
	element.input.onkeyup     = onkeyup;
	element.input.onfocus     = onfocus;
	element.input.onblur      = onblur;
	element.send.disabled     = true;
	element.send.onclick      = send;
	element.cancel.disabled   = true;
	element.cancel.onclick    = cancel;
	element.upnow.onclick     = onButtonUpToNow;
	element.up.onclick        = onButtonUpClick;
	element.down.onclick      = onButtonDownClick;

	peer = new Peer( 'sync' );
	update( -1 );
	updatePad( );
	resetBlink( );
	element.input.focus( );
};

} )( );


