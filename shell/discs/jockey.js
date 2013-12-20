/*
| The disc jockey is the master of all discs
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Discs;

Discs =
	Discs || { };


/*
| Imports
*/
var
	Path,
	shell;

/*
| Capsule
*/
( function( ) {
'use strict';


if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


var
	_tag =
		'DISC-JOCKEY-76533526';

/*
| Constructor
*/
var Jockey =
Discs.Jockey =
	function(
		tag,
		inherit,
		screensize,
		hover
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if( !hover || hover.reflect !== 'Path' )
		{
			throw new Error(
				'invalid hover'
			);
		}
	}

	// TODO make static, immutable
	var
		discList =
		this._discList =
			[
				'MainDisc',
				'CreateDisc'
			];

	this.screensize =
		screensize;

	this.hover =
		hover;

	var
		discs =
			{ };

	for( var i in discList )
	{
		var
			name =
				discList[ i ];

		discs[ name ] =
			Discs.Disc.create(
				'name',
					name,
				'inherit',
					inherit && inherit._discs[ name ],
				'hover',
					hover.length === 0
						?
						hover // empty
						:
						(
							hover.get( 0 ) === name
							?
							hover
							:
							Path.empty
						),
				'screensize',
					screensize
			);
	}

	// XXX immute
	this._discs =
		discs;
};


/*
| Creates a new disc jockey.
*/
Jockey.create =
	function(
		// free strings
	)
{
	var
		hover =
			null,

		inherit =
			null,

		screensize =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'hover' :

				hover =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'screensize' :

				screensize =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: '
				);
		}
	}

	if( inherit )
	{
		if( screensize === null )
		{
			screensize =
				inherit.screensize;
		}

		if( hover === null )
		{
			hover =
				inherit.hover;
		}

		// FIXME add immuted tests
	}

	return (
		new Jockey(
			_tag,
			inherit,
			screensize,
			hover
		)
	);
};



/*
| Displays a current space
*/
Jockey.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag,
		access
	)
{
	return (
		this._discs.MainDisc.arrivedAtSpace(
			spaceUser,
			spaceTag,
			access
		)
	);
};


/*
| Start of a dragging operation.
*/
Jockey.prototype.dragStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


/*
| Draws the disc panel.
*/
Jockey.prototype.draw =
	function(
		fabric
	)
{
	if( shell.bridge.inMode( 'Create' ) )
	{
		this._discs.CreateDisc.draw( fabric );
	}

	this._discs.MainDisc.draw( fabric );
};


/*
| Returns true if point is on the disc panel.
*/
Jockey.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		hover =
			this._discs.MainDisc.pointingHover(
				p,
				shift,
				ctrl
			);

	if( hover !== null )
	{
		return hover;
	}

	if( shell.bridge.inMode( 'Create' ) )
	{
		return (
			this._discs.CreateDisc.pointingHover(
				p,
				shift,
				ctrl
			)
		);
	}

	return null;
};


/*
| Displays a message
*/
Jockey.prototype.message =
	function(
		// message
	)
{
	// nothing
};


/*
| Returns true if point is on this panel.
*/
Jockey.prototype.pointingStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		start =
			this._discs.MainDisc.pointingStart(
				p,
				shift,
				ctrl
			);

	if( start !== null )
	{
		return start;
	}

	if( shell.bridge.inMode( 'Create' ) )
	{
		return (
			this._discs.CreateDisc.pointingStart(
				p,
				shift,
				ctrl
			)
		);
	}

	return null;
};


/*
| A button of the main disc has been pushed.
*/
Jockey.prototype.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
	var
		discname =
			path.get( 0 );

	switch( discname )
	{
		case 'CreateDisc' :

			return (
				this._discs.CreateDisc.pushButton(
					path,
					shift,
					ctrl
				)
			);

		case 'MainDisc' :

			return (
				this._discs.MainDisc.pushButton(
					path,
					shift,
					ctrl
				)
			);

		default :

			throw new Error(
				'invalid discname: ' + discname
			);
	}
};


/*
| Sets the hovered component.
|
| TODO remove
*/
Jockey.prototype.setHover =
	function(
		path
	)
{
	var
		discname =
			path.get( 0 );

	switch( discname )
	{
		case 'CreateDisc' :

			this._discs.CreateDisc =
				Discs.Disc.create(
					'name',
						'CreateDisc',
					'inherit',
						this._discs.CreateDisc,
					'hover',
						path
				);

			return;

		case 'MainDisc' :

			this._discs.MainDisc =
				Discs.Disc.create(
					'name',
						'MainDisc',
					'inherit',
						this._discs.MainDisc,
					'hover',
						path
				);

			return;

		default :

			throw new Error(
				'invalid discname: ' + discname
			);
	}
};


/*
| An action started or stoped or changed
|
| TODO remove
*/
Jockey.prototype.setMode =
	function(
		mode
	)
{
	return this._discs.MainDisc.setMode( mode );
};


/*
| Displays the current space zoom level
*/
Jockey.prototype.setSpaceZoom =
	function(
		// zf
	)
{
	// nothing
};


/*
| Displays the current user
| Adapts login/logout/signup button
|
| TODO remove
*/
Jockey.prototype.setUser =
	function(
		user
	)
{
	return this._discs.MainDisc.setUser( user );
};


/*
| TODO remove
*/
Jockey.prototype.setActive =
	function(
		active
	)
{
	return this._discs.CreateDisc.setActive( active );
};


} )( );
