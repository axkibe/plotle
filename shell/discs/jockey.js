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


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'Jockey',

		unit :
			'Discs',

		attributes :
			{
				access :
					{
						comment :
							'users access to current space',

						type :
							'String'
					},

				action :
					{
						comment :
							'currently active action',

						type :
							'Action'
					},

				hover :
					{
						comment :
							'the widget hovered upon',

						type :
							'Path'
					},

				mark :
					{
						comment :
							'the users mark',

						concerns :
							{
								func :
									'Discs.Jockey.concernsMark',

								args :
									[
										'mark'
									]
							},

						type :
							'Mark'

					},

				mode :
					{
						comment :
							'current mode the UI is in',

						type :
							'String'
					},

				path :
					{
						comment :
							'path of the disc',

						type :
							'Path'
					},

				view :
					{
						comment :
							'the current view',

						type :
							'View'
					},

				spaceUser :
					{
						comment :
							'owner of currently loaded space',

						type :
							'String',

						allowNull :
							true
					},

				spaceTag :
					{
						comment :
							'name of currently loaded space',

						type :
							'String',

						allowNull :
							true
					},

				username :
					{
						comment :
							'currently logged in user',

						type :
							'String',

						allowNull :
							true
					}
			},

		subclass :
			'Discs.Disc',

		init :
			[
				'inherit'
			]
	};
}

var
	Jockey =
		Discs.Jockey;


var
	_discList =
		Object.freeze(
			[
				'MainDisc',
				'CreateDisc'
			]
		);



/*
| Initializes the disc jockey.
*/
Jockey.prototype._init =
	function(
		inherit
	)
{
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
					this.access,
				'action',
					this.action,
				'hover',
					// FIXME make a concernsHover in the disc
					this.hover.isEmpty || this.hover.get( 1 ) !== name ?
						Path.empty
						:
						this.hover,
				'mark',
					this.mark,
				'mode',
					this.mode,
				'path',
					this.path.append( name ),
				'view',
					this.view,
				'spaceUser',
					this.spaceUser,
				'spaceTag',
					this.spaceTag,
				'username',
					this.username
			);
	}

	this._discs =
		Object.freeze( discs );
};


/*
| Returns the mark if the form jockey concerns a mark.
|
| FIXME go into markItemPath
*/
Jockey.concernsMark =
	function(
		mark
	)
{
	return mark;
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
Jockey.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		start =
			this._discs.MainDisc.click(
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
			this._discs.CreateDisc.click(
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
				CHECK
				&&
				( 'invalid discname: ' + discname )
			);
	}
};


} )( );
