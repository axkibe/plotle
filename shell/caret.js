/*
|
| The virtual caret.
|
| Authors: Axel Kittenberger
|
*/


/*
| Exports
*/
var Caret = null;


/*
| Imports
*/
var Euclid;
var Jools;
var shell;
var system;


/*
| Capsule
*/
(function() {

'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
Caret =
	function(
		sign,
		retainx,
		shown
	)
{
	// a signature pointing to the item the caret is in
	this.sign =
		sign;

	// x position to retain when using up/down keys.
	this.retainx =
		retainx;

	Jools.immute( this );

	// position cache
	this.$pos =
		null;

	// true if visible
	this.$shown =
		!!shown;

	// true when just blinked away
	this.$blinked =
		false;

	// TODO remove
	Jools.keyNonGrata( this, 'section' );
};


/*
| If true uses getImageData() to cache the image
| without the caret to achieve blinking.
| Without it uses drawImage() for the whole canvas.
| On firefox this is paradoxically way faster.
*/
Caret.useGetImageData =
	true;


/*
| Shows the caret or resets the blink timer if already shown
*/
Caret.prototype.show =
	function( )
{
	this.$shown =
		true;

	this.$blinked =
		false;

	system.restartBlinker( );
};


/*
| Hides the caret.
*/
Caret.prototype.hide =
	function( )
{
	this.$shown =
		false;
};


/*
| Draws or erases the caret.
*/
Caret.prototype.display =
	function( )
{
	// erases the old caret
	if( this.$save )
	{
		if( Caret.useGetImageData )
		{
			shell.fabric.putImageData(
				this.$save,
				this.$screenPos
			);
		}
		else
		{
			shell.fabric.drawImage(
				'image', this.$save,
				'x', 0,
				'y', 0
			);
		}
	}

	this.$save =
	this.$screenPos =
	this.$height =
		null;

	if(
		!this.$shown ||
		!this.sign
	)
	{
		return;
	}

	// calculates new position
	// even if blinked, so system can fiddle the input
	// position correctly
	shell.positionCaret( );

	var pos =
		this.$screenPos;

	var height =
		this.$height;

	if( !this.$blinked && pos !== null )
	{
		// saves the caret background
		if( Caret.useGetImageData )
		{
			this.$save = shell.fabric.getImageData(
				pos.x,
				pos.y,
				3,
				height + 2
			);
		}
		else
		{
			// paradoxically this is sometimes faster ( like on firefox )
			// FIXME autodetect mode
			this.$save = new Euclid.Fabric(
				shell.fabric.width,
				shell.fabric.height
			);

			this.$save.drawImage(
				'image', shell.fabric,
				'x', 0,
				'y', 0
			);
		}

		// draws the caret
		shell.fabric.fillRect(
			'black',
			pos.x + 1,
			pos.y + 1,
			1,
			height
		);
	}
};


/*
| Switches caret visibility state.
*/
Caret.prototype.blink =
	function( )
{
	if( this.$shown )
	{
		this.$blinked =
			!this.$blinked;

		this.display( );
	}
};


} )( );
