/*
| A testing pad for the CC/OT engine.
*/
'use strict';


tim.define( module, ( def, self ) => {


const change_insert = require( '../change/insert' );

const change_list = require( '../change/list' );

const change_join = require( '../change/join' );

const change_remove = require( '../change/remove' );

const change_split = require( '../change/split' );

const change_wrap = require( '../change/wrap' );

const limit = require( '../math/root' ).limit;

const maxInteger = require( '../math/root' ).maxInteger;

const session_uid = require( '../session/uid' );

const testpad_action = require( './action' );

const tim_path = tim.import( 'tim.js', 'path' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		action :
		{
			// the action the user is preparing
			type : [ 'undefined', './action' ]
		},
		beepTimer :
		{
			// removes the beep
			type : [ 'undefined', 'protean' ]
		},
		cursorAt :
		{
			// offset cursor is at
			type : 'integer',
			defaultValue : '0'
		},
		cursorLine :
		{
			// line cursor is in
			type : 'integer',
			defaultValue : '0'
		},
		elements :
		{
			// DOM elements
			type : [ 'undefined', 'protean' ]
		},
		haveFocus :
		{
			// true when having focus
			type : 'boolean',
			defaultValue : 'false'
		},
		mouseDown :
		{
			// true when mouse button is held down
			type : 'boolean',
			defaultValue : 'false'
		},
		repository :
		{
			// the testing repository
			type : './repository',
			// TODO
			// defaultValue : 'testpad_repository.create( )'
		}
	};

	def.init = [ ];
}


const noteDocPath = tim_path.empty.append( 'note' ).append( 'doc' );


/*
| Binds an event handler to the
| latest instance of testpads root.
*/
const _bind =
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
def.func._init =
	function( )
{
	let elements = this.elements;

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

		for( let id in elements )
		{
			elements[ id ] = document.getElementById( id );
		}

		const pad = elements.pad;

		const input = elements.input;

		const send = elements.send;

		const cancel = elements.cancel;

		const down = elements.down;

		const up = elements.up;

		const upnow = elements.upnow;

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

	const doc =
	this._doc =
		this.repository.get( noteDocPath.chop );

	elements.now.innerHTML = '' + this.repository.seq;

	this.cursorLine = limit( 0, this.cursorLine, doc.length - 1 );

	this.cursorAt =
		limit(
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
| FUTURE make this a table.
*/
const isSpecialKey =
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


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Generates the noDataScreen.
*/
def.lazy.noDataScreen =
	function( )
{
	let line = [ ];

	for( let a = 0; a < 100; a++ )
	{
		line.push( '{}  ' );
	}

	line = line.join( '' );

	const line2 = '  ' + line;

	const lines = [ ];

	for( let a = 0; a < 50; a++ )
	{
		lines.push( line, line2 );
	}

	return lines.join( '\n' );
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Alters the tree.
*/
def.func.alter =
	function(
		change
	)
{
	const changeWrap =
		change_wrap.create(
			'cid', session_uid.newUid( ),
			'changeList',
				change_list.create( 'list:set', 0, change )
		);

	root.repository.alter( changeWrap );
};


/*
| Mouse down event on pad -> focuses the hidden input,
*/
def.func.onMouseDown =
	function(
		event
	)
{
	if( event.button !== 0 ) return;

	event.preventDefault( );

	root.captureEvents( );

	root.create( 'mouseDown', true );

	root.elements.input.focus( );

	const pad = root.elements.pad;

	const measure = root.elements.measure;

	const doc = root._doc;

	const x = event.pageX - pad.offsetLeft;

	const y = event.pageY - pad.offsetTop;

	if( !doc ) { root.beep( ); return; }

	const cLine =
		limit(
			0,
			Math.floor( y / measure.offsetHeight ),
			doc.length - 1
		);

	const cText = doc.atRank( cLine ).text;

	root.create(
		'cursorLine', cLine,
		'cursorAt',
			limit(
				0,
				Math.floor( x / measure.offsetWidth ),
				cText.length
			)
	);
};


/*
| Captures all mouse events.
*/
def.func.captureEvents =
	function( )
{
	const pad = root.elements.pad;

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
def.func.releaseEvents =
	function( )
{
	const pad = this.elements.pad;

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
def.func.onMouseUp =
	function(
		event
	)
{
	if( event.button !==  0) return;

	event.preventDefault( );

	root.create( 'mouseDown', false );

	root.releaseEvents( );
};



/*
| Mouse clicked on pad.
*/
def.func.onMouseClick =
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
def.func.onMouseMove =
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
def.func.onKeyDown =
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
def.func.onKeyPress =
	function(
		// event
	)
{
	setTimeout( _bind( 'testInput' ), 0 );
};


/*
| Up event to (hidden) input.
*/
def.func.onKeyUp =
	function(
		// event
	)
{
	root.testInput( );
};


/*
| Hidden input got focus.
*/
def.func.onFocus =
	function( )
{
	root.create( 'haveFocus', true );
};


/*
| Hidden input lost focus.
*/
def.func.onBlur =
	function( )
{
	root.create( 'haveFocus', false );
};


/*
| Sends the current action.
*/
def.func.send =
	function( )
{
	const action = this.action;

	let cursorAt;

	const doc = this._doc;

	if( !action )
	{
		this.beep( );

		return;
	}

	const linePath =
		noteDocPath
		.append( 'twig' )
		.append( doc.getKey( action.line ) )
		.append( 'text' );

	switch( action.command )
	{
		case 'insert' :

			root.alter(
				change_insert.create(
					'val', action.value,
					'path', linePath.chop,
					'at1', action.at,
					'at2', action.at + action.value.length
				)
			);

			cursorAt = this.cursorAt + action.value.length;

			break;

		case 'remove' :

			root.alter(
				change_remove.create(
					'val',
						doc.atRank( action.line ).text
						.substring( action.at2, action.at ),
					'path', linePath.chop,
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

			root.alter(
				change_split.create(
					'path', linePath.chop,
					'path2', linePath.set( -2, session_uid.newUid( ) ).chop,
					'at1', action.at
				)
			);

			break;

		case 'join' :

			root.alter(
				change_join.create(
					'path',
						noteDocPath
						.append( 'twig' )
						.append( doc.getKey( action.line - 1 ) )
						.append( 'text' )
						.chop,
					'path2', linePath.chop,
					'at1', doc.atRank( action.line - 1 ).text.length
				)
			);

			break;

		default : throw new Error( );
	}

	root.create(
		'action', undefined,
		'cursorAt', cursorAt,
		'repository', root.repository.create( 'seq', maxInteger )
	);
};


/*
| Cancels the current action.
*/
def.func.onCancelButton =
	function( )
{
	root.create( 'action', undefined );
};


/*
| Displays a beep message.
*/
def.func.beep =
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
def.func.clearBeep =
	function( )
{
	root.elements.beep.innerHTML = '';

	clearInterval( root.beepTimer );

	root.create( 'beepTimer', undefined );
};


/*
| Aquires non-special input from (hidden) input.
*/
def.func.testInput =
	function( )
{
	const action = root.action;

	const cursorLine = root.cursorLine;

	const cursorAt = root.cursorAt;

	const elements = root.elements;

	const text = elements.input.value;

	elements.input.value = '';

	if( text === '' ) return;

	if( !root._doc ) { root.beep( ); return; }

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
def.func.inputSpecialKey =
	function(
		keyCode,
		ctrl
	)
{
	const action = root.action;

	const cursorLine = root.cursorLine;

	const cursorAt = root.cursorAt;

	const doc = root._doc;

	switch( keyCode )
	{
		case  8 : // backspace

			if( !doc ) { root.beep( ); return; }

			if( cursorAt <= 0 )
			{
				if( action || cursorLine <= 0 ) { root.beep( ); return; }

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

			if( action.command !== 'remove' || cursorAt !== action.at )
			{
				root.beep( );

				return;
			}

			root.create(
				'action', root.action.create( 'at', root.action.at - 1 ),
				'cursorAt', cursorAt - 1
			);

			return;

		case 13 : // return

			if( !doc ) { root.beep( ); return; }

			if( ctrl ) { root.send( ); return; }

			if( action ) { root.beep( ); return; }

			root.create(
				'action',
					testpad_action.create(
						'command', 'split',
						'line', cursorLine,
						'at', cursorAt
					)
			);

			return;

		case 27 : // esc

			root.create( 'action', undefined );

			return;

		case 35 : // end

			if( !doc ) { this.beep( ); return; }

			root.create(
				'cursorAt', doc.atRank( cursorLine ).text.length
			);

			return;

		case 36 : // pos1

			if( !doc ) { this.beep( ); return; }

			root.create( 'cursorAt', 0 );

			return;

		case 37 : // left

			if( !doc ) { this.beep( ); return; }

			if( cursorAt <= 0 ) { this.beep( ); return; }

			root.create( 'cursorAt', cursorAt - 1 );

			return;

		case 38 : // up

			if( !doc || cursorLine <= 0) { this.beep( ); return; }

			root.create( 'cursorLine', cursorLine - 1 );

			return;

		case 39 : // right

			if( !doc ) { this.beep( ); return; }

			root.create( 'cursorAt', cursorAt + 1 );

			return;

		case 40 : // down

			if( !doc || cursorLine >= doc.length - 1 )
			{
				this.beep( );

				return;
			}

			root.create( 'cursorLine', cursorLine + 1 );

			return;

		case 46 : // del

			if( !doc ) { this.beep( ); return; }

			const text = doc.atRank( cursorLine ).text;

			if( cursorAt >= text.length ) { this.beep( ); return; }

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

			if( action.command !== 'remove' || cursorAt !== action.at2 )
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
def.func.onUpNowButton =
	function( )
{
	root.create(
		'repository',
			root.repository.create( 'seq', maxInteger )
	);

	this.elements.input.focus( );
};


/*
| Button one-up-the-sequence has been clicked.
*/
def.func.onUpButton =
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
def.func.onDownButton =
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
def.func.makeScreen =
	function(
		doc
	)
{
	const action = this.action;

	const lines = [ ];

	// splits up the doc into
	// an array of lines which are
	// an array of chars
	for( let a = 0, aZ = doc.length; a < aZ; a++ )
	{
		lines.push( doc.atRank( a ).text.split( '' ) );
	}

	// replaces HTML entities
	for( let a = 0, aZ = lines.length; a < aZ; a++ )
	{
		const line = lines[ a ];

		for( let b = 0, bZ = line.length; b < bZ; b++ )
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
		const cLine = this.cursorLine;

		const cText = lines[ cLine ];

		let cAt = this.cursorAt;

		const cLen = lines[ cLine ].length;

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

	for( let a = 0, aZ = lines.length; a < aZ; a++ )
	{
		lines[ a ] = lines[ a ].join( '' );
	}

	return lines.join( '\n' );
};


/*
| Window.
*/
if( !NODE )
{
	window.onload =
		function( )
	{
		self.create( );

		root.elements.input.focus( );
	};
}


} );
