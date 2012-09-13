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
| imports
*/
var Euclid;
var Jools;
var Shell;
var config;


/*
| export
*/
var system;
var startup;


/*
| capsule
*/
( function( ) {
'use strict';
if ( typeof( window ) === 'undefined')
	{ throw new Error( 'browser.js needs a browser!' ); }


/*
| catches all errors a function throws if config.devel is set.
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
| the system
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
	this._$mouseState  = false;

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

	// remembers last SpecialKey pressed, to hinder double events.
	// Opera is behaving stupid here.
	this._lastSpecialKey = -1;

	// The value that is expected to be in input.
	// either nothing or the text selection.
	// if it changes the user did something.
	this._inputVal = '';

	canvas.onmouseup             = makeCatcher( this, this._onMouseUp   );
	canvas.onmousemove           = makeCatcher( this, this._onMouseMove );
	canvas.onmousedown           = makeCatcher( this, this._onMouseDown );

	canvas.ontouchstart          = canvas.onmousedown;
	canvas.ontouchmove           = canvas.onmousemove;
	canvas.ontouchend            = canvas.onmouseup;

	canvas.onmousewheel          = makeCatcher( this, this._onMouseWheel  );
	canvas.addEventListener( 'DOMMouseScroll', canvas.onmousewheel, false ); // Firefox
	window.onresize              = makeCatcher( this, this._onResize      );
	this._hiddenInput.onfocus    = makeCatcher( this, this._onFocus       );
	this._hiddenInput.onblur     = makeCatcher( this, this._onBlur        );
	this._hiddenInput.onkeydown  = makeCatcher( this, this._onKeyDown     );
	this._hiddenInput.onkeypress = makeCatcher( this, this._onKeyPress    );
	this._hiddenInput.onkeyup    = makeCatcher( this, this._onKeyUp       );
	this._testInputCatcher       = makeCatcher( this, this._testInput     );
	this._onAtweenTimeCatcher    = makeCatcher( this, this._onAtweenTime  );
	this._blinkCatcher           = makeCatcher( this, this._blink         );
	document.oncontextmenu       = makeCatcher( this, this._onContextMenu );

	// the blink (and check input) timer
	this._blinkTimer = null;

	this.restartBlinker();
};


/*
| default system behavior settings
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
| cancels a timer
*/
System.prototype.cancelTimer = function( id )
{
	return window.clearTimeout( id );
};


/*
| (re)starts the blink timer
*/
System.prototype.restartBlinker = function( )
{
	// double uses the blink timer
	this._testInput();

	if (this._blinkTimer)
		{ clearInterval( this._blinkTimer ); }

	this._blinkTimer = setInterval( this._blinkCatcher, this.settings.caretBlinkSpeed );
};


/*
| sets the hidden input field (text selection)
*/
System.prototype.setInput = function( text )
{
	var hi   = this._hiddenInput;
	hi.value = this._inputVal = text;
	if ( text !== '' )
	{
		hi.selectionStart = 0;
		hi.selectionEnd = text.length;
	}
};


/*
| sets a time through the error catcher
*/
System.prototype.setTimer = function(time, callback)
{
	return window.setTimeout(makeCatcher(null, callback), time);
};

// ---------------------------


/*
| blinks the caret
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
	if (this._$mouseState !== 'atween')
	{
		Jools.log('warn', 'dragTime() in wrong action mode');
		return;
	}

	var atween        = this._$atween;
	this._$mouseState = 'drag';
	atween.timer      = null;

	var cursor = null;
	this.shell.dragstart( atween.pos, atween.shift, atween.ctrl );
	cursor = this.shell.dragmove( atween.move, atween.shift, atween.ctrl );

	if (cursor !== null)
		{ this._canvas.style.cursor = cursor; }
};


/*
| hidden input lost focus
*/
System.prototype._onBlur = function( event )
{
	this.shell.systemBlur( );
};


/*
| hidden input got focus
*/
System.prototype._onFocus = function( event )
{
	this.shell.systemFocus( );
};


/*
| view window has resized
*/
System.prototype._onResize = function( event )
{
	var c = this._canvas;

	c.width  = window.innerWidth - 1;
	c.height = window.innerHeight - 1;
	this.shell.resize( c.width, c.height );
};


/*
| captures all mouseevents event beyond the canvas (for dragging)
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
| key down in hidden input field
*/
System.prototype._onKeyDown = function( event )
{
	var shift = event.shiftKey;
	var ctrl  = event.ctrlKey || event.metaKey;

	if(
		!this._specialKey(
			this._lastSpecialKey = event.keyCode, shift, ctrl
		)
	)
	{
		event.preventDefault();
	}
};


/**
| Hidden input key press.
*/
System.prototype._onKeyPress = function( event )
{
	var ew    = event.which;
	var ek    = event.keyCode;
	var shift = event.shiftKey;
	var ctrl  = event.ctrlKey || event.metaKey;

	if (
		(
			( ek > 0 && ek < 32 ) ||
			ew === 0
		) &&
		this._lastSpecialKey !== ek
	)
	{
		this._lastSpecialKey = -1;
		return this._specialKey(ek, shift, ctrl);
	}

	this._lastSpecialKey = -1;
	this._testInput();
	this.setTimer( 0, this._testInputCatcher );
	return true;
};


/*
| Hidden input key up.
*/
System.prototype._onKeyUp = function( event )
{
	this._testInput( );
	return true;
};


/*
| Disables context menues.
*/
System.prototype._onContextMenu = function( event )
{
	e.stopPropagation();
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

	this._hiddenInput.focus();

	// worksaround a bug in safari/OSX
	var self = this;
	this.setTimer( 0, function( ) {
		self._hiddenInput.selectionStart = 0;
	} );

	var canvas = this._canvas;
	var p      = new Euclid.Point(
		event.pageX - canvas.offsetLeft,
		event.pageY - canvas.offsetTop
	);
	var shift  = event.shiftKey;
	var ctrl   = event.ctrlKey || event.metaKey;

	// asks the shell if it forces this to be a drag or click, or yet unknown.
	this._$mouseState = this.shell.mousedown( p, shift, ctrl );

	switch( this._$mouseState )
	{
		case 'atween' :

			var atween   = this._$atween;
			atween.pos   = p;
			atween.move  = p;
			atween.shift = shift;
			atween.ctrl  = ctrl;
			atween.timer = this.setTimer(this.settings.dragtime, this._onAtweenTimeCatcher);
			break;

		case 'drag' :

			this._captureEvents( );
			break;
	}

	var cursor = this.shell.mousehover( p, shift, ctrl );
	if ( cursor !== null )
		{ canvas.style.cursor = cursor; }

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

	switch( this._$mouseState )
	{
		case false:
			cursor = this.shell.mousehover( p, shift, ctrl );
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
				atween.timer = null;
				this._$mouseState = 'drag';
				this.shell.dragstart( atween.pos, shift, ctrl );
				cursor = this.shell.dragmove( p, shift, ctrl );
				this._captureEvents( );
			}
			else
			{
				// saves position for possible atween timeout
				atween.move  = p;
				atween.shift = shift;
				atween.ctrl  = ctrl;
			}
			break;

		case 'drag':
			cursor = this.shell.dragmove( p, shift, ctrl );
			break;

		default :
			throw new Error('invalid mouseState');

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

	switch( this._$mouseState )
	{
		case false :
			break;

		case 'atween' :
			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			var atween = this._$atween;
			clearTimeout( atween.timer );
			atween.timer = null;
			this.shell.click( p, shift, ctrl );
			cursor = this.shell.mousehover( p, shift, ctrl );
			this._$mouseState = false;
			break;

		case 'drag' :
			this.shell.dragstop( p, shift, ctrl );
			cursor = this.shell.mousehover( p, shift, ctrl );
			this._$mouseState = false;
			break;

		default :
			throw new Error( 'invalid mouseState' );
	}

	if( cursor !== null )
		{ canvas.style.cursor = cursor; }

	return false;
};


/*
| Mouse down event.
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
| A special key was pressed.
*/
System.prototype._specialKey = function(keyCode, shift, ctrl)
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

	return false;
};


/*
| tests if the hidden input field got data.
*/
System.prototype._testInput = function( )
{
	var hi   = this._hiddenInput;
	var text = hi.value;

	if( text == this._inputVal )
		{ return; }

	hi.value = this._inputVal = '';
	this.shell.input(text);
};


//window.onload = function() {
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
