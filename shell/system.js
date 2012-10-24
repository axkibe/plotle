/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                   .---.         .
                                   \___  . . ,-. |- ,-. ,-,-.
                                       \ | | `-. |  |-' | | |
                                   `---' `-| `-' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                         `-'
 This is a wrapper around HTML5 browsers, creating a more comfortable interface for
 graphical systems like the meshcraft shell.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Imports
*/
var Euclid;
var Jools;
var Shell;
var config;


/*
| Export
*/
var system;
var startup;


/*
| Capsule
*/
( function( ) {
'use strict';
if ( typeof( window ) === 'undefined')
	{ throw new Error( 'browser.js needs a browser!' ); }


/*
| Catches all errors a function throws if config.devel is set.
*/
var makeCatcher = function( t, f )
{
	return function( )
	{
		if( config.devel )
		{
			return f.apply( t, arguments );
		}

		try {
			f.apply( t, arguments );
		}
		catch( e )
		{
			window.alert(
				'Internal failure, ' + e.name + ': ' + e.message + '\n\n' +
				'file: '  + e.fileName   + '\n' +
				'line: '  + e.lineNumber + '\n' +
				'stack: ' + e.stack
			);
		}
	};
};


/*
| The system
*/
var System = function()
{
	if( system )
		{ throw new Error('System not a singleton'); }

	var canvas    = this._canvas = document.getElementById('canvas');
	canvas.width  = window.innerWidth - 1;
	canvas.height = window.innerHeight - 1;
	this.fabric   = new Euclid.Fabric(canvas);

	// if true browser supports the setCapture() call
	// if false needs work around
	this._useCapture = !!canvas.setCapture;

	// false, 'atween' or 'drag'
	this._$pointingState  = false;

	// atween is the state where the mouse button went down,
	// and its yet unsure if this is a click or drag.
	// if the mouse moves out of the atweenBox or the atweenTimer ticks its
	// a drag, if it goes up before either happens, its a click

	this._$atween =
	{
		// timer for atween state
		timer : null,

		// position mouse button went down
		pos   : null,

		// latest mouse position seen in atween state
		move  : null,

		// shift key in atween state
		shift : null,

		// ctrl  key in atween state
		ctrl  : null
	};

	// hidden input that forwards all events
	this._hiddenInput = document.getElementById('input');

	// remembers last special key pressed, to hinder double events.
	// Opera is behaving stupid here.
	this._$lastSpecialKey = -1;

	// The value expected to be in input.
	// either nothing or the text selection.
	// if it changes the user did something.
	this._inputVal  = '';

	var hiddenInput = this._hiddenInput;

	canvas.onmousedown        = makeCatcher( this, this._onMouseDown      );
	canvas.onmousemove        = makeCatcher( this, this._onMouseMove      );
	canvas.onmouseup          = makeCatcher( this, this._onMouseUp        );

	canvas.ontouchstart       = makeCatcher( this, this._onTouchStart     );
	canvas.ontouchmove        = makeCatcher( this, this._onTouchMove      );
	canvas.ontouchend         = makeCatcher( this, this._onTouchEnd       );

	canvas.onmousewheel       = makeCatcher( this, this._onMouseWheel     );
	canvas.addEventListener( 'DOMMouseScroll', canvas.onmousewheel, false ); // Firefox

	window.onresize           = makeCatcher( this, this._onResize         );

	window.onfocus            = makeCatcher( this, this._onSystemFocus    );
	window.onblur             = makeCatcher( this, this._onSystemBlur     );

	hiddenInput.onkeydown     = makeCatcher( this, this._onHiddenKeyDown  );
	hiddenInput.onkeypress    = makeCatcher( this, this._onHiddenKeyPress );
	hiddenInput.onkeyup       = makeCatcher( this, this._onHiddenKeyUp    );

	canvas.onkeydown          = makeCatcher( this, this._onCanvasKeyDown  );
	canvas.onkeypress         = makeCatcher( this, this._onCanvasKeyPress );

	this._testInputCatcher    = makeCatcher( this, this._testInput        );
	this._onAtweenTimeCatcher = makeCatcher( this, this._onAtweenTime     );
	this._blinkCatcher        = makeCatcher( this, this._blink            );
	document.oncontextmenu    = makeCatcher( this, this._onContextMenu    );

	// the blink (and check input) timer
	this._blinkTimer = null;

	this.restartBlinker();
};


/*
| Default system behavior settings
*/
System.prototype.settings =
{
	// pixels to scroll for a wheel event
	textWheelSpeed : 12 * 5,

	// blink speed of the caret.
	caretBlinkSpeed : 530,

	// milliseconds after mouse down, dragging starts
	dragtime : 400,

	// pixels after mouse down and move, dragging starts
	dragbox  : 10
};


/*
| Cancels a timer
*/
System.prototype.cancelTimer = function( id )
{
	return window.clearTimeout( id );
};


/*
| (Re)Starts the blink timer
*/
System.prototype.restartBlinker = function( )
{
	// double uses the blink timer
	this._testInput();

	if (this._blinkTimer)
		{ clearInterval( this._blinkTimer ); }

	this._blinkTimer = setInterval(
		this._blinkCatcher,
		this.settings.caretBlinkSpeed
	);
};


/*
| Sets the hidden input field (text selection)
*/
System.prototype.setInput = function( text )
{
	var hi   = this._hiddenInput;
	hi.value = this._inputVal = '' + text;

	hi.selectionStart = 0;
	if( text !== '' )
	{
		hi.selectionEnd = text.length;
	}
};


/*
| Sets a timer with an error catcher
*/
System.prototype.setTimer = function( time, callback )
{
	return window.setTimeout(
		makeCatcher( null, callback ),
		time
	);
};


/*
| Sets the focus mode so it matched the keyboard suggestion (for iPad)
| Moves the hidden input vertically so the iPad keeps the caret in view
*/
System.prototype.fiddleInput = function( )
{
	var caret  = this.shell.$caret;
	var height = caret.$height;
	var pos    = caret.$screenPos;
	var sk     = height > 0;

	if( sk )
	{
		var input = this._hiddenInput;

		input.style.top    = pos.y + 'px';
		input.style.height = height;

		if( !this._$suggestingKeyboard )
		{
			input.focus();

			// works around a bug in safari/OSX
			var self = this;
			this.setTimer(
				0,
				function( )
					{ self._hiddenInput.selectionStart = 1; }
			);

			this._$suggestingKeyboard = true;
		}
	}
	else
	{
		if( this._$suggestingKeyboard )
		{
			this._canvas.focus();
			this._$suggestingKeyboard = false;
		}
	}
};

// ---------------------------


/*
| Blinks the caret
*/
System.prototype._blink = function()
{
	// also looks into the hidden input field,
	// maybe the user pasted something using the browser menu
	this._testInput();

	this.shell.blink();
};


/*
| timeout after mouse down so dragging starts
*/
System.prototype._onAtweenTime = function( )
{
	if( this._$pointingState !== 'atween' )
	{
		Jools.log('warn', 'dragTime() in wrong action mode');
		return;
	}

	var atween        = this._$atween;

	this._$pointingState = 'drag';

	var cursor = null;

	this.shell.dragStart(
		atween.pos,
		atween.shift,
		atween.ctrl
	);

	cursor = this.shell.dragMove(
		atween.move,
		atween.shift,
		atween.ctrl
	);

	this._$atween     = null;

	if( cursor !== null )
		{ this._canvas.style.cursor = cursor; }
};


/*
| The meshcraft system lost focus
*/
System.prototype._onSystemBlur = function( event )
{
	this.shell.systemBlur( );
};


/*
| The meshcraft system got focus
*/
System.prototype._onSystemFocus = function( event )
{
	this.shell.systemFocus( );
};


/*
| View window is being resized.
*/
System.prototype._onResize = function( event )
{
	var c = this._canvas;
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;

	c.width  = w - 1;
	c.height = h - 1;

	if( this.shell ) {
		this.shell.resize( w - 1, h - 1 );
	}
};


/*
| Captures all mouseevents event beyond the canvas (for dragging)
*/
System.prototype._captureEvents = function( )
{
	if( this._useCapture )
	{
		this._canvas.setCapture( this._canvas );
		return;
	}

	document.onmouseup   = this._canvas.onmouseup;
	document.onmousemove = this._canvas.onmousemove;
};


/*
| Key down on canvas.
| Used when not suggesting a keyboard.
*/
System.prototype._onCanvasKeyDown = function( event )
{
	var kcode = this._$lastSpecialKey = event.keyCode;
	var shift = event.shiftKey;
	var ctrl  = event.ctrlKey || event.metaKey;

	if( !this._specialKey( kcode, shift, ctrl ) )
	{
		event.preventDefault();
		return false;
	}
};


/**
| Key press on canvas.
| Used when not suggesting a keyboard.
*/
System.prototype._onCanvasKeyPress = function( event )
{
	var kcode = event.keyCode;
	var which = event.which;
	var shift = event.shiftKey;
	var ctrl  = event.ctrlKey || event.metaKey;

	if(
		(
			ctrl ||
			( kcode > 0 && kcode < 32 ) ||
			which === 0
		) &&
		this._$lastSpecialKey !== kcode
	)
	{
		this._$lastSpecialKey = -1;

		return this._specialKey( kcode, shift, ctrl );
	}

	if( which >= 32 )
	{
		this.shell.input( String.fromCharCode( which ) );
		this.fiddleInput();
	}

	this._$lastSpecialKey = -1;
	return true;
};


/*
| Key down on hidden input field.
| Used when suggesting a keyboard.
*/
System.prototype._onHiddenKeyDown = function( event )
{
	var shift = event.shiftKey;
	var ctrl  = event.ctrlKey || event.metaKey;
	var kcode = this._$lastSpecialKey = event.keyCode;

	if( !this._specialKey( kcode, shift, ctrl ) )
	{
		event.preventDefault();
	}
};


/**
| Hidden input key press.
*/
System.prototype._onHiddenKeyPress = function( event )
{
	var ew    = event.which;
	var kcode = event.keyCode;
	var shift = event.shiftKey;
	var ctrl  = event.ctrlKey || event.metaKey;

	if (
		(
			( kcode > 0 && kcode < 32 ) ||
			ew === 0
		) &&
		this._$lastSpecialKey !== kcode
	)
	{
		this._$lastSpecialKey = -1;
		return this._specialKey( kcode, shift, ctrl );
	}

	this._$lastSpecialKey = -1;
	this._testInput( );
	this.setTimer( 0, this._testInputCatcher );
	return true;
};


/*
| Hidden input key up.
*/
System.prototype._onHiddenKeyUp = function( event )
{
	this._testInput( );
	return true;
};


/*
| Disables context menues.
*/
System.prototype._onContextMenu = function( event )
{
	event.stopPropagation();
	return false;
};


/*
| Mouse down event.
*/
System.prototype._onMouseDown = function( event )
{
	event.preventDefault();

	if( Jools.is( event.button ) && event.button !== 0 )
		{ return; }

	// Opera requires focusing the window first
	window.focus();

	var canvas = this._canvas;
	var p      = new Euclid.Point(
		event.pageX - canvas.offsetLeft,
		event.pageY - canvas.offsetTop
	);
	var shift  = event.shiftKey;
	var ctrl   = event.ctrlKey || event.metaKey;

	// asks the shell if it forces this to be a drag or click, or yet unknown.
	this._$pointingState = this.shell.pointingStart( p, shift, ctrl );

	switch( this._$pointingState )
	{
		case 'atween' :
			this._$atween =
			{
				pos   : p,
				move  : p,
				shift : shift,
				ctrl  : ctrl,
				timer : this.setTimer(
					this.settings.dragtime,
					this._onAtweenTimeCatcher
				)
			};
			break;

		case 'drag' :
			this._captureEvents( );
			break;
	}

	var cursor = this.shell.pointingHover( p, shift, ctrl );

	if ( cursor !== null )
		{ canvas.style.cursor = cursor; }


	this.fiddleInput();

	return false;
};


/*
| Mouse move event.
*/
System.prototype._onMouseMove = function( event )
{
	var canvas = this._canvas;
	var p      = new Euclid.Point(
		event.pageX - canvas.offsetLeft,
		event.pageY - canvas.offsetTop
	);

	var shift  = event.shiftKey;
	var ctrl   = event.ctrlKey || event.metaKey;
	var cursor = null;

	switch( this._$pointingState )
	{
		case false:
			cursor = this.shell.pointingHover( p, shift, ctrl );
			break;

		case 'atween':
			var dragbox = this.settings.dragbox;
			var atween  = this._$atween;

			if( (Math.abs( p.x - atween.pos.x ) > dragbox ) ||
				(Math.abs( p.y - atween.pos.y ) > dragbox )
			)
			{
				// moved out of dragbox -> start dragging
				clearTimeout( atween.timer );
				this._$atween = null;
				this._$pointingState = 'drag';

				this.shell.dragStart(
					atween.pos,
					shift,
					ctrl
				);

				cursor = this.shell.dragMove(
					p,
					shift,
					ctrl
				);

				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				atween.move = p;
			}
			break;

		case 'drag':
			cursor = this.shell.dragMove( p, shift, ctrl );
			break;

		default :
			throw new Error('invalid pointingState');

	}

	if( cursor !== null )
		{ canvas.style.cursor = cursor; }

	return true;
};


/*
| Mouse up event.
*/
System.prototype._onMouseUp = function( event )
{
	event.preventDefault( );
	this._releaseEvents( );

	var canvas = this._canvas;
	var p      = new Euclid.Point(
		event.pageX - canvas.offsetLeft,
		event.pageY - canvas.offsetTop
	);
	var shift  = event.shiftKey;
	var ctrl   = event.ctrlKey || event.metaKey;
	var cursor = null;

	switch( this._$pointingState )
	{
		case false :
			break;

		case 'atween' :

			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			var atween = this._$atween;
			clearTimeout( atween.timer );
			this._$atween = null;
			this.shell.click( p, shift, ctrl );
			cursor = this.shell.pointingHover( p, shift, ctrl );
			this._$pointingState = false;
			break;

		case 'drag' :

			this.shell.dragStop( p, shift, ctrl );
			cursor = this.shell.pointingHover( p, shift, ctrl );
			this._$pointingState = false;
			break;

		default :

			throw new Error( 'invalid pointingState' );
	}

	if( cursor !== null )
		{ canvas.style.cursor = cursor; }

	this.fiddleInput( );

	return false;
};


/*
| The mouse wheel is being turned.
*/
System.prototype._onMouseWheel = function( event )
{
	var canvas = this._canvas;
	var p = new Euclid.Point(
		event.pageX - canvas.offsetLeft,
		event.pageY - canvas.offsetTop
	);

	var dir;
	if( Jools.is( event.wheelDelta ) )
	{
		dir = (event.wheelDelta) > 0 ? 1 : -1;
	}
	else if( Jools.is( event.detail ) )
	{
		dir = (event.detail) > 0 ? -1 : 1;
	}
	else
	{
		Jools.log('warn', 'invalid wheel event');
		return;
	}

	var shift = event.shiftKey;
	var ctrl  = event.ctrlKey || event.metaKey;

	this.shell.mousewheel( p, dir, shift, ctrl );

	this.fiddleInput();
};


/*
| The user is touching something ( on mobile devices )
*/
System.prototype._onTouchStart = function( event )
{
	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 1 )
		{ return false; }

	var canvas = this._canvas;
	var p      = new Euclid.Point(
		event.pageX - canvas.offsetLeft,
		event.pageY - canvas.offsetTop
	);
	var shift  = event.shiftKey;
	var ctrl   = event.ctrlKey || event.metaKey;

	// asks the shell if it forces this to be a drag or click, or yet unknown.
	this._$pointingState = this.shell.pointingStart( p, shift, ctrl );

	switch( this._$pointingState )
	{
		case 'atween' :
			this._$atween =
			{
				pos   : p,
				move  : p,
				shift : shift,
				ctrl  : ctrl,
				timer : this.setTimer(
					this.settings.dragtime,
					this._onAtweenTimeCatcher
				)
			};
			break;

		case 'drag' :
			this._captureEvents( );
			break;
	}

	this.fiddleInput();

	return false;
};


/*
| The use is moving the touch ( on mobile devices )
*/
System.prototype._onTouchMove = function( event )
{
	event.preventDefault();

	// for now ignore multi-touches
	if( event.touches.length !== 1 )
		{ return false; }

	var canvas = this._canvas;
	var p      = new Euclid.Point(
		event.pageX - canvas.offsetLeft,
		event.pageY - canvas.offsetTop
	);

	var shift  = event.shiftKey;
	var ctrl   = event.ctrlKey || event.metaKey;
	var cursor = null;

	switch( this._$pointingState )
	{
		case false:
			cursor = this.shell.pointingHover( p, shift, ctrl );
			break;

		case 'atween':
			var dragbox = this.settings.dragbox;
			var atween  = this._$atween;

			if( (Math.abs( p.x - atween.pos.x ) > dragbox ) ||
				(Math.abs( p.y - atween.pos.y ) > dragbox )
			)
			{
				// moved out of dragbox -> start dragging
				clearTimeout( atween.timer );
				this._$atween = null;
				this._$pointingState = 'drag';

				this.shell.dragStart(
					atween.pos,
					shift,
					ctrl
				);

				cursor = this.shell.dragMove(
					p,
					shift,
					ctrl
				);

				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				atween.move = p;
			}
			break;

		case 'drag':
			cursor = this.shell.dragMove(
				p,
				shift,
				ctrl
			);
			break;

		default :
			throw new Error('invalid pointingState');

	}

	return true;
};


/*
| The using is lifting his/her finger ( on mobile devices)
*/
System.prototype._onTouchEnd = function( event )
{
	event.preventDefault( );

	// for now ignore multi-touches
	if( event.touches.length !== 0 )
		{ return false; }

	this._releaseEvents( );

	var canvas = this._canvas;
	var p      = new Euclid.Point(
		event.changedTouches[0].pageX - canvas.offsetLeft,
		event.changedTouches[0].pageY - canvas.offsetTop
	);

	var shift  = event.shiftKey;
	var ctrl   = event.ctrlKey || event.metaKey;
	var cursor = null;

	switch( this._$pointingState )
	{
		case false :

			break;

		case 'atween' :

			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			var atween = this._$atween;
			clearTimeout( atween.timer );
			this._$atween = null;
			this.shell.click( p, shift, ctrl );
			cursor = this.shell.pointingHover( p, shift, ctrl );
			this._$pointingState = false;
			break;

		case 'drag' :

			this.shell.dragStop( p, shift, ctrl );
			cursor = this.shell.pointingHover( p, shift, ctrl );
			this._$pointingState = false;
			break;

		default :
			throw new Error( 'invalid pointingState' );
	}

	this.fiddleInput();

	return false;
};

/*
| Stops capturing all mouseevents
*/
System.prototype._releaseEvents = function( )
{
	if ( this._useCapture )
	{
		document.releaseCapture(this._canvas);
		return;
	}

	document.onmouseup   = null;
	document.onmousemove = null;
};


/*
| A special key is being pressed.
*/
System.prototype._specialKey = function( keyCode, shift, ctrl )
{
	var key = null;
	if( ctrl )
	{
		switch( keyCode )
		{
			case 65  : key = 'a'; break;
			case 89  : key = 'y'; break;
			case 90  : key = 'z'; break;
			case 188 : key = ','; break;
			case 190 : key = '.'; break;
		}
	}
	else
	{
		switch( keyCode )
		{
			case  8 : key = 'backspace'; break;
			case  9 : key = 'tab';       break;
			case 13 : key = 'enter';     break;
			case 27 : key = 'esc';       break;
			case 33 : key = 'pageup';    break;
			case 34 : key = 'pagedown';  break;
			case 35 : key = 'end';       break;
			case 36 : key = 'pos1';      break;
			case 37 : key = 'left';      break;
			case 38 : key = 'up';        break;
			case 39 : key = 'right';     break;
			case 40 : key = 'down';      break;
			case 46 : key = 'del';       break;
		}
	}

	if( key === null )
		{ return true; }

	this.shell.specialKey( key, shift, ctrl );

	this.fiddleInput();

	return false;
};


/*
| Tests if the hidden input field got data
*/
System.prototype._testInput = function( )
{
	var hi   = this._hiddenInput;
	var text = hi.value;

	// works around opera quirks inserting CR characters
	text = text.replace(/\r/g,'');

	if( text == this._inputVal || !this.shell )
		{ return; }

	hi.value = this._inputVal = '';
	hi.selectionStart = 0;

	this.shell.input( text );

	this.fiddleInput();
};


/*
| System starts up ( pages loades )
*/
startup = function( )
{
	makeCatcher(
		null,
		function( ) {
			system = new System();
			system.shell = new Shell(system.fabric);
			system.shell.onload();
		}
	)( );
};

} ) ( );
