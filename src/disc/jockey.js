/*
| The disc jockey is the master of all discs.
*/


var
	disc_jockey,
	jion_path,
	jools;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'disc_jockey',
		attributes :
			{
				access :
					{
						comment : 'users access to current space',
						type : 'string',
						defaultValue : 'null'
					},
				action :
					{
						comment : 'currently active action',
						type : '->action',
						defaultValue : 'undefined'
					},
				hover :
					{
						comment : 'the widget hovered upon',
						type : 'jion_path'
					},
				mark :
					{
						comment : 'the users mark',
						prepare : 'disc_jockey.concernsMark( mark )',
						type : '->mark',
						allowsUndefined : true
					},
				mode :
					{
						comment : 'current mode the UI is in',
						type : 'string'
					},
				path :
					{
						comment : 'path of the disc',
						type : 'jion_path'
					},
				view :
					{
						comment : 'the current view',
						type : 'euclid_view'
					},
				spaceRef :
					{
						comment : 'currently loaded space',
						type : 'fabric_spaceRef',
						defaultValue : 'null'
					},
				user :
					{
						comment : 'currently logged in user',
						type : 'user_creds',
						defaultValue : 'null'
					}
			},
		init :
			[ ],
		twig :
			[ 'disc_mainDisc', 'disc_createDisc' ]
	};
}


var
	prototype;

prototype = disc_jockey.prototype;


/*
| Returns the mark if the form jockey concerns a mark.
|
| FIXME go into markItemPath
*/
disc_jockey.concernsMark =
	function(
		mark
	)
{
	return mark;
};


/*
| Initializes the disc jockey.
*/
prototype._init =
	function( )
{
	var
		name,
		path,
		proto,
		ranks,
		twig;

	ranks = this.ranks;

	// FIXME do not copy when inherit.twig !== this.twig
	twig = jools.copy( this.twig );

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		name = ranks[ a ];

		proto = twig[ name ];

		if( !proto.path )
		{
			path =
				this.path
				.append( 'twig' )
				.append( name );
		}
		else
		{
			path = pass;
		}

		twig[ name ] =
			proto.create(
				'access', this.access,
				'action', this.action,
				'hover',
					// FIXME make a concernsHover in the disc
					( this.hover.isEmpty || this.hover.get( 2 ) !== name )
					?  jion_path.empty
					: this.hover,
				'mark', this.mark,
				'mode', this.mode,
				'path', path,
				'view', this.view,
				'spaceRef', this.spaceRef,
				// FIXME hand user object
				'username', this.user && this.user.name
			);
	}

	this.twig = twig;
};


/*
| Start of a dragging operation.
*/
prototype.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		bubble;

	bubble =
		this.twig.mainDisc.dragStart(
			p,
			shift,
			ctrl
		);

	if( bubble !== null )
	{
		return bubble;
	}

	if( this.mode === 'create' )
	{
		return this.twig.createDisc.dragStart( p, shift, ctrl );
	}

	return null;
};


/*
| Dispalys the disc panel.
*/
prototype.draw =
	function(
		display
	)
{
	if( this.mode === 'create' )
	{
		this.twig.createDisc.draw( display );
	}

	this.twig.mainDisc.draw( display );
};


/*
| Returns true if point is on the disc panel.
*/
prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		hover;

	hover =
		this.twig.mainDisc.pointingHover( p, shift, ctrl );

	if( hover !== null )
	{
		return hover;
	}

	if( this.mode === 'create' )
	{
		return this.twig.createDisc.pointingHover( p, shift, ctrl );
	}

	return null;
};


/*
| Returns true if point is on this panel.
*/
prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		start;

	start = this.twig.mainDisc.click( p, shift, ctrl );

	if( start !== null )
	{
		return start;
	}

	if( this.mode === 'create' )
	{
		return this.twig.createDisc.click( p, shift, ctrl );
	}

	return null;
};


/*
| A button of the main disc has been pushed.
*/
prototype.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
	switch( path.get( 2 ) )
	{
		case 'createDisc' :

			return this.twig.createDisc.pushButton( path, shift, ctrl );

		case 'mainDisc' :

			return this.twig.mainDisc.pushButton( path, shift, ctrl );

		default :

			throw new Error( );
	}
};


} )( );
