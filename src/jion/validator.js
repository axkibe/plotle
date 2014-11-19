/*
| Checks if a jion definition is ok.
*/


/*
| Exports.
*/
var
	validator;

validator = { };


/*
| Imports.
*/
var
	jools;


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );
}


/*
| Attributes must not be named like these.
*/
var _attributeBlacklist =
	Object.freeze( {
		'atRank' : true,
		'create' : true,
		'getPath' : true,
		'inherit' : true,
		'newUID' : true,
		'ranks' : true,
		'rankOf' : true,
		'ray' : true,
		'rayDup' : true,
		'setPath' : true,
		'twig' : true,
		'twigDup' : true
	} );


/*
| A jion definition may have these.
*/
var _jionWhitelist =
	Object.freeze( {
		'alike' : true,
		'attributes' : true,
		'id' : true,
		'init' : true,
		'json' : true,
		'node' : true,
		'equals' : true,
		'subclass' : true,
		'singleton' : true,
		'ray' : true,
		'twig' : true,
	} );


/*
| Checks if a jion concern definition looks ok.
*/
var _checkConcern =
	function(
		concern
	)
{
	for( var name in concern )
	{
		switch( name )
		{
			case 'args' :
			case 'func' :
			case 'member' :
			case 'type' :

				break;

			default :

				throw new Error(
					'invalid concerns: "' + name + '"'
				);
		}
	}

	if( concern.unit && !concern.type )
	{
		throw new Error(
			'concern "' + name + '" has unit but not type'
		);
	}
};


/*
| Checks the alike definitions.
*/
var _checkAlikes =
	function(
		jion // the jion definition
	)
{
	var
		alike,
		adef,
		ignores,
		name;

	alike = jion.alike;

	if( !jion.attributes )
	{
		throw new Error(
			'there cannot be alikes without attributes'
		);
	}

	for( name in alike )
	{
		adef = alike[ name ];

		for( var spec in adef )
		{
			if( spec !== 'ignores' )
			{
				throw new Error(
					'alike ' + name + ' has invalid specifier ' + spec
				);
			}
		}

		ignores = adef.ignores;

		if( typeof( ignores ) !== 'object' )
		{
			throw new Error(
				'alike ' + name + ' misses ignores.'
			);
		}

		for( var attr in ignores )
		{
			if( !jion.attributes[ attr ] )
			{
				throw new Error(
					'alike ' + name + ' ignores unknown attribute ' + attr
				);
			}
		}
	}
};


/*
| Checks the twig definition.
*/
var _checkTwig =
	function(
		jion // the jion definition
	)
{
	var
		entry,
		map,
		twig;

	twig = jion.twig;

	map = { };

	if( jools.isString( twig ) )
	{
		if( !( /\->[a-zA-Z_-]+/.test( jion.twig ) ) )
		{
			throw new Error( 'invalid typemap reference' );
		}

		twig = require( '../typemaps/' + twig.substr( 2 ) + '.js' );
	}

	if(
		!( Array.isArray( twig ) )
	)
	{
		throw new Error(
			'twig definition must be an Array or a typemap to one'
		);
	}

	for(
		var a = 0, aZ = twig.length;
		a < aZ;
		a++
	)
	{
		entry = twig[ a ];

		if( !jools.isString( entry ) )
		{
			throw new Error(
				'twig definition entry not a String'
			);
		}

		if( map[ entry ] )
		{
			throw new Error(
				'twig definition contains duplicate: '
				+ entry
			);
		}

		map[ entry ] = true;
	}
};


/*
| Checks the ray definition.
*/
var _checkRay =
	function(
		jion // the jion definition
	)
{
	var
		entry,
		map,
		ray;

	ray = jion.ray;

	map = { };

	if( jools.isString( ray ) )
	{
		if( !( /\->[a-zA-Z_-]+/.test( jion.ray ) ) )
		{
			throw new Error( 'invalid typemap reference' );
		}

		ray = require( '../typemaps/' + ray.substr( 2 ) + '.js' );
	}

	if(
		!( Array.isArray( ray ) )
	)
	{
		throw new Error(
			'ray definition must be an Array or a typemap to one'
		);
	}

	for(
		var a = 0, aZ = ray.length;
		a < aZ;
		a++
	)
	{
		entry = ray[ a ];

		if( !jools.isString( entry ) )
		{
			throw new Error(
				'twig definition entry not a String'
			);
		}

		if( map[ entry ] )
		{
			throw new Error(
				'twig definition contains duplicate: '
				+ entry
			);
		}

		map[ entry ] = true;
	}
};


/*
| Checks if an attributes type is valid.
|
| This does not include sets, it checks a single type.
*/
var _checkAttributeSingleType =
	function(
		name, // attribute name
		type  // the type specifier to check
	)
{
	if( !jools.isString( type ) )
	{
		throw new Error(
			'attribute "' + name + '" has invalid type: ' + type
		);
	}

	if( type.indexOf( '.' ) < 0  )
	{
		switch( type )
		{
			case 'Array' :
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'Object' :
			case 'String' :

				break;

			default :

				throw new Error(
					'attribute "' + name + '", type misses unit: ' + type
				);
		}
	}
};



/*
| Checks if a jion attribute definition looks ok.
*/
var _checkAttribute =
	function(
		jion,	// the jion definition
		name	// the attribute name
	)
{
	var
		a, aZ,
		attr,
		key,
		type,
		value;

	if( _attributeBlacklist[ name ] )
	{
		throw new Error(
			'attribute must not be named "' + name + '"'
		);
	}

	attr = jion.attributes[ name ];

	type = attr.type;

	if( jools.isString( type ) )
	{
		_checkAttributeSingleType( name, type );
	}
	else if( Array.isArray( type ) )
	{
		// for now assuming its okay

		for( a = 0, aZ = type.length; a < aZ; a++ )
		{
			_checkAttributeSingleType( name, type[ a ] );
		}
	}
	else
	{
		throw new Error(
			'attribute "' + name + '" has invalid type: ' + type
		);
	}

	for( key in attr )
	{
		value = attr[ key ];

		switch( key )
		{
			case 'defaultValue' :

				break;

			case 'allowsNull' :

				if( attr.defaultValue === 'null' )
				{
					throw new Error(
						jion.id
						+
						': '
						+
						'defaultValue \"null\" implies allowsNull'
					);
				}

				break;

			case 'allowsUndefined' :

				if( attr.defaultValue === 'undefined' )
				{
					throw new Error(
						jion.id
						+
						': '
						+
						'defaultValue \"undefined\" implies allowsUndefined'
					);
				}

				break;

			case 'json' :

				if( attr.assign === null )
				{
					throw new Error(
						'json attributes most not have null assignment'
					);
				}

				break;

			case 'assign' :
			case 'comment' :
			case 'type' :

				break;

			case 'concerns' :

				_checkConcern( attr.concerns );

				break;

			default :

				throw new Error(
					'attribute ' +
						'"' + name + '"' +
						' has invalid specifier: ' +
						'"' + key + '"'
				);
		}
	}
};


/*
| Checks if a jion definition looks ok.
*/
validator.check =
	function(
		jion // the jools object definition
	)
{
	var
		attr,
		idParts,
		name;

	if( !jion )
	{
		throw new Error( );
	}

	for( name in jion )
	{
		if( !_jionWhitelist[ name ] )
		{
			throw new Error(
				'invalid jion parameter: ' + name
			);
		}
	}

	if( !jools.isString( jion.id ) )
	{
		throw new Error( 'id missing' );
	}

	idParts = jion.id.split( '.' );

	if( idParts.length !== 2 )
	{
		throw new Error( 'id must be unit.name' );
	}

	if( !/[a-z]/.exec(idParts[ 0 ][ 0 ] ) )
	{
		throw new Error( 'unit ( id ) must start with lowercase letter' );
	}

	if( !/[a-z]/.exec(idParts[ 1 ][ 0 ] ) )
	{
		throw new Error( 'name ( id ) must start with lowercase letter' );
	}

	attr = jion.attributes;

	if( jion.singleton && attr )
	{
		throw new Error(
			'singletons must not have attributes'
		);
	}

	if( attr )
	{
		for( name in attr )
		{
			_checkAttribute( jion, name );
		}
	}

	if( jion.alike )
	{
		_checkAlikes( jion );
	}

	if( jion.twig && jion.ray )
	{
		throw new Error(
			'a jion cannot be a ray and twig at the same time'
		);
	}

	if( jion.twig )
	{
		_checkTwig( jion );
	}

	if( jion.ray )
	{
		_checkRay( jion );
	}
};


/*
| Node export
*/
if( SERVER )
{
	module.exports = validator;
}


} )( );
