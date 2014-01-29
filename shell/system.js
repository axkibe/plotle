/*
| This is a wrapper around HTML5 browsers,
| creating a more comfortable interface for
| graphical systems like the meshcraft shell.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	config,
	Euclid,
	Jools,
	Shell;


/*
| Export
*/
var
	system,
	startup;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Catches all errors a function throws if config.devel is set.
*/
var makeCatcher =
	function(
		t,
		f
	)
{
	return function( )
	{
		if(
			config.devel &&
			!config.debug.weinre
		)
		{
			return f.apply( t, arguments );
		}

		try
		{
			f.apply( t, arguments );
		}
		catch( e )
		{
			try {
				var message =
					[
						'Internal failure, ',
							e.name, ': ',
							e.message, '\n\n',
						'file: ',
							e.fileName, '\n',
						'line: ',
							e.lineNumber, '\n',
						'stack: ',
							e.stack
					].join('');

				if( !config.debug.weinre )
				{
					window.alert( message );
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
| The system.
*/
var System =
	function( )
{
	if( system )
	{
		throw new Error(
			CHECK && 'System not a singleton'
		);
	}

	var
		canvas =
		this._canvas =
			document.getElementById( 'canvas' );

	this._$height =
		window.innerHeight - 1;

	this._fabric =
		Euclid.Fabric.create(
			'canvas',
				this._canvas,
			'width',
				window.innerWidth - 1,
			'height',
				this._$height
		);

	// if true browser supports the setCapture() call
	// if false needs work around
	this._useCapture =
		!!canvas.setCapture;

	// false, 'atween' or 'drag'
	this._$pointingState =
		false;

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
	this._hiddenInput =
		document.getElementById( 'input' );

	// remembers last special key pressed, to hinder double events.
	// Opera is behaving stupid here.
	this._$lastSpecialKey =
		-1;

	// remembers last pointing device hovering state.
	this._$hover =
		null;

	// The value expected to be in input.
	// either nothing or the text selection.
	// if it changes the user did something.
	this._inputVal =
		'';

	canvas.onmousedown =
		makeCatcher(
			this,
			this._onMouseDown
		);

	canvas.onmousemove =
		makeCatcher(
			this,
			this._onMouseMove
		);

	canvas.onmouseup =
		makeCatcher(
			this,
			this._onMouseUp
		);

	canvas.ontouchstart =
		makeCatcher(
			this,
			this._onTouchStart
		);

	canvas.ontouchmove =
		makeCatcher(
			this,
			this._onTouchMove
		);

	canvas.ontouchend =
		makeCatcher(
			this,
			this._onTouchEnd
		);

	canvas.onmousewheel =
		makeCatcher(
			this,
			this._onMouseWheel
		);

	// firefox wheel listening
	canvas.addEventListener(
		'DOMMouseScroll',
		canvas.onmousewheel,
		false
	);

	// iPad sometimes starts just somewhere
	window.scrollTo( 0, 0 );

	window.onresize =
		makeCatcher(
			this,
			this._onResize
		);

	window.onfocus =
		makeCatcher(
			this,
			this._onSystemFocus
		);

	window.onblur =
		makeCatcher(
			this,
			this._onSystemBlur
		);

	this._hiddenInput.onblur =
		makeCatcher(
			this,
			this._onHiddenInputBlur
		);

	document.onkeyup =
		makeCatcher(
			this,
			this._onHiddenKeyUp
		);

	document.onkeydown =
		makeCatcher(
			this,
			this._onHiddenKeyDown
		);

	document.onkeypress =
		makeCatcher(
			this,
			this._onHiddenKeyPress
		);

	this._testInputCatcher =
		makeCatcher(
			this,
			this._testInput
		);

	this._onAtweenTimeCatcher =
		makeCatcher(
			this,
			this._onAtweenTime
		);

	this._blinkCatcher =
		makeCatcher(
			this,
			this._blink
		);

	document.oncontextmenu =
		makeCatcher(
			this,
			this._onContextMenu
		);

	// the blink (and check input) timer
	this._blinkTimer =
		null;

	this._canvas.focus( );

	this.restartBlinker( );
};


/*
| Default system behavior settings
*/
System.prototype.settings =
{
	// pixels to scroll for a wheel event
	textWheelSpeed :
		12 * 5,

	// blink speed of the caret.
	caretBlinkSpeed :
		530,

	// milliseconds after mouse down, dragging starts
	dragtime :
		400,

	// pixels after mouse down and move, dragging starts
	dragbox :
		10
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
		this.settings.caretBlinkSpeed
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
	var
		hi =
			this._hiddenInput;

	hi.value =
	this._inputVal =
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
		makeCatcher(
			null,
			callback
		),
		time
	);
};



/*
| An asyncronous event happened
|
| For example:
|   onArriveAtSpace
*/
System.prototype.asyncEvent =
	function(
		eventName,
		asw
	)
{
	this.shell[ eventName ](
		asw
	);

	this._repeatHover( );

	this._steerAttention( );
};


// ---------------------------


/*
| Blinks the caret
*/
System.prototype._blink =
	function( )
{
	// also looks into the hidden input field,
	// maybe the user pasted something using the browser menu
	this._testInput( );

	// this.shell.blink( );
};


/*
| timeout after mouse down so dragging starts
*/
System.prototype._onAtweenTime =
	function( )
{
	if(
		this._$pointingState !== 'atween'
	)
	{
		Jools.log('warn', 'dragTime() in wrong action mode');
		return;
	}

	var
		atween =
			this._$atween;

	this._$pointingState =
		'drag';

	var
		cursor =
			null;

	this.shell.dragStart(
		atween.pos,
		atween.shift,
		atween.ctrl
	);

	cursor =
		this.shell.dragMove(
			atween.$move,
			atween.shift,
			atween.ctrl
		);

	this._$atween =
		null;

	if( cursor !== null )
	{
		this._canvas.style.cursor =
			cursor;
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
	this.shell.setFocus( false );
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
	this.shell.setFocus( true );
};


/*
| View window is being resized.
*/
System.prototype._onResize =
	function(
		// event
	)
{
	this._$height =
		window.innerHeight - 1;

	var
		fabric =
		this._fabric =
			Euclid.Fabric.create(
				'inherit',
					this._fabric,
				'width',
					window.innerWidth - 1,
				'height',
					this._$height
			);

	if( this.shell )
	{
		this.shell.resize(
			fabric
		);
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
		this._canvas.setCapture( this._canvas );

		return;
	}

	document.onmouseup =
		this._canvas.onmouseup;

	document.onmousemove =
		this._canvas.onmousemove;
};


/*
| Key down on hidden input field.
| Used when suggesting a keyboard.
*/
System.prototype._onHiddenKeyDown =
	function(
		event
	)
{
	var
		kcode =
			this._$lastSpecialKey = event.keyCode;

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
System.prototype._onHiddenKeyPress =
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
System.prototype._onHiddenKeyUp =
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
		Jools.is( event.button ) &&
		event.button !== 0
	)
	{
		return;
	}

	// Opera requires focusing the window first
	window.focus( );

	var
		canvas =
			this._canvas,

		p =
			Euclid.Point.create(
				'x',
					event.pageX - canvas.offsetLeft,
				'y',
					event.pageY - canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey;

	this._$pointingState =
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
					this.settings.dragtime,
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
			this.shell.pointingHover(
				p,
				shift,
				ctrl
			);

	if( cursor !== null )
	{
		this._canvas.style.cursor =
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
			this.shell.pointingHover(
				this._$hover.p,
				this._$hover.shift,
				this._$hover.ctrl
			);

	if( cursor !== null )
	{
		this._canvas.style.cursor =
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
		canvas =
			this._canvas,

		p =
			Euclid.Point.create(
				'x',
					event.pageX - canvas.offsetLeft,
				'y',
					event.pageY - canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey,

		cursor =
			null;

	switch( this._$pointingState )
	{
		case false :

			this._pointingHover(
				p,
				shift,
				ctrl
			);

			break;

		case 'atween' :

			var dragbox =
				this.settings.dragbox;

			var atween =
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

				this._$pointingState =
					'drag';

				this.shell.dragStart(
					atween.pos,
					shift,
					ctrl
				);

				cursor =
					this.shell.dragMove(
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
				this.shell.dragMove(
					p,
					shift,
					ctrl
				);

			break;

		default :
			throw new Error(
				CHECK && 'invalid pointingState'
			);

	}

	if( cursor !== null )
	{
		canvas.style.cursor =
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
	event.preventDefault( );

	this._releaseEvents( );

	var
		canvas =
			this._canvas,

		p =
			Euclid.Point.create(
				'x',
					event.pageX - canvas.offsetLeft,
				'y',
					event.pageY - canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey;

	switch( this._$pointingState )
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

			this.shell.click(
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

			this._$pointingState =
				false;

			break;

		case 'drag' :

			this.shell.dragStop(
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

			this._$pointingState =
				false;

			break;

		default :

			throw new Error(
				CHECK && 'invalid pointingState'
			);
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
		canvas =
			this._canvas,

		p =
			Euclid.Point.create(
				'x',
					event.pageX - canvas.offsetLeft,
				'y',
					event.pageY - canvas.offsetTop
			);

	var dir;

	if( Jools.is( event.wheelDelta ) )
	{
		dir =
			event.wheelDelta > 0 ? 1 : -1;
	}
	else if( Jools.is( event.detail ) )
	{
		dir =
			event.detail > 0 ? -1 : 1;
	}
	else
	{
		Jools.log(
			'warn',
			'invalid wheel event'
		);

		return;
	}

	this.shell.mousewheel(
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
		canvas =
			this._canvas,

		p =
			Euclid.Point.create(
				'x',
					event.pageX - canvas.offsetLeft,
				'y',
					event.pageY - canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey;

	this._$pointingState =
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
					this.settings.dragtime,
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
		canvas =
			this._canvas,

		p =
			Euclid.Point.create(
				'x',
					event.pageX - canvas.offsetLeft,
				'y',
					event.pageY - canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey,

		cursor =
			null;

	switch( this._$pointingState )
	{
		case false:

			this._pointingHover(
				p,
				shift,
				ctrl
			);

			break;

		case 'atween':

			var dragbox =
				this.settings.dragbox;

			var atween =
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

				this._$pointingState =
					'drag';

				this.shell.dragStart(
					atween.pos,
					shift,
					ctrl
				);

				cursor =
					this.shell.dragMove(
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
				this.shell.dragMove(
					p,
					shift,
					ctrl
				);

			break;

		default :

			throw new Error(
				CHECK && 'invalid pointingState'
			);

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
		canvas =
			this._canvas,

		p =
			Euclid.Point.create(
				'x',
					event.changedTouches[ 0 ].pageX -
					canvas.offsetLeft,
				'y',
					event.changedTouches[ 0 ].pageY -
					canvas.offsetTop
			),

		shift =
			event.shiftKey,

		ctrl =
			event.ctrlKey || event.metaKey;

	switch( this._$pointingState )
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

			this.shell.click(
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

			this._$pointingState =
				false;

			break;

		case 'drag' :

			this.shell.dragStop(
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

			this._$pointingState =
				false;

			break;

		default :

			throw new Error(
				CHECK && 'invalid pointingState'
			);
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
		document.releaseCapture( this._canvas );

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

	this.shell.specialKey(
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
			this._hiddenInput,

		text =
			hi.value;

	// works around opera quirks inserting CR characters
	text =
		text.replace( /\r/g, '' );

	if(
		text === this._inputVal ||
		!this.shell
	)
	{
		return;
	}

	hi.value =
	this._inputVal =
		'';

	hi.selectionStart =
		0;

	this.shell.input( text );

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
		ac =
			this.shell.attentionCenter;

	if( ac === null )
	{
		this._hiddenInput.style.top =
			'0';
	}
	else
	{
		ac =
			Jools.limit(
				0,
				ac,
				this._$height - 15
			);

		this._hiddenInput.style.top =
			ac + 'px';
	}

	if( this.shell.suggestingKeyboard( ) )
	{
		this._hiddenInput.focus( );

		if( this._hiddenInput.scrollIntoViewIfNeeded )
		{
			this._hiddenInput.scrollIntoViewIfNeeded( true );
		}
	}
	else
	{
		this._canvas.focus( );
	}
};


/*
| System starts up ( pages loades )
*/
startup =
	function( )
{
	var catcher =
		makeCatcher(
			null,
			function( ) {
				system =
					new System( );

				system.shell =
					new Shell( system._fabric );

				system.shell.onload( );

				// FIXME work on IOS
				system._hiddenInput.focus( );
			}
		);

	if( !config.debug.weinre )
	{
		catcher( );
	}
	else
	{
		// gives weinre a moment to set itself up
		window.setTimeout( catcher, 1500 );
	}
};

} )( );
