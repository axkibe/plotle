/*
| A testing pad for the CC/OT engine.
*/
'use strict';


tim.define( module, ( def, testpad_root ) => {


if( TIM )
{
	def.attributes =
	{
		// the action the user is preparing
		action : { type : [ 'undefined', './action' ] },

		// removes the beep
		beepTimer : { type : [ 'undefined', 'number' ] },

		// offset cursor is at
		cursorAt : { type : 'integer', defaultValue : '0' },

		// line cursor is in
		cursorLine : { type : 'integer', defaultValue : '0' },

		// DOM elements
		elements : { type : 'protean' },

		// true when having focus
		haveFocus : { type : 'boolean', defaultValue : 'false' },

		// true when mouse button is held down
		mouseDown : { type : 'boolean', defaultValue : 'false' },

		// the testing repository
		repository :
		{
			type : './repository',
			defaultValue : 'require( "./repository" ).init( )'
		}
	};

	def.global = 'root';
}


const change_insert = tim.require( '../change/insert' );

const change_list = tim.require( '../change/list' );

const change_join = tim.require( '../change/join' );

const change_remove = tim.require( '../change/remove' );

const change_split = tim.require( '../change/split' );

const change_wrap = tim.require( '../change/wrap' );

const math = tim.require( '../math/root' );

const session_uid = tim.require( '../session/uid' );

const testpad_action = tim.require( './action' );

const trace_space = tim.require( '../trace/space' );


/*
| Path to the document.
*/
def.staticLazy.docTrace = ( ) =>
	trace_space.fakeRoot.appendItem( 'note' ).appendDoc;


/*
| Binds an event handler to the
| latest instance of testpads root.
*/
const _bind =
	function(
		handler  // the handler of testpad
	)
{
	return( function( ) { root[ handler ].apply( root, arguments ); } );
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


/*
| Alters the tree.
*/
def.proto.alter =
	function(
		change
	)
{
	const changeWrap =
		change_wrap.create(
			'cid', session_uid.newUid( ),
			'changeList', change_list.create( 'list:set', 0, change )
		);

	root.repository.alter( changeWrap );
};


/*
| Shortcut to doc.
*/
def.lazy.doc =
	function( )
{
	return this.repository.note.doc;
};


/*
| Updates the sequence number
*/
def.proto.updateSeq =
	function(
		seq
	)
{
	const repository = this.repository;

	seq = math.limit( 0, seq, repository.maxSeq );

	return root.create( 'repository', repository.create( 'seq', seq ) );
};


/*
| Updates the html elements after altering the root.
*/
def.proto.update =
	function( )
{
	const elements = root.elements;

	elements.send.disabled =
	elements.cancel.disabled =
		!root.action;

	elements.now.innerHTML = '' + root.repository.seq;

	const doc = root.doc;

	const cursorLine = math.limit( 0, root.cursorLine, doc.length - 1 );

	const cursorAt = math.limit( 0, root.cursorAt, doc.atRank( cursorLine ).text.length );

	elements.pad.innerHTML = root.makeScreen( doc );

	root.create(
		'elements', elements,
		'cursorLine', cursorLine,
		'cursorAt', cursorAt
	);
};


/*
| Mouse down event on pad -> focuses the hidden input,
*/
def.proto.onMouseDown =
	function(
		event
	)
{
	if( event.button !== 0 ) return;

	event.preventDefault( );

	root.captureEvents( );

	root.create( 'mouseDown', true ).update( );

	root.elements.input.focus( );

	const pad = root.elements.pad;

	const measure = root.elements.measure;

	const doc = root.doc;

	const x = event.pageX - pad.offsetLeft;

	const y = event.pageY - pad.offsetTop;

	if( !doc ) { root.beep( ); return; }

	const cLine =
		math.limit(
			0,
			Math.floor( y / measure.offsetHeight ),
			doc.length - 1
		);

	const cText = doc.atRank( cLine ).text;

	root.create(
		'cursorLine', cLine,
		'cursorAt',
			math.limit(
				0,
				Math.floor( x / measure.offsetWidth ),
				cText.length
			)
	).update( );
};


/*
| Captures all mouse events.
*/
def.proto.captureEvents =
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
def.proto.releaseEvents =
	function( )
{
	const pad = this.elements.pad;

	if( pad.setCapture )
	{
		pad.releaseCapture( pad );
	}
	else
	{
		document.onmouseup = document.onmousemove = undefined;
	}
};


/*
| Mouse button released.
*/
def.proto.onMouseUp =
	function(
		event
	)
{
	if( event.button !==  0) return;

	event.preventDefault( );

	root.create( 'mouseDown', false ).update( );

	root.releaseEvents( );
};



/*
| Mouse clicked on pad.
*/
def.proto.onMouseClick =
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
def.proto.onMouseMove =
	function(
		event
	)
{
	if( root.mouseDown ) root.onMouseDown( event );
};


/*
| Key down event to ( hidden ) input.
*/
def.proto.onKeyDown =
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
def.proto.onKeyPress =
	function(
		// event
	)
{
	setTimeout( _bind( 'testInput' ), 0 );
};


/*
| Up event to (hidden) input.
*/
def.proto.onKeyUp =
	function(
		// event
	)
{
	root.testInput( );
};


/*
| Hidden input got focus.
*/
def.proto.onFocus =
	function( )
{
	root.create( 'haveFocus', true ).update( );
};


/*
| Hidden input lost focus.
*/
def.proto.onBlur =
	function( )
{
	root.create( 'haveFocus', false ).update( );
};


/*
| Sends the current action.
*/
def.proto.send =
	function( )
{
	const action = this.action;

	let cursorAt;

	const doc = this.doc;

	if( !action ) { this.beep( ); return; }

	const lineTrace =
		testpad_root.docTrace
		.appendPara( doc.getKey( action.line ) );

	switch( action.command )
	{
		case 'insert' :

			root.alter(
				change_insert.create(
					'val', action.value,
					'path', lineTrace.toPath.append( 'text' ),
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
					'path', lineTrace.toPath.append( 'text' ),
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
					'path', lineTrace.toPath.append( 'text' ),
					'path2',
						testpad_root.docTrace
						.appendPara( session_uid.newUid( ) ).toPath.append( 'text' ),
					'at1', action.at
				)
			);

			break;

		case 'join' :

			root.alter(
				change_join.create(
					'path',
						testpad_root.docTrace
						.appendPara( doc.getKey( action.line - 1 ) )
						.toPath.append( 'text' ),
					'path2', lineTrace.toPath.append( 'text' ),
					'at1', doc.atRank( action.line - 1 ).text.length
				)
			);

			break;

		default : throw new Error( );
	}

	root.create( 'action', undefined, 'cursorAt', cursorAt )
	.updateSeq( math.maxInteger )
	.update( );
};


/*
| Cancels the current action.
*/
def.proto.onCancelButton =
	function( )
{
	root.create( 'action', undefined ).update( );
};


/*
| Displays a beep message.
*/
def.proto.beep =
	function( )
{
	root.elements.beep.innerHTML = 'BEEP!';

	if( root.beepTimer ) clearInterval( root.beepTimer );

	root.create(
		'beepTimer', setInterval( _bind( 'clearBeep' ), 540 )
	).update( );
};


/*
| Clears the beep message.
*/
def.proto.clearBeep =
	function( )
{
	root.elements.beep.innerHTML = '';

	clearInterval( root.beepTimer );

	root.create( 'beepTimer', undefined ).update( );
};


/*
| Aquires non-special input from (hidden) input.
*/
def.proto.testInput =
	function( )
{
	const action = root.action;

	const cursorLine = root.cursorLine;

	const cursorAt = root.cursorAt;

	const elements = root.elements;

	const text = elements.input.value;

	elements.input.value = '';

	if( text === '' ) return;

	if( !root.doc ) { root.beep( ); return; }

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
		).update( );

		return;
	}

	if(
		action.command === 'insert'
		&& cursorLine === action.line
		&& cursorAt === action.at
	)
	{
		root
		.create( 'action', action.create( 'value', action.value + text ) )
		.update( );

		return;
	}

	root.beep( );
};


/*
| Handles all kind of special keys.
*/
def.proto.inputSpecialKey =
	function(
		keyCode,
		ctrl
	)
{
	const action = root.action;

	const cursorLine = root.cursorLine;

	const cursorAt = root.cursorAt;

	const doc = root.doc;

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
				).update( );

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
				).update( );

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
			).update( );

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
			).update( );

			return;

		case 27 : // esc

			root.create( 'action', undefined ).update( );

			return;

		case 35 : // end

			if( !doc ) { this.beep( ); return; }

			root.create( 'cursorAt', doc.atRank( cursorLine ).text.length ).update( );

			return;

		case 36 : // pos1

			if( !doc ) { this.beep( ); return; }

			root.create( 'cursorAt', 0 ).update( );

			return;

		case 37 : // left

			if( !doc ) { this.beep( ); return; }

			if( cursorAt <= 0 ) { this.beep( ); return; }

			root.create( 'cursorAt', cursorAt - 1 ).update( );

			return;

		case 38 : // up

			if( !doc || cursorLine <= 0) { this.beep( ); return; }

			root.create( 'cursorLine', cursorLine - 1 ).update( );

			return;

		case 39 : // right

			if( !doc ) { this.beep( ); return; }

			root.create( 'cursorAt', cursorAt + 1 ).update( );

			return;

		case 40 : // down

			if( !doc || cursorLine >= doc.length - 1 )
			{
				this.beep( );

				return;
			}

			root.create( 'cursorLine', cursorLine + 1 ).update( );

			return;

		case 46 : // del
		{
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
					'cursorAt', cursorAt + 1
				).update( );

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
			).update( );

			return;
		}
	}
};


/*
| Button update-to-now has been clicked.
*/
def.proto.onUpNowButton =
	function( )
{
	root.updateSeq( math.maxInteger ).update( );

	this.elements.input.focus( );
};


/*
| Button one-up-the-sequence has been clicked.
*/
def.proto.onUpButton =
	function( )
{
	root.updateSeq( root.repository.seq + 1 ).update( );

	this.elements.input.focus( );
};


/*
| Button one-down-the-sequence has been clicked.
*/
def.proto.onDownButton =
	function( )
{
	root.updateSeq( root.repository.seq - 1 ).update( );

	this.elements.input.focus( );
};


/*
| Cretes a screen for current data.
*/
def.proto.makeScreen =
	function(
		doc
	)
{
	const action = this.action;

	const lines = [ ];

	// splits up the doc into
	// an array of lines which are
	// an array of chars
	for( let para of doc )
	{
		lines.push( para.text.split( '' ) );
	}

	// replaces HTML entities
	for( let line of lines )
	{
		for( let b = 0, blen = line.length; b < blen; b++ )
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

	for( let a = 0, al = lines.length; a < al; a++ )
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
		const elements =
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

		for( let id in elements ) elements[ id ] = document.getElementById( id );

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

		testpad_root.create( 'elements', elements ).update( );

		root.elements.input.focus( );
	};
}


} );
