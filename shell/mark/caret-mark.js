/*
| The virtual caret.
|
| Authors: Axel Kittenberger
|
| TODO remove $stuff
*/


/*
| Exports
*/
var
	CaretMark =
		null;


/*
| Imports
*/
var
	Euclid,
	Jools,
	shell,
	system;


/*
| Capsule
*/
(function() {

'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
CaretMark =
	function(
		sign,
		retainx
	)
{
	// a signature pointing to the item the caret is in
	this.sign =
		sign;

	// x position to retain when using up/down keys.
	this.retainx =
		retainx;

	// position cache
	this.$pos =
		null;

	Jools.immute( this );
};


/*
| If true uses getImageData() to cache the image
| without the caret to achieve blinking.
| Without it uses drawImage() for the whole canvas.
| On firefox this is paradoxically way faster.
*/
CaretMark.useGetImageData =
	true;


/*
| Draws or erases the caret.
*/
CaretMark.prototype.display =
	function(
		blink
	)
{
	// erases the old caret
	if( this.$save )
	{
		if( CaretMark.useGetImageData )
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

	if( !this.sign )
	{
		return;
	}

	// calculates new position
	// even if blinked, so system can fiddle the input
	// position correctly
	shell.positionCaret( );

	var
		pos =
			this.$screenPos,

		height =
			this.$height;

	if( !blink && pos !== null )
	{
		// saves the caret background
		if( CaretMark.useGetImageData )
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


} )( );
