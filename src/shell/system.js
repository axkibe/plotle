/*
| This is a wrapper around HTML5 browsers,
| creating a more comfortable interface for
| the shell.
*/


var
	config,
	euclid_size,
	gleam_display_canvas,
	gleam_impl,
	euclid_point,
	math_limit,
	root,
	shell_root,
	shell_system,
	startup,
	system,
	transmitter;


/*
| Currently only canvas is supported as display backend.
*/
gleam_impl = gleam_display_canvas;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Catches all error a function throws
| and coorects hover and attention steering.
*/
transmitter =
	function(
		func,        // event function to wrap
		nosteering   // if true it won't stear hovering/attention
	)
{
	return function( )
	{
		var
			message;

		if( failScreen ) return;

		if( config.devel && !config.debug.weinre )
		{
			func.apply( this, arguments );

			if( !nosteering )
			{
				system._repeatHover( );

				system._steerAttention( );
			}

			if( root ) root.draw();

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

			if( root ) root.draw();
		}
		catch( e )
		{
			try {
				message =
					[
						'OOPS! Internal failure, ',
						e.name, ': ',
						e.message, '\n\n',
						'stack: ',
						e.stack,
						'\n\n',
						'Please report to axkibe@gmail.com'
					].join('');

				if( !config.debug.weinre )
				{
					system.failScreen( message );
				}
				else
				{
					console.log( message );
				}
			}
			catch ( ee )
			{
				console.log( 'error in error:' + ee );
			}
		}
	};
};


var
	// atween is the state where the mouse button went down,
	// and its yet unsure if this is a click or drag.
	// if the mouse moves out of the atweenBox or the atweenTimer ticks its
	// a drag, if it goes up before either happens, its a click

	// status of ctrl when atween state starts.
	atweenCtrl,
	// move position where cursor moved to in atween state.
	atweenMove,
	// position where mouse went down.
	atweenPos,
	// status of shift when atween state starts.
	atweenShift,
	// timer of the atween state
	atweenTimer,

	// the canvas everything is drawn upon.
	canvas,

	// if true the system dropped down to show a fail screen
	failScreen,

	// the hidden input taking text input.
	hiddenInput,

	// hover is getting repeated by events that change
	// the root, so it can react properly.
	hoverCtrl,
	hoverP,
	hoverShift,
	inputVal,
	keyCodeNames,
	keyCodeNamesCtrl,
	lastSpecialKey,

	// current height of the main window
	mainWindowHeight,
	pointingState,
	prototype,
	settings,
	systemTransmitter;


atweenCtrl = false;

atweenShift = false;

failScreen = false;

hoverShift = false;

hoverCtrl = false;


/*
| The value expected to be in input.
| either nothing or the text selection.
| if it changes the user did something.
*/
inputVal = '';


/*
| Remembers last special key pressed, to hinder double events.
| Opera is behaving stupid here.
*/
lastSpecialKey = -1;


/*
| false, 'atween' or 'drag'
*/
pointingState = false;


keyCodeNames =
	{
		8 : 'backspace',
		9 : 'tab',
		13 : 'enter',
		16 : 'shift',
		17 : 'ctrl',
		27 : 'esc',
		33 : 'pageup',
		34 : 'pagedown',
		35 : 'end',
		36 : 'pos1',
		37 : 'left',
		38 : 'up',
		39 : 'right',
		40 : 'down',
		46 : 'del'
	};

keyCodeNamesCtrl =
	{
		16 : 'shift',
		17 : 'ctrl',
		65 : 'a',
		89 : 'y',
		90 : 'z',
		188 : ',',
		190 : '.'
	};

/**/if( FREEZE )
/**/{
/**/	Object.freeze( keyCodeNames );
/**/
/**/	Object.freeze( keyCodeNamesCtrl );
/**/}


/*
| Default system behavior settings
*/
settings =
	{
		// blink speed of the caret.
		caretBlinkSpeed : 530,

		// milliseconds after mouse down, dragging starts
		dragtime : 400,

		// pixels after mouse down and move, dragging starts
		dragbox : 10
	};

/**/if( FREEZE )
/**/{
/**/	Object.freeze( settings );
/**/}


/*
| Creates a catcher that calls a system function.
*/
systemTransmitter =
	function(
		funcName  // name of the function to call
	)
{
	return(
		transmitter(
			function( )
			{
				system[ funcName ].apply( system, arguments );
			},
			true
		)
	);
};


/*
| The system.
*/
shell_system =
	function( )
{
	if( system ) throw new Error( );

	canvas = document.getElementById( 'canvas' );

	this._display =
		gleam_impl.createAroundHTMLCanvas(
			canvas,
			'root',
			euclid_size.create(
				'height', window.innerHeight - 1,
				'width', window.innerWidth - 1
			),
			window.devicePixelRatio
		);

	// if true browser supports the setCapture() call
	// if false needs work around
	this._useCapture = !!canvas.setCapture;

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

	this._testInputTransmitter = systemTransmitter( '_testInput' );

	this._onAtweenTimeTransmitter = systemTransmitter( '_onAtweenTime' );

	this._blinkTransmitter = systemTransmitter( '_blink' );

	document.oncontextmenu = systemTransmitter( '_onContextMenu' );

	// the blink (and check input) timer
	this._blinkTimer = undefined;

	this.restartBlinker( );
};


prototype = shell_system.prototype;


/*
| Replaces the shell by a failscreen
*/
prototype.failScreen =
	function(
		message
	)
{
	var
		body,
		butReload,
		divContent,
		divMessage,
		divWrap;

	if( console )
	{
		console.log( 'failScreen', message );
	}

	if( failScreen ) return;

	failScreen = true;

	body = document.body;

	body.removeChild( canvas );

	body.removeChild( hiddenInput );

	divWrap = document.createElement( 'div' );

	divContent = document.createElement( 'div' ),

	divMessage = document.createElement( 'div' ),

	butReload = document.createElement( 'button' );

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

	butReload.onclick =
		function( )
	{
		location.reload( );
	};
};


/*
| Cancels a timer
*/
prototype.cancelTimer =
	function( id )
{
	return window.clearTimeout( id );
};


/*
| (Re)Starts the blink timer
*/
prototype.restartBlinker =
	function( )
{
	// double uses the blink timer
	this._testInput( );

	if( this._blinkTimer )
	{
		clearInterval( this._blinkTimer );
	}

	this._blinkTimer =
		setInterval(
			this._blinkTransmitter,
			settings.caretBlinkSpeed
		);
};


/*
| Sets the hidden input field (text selection)
*/
prototype.setInput =
	function(
		text
	)
{
	inputVal = text;

	hiddenInput.value = '88' + text;

	hiddenInput.setSelectionRange( 2, 2 + text.length );
};


/*
| Sets a timer with an error catcher
*/
prototype.setTimer =
	function(
		time,
		callback
	)
{
	return window.setTimeout( transmitter( callback, true ), time );
};


/*
| Pixels to scroll on a wheel event
*/
prototype.textWheelSpeed = 12 * 5;


// ---------------------------


/*
| Blinks the caret
*/
prototype._blink =
	function( )
{
	if( failScreen ) return;

	// also looks into the hidden input field,
	// maybe the user pasted something using the browser menu
	this._testInput( );
};


var
_resetAtweenState =
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
prototype._onAtweenTime =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( pointingState !== 'atween' )
/**/	{
/**/		throw new Error( );
/**/	}
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
prototype._onInputBlur =
	function(
		// event
	)
{
	window.scrollTo( 0, 0 );
};



/*
| Lost focus.
*/
prototype._onSystemBlur =
	function(
		// event
	)
{
	root.create( 'systemFocus', false );
};



/*
| Got focus.
*/
prototype._onSystemFocus =
	function(
		// event
	)
{
	root.create( 'systemFocus', true );
};


/*
| Window is being resized.
*/
prototype._onResize =
	function(
		// event
	)
{
	if( !root ) return;

	root.resize( window.innerWidth - 1, window.innerHeight - 1 );
};


/*
| Captures all mouseevents event beyond the canvas (for dragging)
*/
prototype._captureEvents =
	function( )
{
	if( this._useCapture )
	{
		canvas.setCapture( canvas );

		return;
	}

	document.onmouseup = canvas.onmouseup;

	document.onmousemove = canvas.onmousemove;
};


/*
| Key down on hidden input field.
| Used when suggesting a keyboard.
*/
prototype._onKeyDown =
	function(
		event
	)
{
	var
		kcode;

	kcode =
	lastSpecialKey =
		event.keyCode;

	if(
		!this._specialKey(
			kcode,
			event.shiftKey,
			event.ctrlKey || event.metaKey
		)
	)
	{
		event.preventDefault( );
	}
};


/*
| Hidden input key press.
*/
prototype._onKeyPress =
	function(
		event
	)
{
	var
		ctrl,
		ew,
		kcode,
		shift;

	ew = event.which;

	kcode = event.keyCode;

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	if(
		( ( kcode > 0 && kcode < 32) || ew === 0)
		&& lastSpecialKey !== kcode
	)
	{
		lastSpecialKey = -1;

		return this._specialKey( kcode, shift, ctrl );
	}

	lastSpecialKey = -1;

	this._testInput( );

	this.setTimer( 0, this._testInputTransmitter );

	return true;
};


/*
| Hidden input key up.
*/
prototype._onKeyUp =
	function( )
{
	this._testInput( );

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
prototype._onContextMenu =
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
prototype._onMouseDown =
	function(
		event
	)
{
	var
		ctrl,
		p,
		shift;

	event.preventDefault( );

	if(
		event.button !== undefined
		&&
		event.button !== 0
	)
	{
		return;
	}

	// Opera requires focusing the window first
	//window.focus( );

	p =
		euclid_point.create(
			'x', event.pageX - canvas.offsetLeft,
			'y', event.pageY - canvas.offsetTop
		);

	shift = event.shiftKey,

	ctrl = event.ctrlKey || event.metaKey;

	pointingState = 'atween';

	atweenPos = p;

	atweenMove = p;

	atweenShift = shift;

	atweenCtrl = ctrl;

	atweenTimer =
		this.setTimer(
			settings.dragtime,
			this._onAtweenTimeTransmitter
		);

	this._pointingHover( p, shift, ctrl );

	return false;
};


/*
| Handles hovering of the pointing device.
*/
prototype._pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		cursor;

	hoverP = p;

	hoverShift = shift;

	hoverCtrl = ctrl;

	cursor = root.pointingHover( p, shift, ctrl );

	this._setCursor( cursor );

};


/*
| Sets the cursor
*/
prototype._setCursor =
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
prototype._repeatHover =
	function( )
{
	if( !hoverP ) return;

	this._setCursor( root.pointingHover( hoverP, hoverShift, hoverCtrl ) );
};


/*
| Mouse move event.
*/
prototype._onMouseMove =
	function(
		event
	)
{
	var
		ctrl,
		cursor,
		dragbox,
		p,
		shift;

	p =
		euclid_point.create(
			'x', event.pageX - canvas.offsetLeft,
			'y', event.pageY - canvas.offsetTop
		);

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	cursor = undefined;

	switch( pointingState )
	{
		case false :

			this._pointingHover( p, shift, ctrl );

			break;

		case 'atween' :

			dragbox = settings.dragbox;

			if(
				( Math.abs( p.x - atweenPos.x ) > dragbox )
				||
				( Math.abs( p.y - atweenPos.y ) > dragbox )
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

		case 'drag':

			root.dragMove( p, shift, ctrl );

			system._repeatHover( );

			break;

		default :

			throw new Error( );

	}

	this._setCursor( cursor );

	return true;
};


/*
| Mouse up event.
*/
prototype._onMouseUp =
	function(
		event
	)
{
	var
		ctrl,
		p,
		shift;

	event.preventDefault( );

	this._releaseEvents( );

	p =
		euclid_point.create(
			'x', event.pageX - canvas.offsetLeft,
			'y', event.pageY - canvas.offsetTop
		);

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

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

		default :

			throw new Error( );
	}

	return false;
};


/*
| The mouse wheel is being turned.
*/
prototype._onMouseWheel =
	function(
		event
	)
{
	var
		dir,
		p;

	event.preventDefault( );

	p =
		euclid_point.create(
			'x', event.pageX - canvas.offsetLeft,
			'y', event.pageY - canvas.offsetTop
		);

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

	root.mousewheel( p, dir, event.shiftKey, event.ctrlKey || event.metaKey );
};


/*
| The user is touching something ( on mobile devices )
*/
prototype._onTouchStart =
	function(
		event
	)
{
	var
		p,
		shift,
		ctrl;

	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 1 )
	{
		return false;
	}

	p =
		euclid_point.create(
			'x', event.touches[ 0 ].pageX - canvas.offsetLeft,
			'y', event.touches[ 0 ].pageY - canvas.offsetTop
		),

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	pointingState = 'atween';

	atweenPos = p;

	atweenMove = p;

	atweenShift = shift;

	atweenCtrl = ctrl;

	atweenTimer = this.setTimer( settings.dragtime, this._onAtweenTimeTransmitter );

	return false;
};


/*
| The use is moving the touch ( on mobile devices )
*/
prototype._onTouchMove =
	function(
		event
	)
{
	var
		ctrl,
		dragbox,
		p,
		shift;

	event.preventDefault();

	// for now ignore multi-touches
	if( event.touches.length !== 1 ) return false;

	p =
		euclid_point.create(
			'x', event.touches[ 0 ].pageX - canvas.offsetLeft,
			'y', event.touches[ 0 ].pageY - canvas.offsetTop
		),

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	switch( pointingState )
	{
		case false:

			this._pointingHover( p, shift, ctrl );

			break;

		case 'atween':

			dragbox = settings.dragbox;

			if(
				( Math.abs( p.x - atweenPos.x ) > dragbox )
				||
				( Math.abs( p.y - atweenPos.y ) > dragbox )
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

		case 'drag':

			root.dragMove( p, shift, ctrl );

			system._repeatHover( );

			break;

		default :

			throw new Error( );

	}

	return true;
};


/*
| The using is lifting his/her finger ( on mobile devices)
*/
prototype._onTouchEnd =
	function(
		event
	)
{
	var
		p,
		shift,
		ctrl;

	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 0 )
	{
		return false;
	}

	this._releaseEvents( );

	p =
		euclid_point.create(
			'x',
				event.changedTouches[ 0 ].pageX -
				canvas.offsetLeft,
			'y',
				event.changedTouches[ 0 ].pageY -
				canvas.offsetTop
		);

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

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

		default :

			throw new Error( );
	}

	return false;
};


/*
| Stops capturing all mouseevents
*/
prototype._releaseEvents =
	function( )
{
	if ( this._useCapture )
	{
		document.releaseCapture( canvas );

		return;
	}

	document.onmouseup = undefined;

	document.onmousemove = undefined;
};


/*
| A special key is being pressed.
*/
prototype._specialKey =
	function(
		keyCode,
		shift,
		ctrl
	)
{
	var
		key;

	if( ctrl )
	{
		key = keyCodeNamesCtrl[ keyCode ];
	}
	else
	{
		key = keyCodeNames[ keyCode ];
	}

	if( !key ) return true;

	root.specialKey( key, shift, ctrl );

	system._repeatHover( );

	system._steerAttention( );

	return false;
};


/*
| A special key is being released.
*/
prototype._releaseSpecialKey =
	function(
		keyCode,
		shift,
		ctrl
	)
{
	var
		key;

	if( ctrl )
	{
		key = keyCodeNamesCtrl[ keyCode ];
	}
	else
	{
		key = keyCodeNames[ keyCode ];
	}

	if( !key ) return;

	root.releaseSpecialKey( key, shift, ctrl );

	system._repeatHover( );

	system._steerAttention( );
};



/*
| Tests if the hidden input field got data
*/
prototype._testInput =
	function( )
{
	var
		text;

	text = hiddenInput.value;

	if( text === '88' + inputVal || !root )
	{
		return;
	}

	// works around opera quirks inserting CR characters
	text = text.replace( /\r/g, '' );

	root.input( text.substr( 2 ) );

	system._repeatHover( );

	system._steerAttention( );
};


/*
| This is mainly used on the iPad.
|
| Checks if the virtual keyboard should be suggested
| and if takes care the caret is scrolled into
| visible screen area
*/
prototype._steerAttention =
	function( )
{
	var
		ac,
		clipboard;

	ac = root.attentionCenter;

	if( ac === undefined )
	{
		hiddenInput.style.top = '0';

		window.scrollTo( 0, 0 );

		hiddenInput.blur( );
	}
	else
	{
		ac = math_limit( 0, ac, mainWindowHeight - 15 );

		hiddenInput.style.top = ac + 'px';

		clipboard = root.clipboard;

		system.setInput( clipboard );

		hiddenInput.focus( );
	}
};


/*
| System starts up ( pages loades )
*/
startup = function( )
{
	var
		start;

	start =
		transmitter(
			function( )
			{
				system = new shell_system( );

				shell_root.startup( system._display );
			},
			true
		);

	if( !config.debug.weinre )
	{
		start( );
	}
	else
	{
		// gives weinre a moment to set itself up
		window.setTimeout( start, 1500 );
	}
};

} )( );
