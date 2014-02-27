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
	Jools,
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
						defaultValue :
							'null'
					},
				spaceTag :
					{
						comment :
							'name of currently loaded space',
						type :
							'String',
						defaultValue :
							'null'
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							'null'
					}
			},
		subclass :
			'Discs.Disc',
		init :
			[ ],
		twig :
			{
				'MainDisc' :
					Discs.MainDisc,
				'CreateDisc' :
					Discs.CreateDisc
			}
	};
}

var
	Jockey =
		Discs.Jockey;


/*
| Initializes the disc jockey.
*/
Jockey.prototype._init =
	function( )
{
	var
		path,
		ranks =
			this.ranks,
		twig =
			// FIXME do not copy when inherit.twig !== this.twig
			Jools.copy( this.twig );

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				ranks[ a ],

			proto =
				twig[ name ];

		if( !proto.path )
		{
			path =
				this.path.append( name );
		}
		else
		{
			path =
				undefined;
		}

		twig[ name ] =
			proto.create(
				'access',
					this.access,
				'action',
					this.action,
				'hover',
					// FIXME make a concernsHover in the disc
					( this.hover.isEmpty || this.hover.get( 1 ) !== name )
						?
						Path.empty
						:
						this.hover,
				'mark',
					this.mark,
				'mode',
					this.mode,
				'path',
					path,
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

	this.twig =
		twig;
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
		this.twig.CreateDisc.draw( fabric );
	}

	this.twig.MainDisc.draw( fabric );
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
			this.twig.MainDisc.pointingHover(
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
			this.twig.CreateDisc.pointingHover(
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
			this.twig.MainDisc.click(
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
			this.twig.CreateDisc.click(
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
				this.twig.CreateDisc.pushButton(
					path,
					shift,
					ctrl
				)
			);

		case 'MainDisc' :

			return (
				this.twig.MainDisc.pushButton(
					path,
					shift,
					ctrl
				)
			);

		default :

			throw new Error( );
	}
};


} )( );
