/*
| A testing pad for the CC/OT engine.
|
| FIXME remove space from path an all the chopping
*/


var
	change_insert,
	change_join,
	change_remove,
	change_ray,
	change_split,
	change_wrap,
	jion,
	jion_path,
	math_limit,
	math_maxInteger,
	root,
	session_uid,
	testpad_action,
	testpad_root;


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
		id : 'testpad_root',
		attributes :
		{
			action :
			{
				comment : 'the action the user is preparing',
				type : 'testpad_action',
				defaultValue : 'undefined'
			},
			beepTimer :
			{
				comment : 'removes the beep',
				type : 'protean',
				defaultValue : 'undefined'
			},
			cursorAt :
			{
				comment : 'offset cursor is at',
				type : 'integer',
				defaultValue : '0'
			},
			cursorLine :
			{
				comment : 'line cursor is in',
				type : 'integer',
				defaultValue : '0'
			},
			elements :
			{
				comment : 'DOM elements',
				type : 'protean',
				defaultValue : 'undefined'
			},
			haveFocus :
			{
				comment : 'true when having focus',
				type : 'boolean',
				defaultValue : 'false'
			},
			mouseDown :
			{
				comment : 'true when mouse button is held down',
				type : 'boolean',
				defaultValue : 'false'
			},
			repository :
			{
				comment : 'the testing repository',
				type : 'testpad_repository',
				defaultValue : 'testpad_repository.create( )'
			}
		},
		init : [ ]
	};
}

var
	isSpecialKey,
	noteDocPath;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


noteDocPath =
	jion_path.empty
	.append( 'space' ) // FIXME, this isn't needed
	.append( 'twig' )
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
testpad_root.prototype._init =
	function( )
{
	var
		cancel,
		doc,
		down,
		elements,
		id,
		input,
		pad,
		send,
		up,
		upnow;

	elements = this.elements;

	if( !elements )
	{
		elements =
		this.elements =
			{
				measure : undefined,
				pad : undefined,
				input : undefined,
				beep : undefined,
				send : undefined,
				cancel : undefined,
				upnow : undefined,
				up : undefined,
				now : undefined,
				down : undefined
			};

		for( id in elements )
		{
			elements[ id ] = document.getElementById( id );
		}

		pad = elements.pad;

		input = elements.input;

		send = elements.send;

		cancel = elements.cancel;

		down = elements.down;

		up = elements.up;

		upnow = elements.upnow;

		pad.onmousedown = _bind( 'onMouseDown' );

		pad.onmousemove = _bind( 'onMouseMove' );

		pad.onmouseup = _bind( 'onMouseUp' );

		pad.onclick = _bind( 'onMouseClick' );

		input.onkeypress = _bind( 'onKeyPress' );

		input.onkeydown = _bind( 'onKeyDown' );

		input.onkeyup = _bind( 'onKeyUp' );

		input.onfocus = _bind( 'onFocus' );

		input.onblur = _bind( 'onBlur' );

		send.onclick = _bind( 'send' );

		cancel.onclick = _bind( 'onCancelButton' );

		down.onclick = _bind( 'onDownButton' );

		up.onclick = _bind( 'onUpButton' );

		upnow.onclick = _bind( 'onUpNowButton' );
	}

	elements.send.disabled =
	elements.cancel.disabled =
		!this.action;

	doc =
	this._doc =
		this.repository.get( noteDocPath.chop );

	elements.now.innerHTML = '' + this.repository.seq;

	this.cursorLine = math_limit( 0, this.cursorLine, doc.ranks.length - 1 );

	this.cursorAt =
		math_limit(
			0,
			this.cursorAt,
			doc.atRank( this.cursorLine ).text.length
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
isSpecialKey =
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
| Alters the tree.
*/
testpad_root.prototype.alter =
	function(
		change
	)
{
	var
		changeWrap,
		result;

	changeWrap =
		change_wrap.create(
			'cid', session_uid( ),
			'changeRay',
				change_ray.create( 'ray:set', 0, change )
		);

	result = root.repository.alter( changeWrap );

	// FIXME return nothing!
	return result;
};


/*
| Mouse down event on pad -> focuses the hidden input,
*/
testpad_root.prototype.onMouseDown =
	function(
		event
	)
{
	var
		cLine,
		cText,
		doc,
		pad,
		measure,
		x,
		y;


	if( event.button !== 0 )
	{
		return;
	}

	event.preventDefault( );

	root.captureEvents( );

	root.create( 'mouseDown', true );

	root.elements.input.focus( );

	pad = root.elements.pad;

	measure = root.elements.measure;

	doc = root._doc;

	x = event.pageX - pad.offsetLeft;

	y = event.pageY - pad.offsetTop;

	if( !doc )
	{
		root.beep( );

		return;
	}

	cLine =
		math_limit(
			0,
			Math.floor( y / measure.offsetHeight ),
			doc.ranks.length - 1
		);

	cText = doc.twig[ doc.ranks[ cLine ] ].text;

	root.create(
		'cursorLine', cLine,
		'cursorAt',
			math_limit(
				0,
				Math.floor( x / measure.offsetWidth ),
				cText.length
			)
	);
};


/*
| Captures all mouse events.
*/
testpad_root.prototype.captureEvents =
	function( )
{
	var
		pad;

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
testpad_root.prototype.releaseEvents =
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
			undefined;
	}
};


/*
| Mouse button released.
*/
testpad_root.prototype.onMouseUp =
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
testpad_root.prototype.onMouseClick =
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
testpad_root.prototype.onMouseMove =
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
testpad_root.prototype.onKeyDown =
	function(
		event
	)
{
	if( isSpecialKey( event.keyCode ) )
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
testpad_root.prototype.onKeyPress =
	function(
		// event
	)
{
	setTimeout( _bind( 'testInput' ), 0 );
};


/*
| Up event to (hidden) input.
*/
testpad_root.prototype.onKeyUp =
	function(
		// event
	)
{
	root.testInput( );
};


/*
| Hidden input got focus.
*/
testpad_root.prototype.onFocus =
	function( )
{
	root.create( 'haveFocus', true );
};


/*
| Hidden input lost focus.
*/
testpad_root.prototype.onBlur =
	function( )
{
	root.create( 'haveFocus', false );
};


/*
| Sends the current action.
*/
testpad_root.prototype.send =
	function( )
{
	var
		action,
		cursorAt,
		doc,
		path,
		path2;

	action = this.action;

	doc = this._doc;

	if( !action )
	{
		this.beep( );

		return;
	}

	switch( action.command )
	{
		case 'insert' :

			// FIXME path is set in all cases equally, so
			//       move it up
			path =
				noteDocPath
				.append( 'twig' )
				.append( doc.ranks[ action.line ] )
				.append( 'text' );

			root.alter(
				change_insert.create(
					'val', action.value,
					'path', path.chop,
					'at1', action.at,
					'at2', action.at + action.value.length
				)
			);

			cursorAt = this.cursorAt + action.value.length;

			break;

		case 'remove' :

			path =
				noteDocPath
				.append( 'twig' )
				.append( doc.ranks[ action.line ] )
				.append( 'text' );

			root.alter(
				change_remove.create(
					'val',
						doc.atRank( action.line ).text
						.substring( action.at2, action.at ),
					'path', path.chop,
					'at1', action.at,
					'at2', action.at2
				)
			);

			if(
				this.cursorLine == action.line
				&& this.cursorAt >= action.at2
			)
			{
				cursorAt = this.cursorAt - ( action.at2 - action.at );
			}

			break;

		case 'split' :

			path =
				noteDocPath
				.append( 'twig' )
				.append( doc.ranks[ action.line ] )
				.append( 'text' );

			root.alter(
				change_split.create(
					'path', path.chop,
					'path2', path.set( -2, session_uid( ) ).chop,
					'at1', action.at
				)
			);

			break;

		case 'join' :

			path =
				noteDocPath
				.append( 'twig' )
				.append( doc.ranks[ action.line - 1 ] )
				.append( 'text' );

			path2 =
				noteDocPath
				.append( 'twig' )
				.append( doc.ranks[ action.line ] )
				.append( 'text' );

			root.alter(
				change_join.create(
					'path', path.chop,
					'path2', path2.chop,
					'at1', doc.atRank( action.line - 1 ).text.length
				)
			);

			break;

		default :

			throw new Error( 'invalid action.command' );
	}

	root.create(
		'action', undefined,
		'cursorAt', cursorAt,
		'repository', root.repository.create( 'seq', math_maxInteger )
	);
};


/*
| Cancels the current action.
*/
testpad_root.prototype.onCancelButton =
	function( )
{
	root.create( 'action', undefined );
};


/*
| Displays a beep message.
*/
testpad_root.prototype.beep =
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
testpad_root.prototype.clearBeep =
	function( )
{
	root.elements.beep.innerHTML = '';

	clearInterval( root.beepTimer );

	root.create( 'beepTimer', undefined );
};


/*
| Aquires non-special input from (hidden) input.
*/
testpad_root.prototype.testInput =
	function( )
{
	var
		action,
		cursorLine,
		cursorAt,
		elements,
		text;

	action = root.action;

	cursorLine = root.cursorLine;

	cursorAt = root.cursorAt;

	elements = root.elements;

	text = elements.input.value;

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

	if( !action )
	{
		root.create(
			'action',
			testpad_action.create(
				'command', 'insert',
				'line', cursorLine,
				'at', cursorAt,
				'value', text
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
testpad_root.prototype.inputSpecialKey =
	function(
		keyCode,
		ctrl
	)
{
	var
		action,
		cursorAt,
		cursorLine,
		doc;

	action = root.action;

	cursorLine = root.cursorLine;

	cursorAt = root.cursorAt;

	doc = root._doc;

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
						testpad_action.create(
							'command', 'join',
							'line', cursorLine
						)
				);

				return;
			}

			if( !action )
			{
				root.create(
					'action',
						testpad_action.create(
							'command', 'remove',
							'line', cursorLine,
						'at', cursorAt - 1,
						'at2', cursorAt
					),
					'cursorAt', cursorAt - 1
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
				'action', root.action.create( 'at', root.action.at - 1 ),
				'cursorAt', cursorAt - 1
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
					testpad_action.create(
						'command', 'split',
						'line', cursorLine,
						'at', cursorAt
					)
			);

			return;

		case 27 :
			// esc

			root.create( 'action', undefined );

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
						testpad_action.create(
							'command', 'remove',
							'line', cursorLine,
							'at', cursorAt,
							'at2', cursorAt + 1
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
				'action', action.create( 'at2', action.at2 + 1 ),
				'cursorAt', cursorAt + 1
			);

			return;
	}
};


/*
| Button update-to-now has been clicked.
*/
testpad_root.prototype.onUpNowButton =
	function( )
{
	root.create(
		'repository',
			root.repository.create( 'seq', math_maxInteger )
	);

	this.elements.input.focus( );
};


/*
| Button one-up-the-sequence has been clicked.
*/
testpad_root.prototype.onUpButton =
	function( )
{
	root.create(
		'repository',
			root.repository.create( 'seq', root.repository.seq + 1 )
	);

	this.elements.input.focus( );
};


/*
| Button one-down-the-sequence has been clicked.
*/
testpad_root.prototype.onDownButton =
	function( )
{
	root.create(
		'repository',
			root.repository.create( 'seq', root.repository.seq - 1 )
	);

	this.elements.input.focus( );
};


/*
| Cretes a screen for current data.
*/
testpad_root.prototype.makeScreen =
	function(
		doc
	)
{
	var
		a,
		action,
		aZ,
		b,
		bZ,
		cAt,
		cLen,
		cLine,
		cText,
		line,
		lines,
		ranks,
		twig;

	action = this.action;

	lines = [ ];

	ranks = doc.ranks;

	twig = doc.twig;

	// splits up the doc into
	// an array of lines which are
	// an array of chars
	for(
		a = 0, aZ = doc.length;
		a < aZ;
		a++
	)
	{
		lines.push( doc.atRank( a ).text.split( '' ) );
	}

	// replaces HTML entities
	for(
		a = 0, aZ = lines.length;
		a < aZ;
		a++
	)
	{
		line = lines[ a ];

		for(
			b = 0, bZ = line.length;
			b < bZ;
			b++
		)
		{
			switch( line[ b ] )
			{
				case '&' : line[ b ] = '&amp;'; break;

				case '"' : line[ b ] = '&quot;'; break;

				case '<' : line[ b ] = '&lt;';  break;

				case '>' : line[ b ] = '&gt;';  break;
			}
		}
	}

	// inserts the cursor
	if( this.haveFocus )
	{
		cLine = this.cursorLine;

		cText = lines[ cLine ];

		cAt = this.cursorAt;

		cLen = lines[ cLine ].length;

		if( cAt >= cText.length )
		{
			cAt = cText.length;

			lines[ cLine ][ cAt ] = ' ';
		}

		lines[ cLine ][ cAt ] =
			'<span id="cursor">'
			+ lines[ cLine ][ cAt ]
			+ '</span>';

		if( cAt === cLen )
		{
			lines[ cLine ].push( ' ' );
		}
	}

	// inserts the action
	switch( action && action.command )
	{
		case undefined :

			break;

		case 'join' :

			lines[ action.line ]
			.unshift( '<span id="join">↰</span>' );

			break;

		case 'split' :

			lines[ action.line ]
			.splice( action.at, 0, '<span id="split">⤶</span>' );

			break;

		case 'insert' :

			lines[ action.line ]
			.splice(
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
		lines[ a ] = lines[ a ].join( '' );
	}

	return lines.join( '\n' );
};


/*
| Generates the noDataScreen.
*/
jion.lazyValue(
	testpad_root.prototype,
	'noDataScreen',
	function( )
	{
		var
			a,
			line,
			line2,
			lines;

		line = [ ];

		lines = [ ];

		for( a = 0; a < 100; a++ )
		{
			line.push( '{}  ' );
		}

		line = line.join( '' );

		line2 = '  ' + line;

		for( a = 0; a < 50; a++ )
		{
			lines.push( line, line2 );
		}

		return lines.join( '\n' );
	}
);


/*
| Window.
*/
window.onload =
	function( )
{
	testpad_root.create( );

	root.elements.input.focus( );
};


} )( );
