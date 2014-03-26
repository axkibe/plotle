/*
| This is an autogenerated file.
|
| DO NOT EDIT!
*/


/*
| Export
*/
var
	Forms =
		Forms || { };


/*
| Imports
*/
var
	JoobjProto,
	Jools;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		353766230;


/*
| Constructor.
*/
var Welcome =
Forms.Welcome =
	function(
		tag,
		inherit,    // inheritance
		ranks,      // twig order, set upon change
		twig,       // twig, set upon change
		v_hover,    // the widget hovered upon
		v_mark,     // the users mark
		v_path,     // the path of the form
		v_username, // currently logged in user
		v_view      // the current view
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	this.hover =
		v_hover;

	this.mark =
		v_mark;

	if( v_path !== undefined )
	{
		this.path =
			v_path;
	}

	this.username =
		v_username;

	if( v_view !== undefined )
	{
		this.view =
			v_view;
	}

	this.twig =
		twig;

	this.ranks =
		ranks;

	this._init(
		inherit
	);

	Jools.immute( this );
Jools.immute( ranks );
Jools.immute( twig );
};


Jools.subclass(
	Welcome,
	Forms.Form
);


/*
| Creates a new Welcome object.
*/
Welcome.create =
Welcome.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		key,
		ranks,
		twig,
		twigdup,
		v_hover,
		v_mark,
		v_path,
		v_spaceTag,
		v_spaceUser,
		v_username,
		v_view;

	if( this !== Welcome )
	{
		inherit =
			this;

		twig =
			inherit.twig;

		ranks =
			inherit.ranks;

		twigdup =
			false;

		v_hover =
			this.hover;

		v_mark =
			this.mark;

		v_path =
			this.path;

		v_username =
			this.username;

		v_view =
			this.view;
	}
	else
	{
		twig =
			{ };

		ranks =
			[ ];

		twigdup =
			true;
	}

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		var
			arg =
				arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'hover' :

				if( arg !== undefined )
				{
					v_hover =
						arg;
				}

				break;

			case 'mark' :

				if( arg !== undefined )
				{
					v_mark =
						arg;
				}

				break;

			case 'path' :

				if( arg !== undefined )
				{
					v_path =
						arg;
				}

				break;

			case 'spaceTag' :

				if( arg !== undefined )
				{
					v_spaceTag =
						arg;
				}

				break;

			case 'spaceUser' :

				if( arg !== undefined )
				{
					v_spaceUser =
						arg;
				}

				break;

			case 'username' :

				if( arg !== undefined )
				{
					v_username =
						arg;
				}

				break;

			case 'view' :

				if( arg !== undefined )
				{
					v_view =
						arg;
				}

				break;

			case 'twig:add' :

				if( !twigdup )
				{
					twig =
						Jools.copy( twig );

					ranks =
						ranks.slice( );

					twigdup =
						true;
				}

				key =
					arg;

				arg =
					arguments[ ++a + 1 ];

				if( twig[ key ] !== undefined )
				{
					throw new Error(
						'key "' + key + '" already in use'
					);
				}

				twig[ key ] =
					arg;

				ranks.push( key );

				break;

			case 'twig:set' :

				if( !twigdup )
				{
					twig =
						Jools.copy( twig );

					ranks =
						ranks.slice( );

					twigdup =
						true;
				}

				key =
					arg;

				arg =
					arguments[ ++a + 1 ];

				if( twig[ key ] === undefined )
				{
					throw new Error(
						'key "' + key + '" not in use'
					);
				}

				twig[ key ] =
					arg;

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

	if( v_hover === undefined )
	{
		v_hover =
			null;
	}

	if( v_mark === undefined )
	{
		v_mark =
			null;
	}

	if( v_path === undefined )
	{
		v_path =
			undefined;
	}

	if( v_spaceTag === undefined )
	{
		v_spaceTag =
			undefined;
	}

	if( v_spaceUser === undefined )
	{
		v_spaceUser =
			undefined;
	}

	if( v_username === undefined )
	{
		v_username =
			null;
	}

	if( v_view === undefined )
	{
		v_view =
			undefined;
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_hover === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute hover'
/**/		);
/**/	}
/**/
/**/	if( v_hover !== null )
/**/	{
/**/		if( v_hover.reflect !== 'Path' )
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/
/**/	if( v_mark === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute mark'
/**/		);
/**/	}
/**/
/**/	if( v_path === null )
/**/	{
/**/		throw new Error(
/**/			'path must not be null'
/**/		);
/**/	}
/**/
/**/	if( v_path !== undefined )
/**/	{
/**/		if( v_path.reflect !== 'Path' )
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/
/**/	if( v_spaceTag === null )
/**/	{
/**/		throw new Error(
/**/			'spaceTag must not be null'
/**/		);
/**/	}
/**/
/**/	if( v_spaceTag !== undefined )
/**/	{
/**/		if(
/**/			typeof( v_spaceTag ) !== 'string'
/**/			&&
/**/			!( v_spaceTag instanceof String )
/**/		)
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/
/**/	if( v_spaceUser === null )
/**/	{
/**/		throw new Error(
/**/			'spaceUser must not be null'
/**/		);
/**/	}
/**/
/**/	if( v_spaceUser !== undefined )
/**/	{
/**/		if(
/**/			typeof( v_spaceUser ) !== 'string'
/**/			&&
/**/			!( v_spaceUser instanceof String )
/**/		)
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/
/**/	if( v_username === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute username'
/**/		);
/**/	}
/**/
/**/	if( v_username !== null )
/**/	{
/**/		if(
/**/			typeof( v_username ) !== 'string'
/**/			&&
/**/			!( v_username instanceof String )
/**/		)
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/
/**/	if( v_view === null )
/**/	{
/**/		throw new Error(
/**/			'view must not be null'
/**/		);
/**/	}
/**/
/**/	if( v_view !== undefined )
/**/	{
/**/		if( v_view.reflect !== 'View' )
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/}
	v_mark =
		Forms.Form.concernsMark(
			v_mark,
			v_path
		);

	v_view =
		v_view !== undefined ?
			v_view.sizeOnly:
			null;

	if(
		inherit
		&&
		!twigdup
		&&
		(
			v_hover === inherit.hover
			||
			(
				v_hover
				&&
				v_hover.equals( inherit.hover )
			)
		)
		&&
		v_mark === inherit.mark
		&&
		(
			v_path === inherit.path
			||
			(
				v_path
				&&
				v_path.equals( inherit.path )
			)
		)
		&&
		v_spaceTag === null
		&&
		v_spaceUser === null
		&&
		v_username === inherit.username
		&&
		(
			v_view === inherit.view
			||
			(
				v_view
				&&
				v_view.equals( inherit.view )
			)
		)
	)
	{
		return inherit;
	}

	return (
		new Welcome(
			_tag,
			inherit,
			ranks,
			twig,
			v_hover,
			v_mark,
			v_path,
			v_username,
			v_view
		)
	);
};


/*
| Reflection.
*/
Welcome.prototype.reflect =
	'Welcome';


/*
| Sets values by path.
*/
Welcome.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
Welcome.prototype.getPath =
	JoobjProto.getPath;


/*
| .
*/
Welcome.prototype.atRank =
	JoobjProto.atRank;


/*
| Checks for equal objects.
*/
Welcome.prototype.equals =
	function(
		obj
	)
{
	if( this === obj )
	{
		return true;
	}

	if( !obj )
	{
		return false;
	}

	return (
		this.twig === obj.twig
		&&
		(
			this.hover === obj.hover ||
			(
				this.hover !== null
				&&
				this.hover.equals( obj.hover )
			)
		)
		&&
		this.mark === obj.mark
		&&
		this.path.equals( obj.path )
		&&
		this.username === obj.username
		&&
		this.view.equals( obj.view )
	);
};


} )( );
