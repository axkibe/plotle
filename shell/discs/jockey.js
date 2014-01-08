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
	Path;

/*
| Capsule
*/
( function( ) {
'use strict';


/**/if( CHECK && typeof( window ) === 'undefined' )
/**/{
/**/	throw new Error(
/**/		'this code needs a browser!'
/**/	);
/**/}


var
	_tag =
		'DISC-JOCKEY-76533526',

	_discList =
		Object.freeze(
			[
				'MainDisc',
				'CreateDisc'
			]
		);


/*
| Constructor
*/
var Jockey =
Discs.Jockey =
	function(
		tag,
		inherit,
		access,
		action,
		hover,
		mark,
		mode,
		screensize,
		username
	)
{
	Jools.logNew(
		this,
		this.path
	);

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/
/**/	if( !hover || hover.reflect !== 'Path' )
/**/	{
/**/		throw new Error(
/**/			'invalid hover'
/**/		);
/**/	}
/**/}

	this.screensize =
		screensize;

	this.access =
		access;

	this.action =
		action;

	this.hover =
		hover;

	this.mark =
		mark;

	this.mode =
		mode;

	this.username =
		username;

	var
		discs =
			{ };

	for( var i in _discList )
	{
		var
			name =
				_discList[ i ];

/**/	if( CHECK )
/**/	{
/**/		if( !Discs[ name ] )
/**/		{
/**/			throw new Error(
/**/				'invalid disc'
/**/			);
/**/		}
/**/	}

		discs[ name ] =
			Discs[ name ].create(
				'inherit',
					inherit && inherit._discs[ name ],
				'access',
					access,
				'action',
					action,
				'hover',
					hover.isEmpty || hover.get( 1 ) !== name ?
						Path.empty
						:
						hover,
				'mark',
					mark,
				'mode',
					mode,
				'screensize',
					screensize,
				'username',
					username
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
		access =
			null,

		action =
			null,

		hover =
			null,

		inherit =
			null,

		mark =
			null,

		mode =
			null,

		screensize =
			null,

		username =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'access' :

				access =
					arguments[ a + 1 ];

				break;

			case 'action' :

				action =
					arguments[ a + 1 ];

				break;

			case 'hover' :

				hover =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'mode' :

				mode =
					arguments[ a + 1 ];

				break;

			case 'screensize' :

				screensize =
					arguments[ a + 1 ];

				break;

			case 'username' :

				username =
					arguments[ a + 1 ];

				break;


			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

	// TODO use concernsMark

	if( inherit )
	{
		if( access === null )
		{
			access =
				inherit.access;
		}

		if( action === null )
		{
			action =
				inherit.action;
		}

		if( hover === null )
		{
			hover =
				inherit.hover;
		}

		if( mark === null )
		{
			mark =
				inherit.mark;
		}

		if( mode === null )
		{
			mode =
				inherit.mode;
		}

		if( screensize === null )
		{
			screensize =
				inherit.screensize;
		}

		if(
			inherit.access === access
			&&
			inherit.action === action
			&&
			inherit.hover.equals( hover )
			&&
			inherit.mark.equals( mark )
			&&
			inherit.mode === mode
			&&
			inherit.screensize.equals( screensize )
			&&
			inherit.username === username
		)
		{
			return inherit;
		}
	}

	return (
		new Jockey(
			_tag,
			inherit,
			access,
			action,
			hover,
			mark,
			mode,
			screensize,
			username
		)
	);
};


/*
| Reflection.
*/
Jockey.prototype.reflect =
	'Disc:Jockey';


/*
| Disc jockey path
|
| TODO rename 'discs'
*/
Jockey.prototype.path =
	Path.empty.append( 'disc' );


/*
| Displays a current space
*/
Jockey.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag
	)
{
	return (
		this._discs.MainDisc.arrivedAtSpace(
			spaceUser,
			spaceTag
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
	if( this.mode === 'Create' )
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

	if( this.mode === 'Create' )
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

	if( this.mode === 'Create' )
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
			path.get( 1 );

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
