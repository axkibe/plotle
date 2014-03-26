/*
| This is an autogenerated file.
|
| DO NOT EDIT!
*/


/*
| Export
*/
var
	Text;


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
		467562417;


/*
| Node includes
*/
if( SERVER )
{
	JoobjProto =
		require( '../src/joobj/proto' );

	Jools =
		require( '../src/jools/jools' );
}


/*
| Constructor.
*/
Text =
	function(
		tag,
		v_text  // the text
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

	this.text =
		v_text;

	Jools.immute( this );
};


/*
| Creates a new Text object.
*/
Text.create =
Text.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_text;

	if( this !== Text )
	{
		inherit =
			this;

		v_text =
			this.text;
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
			case 'text' :

				if( arg !== undefined )
				{
					v_text =
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

	if( v_text === undefined )
	{
		v_text =
			'';
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_text === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute text'
/**/		);
/**/	}
/**/
/**/	if( v_text === null )
/**/	{
/**/		throw new Error(
/**/			'text must not be null'
/**/		);
/**/	}
/**/	if(
/**/		typeof( v_text ) !== 'string'
/**/		&&
/**/		!( v_text instanceof String )
/**/	)
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/}

	if(
		inherit
		&&
		v_text === inherit.text
	)
	{
		return inherit;
	}

	return (
		new Text(
			_tag,
			v_text
		)
	);
};


/*
| Reflection.
*/
Text.prototype.reflect =
	'Text';


/*
| Sets values by path.
*/
Text.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
Text.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
Text.prototype.equals =
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
		this.text === obj.text
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Text;
}


} )( );
