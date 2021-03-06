/*
| This is a wrapper around HTML5 browsers,
| creating a more comfortable interface for
| the shell.
*/
'use strict';


tim.define( module, ( def, shell_system ) => {


if( TIM )
{
	def.attributes =
	{
		// the transmitter creator is used to catch errors.
		transmitter : { type : 'function' },

		// used to transmit animation events
		_animationTransmitter : { type : 'function' },

		// used for checking input
		_checkInputTransmitter : { type : 'function' },

		// the display
		_display : { type : 'protean' },

		// used for starting drags after timeout
		_onAtweenTimeTransmitter : { type : 'function' },

		// if true browser supports the setCapture( ) call
		// if false needs work around
		_useCapture : { type : 'boolean' },
	};
}


/*
| Currently only canvas is supported as display backend.
*/
const gleam_impl = tim.require( '../gleam/display/canvas' );
const gleam_point = tim.require( '../gleam/point' );
const gleam_size = tim.require( '../gleam/size' );
const math = tim.require( '../math/root' );
const shell_root = tim.require( '../shell/root' );


/*
| Catches all thrown errors.
|
| also coorects hover and attention steering.
*/
const transmitter =
	function(
		func,        // event function to wrap
		nosteering   // if true it won't stear hovering/attention
	)
{
	return function( )
	{
		if( failScreen ) return;

		if( !FAILSCREEN )
		{
			func.apply( this, arguments );

			if( !nosteering )
			{
				system._repeatHover( );
				system._steerAttention( );
			}

			if( root ) root.draw;

			return;
		}

		try
		{
			func.apply( this, arguments );

			if( !nosteering )
			{
				system._repeatHover( );
				system._steerAttention( );
			}

			if( root ) root.draw;
		}
		catch( e )
		{
			try
			{
				const message =
					'OOPS! Internal failure, '
					+ e.name + ': '
					+ e.message + '\n\n'
					+ 'stack: '
					+ e.stack
					+ '\n\n'
					+ 'Please report to axkibe@gmail.com';

				system.failScreen( message );
			}
			catch( ee )
			{
				console.log( 'error in error:' + ee );
			}
		}
	};
};


/*
| If true there is currently one or more animations
| to be processed.
*/
let animating = false;


/*
| Timer used for checking input
*/
let checkInputTimer;


/*
| Atween is the state where the mouse button went down,
| and its yet unsure if this is a click or drag.
| if the mouse moves out of the atweenBox or the atweenTimer ticks its
| a drag, if it goes up before either happens, its a click
*/

/*
| Status of ctrl when atween state starts.
*/
let atweenCtrl = false;


/*
| Move position where cursor moved to in atween state.
*/
let atweenMove;


/*
| Position where mouse went down.
*/
let atweenPos;


/*
| Status of shift when atween state starts.
*/
let atweenShift = false;


/*
| Timer of the atween state.
*/
let atweenTimer;


/*
| The canvas everything is drawn upon.
*/
let canvas;


/*
| When true the system dropped down to show a fail screen.
*/
let failScreen = false;


/*
| The hidden input taking text input.
*/
let hiddenInput;


/*
| Hover is getting repeated by events that change
| the root, so it can react properly.
*/
let hoverShift = false;

let hoverCtrl = false;

let hoverP;


/*
| The value expected to be in input.
| either nothing or the text selection.
| if it changes the user did something.
*/
let inputVal = '';


/*
| Remembers last special key pressed, to hinder double events.
| Opera is behaving stupid here.
*/
let lastSpecialKey = -1;


/*
| false, 'atween' or 'drag'
*/
let pointingState = false;


const keyCodeNames =
	Object.freeze( new Map( [
		[  8, 'backspace' ],
		[  9, 'tab'       ],
		[ 13, 'enter'     ],
		[ 16, 'shift'     ],
		[ 17, 'ctrl'      ],
		[ 27, 'esc'       ],
		[ 33, 'pageup'    ],
		[ 34, 'pagedown'  ],
		[ 35, 'end'       ],
		[ 36, 'pos1'      ],
		[ 37, 'left'      ],
		[ 38, 'up'        ],
		[ 39, 'right'     ],
		[ 40, 'down'      ],
		[ 46, 'del'       ]
	] ) );

const keyCodeNamesCtrl =
	Object.freeze( new Map( [
		[  16, 'shift' ],
		[  17, 'ctrl'  ],
		[  65, 'a'     ],
		[  89, 'y'     ],
		[  90, 'z'     ],
		[ 188, ','     ],
		[ 190, '.'     ]
	] ) );


/*
| Creates a catcher that calls a system function.
*/
const systemTransmitter =
	function(
		funcName  // name of the function to call
	)
{
	return(
		transmitter(
			function( ) { return system[ funcName ].apply( system, arguments ); },
			true
		)
	);
};


/*
| Cancels an interval timer.
*/
def.proto.cancelInterval = ( id ) => window.clearInterval( id );


/*
| Cancels a single timer.
*/
def.proto.cancelTimer = ( id ) => window.clearTimeout( id );


/*
| If not already animating, start doing so.
*/
def.proto.doAnimation =
	function( )
{
	if( animating ) return;
	animating = true;
	window.requestAnimationFrame( this._animationTransmitter );
};


/*
| Replaces the shell by a failscreen
*/
def.proto.failScreen =
	function(
		message
	)
{
	if( failScreen ) return;
	failScreen = true;
	const body = document.body;
	body.removeChild( canvas );
	body.removeChild( hiddenInput );
	const divWrap = document.createElement( 'div' );
	const divContent = document.createElement( 'div' );
	const divMessage = document.createElement( 'div' );
	const butReload = document.createElement( 'button' );
	body.appendChild( divWrap );
	body.style.backgroundColor = 'rgb(250, 245, 206)';

	document.getElementById( 'viewport' ).content =
		'width=device-width, initial-scale=1, maximum-scale=1';

	divWrap.appendChild( divContent );
	divContent.appendChild( divMessage );
	divContent.appendChild( butReload );

	divWrap.style.display = 'table';
	divWrap.style.height = '100%';
	divWrap.style.marginLeft = 'auto';
	divWrap.style.marginRight = 'auto';

	divContent.style.display = 'table-cell';
	divContent.style.verticalAlign = 'middle';

	divMessage.textContent = message;
	divMessage.style.whiteSpace = 'pre-wrap';

	butReload.textContent = 'Reload';
	butReload.style.width = '100%';
	butReload.style.marginTop = '20px';
	butReload.onclick = ( ) => location.reload( );
};


/*
| Sets the hidden input field (text selection)
*/
def.proto.setInput =
	function(
		text
	)
{
	inputVal = text;
	hiddenInput.value = '__' + text;
	hiddenInput.setSelectionRange( 2, 2 + text.length );
};


/*
| Sets an interval timer.
|
| Handles error catching.
|
| Return the timer id.
*/
def.proto.setInterval =
	function(
		time,
		callback
	)
{
	return window.setInterval( transmitter( callback, true ), time );
};


/*
| Sets a timer.
|
| Handles error catching.
|
| Return the timer id.
*/
def.proto.setTimer =
	function(
		time,
		callback
	)
{
	return window.setTimeout( transmitter( callback, true ), time );
};


/*
| Stops animating.
*/
def.proto.stopAnimation =
	function( )
{
	animating = false;
};


// ---------------------------


/*
| Does an animation frame.
*/
def.proto._animation =
	function(
		time
	)
{
	if( !animating ) return;

	root.animationFrame( time );

	window.requestAnimationFrame( this._animationTransmitter );
};


const _resetAtweenState =
	function( )
{
	atweenTimer = undefined;
	atweenShift = false;
	atweenCtrl = false;
	atweenPos = undefined;
	atweenMove = undefined;
};


/*
| timeout after mouse down so dragging starts
*/
def.proto._onAtweenTime =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( pointingState !== 'atween' ) throw new Error( );
/**/}

	pointingState = 'drag';

	root.dragStart( atweenPos, atweenShift, atweenCtrl );
	root.dragMove( atweenMove, atweenShift, atweenCtrl );

	_resetAtweenState( );

	system._repeatHover( );
};


/*
| Input blur
*/
def.proto._onInputBlur =
	function(
		// event
	)
{
	window.scrollTo( 0, 0 );
};



/*
| Lost focus.
*/
def.proto._onSystemBlur =
	function(
		// event
	)
{
	root.setSystemFocus( false );
};



/*
| Got focus.
*/
def.proto._onSystemFocus =
	function(
		// event
	)
{
	root.setSystemFocus( true );
};


/*
| Window is being resized.
*/
def.proto._onResize =
	function(
		// event
	)
{
	if( !root ) return;

	root.resize(
		gleam_size.create(
			'width', window.innerWidth,
			'height', window.innerHeight
		),
		window.devicePixelRatio || 1
	);
};


/*
| Captures all mouseevents event beyond the canvas (for dragging)
*/
def.proto._captureEvents =
	function( )
{
	if( this._useCapture ) { canvas.setCapture( canvas ); return; }

	document.onmouseup = canvas.onmouseup;
	document.onmousemove = canvas.onmousemove;
};


/*
| Key down on hidden input field.
| Used when suggesting a keyboard.
*/
def.proto._onKeyDown =
	function(
		event
	)
{
	const kcode = ( lastSpecialKey = event.keyCode );

	if( !this._specialKey( kcode, event.shiftKey, event.ctrlKey || event.metaKey ) )
	{
		event.preventDefault( );
	}
};


/*
| Hidden input key press.
*/
def.proto._onKeyPress =
	function(
		event
	)
{
	const ew = event.which;
	const kcode = event.keyCode;
	const shift = event.shiftKey;
	const ctrl = event.ctrlKey || event.metaKey;

	if(
		( ( kcode > 0 && kcode < 32) || ew === 0)
		&& lastSpecialKey !== kcode
	)
	{
		lastSpecialKey = -1;

		return this._specialKey( kcode, shift, ctrl );
	}

	lastSpecialKey = -1;

	this._checkInput( );
	this.setTimer( 0, this._checkInputTransmitter );

	return true;
};


/*
| Hidden input key up.
*/
def.proto._onKeyUp =
	function( event )
{
	this._checkInput( );

	this._releaseSpecialKey(
		event.keyCode,
		event.shiftKey,
		event.ctrlKey || event.metaKey
	);

	return true;
};


/*
| Disables context menues.
*/
def.proto._onContextMenu =
	function(
		event
	)
{
	event.stopPropagation( );

	return false;
};


/*
| Mouse down event.
*/
def.proto._onMouseDown =
	function(
		event
	)
{
	event.preventDefault( );

	if( event.button !== undefined && event.button !== 0 ) return;

	// Opera requires focusing the window first
	//window.focus( );

	const p =
		gleam_point.createXY(
			event.pageX - canvas.offsetLeft,
			event.pageY - canvas.offsetTop
		);

	const shift = event.shiftKey;
	const ctrl = event.ctrlKey || event.metaKey;

	this._probeClickDrag( p, shift, ctrl );
	this._pointingHover( p, shift, ctrl );

	return false;
};


/*
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
def.proto._probeClickDrag =
	function(
		p,
		shift,
		ctrl
	)
{
	pointingState = root.probeClickDrag( p, shift, ctrl );

	switch( pointingState )
	{
		case 'atween' :

			atweenPos = p;
			atweenMove = p;
			atweenShift = shift;
			atweenCtrl = ctrl;
			atweenTimer =
				this.setTimer( config.dragTime, this._onAtweenTimeTransmitter );

			return;

		case 'drag' : root.dragStart( p, shift, ctrl ); return;

		case false : return;

		default : throw new Error( );
	}
};



/*
| Handles hovering of the pointing device.
*/
def.proto._pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	hoverP = p;
	hoverShift = shift;
	hoverCtrl = ctrl;

	this._setCursor( root.pointingHover( p, shift, ctrl ) );
};


/*
| Sets the cursor
*/
def.proto._setCursor =
	function(
		cursor
	)
{
	if( !cursor ) return;

	switch( cursor )
	{

		case 'grab' :

			canvas.style.cursor = '';
			canvas.className = 'grab';
			break;

		case 'grabbing' :

			canvas.style.cursor = '';
			canvas.className = 'grabbing';
			break;

		default :

			canvas.style.cursor = cursor;
			canvas.className = '';
			break;
	}
};

/*
| Repeats the last hover.
|
| Used by asyncEvents so the hoveringState is corrected.
*/
def.proto._repeatHover =
	function( )
{
	if( !hoverP ) return;

	this._setCursor( root.pointingHover( hoverP, hoverShift, hoverCtrl ) );
};


/*
| Mouse move event.
*/
def.proto._onMouseMove =
	function(
		event
	)
{
	const p =
		gleam_point.createXY(
			event.pageX - canvas.offsetLeft,
			event.pageY - canvas.offsetTop
		);

	const shift = event.shiftKey;
	const ctrl = event.ctrlKey || event.metaKey;

	switch( pointingState )
	{
		case false : this._pointingHover( p, shift, ctrl ); break;

		case 'atween' :
		{
			const dragbox = config.dragBox;

			if(
				( Math.abs( p.x - atweenPos.x ) > dragbox )
				|| ( Math.abs( p.y - atweenPos.y ) > dragbox )
			)
			{
				// moved out of dragbox -> start dragging
				clearTimeout( atweenTimer );
				pointingState = 'drag';
				root.dragStart( atweenPos, shift, ctrl );
				root.dragMove( p, shift, ctrl );
				system._repeatHover( );
				_resetAtweenState( );
				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				atweenMove = p;
			}

			break;
		}

		case 'drag':

			root.dragMove( p, shift, ctrl );
			system._repeatHover( );
			break;

		default : throw new Error( );
	}

	return true;
};


/*
| Mouse up event.
*/
def.proto._onMouseUp =
	function(
		event
	)
{
	event.preventDefault( );

	this._releaseEvents( );

	const p =
		gleam_point.createXY(
			event.pageX - canvas.offsetLeft,
			event.pageY - canvas.offsetTop
		);

	const shift = event.shiftKey;
	const ctrl = event.ctrlKey || event.metaKey;

	switch( pointingState )
	{
		case false : break;

		case 'atween' :

			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			clearTimeout( atweenTimer );
			root.click( atweenPos, shift, ctrl );
			this._pointingHover( atweenPos, shift, ctrl );
			this._steerAttention( );
			_resetAtweenState( );
			pointingState = false;
			break;

		case 'drag' :

			root.dragStop( p, shift, ctrl );
			this._pointingHover( p, shift, ctrl );
			this._steerAttention( );
			pointingState = false;
			break;

		default : throw new Error( );
	}

	return false;
};


/*
| The mouse wheel is being turned.
*/
def.proto._onMouseWheel =
	function(
		event
	)
{
	event.preventDefault( );

	const p =
		gleam_point.createXY(
			event.pageX - canvas.offsetLeft,
			event.pageY - canvas.offsetTop
		);

	let dir;

	if( event.wheelDelta !== undefined )
	{
		dir = event.wheelDelta > 0 ? 1 : -1;
	}
	else if( event.detail !== undefined )
	{
		dir = event.detail > 0 ? -1 : 1;
	}
	else
	{
		console.log( 'invalid wheel event' );
		return;
	}

	const shift = event.shiftKey;
	const ctrl = event.ctrlKey || event.metaKey;

	root.mousewheel( p, dir, shift, ctrl );

	this._pointingHover( p, shift, ctrl );
	this._steerAttention( );
};


/*
| The user is touching something ( on mobile devices )
*/
def.proto._onTouchStart =
	function(
		event
	)
{
	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 1 ) return false;

	const p =
		gleam_point.createXY(
			event.touches[ 0 ].pageX - canvas.offsetLeft,
			event.touches[ 0 ].pageY - canvas.offsetTop
		);

	const shift = event.shiftKey;
	const ctrl = event.ctrlKey || event.metaKey;

	this._probeClickDrag( p, shift, ctrl );

	return false;
};


/*
| The use is moving the touch ( on mobile devices )
*/
def.proto._onTouchMove =
	function(
		event
	)
{
	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 1 ) return false;

	const p =
		gleam_point.createXY(
			event.touches[ 0 ].pageX - canvas.offsetLeft,
			event.touches[ 0 ].pageY - canvas.offsetTop
		);

	const shift = event.shiftKey;
	const ctrl = event.ctrlKey || event.metaKey;

	switch( pointingState )
	{
		case false:

			this._pointingHover( p, shift, ctrl );

			break;

		case 'atween':
		{
			const dragbox = config.dragBox;

			if(
				( Math.abs( p.x - atweenPos.x ) > dragbox )
				|| ( Math.abs( p.y - atweenPos.y ) > dragbox )
			)
			{
				// moved out of dragbox -> start dragging
				clearTimeout( atweenTimer );
				pointingState = 'drag';
				root.dragStart( atweenPos, shift, ctrl );
				root.dragMove( p, shift, ctrl );
				system._repeatHover( );
				_resetAtweenState( );
				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				atweenMove = p;
			}

			break;
		}

		case 'drag':

			root.dragMove( p, shift, ctrl );
			system._repeatHover( );
			break;

		default : throw new Error( );
	}

	return true;
};


/*
| The using is lifting his/her finger ( on mobile devices)
*/
def.proto._onTouchEnd =
	function(
		event
	)
{
	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 0 ) return false;

	this._releaseEvents( );

	const p =
		gleam_point.createXY(
			event.changedTouches[ 0 ].pageX - canvas.offsetLeft,
			event.changedTouches[ 0 ].pageY - canvas.offsetTop
		);

	const shift = event.shiftKey;
	const ctrl = event.ctrlKey || event.metaKey;

	switch( pointingState )
	{
		case false :

			break;

		case 'atween' :

			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			clearTimeout( atweenTimer );
			root.click( p, shift, ctrl );
			this._pointingHover( p, shift, ctrl );
			this._steerAttention( );
			_resetAtweenState( );
			pointingState = false;

			break;

		case 'drag' :

			root.dragStop( p, shift, ctrl );
			this._pointingHover( p, shift, ctrl );
			this._steerAttention( );
			pointingState = false;
			break;

		default : throw new Error( );
	}

	return false;
};


/*
| Stops capturing all mouseevents
*/
def.proto._releaseEvents =
	function( )
{
	if ( this._useCapture ) { document.releaseCapture( canvas ); return; }

	document.onmouseup = undefined;
	document.onmousemove = undefined;
};


/*
| A special key is being pressed.
*/
def.proto._specialKey =
	function(
		keyCode,
		shift,
		ctrl
	)
{
	const key =
		ctrl
		? keyCodeNamesCtrl.get( keyCode )
		: keyCodeNames.get( keyCode  );

	if( !key ) return true;

	root.specialKey( key, shift, ctrl );
	system._repeatHover( );
	system._steerAttention( );

	return false;
};


/*
| A special key is being released.
*/
def.proto._releaseSpecialKey =
	function(
		keyCode,
		shift,
		ctrl
	)
{
	const key =
		ctrl
		? keyCodeNamesCtrl.get( keyCode )
		: keyCodeNames.get( keyCode  );

	if( !key ) return;

	root.releaseSpecialKey( key, shift, ctrl );
	system._repeatHover( );
	system._steerAttention( );
};



/*
| Checks if the hidden input field got data.
*/
def.proto._checkInput =
	function( )
{
	if( !root || failScreen ) return;

	let text = hiddenInput.value;
	if( text === '__' + inputVal ) return;
	// works around opera quirks inserting CR characters
	text = text.replace( /\r/g, '' );
	root.input( text.substr( 2 ) );
	system._repeatHover( );
	system._steerAttention( );
};


/*
| Initializes the system.
*/
def.static.init =
	function( )
{
	canvas = document.getElementById( 'canvas' );

	let display =
		gleam_impl.createAroundHTMLCanvas(
			canvas,
			gleam_size.wh( window.innerWidth, window.innerHeight ),
			pass,
			'rgb( 251, 251, 251 )',  // background
			window.devicePixelRatio || 1,
			'root', // debug tag
		);

	system =
		shell_system.create(
			'transmitter', transmitter,
			'_animationTransmitter', systemTransmitter( '_animation' ),
			'_checkInputTransmitter', systemTransmitter( '_checkInput' ),
			'_display', display,
			'_onAtweenTimeTransmitter', systemTransmitter( '_onAtweenTime' ),
			'_useCapture', !!canvas.setCapture
		);

	// hidden input that forwards all events
	hiddenInput = document.getElementById( 'input' );
	hiddenInput.onblur = systemTransmitter( '_onInputBlur' );
	hiddenInput.autocomplete = 'off';

	canvas.onmousedown = systemTransmitter( '_onMouseDown' );
	canvas.onmousemove = systemTransmitter( '_onMouseMove' );
	canvas.onmouseup = systemTransmitter( '_onMouseUp' );
	canvas.ontouchstart = systemTransmitter( '_onTouchStart' );
	canvas.ontouchmove = systemTransmitter( '_onTouchMove' );
	canvas.ontouchend = systemTransmitter( '_onTouchEnd' );
	canvas.onmousewheel = systemTransmitter( '_onMouseWheel' );

	// firefox wheel listening
	canvas.addEventListener( 'DOMMouseScroll', canvas.onmousewheel, false );

	// iPad sometimes starts just somewhere
	window.scrollTo( 0, 0 );

	window.onresize = systemTransmitter( '_onResize' );
	window.onfocus = systemTransmitter( '_onSystemFocus' );
	window.onblur = systemTransmitter( '_onSystemBlur' );
	document.onkeyup = systemTransmitter( '_onKeyUp' );
	document.onkeydown = systemTransmitter( '_onKeyDown' );
	document.onkeypress = systemTransmitter( '_onKeyPress' );
	document.oncontextmenu = systemTransmitter( '_onContextMenu' );

	system._restartCheckTimer( );

	shell_root.startup( system._display );
};


/*
| System starts up ( pages loades )
*/
def.static.startup =
	function( )
{
	window.root = undefined;
	window.system = undefined;

	const init = transmitter( shell_system.init, true );

	init( );
};


/*
| (Re)Starts the check timer
*/
def.proto._restartCheckTimer =
	function( )
{
	this._checkInput( );

	if( checkInputTimer ) clearInterval( checkInputTimer );

	// checks every half second.
	checkInputTimer = setInterval( this._checkInputTransmitter, 500 );
};


/*
| This is mainly used on the iPad.
|
| Checks if the virtual keyboard should be suggested
| and if takes care the caret is scrolled into
| visible screen area.
*/
def.proto._steerAttention =
	function( )
{
	let ac = root.attentionCenter;

	if( ac === undefined )
	{
		hiddenInput.style.top = '0';
		window.scrollTo( 0, 0 );
		hiddenInput.blur( );
	}
	else
	{
		ac = math.limit( 0, ac, root.viewSize.height - 15 );
		hiddenInput.style.top = ac + 'px';
		const clipboard = root.clipboard;
		system.setInput( clipboard );
		hiddenInput.focus( );
	}
};


} );
