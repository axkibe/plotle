/*
| This is a wrapper around HTML5 browsers,
| creating a more comfortable interface for
| meshcraft shell.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	catcher,
	system,
	startup;


/*
| Imports
*/
var
	config,
	Euclid,
	Jools,
	Shell,
	shell;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Catches all errors a function throws if config.devel is set.
*/
catcher =
	function(
		func
	)
{
	return function( )
	{
		var message;

		if(
			config.devel &&
			!config.debug.weinre
		)
		{
			return func.apply( this, arguments );
		}

		try
		{
			func.apply( this, arguments );
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
	_pointingState =
		false;

/*
| Creates a catcher that calls a system function.
*/
var _systemCatcher =
	function(
		funcName  // name of the function to call	
	)
{
	return (
		function( )
		{
			catcher( system[ funcName ].apply( system, arguments ) );
		}
	);
};



/*
| The system.
*/
var System =
	function( )
{
	if( system )
	{
		throw new Error( );
	}

	_canvas = document.getElementById( 'canvas' );

	_height = window.innerHeight - 1;

	this._fabric =
		Euclid.Fabric.Create(
			'canvas',
				_canvas,
			'width',
				window.innerWidth - 1,
			'height',
				_height
		);

	// if true browser supports the setCapture() call
	// if false needs work around
	this._useCapture =
		!!_canvas.setCapture;

	// atween is the state where the mouse button went down,
	// and its yet unsure if this is a click or drag.
	// if the mouse moves out of the atweenBox or the atweenTimer ticks its
	// a drag, if it goes up before either happens, its a click

	this._$atween =
		Jools.immute({
			// timer for atween state
			timer :
				null,

			// position mouse button went down
			pos :
				null,

			// latest mouse position seen in atween state
			$move :
				null,

			// shift key in atween state
			shift :
				null,

			// ctrl  key in atween state
			ctrl :
				null
		});

	// hidden input that forwards all events
	_hiddenInput = document.getElementById( 'input' );

	// remembers last special key pressed, to hinder double events.
	// Opera is behaving stupid here.
	this._$lastSpecialKey = -1;

	// remembers last pointing device hovering state.
	this._$hover = null;

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
	Jools.immute(
		{
			// blink speed of the caret.
			caretBlinkSpeed :
				530,

			// milliseconds after mouse down, dragging starts
			dragtime :
				400,

			// pixels after mouse down and move, dragging starts
			dragbox :
				10
		}
	);


/*
| An asyncronous event happened
|
| For example:
|   message
|   onArriveAtSpace,
|   update
*/
System.prototype.asyncEvent =
	function(
		eventName,
		a1,
		a2,
		a3,
		a4
	)
{
	if( _failScreen )
	{
		return;
	}

	shell[ eventName ]( a1, a2, a3, a4 );

	this._repeatHover( );

	this._steerAttention( );
};


/*
| Replaces the shell by a failscreen
*/
System.prototype.failScreen =
	function(
		message
	)
{
	var body;

	if( console )
	{
		console.log(
			'failScreen',
			message
		);
	}

	if( _failScreen )
	{
		return;
	}

	_failScreen = true;

	body = document.body;

	body.removeChild( _canvas );

	body.removeChild( _hiddenInput );

	var
		divWrap =
			document.createElement( 'div' ),

		divContent =
			document.createElement( 'div' ),

		divMessage =
			document.createElement( 'div' ),

		butReload =
			document.createElement( 'button' );


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
System.prototype.cancelTimer =
	function( id )
{
	return window.clearTimeout( id );
};


/*
| (Re)Starts the blink timer
*/
System.prototype.restartBlinker =
	function( )
{
	// double uses the blink timer
	this._testInput( );

	if( this._blinkTimer )
	{
		clearInterval(
			this._blinkTimer
		);
	}

	this._blinkTimer = setInterval(
		this._blinkCatcher,
		_settings.caretBlinkSpeed
	);
};


/*
| Sets the hidden input field (text selection)
*/
System.prototype.setInput =
	function(
		text
	)
{
	// TODO
	var
		hi =
			_hiddenInput;

	hi.value =
	_inputVal =
		'' + text;

	hi.selectionStart =
		0;

	if( text !== '' )
	{
		hi.selectionEnd =
			text.length;
	}
};


/*
| Sets a timer with an error catcher
*/
System.prototype.setTimer =
	function(
		time,
		callback
	)
{
	return window.setTimeout(
		catcher(
			callback
		),
		time
	);
};


/*
| Pixels to scroll on a wheel event
*/
System.prototype.textWheelSpeed =
	12 * 5;


// ---------------------------


/*
| Blinks the caret
*/
System.prototype._blink =
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


/*
| timeout after mouse down so dragging starts
*/
System.prototype._onAtweenTime =
	function( )
{
	var
		atween,
		cursor;

/**/if( CHECK )
/**/{
/**/	if( _pointingState !== 'atween' )
/**/	{
/**/		Jools.log(
/**/			'warn',
/**/			'dragTime() in wrong action mode'
/**/	);
/**/
/**/		return;
/**/	}
/**/}

	atween = this._$atween;

	_pointingState = 'drag';

	shell.dragStart(
		atween.pos,
		atween.shift,
		atween.ctrl
	);

	cursor =
		shell.dragMove(
			atween.$move,
			atween.shift,
			atween.ctrl
		);

	this._$atween = null;

	if( cursor !== null )
	{
		_canvas.style.cursor = cursor;
	}
};


/*
| The meshcraft system lost focus
*/
System.prototype._onSystemBlur =
	function(
		// event
	)
{
	shell.setFocus( false );
};


System.prototype._onHiddenInputBlur =
	function(
		// event
	)
{
	// resets the view on ipad
	window.scrollTo( 0, 0 );
};


/*
| The meshcraft system got focus
*/
System.prototype._onSystemFocus =
	function(
		// event
	)
{
	shell.setFocus( true );
};


/*
| View window is being resized.
*/
System.prototype._onResize =
	function(
		// event
	)
{
	_height =
		window.innerHeight - 1;

	var
		fabric =
		this._fabric =
			this._fabric.Create(
				'width',
					window.innerWidth - 1,
				'height',
					_height
			);

	if( shell )
	{
		shell.resize( fabric );
	}
};


/*
| Captures all mouseevents event beyond the canvas (for dragging)
*/
System.prototype._captureEvents =
	function( )
{
	if( this._useCapture )
	{
		_canvas.setCapture( _canvas );

		return;
	}

	document.onmouseup =
		_canvas.onmouseup;

	document.onmousemove =
		_canvas.onmousemove;
};


/*
| Key down on hidden input field.
| Used when suggesting a keyboard.
*/
System.prototype._onKeyDown =
	function(
		event
	)
{
	var
		kcode =
		this._$lastSpecialKey =
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
System.prototype._onKeyPress =
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
			(
				kcode > 0 && kcode < 32
			)
			||
			ew === 0
		)
		&&
		this._$lastSpecialKey !== kcode
	)
	{
		this._$lastSpecialKey =
			-1;

		return this._specialKey(
			kcode,
			shift,
			ctrl
		);
	}
	else
	{
		if( !shell.suggestingKeyboard( ) )
		{
			shell.input( String.fromCharCode( kcode ) );
		}
	}

	this._$lastSpecialKey =
		-1;

	this._testInput( );

	this.setTimer(
		0,
		this._testInputCatcher
	);

	return true;
};


/*
| Hidden input key up.
*/
System.prototype._onKeyUp =
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
System.prototype._onContextMenu =
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
System.prototype._onMouseDown =
	function(
		event
	)
{
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

	var
		canvas =
			_canvas,

		p =
			Euclid.Point.Create(
				'x',
					event.pageX - canvas.offsetLeft,
				'y',
					event.pageY - canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey;

	_pointingState =
		'atween';

	this._$atween =
		Jools.immute({
			pos :
				p,

			$move :
				p,

			shift :
				shift,

			ctrl :
				ctrl,

			timer :
				this.setTimer(
					_settings.dragtime,
					this._onAtweenTimeCatcher
				)
		});

	this._pointingHover(
		p,
		shift,
		ctrl
	);

	return false;
};


/*
| Handles hovering of the pointing device.
*/
System.prototype._pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	this._$hover =
		Jools.immute(
			{
				p :
					p,

				shift :
					shift,

				ctrl :
					ctrl
			}
		);

	var
		cursor =
			shell.pointingHover(
				p,
				shift,
				ctrl
			);

	if( cursor !== null )
	{
		_canvas.style.cursor =
			cursor;
	}
};


/*
| Repeats the last hover.
|
| Used by asyncEvents so the hoveringState is corrected.
*/
System.prototype._repeatHover =
	function( )
{
	if( !this._$hover )
	{
		return;
	}

	var
		cursor =
			shell.pointingHover(
				this._$hover.p,
				this._$hover.shift,
				this._$hover.ctrl
			);

	if( cursor !== null )
	{
		_canvas.style.cursor =
			cursor;
	}
};


/*
| Mouse move event.
*/
System.prototype._onMouseMove =
	function(
		event
	)
{
	var
		atween,
		ctrl,
		cursor,
		dragbox,
		p,
		shift;

	p =
		Euclid.Point.Create(
			'x',
				event.pageX - _canvas.offsetLeft,
			'y',
				event.pageY - _canvas.offsetTop
		);
	shift =
		event.shiftKey;
	ctrl =
		event.ctrlKey || event.metaKey;
	cursor =
		null;

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

			dragbox =
				_settings.dragbox;

			atween =
				this._$atween;

			if(
				( Math.abs( p.x - atween.pos.x ) > dragbox ) ||
				( Math.abs( p.y - atween.pos.y ) > dragbox )
			)
			{
				// moved out of dragbox -> start dragging
				clearTimeout( atween.timer );

				this._$atween =
					null;

				_pointingState =
					'drag';

				shell.dragStart(
					atween.pos,
					shift,
					ctrl
				);

				cursor =
					shell.dragMove(
						p,
						shift,
						ctrl
					);

				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				atween.$move =
					p;
			}
			break;

		case 'drag':

			cursor =
				shell.dragMove(
					p,
					shift,
					ctrl
				);

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
System.prototype._onMouseUp =
	function(
		event
	)
{
	var
		atween,
		ctrl,
		p,
		shift;

	event.preventDefault( );

	this._releaseEvents( );

	p =
		Euclid.Point.Create(
			'x',
				event.pageX - _canvas.offsetLeft,
			'y',
				event.pageY - _canvas.offsetTop
		);
	shift =
		event.shiftKey;
	ctrl =
		event.ctrlKey || event.metaKey;

	switch( _pointingState )
	{
		case false :

			break;

		case 'atween' :

			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			atween =
				this._$atween;

			clearTimeout( atween.timer );

			this._$atween =
				null;

			shell.click(
				p,
				shift,
				ctrl
			);

			this._pointingHover(
				p,
				shift,
				ctrl
			);

			this._steerAttention( );

			_pointingState =
				false;

			break;

		case 'drag' :

			shell.dragStop(
				p,
				shift,
				ctrl
			);

			this._pointingHover(
				p,
				shift,
				ctrl
			);

			this._steerAttention( );

			_pointingState =
				false;

			break;

		default :

			throw new Error( );
	}

	return false;
};


/*
| The mouse wheel is being turned.
*/
System.prototype._onMouseWheel =
	function(
		event
	)
{
	var
		dir,
		p;

	p =
		Euclid.Point.Create(
			'x',
				event.pageX - _canvas.offsetLeft,
			'y',
				event.pageY - _canvas.offsetTop
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
		Jools.log(
			'warn',
			'invalid wheel event'
		);

		return;
	}

	shell.mousewheel(
		p,
		dir,
		event.shiftKey,
		event.ctrlKey || event.metaKey
	);
};


/*
| The user is touching something ( on mobile devices )
*/
System.prototype._onTouchStart =
	function(
		event
	)
{
	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 1 )
	{
		return false;
	}

	var
		p =
			Euclid.Point.Create(
				'x',
					event.pageX - _canvas.offsetLeft,
				'y',
					event.pageY - _canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey;

	_pointingState =
		'atween';

	this._$atween =
		Jools.immute({
			pos :
				p,

			$move :
				p,

			shift :
				shift,

			ctrl :
				ctrl,

			timer :
				this.setTimer(
					_settings.dragtime,
					this._onAtweenTimeCatcher
				)
		});

	return false;
};


/*
| The use is moving the touch ( on mobile devices )
*/
System.prototype._onTouchMove =
	function(
		event
	)
{
	event.preventDefault();

	// for now ignore multi-touches
	if( event.touches.length !== 1 )
	{
		return false;
	}

	var
		p =
			Euclid.Point.Create(
				'x',
					event.pageX - _canvas.offsetLeft,
				'y',
					event.pageY - _canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey,

		cursor =
			null;

	switch( _pointingState )
	{
		case false:

			this._pointingHover(
				p,
				shift,
				ctrl
			);

			break;

		case 'atween':

			var
				dragbox =
					_settings.dragbox,

				atween =
					this._$atween;

			if(
				( Math.abs( p.x - atween.pos.x ) > dragbox ) ||
				( Math.abs( p.y - atween.pos.y ) > dragbox )
			)
			{
				// moved out of dragbox -> start dragging
				clearTimeout( atween.timer );

				this._$atween =
					null;

				_pointingState =
					'drag';

				shell.dragStart(
					atween.pos,
					shift,
					ctrl
				);

				cursor =
					shell.dragMove(
						p,
						shift,
						ctrl
					);

				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				atween.$move =
					p;
			}

			break;

		case 'drag':

			cursor =
				shell.dragMove(
					p,
					shift,
					ctrl
				);

			break;

		default :

			throw new Error( );

	}

	return true;
};


/*
| The using is lifting his/her finger ( on mobile devices)
*/
System.prototype._onTouchEnd =
	function( event )
{
	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 0 )
	{
		return false;
	}

	this._releaseEvents( );

	var
		p =
			Euclid.Point.Create(
				'x',
					event.changedTouches[ 0 ].pageX -
					_canvas.offsetLeft,
				'y',
					event.changedTouches[ 0 ].pageY -
					_canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey;

	switch( _pointingState )
	{
		case false :

			break;

		case 'atween' :

			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			var atween =
				this._$atween;

			clearTimeout( atween.timer );

			this._$atween =
				null;

			shell.click(
				p,
				shift,
				ctrl
			);

			this._pointingHover(
				p,
				shift,
				ctrl
			);

			this._steerAttention( );

			_pointingState =
				false;

			break;

		case 'drag' :

			shell.dragStop(
				p,
				shift,
				ctrl
			);

			this._pointingHover(
				p,
				shift,
				ctrl
			);

			this._steerAttention( );

			_pointingState =
				false;

			break;

		default :

			throw new Error( );
	}

	return false;
};


/*
| Stops capturing all mouseevents
*/
System.prototype._releaseEvents =
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
System.prototype._specialKey =
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
		switch( keyCode )
		{
			case  8 :

				key =
					'backspace';

				break;

			case  9 :

				key =
					'tab';

				break;

			case 13 :

				key =
					'enter';

				break;

			case 27 :

				key =
					'esc';

				break;

			case 33 :

				key =
					'pageup';

				break;

			case 34 :

				key =
					'pagedown';

				break;

			case 35 :

				key =
					'end';

				break;

			case 36 :

				key =
					'pos1';

				break;

			case 37 :

				key =
					'left';

				break;

			case 38 :

				key =
					'up';

				break;

			case 39 :

				key =
					'right';

				break;

			case 40 :

				key =
					'down';

				break;

			case 46 :

				key =
					'del';

				break;
		}
	}

	if( key === null )
	{
		return true;
	}

	shell.specialKey(
		key,
		shift,
		ctrl
	);

	this._steerAttention( );

	return false;
};


/*
| Tests if the hidden input field got data
*/
System.prototype._testInput =
	function( )
{
	var
		hi =
			_hiddenInput,

		text =
			hi.value;

	// works around opera quirks inserting CR characters
	text =
		text.replace( /\r/g, '' );

	if(
		text === _inputVal
		||
		!shell
	)
	{
		return;
	}

	hi.value =
	_inputVal =
		'';

	hi.selectionStart =
		0;

	shell.input( text );

	this._steerAttention( );
};


/*
| This is mainly used on the iPad.
|
| Checks if the virtual keyboard should be suggested
| and if takes care the caret is scrolled into
| visible screen area
*/
System.prototype._steerAttention =
	function( )
{
	var
		ac;
	
	ac = shell.attentionCenter;

	if( ac === null )
	{
		_hiddenInput.style.top = '0';
	}
	else
	{
		ac =
			Jools.limit(
				0,
				ac,
				_height - 15
			);

		_hiddenInput.style.top = ac + 'px';
	}

	if( shell.suggestingKeyboard( ) )
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
		catcher(
			function( )
			{
				system = new System( );

				(
					new Shell( system._fabric )
				).onload( );

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
