/*
| This is a wrapper around HTML5 browsers,
| creating a more comfortable interface for
| the shell.
*/


/*
| Export
*/
var
	catcher,
	config,
	euclid_display,
	euclid_point,
	jools,
	root,
	shell_root,
	startup,
	system;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	_catcher;


/*
| Catches all errors a function throws if config.devel is set.
*/
_catcher =
	function(
		func
	)
{
	return function( )
	{
		var
			message;

		if( config.devel && !config.debug.weinre )
		{
			func.apply( this, arguments );

			if( root )
			{
				root.draw( );

				// FIXME make a root.clipboard lazyValue and
				// use it here and below
				system.setInput( root._mark ? root._mark.clipboard : '' );
			}

			return;
		}

		try
		{
			func.apply( this, arguments );

			if( root )
			{
				root.draw( );

				system.setInput( root._mark ? root._mark.clipboard : '' );
			}
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
	//
	// timer of the atween state
	_atweenTimer = null,

	// status of shift / ctrl when atween state starte
	_atweenShift = false,
	_atweenCtrl = false,

	// position where mouse went down
	_atweenPos = null,

	// move position where cursor moved to in atween state
	_atweenMove = null,

	// hover is getting repeated by events that change
	// the root, so it can react properly
	_hoverP = null,
	_hoverShift = false,
	_hoverCtrl = false,

	// remembers last special key pressed, to hinder double events.
	// Opera is behaving stupid here.
	_lastSpecialKey = -1,

	// if true the system dropped down to show
	// a fail screen
	_failScreen = false,

	// the main canvas everything is
	// drawn upon
	_canvas,

	// The value expected to be in input.
	// either nothing or the text selection.
	// if it changes the user did something.
	_inputVal =
		'',

	// the hidden input taking text input
	_hiddenInput,

	// current height of the main window
	_height,

	// false, 'atween' or 'drag'
	_pointingState = false;

/*
| This public version of the catcher is
| to be used by asynchronous events
| (especially network events)
*/
catcher =
	function( func )
{
	return function( )
	{
		var message;

		if( _failScreen )
		{
			return;
		}

		if( config.devel && !config.debug.weinre )
		{
			func.apply( this, arguments );

			system._repeatHover( );

			system._steerAttention( );

			if( root )
			{
				root.draw( );

				system.setInput( root._mark ? root._mark.clipboard : '' );
			}

			return;
		}

		try
		{
			func.apply( this, arguments );

			system._repeatHover( );

			system._steerAttention( );

			if( root )
			{
				root.draw( );

				system.setInput( root._mark ? root._mark.clipboard : '' );
			}
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


/*
| Creates a catcher that calls a system function.
*/
var _systemCatcher =
	function(
		funcName  // name of the function to call
	)
{
	return(
		_catcher(
			function( )
			{
				system[ funcName ].apply( system, arguments );
			}
		)
	);
};



/*
| The system.
*/
var shell_system =
	function( )
{
	if( system )
	{
		throw new Error( );
	}

	_canvas = document.getElementById( 'canvas' );

	_canvas.width = window.innerWidth - 1;

	_canvas.height = window.innerHeight - 1;

	this._display = euclid_display.createAroundHTMLCanvas( _canvas );

	// if true browser supports the setCapture() call
	// if false needs work around
	this._useCapture = !!_canvas.setCapture;

	// hidden input that forwards all events
	_hiddenInput = document.getElementById( 'input' );

	// remembers last pointing device hovering state.

	_canvas.onmousedown = _systemCatcher( '_onMouseDown' );

	_canvas.onmousemove = _systemCatcher( '_onMouseMove' );

	_canvas.onmouseup = _systemCatcher( '_onMouseUp' );

	_canvas.ontouchstart = _systemCatcher( '_onTouchStart' );

	_canvas.ontouchmove = _systemCatcher( '_onTouchMove' );

	_canvas.ontouchend = _systemCatcher( '_onTouchEnd' );

	_canvas.onmousewheel = _systemCatcher( '_onMouseWheel' );

	// firefox wheel listening
	_canvas.addEventListener(
		'DOMMouseScroll',
		_canvas.onmousewheel,
		false
	);

	// iPad sometimes starts just somewhere
	window.scrollTo( 0, 0 );

	window.onresize = _systemCatcher( '_onResize' );

	window.onfocus = _systemCatcher( '_onSystemFocus' );

	window.onblur = _systemCatcher( '_onSystemBlur' );

	_hiddenInput.onblur = _systemCatcher( '_onHiddenInputBlur' );

	document.onkeyup = _systemCatcher( '_onKeyUp' );

	document.onkeydown = _systemCatcher( '_onKeyDown' );

	document.onkeypress = _systemCatcher( '_onKeyPress' );

	this._testInputCatcher = _systemCatcher( '_testInput' );

	this._onAtweenTimeCatcher = _systemCatcher( '_onAtweenTime' );

	this._blinkCatcher = _systemCatcher( '_blink' );

	document.oncontextmenu = _systemCatcher( '_onContextMenu' );

	// the blink (and check input) timer
	this._blinkTimer = null;

	_canvas.focus( );

	this.restartBlinker( );
};


/*
| Default system behavior settings
*/
var _settings =
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
/**/	Object.freeze( _settings );
/**/}


/*
| Replaces the shell by a failscreen
*/
shell_system.prototype.failScreen =
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

	if( _failScreen )
	{
		return;
	}

	_failScreen = true;

	body = document.body;

	body.removeChild( _canvas );

	body.removeChild( _hiddenInput );

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
shell_system.prototype.cancelTimer =
	function( id )
{
	return window.clearTimeout( id );
};


/*
| (Re)Starts the blink timer
*/
shell_system.prototype.restartBlinker =
	function( )
{
	// double uses the blink timer
	this._testInput( );

	if( this._blinkTimer )
	{
		clearInterval( this._blinkTimer );
	}

	this._blinkTimer = setInterval(
		this._blinkCatcher,
		_settings.caretBlinkSpeed
	);
};


/*
| Sets the hidden input field (text selection)
*/
shell_system.prototype.setInput =
	function(
		text
	)
{
	_inputVal =
	_hiddenInput.value =
		'' + text;

	_hiddenInput.selectionStart = 0;

	if( text !== '' )
	{
		_hiddenInput.selectionEnd = text.length;
	}
};


/*
| Sets a timer with an error catcher
*/
shell_system.prototype.setTimer =
	function(
		time,
		callback
	)
{
	return window.setTimeout( _catcher( callback ), time );
};


/*
| Pixels to scroll on a wheel event
*/
shell_system.prototype.textWheelSpeed =
	12 * 5;


// ---------------------------


/*
| Blinks the caret
*/
shell_system.prototype._blink =
	function( )
{
	if( _failScreen )
	{
		return;
	}

	// also looks into the hidden input field,
	// maybe the user pasted something using the browser menu
	this._testInput( );
};


var
_resetAtweenState =
	function( )
{
	_atweenTimer = null;

	_atweenShift = false;

	_atweenCtrl = false;

	_atweenPos = null;

	_atweenMove = null;
};

/*
| timeout after mouse down so dragging starts
*/
shell_system.prototype._onAtweenTime =
	function( )
{
	var
		cursor;

/**/if( CHECK )
/**/{
/**/	if( _pointingState !== 'atween' )
/**/	{
/**/		jools.log(
/**/			'warn',
/**/			'dragTime() in wrong action mode'
/**/		);
/**/
/**/		return;
/**/	}
/**/}

	_pointingState = 'drag';

	root.dragStart( _atweenPos, _atweenShift, _atweenCtrl );

	cursor = root.dragMove( _atweenMove, _atweenShift, _atweenCtrl );

	_resetAtweenState( );

	if( cursor !== null )
	{
		_canvas.style.cursor = cursor;
	}
};


/*
| Lost focus.
*/
shell_system.prototype._onSystemBlur =
	function(
		// event
	)
{
	root.setFocus( false );
};


shell_system.prototype._onHiddenInputBlur =
	function(
		// event
	)
{
	// resets the view on ipad
	window.scrollTo( 0, 0 );
};


/*
| Got focus.
*/
shell_system.prototype._onSystemFocus =
	function(
		// event
	)
{
	root.setFocus( true );
};


/*
| Window is being resized.
*/
shell_system.prototype._onResize =
	function(
		// event
	)
{
	var
		display;

	_height = window.innerHeight - 1;

	display =
	this._display =
		this._display.create(
			'width', window.innerWidth - 1,
			'height', _height
		);

	if( root )
	{
		root.resize( display );
	}
};


/*
| Captures all mouseevents event beyond the canvas (for dragging)
*/
shell_system.prototype._captureEvents =
	function( )
{
	if( this._useCapture )
	{
		_canvas.setCapture( _canvas );

		return;
	}

	document.onmouseup = _canvas.onmouseup;

	document.onmousemove = _canvas.onmousemove;
};


/*
| Key down on hidden input field.
| Used when suggesting a keyboard.
*/
shell_system.prototype._onKeyDown =
	function(
		event
	)
{
	var
		kcode;

	kcode =
	_lastSpecialKey =
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
shell_system.prototype._onKeyPress =
	function(
		event
	)
{
	var
		ew =
			event.which,

		kcode =
			event.keyCode,

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey;

	if (
		(
			( kcode > 0 && kcode < 32)
			|| ew === 0
		)
		&&
		_lastSpecialKey !== kcode
	)
	{
		_lastSpecialKey = -1;

		return this._specialKey( kcode, shift, ctrl );
	}
	else
	{
		if( !root.suggestingKeyboard( ) )
		{
			root.input( String.fromCharCode( kcode ) );
		}
	}

	_lastSpecialKey = -1;

	this._testInput( );

	this.setTimer( 0, this._testInputCatcher );

	return true;
};


/*
| Hidden input key up.
*/
shell_system.prototype._onKeyUp =
	function(
		// event
	)
{
	this._testInput( );

	return true;
};


/*
| Disables context menues.
*/
shell_system.prototype._onContextMenu =
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
shell_system.prototype._onMouseDown =
	function(
		event
	)
{
	var
		canvas,
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
	window.focus( );

	canvas = _canvas;

	p =
		euclid_point.create(
			'x', event.pageX - canvas.offsetLeft,
			'y', event.pageY - canvas.offsetTop
		);

	shift = event.shiftKey,

	ctrl = event.ctrlKey || event.metaKey;

	_pointingState = 'atween';

	_atweenPos = p;

	_atweenMove = p;

	_atweenShift = shift;

	_atweenCtrl = ctrl;

	_atweenTimer =
		this.setTimer(
			_settings.dragtime,
			this._onAtweenTimeCatcher
		);

	this._pointingHover( p, shift, ctrl );

	return false;
};


/*
| Handles hovering of the pointing device.
*/
shell_system.prototype._pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		cursor;

	_hoverP = p;

	_hoverShift = shift;

	_hoverCtrl = ctrl;

	cursor = root.pointingHover( p, shift, ctrl );

	if( cursor !== null )
	{
		_canvas.style.cursor = cursor;
	}
};


/*
| Repeats the last hover.
|
| Used by asyncEvents so the hoveringState is corrected.
*/
shell_system.prototype._repeatHover =
	function( )
{
	var
		cursor;

	if( !_hoverP )
	{
		return;
	}

	cursor = root.pointingHover( _hoverP, _hoverShift, _hoverCtrl );

	if( cursor !== null )
	{
		_canvas.style.cursor = cursor;
	}
};


/*
| Mouse move event.
*/
shell_system.prototype._onMouseMove =
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
			'x', event.pageX - _canvas.offsetLeft,
			'y', event.pageY - _canvas.offsetTop
		);

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	cursor = null;

	switch( _pointingState )
	{
		case false :

			this._pointingHover(
				p,
				shift,
				ctrl
			);

			break;

		case 'atween' :

			dragbox = _settings.dragbox;

			if(
				( Math.abs( p.x - _atweenPos.x ) > dragbox )
				||
				( Math.abs( p.y - _atweenPos.y ) > dragbox )
			)
			{
				// moved out of dragbox -> start dragging
				clearTimeout( _atweenTimer );

				_pointingState = 'drag';

				root.dragStart( _atweenPos, shift, ctrl );

				cursor = root.dragMove( p, shift, ctrl );

				_resetAtweenState( );

				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				_atweenMove = p;
			}
			break;

		case 'drag':

			cursor = root.dragMove( p, shift, ctrl );

			break;

		default :

			throw new Error( );

	}

	if( cursor !== null )
	{
		_canvas.style.cursor =
			cursor;
	}

	return true;
};


/*
| Mouse up event.
*/
shell_system.prototype._onMouseUp =
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
			'x', event.pageX - _canvas.offsetLeft,
			'y', event.pageY - _canvas.offsetTop
		);

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	switch( _pointingState )
	{
		case false :

			break;

		case 'atween' :

			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			clearTimeout( _atweenTimer );

			root.click( p, shift, ctrl );

			this._pointingHover( p, shift, ctrl );

			this._steerAttention( );

			_resetAtweenState( );

			_pointingState = false;

			break;

		case 'drag' :

			root.dragStop( p, shift, ctrl );

			this._pointingHover( p, shift, ctrl );

			this._steerAttention( );

			_pointingState = false;

			break;

		default :

			throw new Error( );
	}

	return false;
};


/*
| The mouse wheel is being turned.
*/
shell_system.prototype._onMouseWheel =
	function(
		event
	)
{
	var
		dir,
		p;

	p =
		euclid_point.create(
			'x', event.pageX - _canvas.offsetLeft,
			'y', event.pageY - _canvas.offsetTop
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
		jools.log(
			'warn',
			'invalid wheel event'
		);

		return;
	}

	root.mousewheel(
		p,
		dir,
		event.shiftKey,
		event.ctrlKey || event.metaKey
	);
};


/*
| The user is touching something ( on mobile devices )
*/
shell_system.prototype._onTouchStart =
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
			'x', event.pageX - _canvas.offsetLeft,
			'y', event.pageY - _canvas.offsetTop
		),

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	_pointingState = 'atween';

	_atweenPos = p;

	_atweenMove = p;

	_atweenShift = shift;

	_atweenCtrl = ctrl;

	_atweenTimer =
		this.setTimer(
			_settings.dragtime,
			this._onAtweenTimeCatcher
		);

	return false;
};


/*
| The use is moving the touch ( on mobile devices )
*/
shell_system.prototype._onTouchMove =
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

	event.preventDefault();

	// for now ignore multi-touches
	if( event.touches.length !== 1 )
	{
		return false;
	}

	p =
		euclid_point.create(
			'x', event.pageX - _canvas.offsetLeft,
			'y', event.pageY - _canvas.offsetTop
		),

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	cursor = null;

	switch( _pointingState )
	{
		case false:

			this._pointingHover( p, shift, ctrl );

			break;

		case 'atween':

			dragbox = _settings.dragbox;

			if(
				( Math.abs( p.x - _atweenPos.x ) > dragbox )
				||
				( Math.abs( p.y - _atweenPos.y ) > dragbox )
			)
			{
				// moved out of dragbox -> start dragging
				clearTimeout( _atweenTimer );

				_pointingState = 'drag';

				root.dragStart( _atweenPos, shift, ctrl );

				cursor = root.dragMove( p, shift, ctrl );

				_resetAtweenState( );

				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				_atweenMove = p;
			}

			break;

		case 'drag':

			cursor = root.dragMove( p, shift, ctrl );

			break;

		default :

			throw new Error( );

	}

	return true;
};


/*
| The using is lifting his/her finger ( on mobile devices)
*/
shell_system.prototype._onTouchEnd =
	function( event )
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
				_canvas.offsetLeft,
			'y',
				event.changedTouches[ 0 ].pageY -
				_canvas.offsetTop
		);

	shift = event.shiftKey;

	ctrl = event.ctrlKey || event.metaKey;

	switch( _pointingState )
	{
		case false :

			break;

		case 'atween' :

			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.

			clearTimeout( _atweenTimer );

			root.click( p, shift, ctrl );

			this._pointingHover( p, shift, ctrl );

			this._steerAttention( );

			_resetAtweenState( );

			_pointingState = false;

			break;

		case 'drag' :

			root.dragStop(
				p,
				shift,
				ctrl
			);

			this._pointingHover( p, shift, ctrl );

			this._steerAttention( );

			_pointingState = false;

			break;

		default :

			throw new Error( );
	}

	return false;
};


/*
| Stops capturing all mouseevents
*/
shell_system.prototype._releaseEvents =
	function( )
{
	if ( this._useCapture )
	{
		document.releaseCapture( _canvas );

		return;
	}

	document.onmouseup =
		null;
	document.onmousemove =
		null;
};


/*
| A special key is being pressed.
*/
shell_system.prototype._specialKey =
	function(
		keyCode,
		shift,
		ctrl
	)
{
	var key =
		null;

	if( ctrl )
	{
		switch( keyCode )
		{
			case 65 :

				key =
					'a';

				break;

			case 89 :

				key =
					'y';

				break;

			case 90 :

				key =
					'z';

				break;

			case 188 :

				key =
					',';

				break;

			case 190 :

				key =
					'.';

				break;
		}
	}
	else
	{
		// FIXME make this a table
		switch( keyCode )
		{
			case  8 :

				key = 'backspace';

				break;

			case  9 :

				key = 'tab';

				break;

			case 13 :

				key = 'enter';

				break;

			case 27 :

				key = 'esc';

				break;

			case 33 :

				key = 'pageup';

				break;

			case 34 :

				key = 'pagedown';

				break;

			case 35 :

				key = 'end';

				break;

			case 36 :

				key = 'pos1';

				break;

			case 37 :

				key = 'left';

				break;

			case 38 :

				key = 'up';

				break;

			case 39 :

				key = 'right';

				break;

			case 40 :

				key = 'down';

				break;

			case 46 :

				key = 'del';

				break;
		}
	}

	if( key === null )
	{
		return true;
	}

	root.specialKey( key, shift, ctrl );

	this._steerAttention( );

	return false;
};


/*
| Tests if the hidden input field got data
*/
shell_system.prototype._testInput =
	function( )
{
	var
		hi,
		text;

	hi = _hiddenInput;

	text = hi.value;

	// works around opera quirks inserting CR characters
	text = text.replace( /\r/g, '' );

	if( text === _inputVal || !root )
	{
		return;
	}

	hi.value =
	_inputVal =
		'';

	hi.selectionStart = 0;

	root.input( text );

	this._steerAttention( );
};


/*
| This is mainly used on the iPad.
|
| Checks if the virtual keyboard should be suggested
| and if takes care the caret is scrolled into
| visible screen area
*/
shell_system.prototype._steerAttention =
	function( )
{
	var
		ac;

	ac = root.attentionCenter;

	if( ac === null )
	{
		_hiddenInput.style.top = '0';
	}
	else
	{
		ac =
			jools.limit(
				0,
				ac,
				_height - 15
			);

		_hiddenInput.style.top = ac + 'px';
	}

	if( root.suggestingKeyboard( ) )
	{
		_hiddenInput.focus( );

		if( _hiddenInput.scrollIntoViewIfNeeded )
		{
			_hiddenInput.scrollIntoViewIfNeeded( true );
		}
	}
	else
	{
		_canvas.focus( );
	}
};


/*
| System starts up ( pages loades )
*/
startup = function( )
{
	var start;

	start =
		_catcher(
			function( )
			{
				system = new shell_system( );

				shell_root.startup( system._display );

				// FIXME work on IOS
				_hiddenInput.focus( );
			}
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
