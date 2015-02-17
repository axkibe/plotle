/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	jion_attribute;


if( SERVER )
{
	jion_attribute = module.exports;
}
else
{
	jion_attribute = { };
}


/*
| Imports.
*/
var
	jools,
	ast_and,
	ast_arrayLiteral,
	ast_assign,
	ast_boolean,
	ast_call,
	ast_comma,
	ast_condition,
	ast_delete,
	ast_differs,
	ast_dot,
	ast_equals,
	ast_func,
	ast_greaterThan,
	ast_instanceof,
	ast_lessThan,
	ast_member,
	ast_multiply,
	ast_multiplyAssign,
	ast_new,
	ast_not,
	ast_null,
	ast_number,
	ast_objLiteral,
	ast_or,
	ast_plus,
	ast_plusAssign,
	ast_preIncrement,
	ast_string,
	ast_typeof,
	ast_var,
	jion_concern,
	jion_id,
	jion_idGroup,
	jion_proto;


/*
| Capsule
*/
(
function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../../src/jools/jools' );

	ast_and = require( '../../src/ast/and' );

	ast_arrayLiteral = require( '../../src/ast/arrayLiteral' );

	ast_assign = require( '../../src/ast/assign' );

	ast_boolean = require( '../../src/ast/boolean' );

	ast_call = require( '../../src/ast/call' );

	ast_comma = require( '../../src/ast/comma' );

	ast_condition = require( '../../src/ast/condition' );

	ast_delete = require( '../../src/ast/delete' );

	ast_differs = require( '../../src/ast/differs' );

	ast_dot = require( '../../src/ast/dot' );

	ast_equals = require( '../../src/ast/equals' );

	ast_func = require( '../../src/ast/func' );

	ast_greaterThan = require( '../../src/ast/greaterThan' );

	ast_instanceof = require( '../../src/ast/instanceof' );

	ast_lessThan = require( '../../src/ast/lessThan' );

	ast_member = require( '../../src/ast/member' );

	ast_multiply = require( '../../src/ast/multiply' );

	ast_multiplyAssign = require( '../../src/ast/multiplyAssign' );

	ast_new = require( '../../src/ast/new' );

	ast_not = require( '../../src/ast/not' );

	ast_null = require( '../../src/ast/null' );

	ast_number = require( '../../src/ast/number' );

	ast_objLiteral = require( '../../src/ast/objLiteral' );

	ast_or = require( '../../src/ast/or' );

	ast_plus = require( '../../src/ast/plus' );

	ast_plusAssign = require( '../../src/ast/plusAssign' );

	ast_preIncrement = require( '../../src/ast/preIncrement' );

	ast_string = require( '../../src/ast/string' );

	ast_typeof = require( '../../src/ast/typeof' );

	ast_var = require( '../../src/ast/var' );

	jion_concern = require( '../../src/jion/concern' );

	jion_id = require( '../../src/jion/id' );

	jion_idGroup = require( '../../src/jion/idGroup' );

	jion_proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var
	Constructor,
	prototype;


Constructor =
	function(
		v_allowsNull, // attribute may be null
		v_allowsUndefined, // attribute may be undefined
		v_assign, // variable name to assign to
		v_comment, // comment
		v_concerns, // concerns function call
		v_defaultValue, // default value
		v_id, // attribute type id
		v_json, // include in JSON export/import
		v_name, // attribute name
		v_v // attribute variable used in generate
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__have_lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.allowsNull = v_allowsNull;

	this.allowsUndefined = v_allowsUndefined;

	this.assign = v_assign;

	this.comment = v_comment;

	this.concerns = v_concerns;

	if( v_defaultValue !== undefined )
	{
		this.defaultValue = v_defaultValue;
	}

	this.id = v_id;

	this.json = v_json;

	this.name = v_name;

	this.v = v_v;

	if( FREEZE )
	{
		Object.freeze( this );
	}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


jion_attribute.prototype = prototype;


/*
| Creates a new attribute object.
*/
jion_attribute.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		a,
		aZ,
		arg,
		inherit,
		v_allowsNull,
		v_allowsUndefined,
		v_assign,
		v_comment,
		v_concerns,
		v_defaultValue,
		v_id,
		v_json,
		v_name,
		v_v;

	if( this !== jion_attribute )
	{
		inherit = this;

		v_allowsNull = this.allowsNull;

		v_allowsUndefined = this.allowsUndefined;

		v_assign = this.assign;

		v_comment = this.comment;

		v_concerns = this.concerns;

		v_defaultValue = this.defaultValue;

		v_id = this.id;

		v_json = this.json;

		v_name = this.name;

		v_v = this.v;
	}

	for(
		a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		arg = arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'allowsNull' :

				if( arg !== undefined )
				{
					v_allowsNull = arg;
				}

				break;

			case 'allowsUndefined' :

				if( arg !== undefined )
				{
					v_allowsUndefined = arg;
				}

				break;

			case 'assign' :

				if( arg !== undefined )
				{
					v_assign = arg;
				}

				break;

			case 'comment' :

				if( arg !== undefined )
				{
					v_comment = arg;
				}

				break;

			case 'concerns' :

				if( arg !== undefined )
				{
					v_concerns = arg;
				}

				break;

			case 'defaultValue' :

				if( arg !== undefined )
				{
					v_defaultValue = arg;
				}

				break;

			case 'id' :

				if( arg !== undefined )
				{
					v_id = arg;
				}

				break;

			case 'json' :

				if( arg !== undefined )
				{
					v_json = arg;
				}

				break;

			case 'name' :

				if( arg !== undefined )
				{
					v_name = arg;
				}

				break;

			case 'v' :

				if( arg !== undefined )
				{
					v_v = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_allowsNull === undefined )
	{
		v_allowsNull = false;
	}

	if( v_allowsUndefined === undefined )
	{
		v_allowsUndefined = false;
	}

	if( v_concerns === undefined )
	{
		v_concerns = null;
	}

	if( v_json === undefined )
	{
		v_json = false;
	}

/**/if( CHECK )
/**/{
/**/	if( v_allowsNull === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_allowsNull === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( typeof( v_allowsNull ) !== 'boolean' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_allowsUndefined === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_allowsUndefined === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( typeof( v_allowsUndefined ) !== 'boolean' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_assign === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_assign !== null )
/**/	{
/**/		if(
/**/			typeof( v_assign ) !== 'string'
/**/			&&
/**/			!( v_assign instanceof String )
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_comment === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_comment === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_comment ) !== 'string'
/**/		&&
/**/		!( v_comment instanceof String )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_concerns === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_concerns !== null )
/**/	{
/**/		if( v_concerns.reflect !== 'jion_concern' )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_defaultValue === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_defaultValue !== undefined )
/**/	{
/**/		if(
/**/			v_defaultValue.reflect !== 'ast_and'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_arrayLiteral'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_assign'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_boolean'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_call'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_comma'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_condition'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_delete'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_differs'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_dot'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_equals'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_func'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_greaterThan'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_instanceof'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_lessThan'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_member'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_multiply'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_multiplyAssign'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_new'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_not'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_null'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_number'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_objLiteral'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_or'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_plus'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_plusAssign'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_preIncrement'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_string'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_typeof'
/**/			&&
/**/			v_defaultValue.reflect !== 'ast_var'
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/
/**/	if( v_id === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_id === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		v_id.reflect !== 'jion_id'
/**/		&&
/**/		v_id.reflect !== 'jion_idGroup'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_json === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_json === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( typeof( v_json ) !== 'boolean' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_name === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_name === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_name ) !== 'string'
/**/		&&
/**/		!( v_name instanceof String )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_v === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_v === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_v.reflect !== 'ast_var' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		inherit
		&&
		v_allowsNull === inherit.allowsNull
		&&
		v_allowsUndefined === inherit.allowsUndefined
		&&
		v_assign === inherit.assign
		&&
		v_comment === inherit.comment
		&&
		(
			v_concerns === inherit.concerns
			||
			v_concerns !== null && v_concerns.equals( inherit.concerns )
		)
		&&
		(
			v_defaultValue === inherit.defaultValue
			||
			v_defaultValue !== undefined
			&&
			v_defaultValue.equals( inherit.defaultValue )
		)
		&&
		v_id.equals( inherit.id )
		&&
		v_json === inherit.json
		&&
		v_name === inherit.name
		&&
		v_v.equals( inherit.v )
	)
	{
		return inherit;
	}

	return (
		new Constructor(
			v_allowsNull,
			v_allowsUndefined,
			v_assign,
			v_comment,
			v_concerns,
			v_defaultValue,
			v_id,
			v_json,
			v_name,
			v_v
		)
	);
};


/*
| Reflection.
*/
prototype.reflect = 'jion_attribute';


/*
| Name Reflection.
*/
prototype.reflectName = 'attribute';


/*
| Sets values by path.
*/
prototype.setPath = jion_proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion_proto.getPath;


/*
| Tests equality of object.
*/
prototype.equals =
	function(
		obj // object to compare to
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

	if( obj.reflect !== 'jion_attribute' )
	{
		return false;
	}

	return (
		this.allowsNull === obj.allowsNull
		&&
		this.allowsUndefined === obj.allowsUndefined
		&&
		this.assign === obj.assign
		&&
		this.comment === obj.comment
		&&
		(
			this.concerns === obj.concerns
			||
			this.concerns !== null && this.concerns.equals( obj.concerns )
		)
		&&
		(
			this.defaultValue === obj.defaultValue
			||
			this.defaultValue !== undefined
			&&
			this.defaultValue.equals( obj.defaultValue )
		)
		&&
		this.id.equals( obj.id )
		&&
		this.json === obj.json
		&&
		this.name === obj.name
		&&
		this.v.equals( obj.v )
	);
};


}
)( );
