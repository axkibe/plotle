/*
| This is an autogenerated file.
|
| DO NOT EDIT!
*/


/*
| Export
*/
var
	Visual =
		Visual || { };


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
		496605732;


/*
| Constructor.
*/
var Portal =
Visual.Portal =
	function(
		tag,
		v_hover, // node currently hovered upon
		v_mark,  // the users mark
		v_path,  // the path of the doc
		v_tree,  // the data tree
		v_view   // the current view
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

	this.path =
		v_path;

	this.tree =
		v_tree;

	this.view =
		v_view;

	this._init( );

	Jools.immute( this );
};


Jools.subclass(
	Portal,
	Visual.Item
);


/*
| Creates a new Portal object.
*/
Portal.create =
Portal.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_hover,
		v_mark,
		v_path,
		v_traitSet,
		v_tree,
		v_view;

	if( this !== Portal )
	{
		inherit =
			this;

		v_hover =
			this.hover;

		v_mark =
			this.mark;

		v_path =
			this.path;

		v_tree =
			this.tree;

		v_view =
			this.view;
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

			case 'traitSet' :

				if( arg !== undefined )
				{
					v_traitSet =
						arg;
				}

				break;

			case 'tree' :

				if( arg !== undefined )
				{
					v_tree =
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

	if( v_traitSet === undefined )
	{
		v_traitSet =
			null;
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
/**/	if( v_mark === null )
/**/	{
/**/		throw new Error(
/**/			'mark must not be null'
/**/		);
/**/	}
/**/
/**/	if( v_path === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute path'
/**/		);
/**/	}
/**/
/**/	if( v_path === null )
/**/	{
/**/		throw new Error(
/**/			'path must not be null'
/**/		);
/**/	}
/**/	if( v_path.reflect !== 'Path' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/
/**/	if( v_traitSet === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute traitSet'
/**/		);
/**/	}
/**/
/**/	if( v_traitSet !== null )
/**/	{
/**/		if( v_traitSet.reflect !== 'TraitSet' )
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/
/**/	if( v_tree === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute tree'
/**/		);
/**/	}
/**/
/**/	if( v_tree === null )
/**/	{
/**/		throw new Error(
/**/			'tree must not be null'
/**/		);
/**/	}
/**/
/**/	if( v_view === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute view'
/**/		);
/**/	}
/**/
/**/	if( v_view === null )
/**/	{
/**/		throw new Error(
/**/			'view must not be null'
/**/		);
/**/	}
/**/	if( v_view.reflect !== 'View' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/}
	v_mark =
		Visual.Item.concernsMark(
			v_mark,
			v_path
		);


	if(
		inherit
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
		v_path.equals( inherit.path )
		&&
		v_traitSet === null
		&&
		v_tree === inherit.tree
		&&
		v_view.equals( inherit.view )
	)
	{
		return inherit;
	}

	return (
		new Portal(
			_tag,
			v_hover,
			v_mark,
			v_path,
			v_tree,
			v_view
		)
	);
};


/*
| Reflection.
*/
Portal.prototype.reflect =
	'Portal';


/*
| Sets values by path.
*/
Portal.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
Portal.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
Portal.prototype.equals =
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
		this.tree === obj.tree
		&&
		this.view.equals( obj.view )
	);
};


} )( );
