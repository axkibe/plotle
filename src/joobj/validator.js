/*
| Checks if a joobj definition is ok.
|
| Authors: Axel Kittenberger
*/


/*
| Exports.
*/
var
	Validator;
	
Validator = { };


/*
| Imports.
*/
var
	Jools;


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
	Jools = require( '../jools/jools' );
}


/*
| Attributes must not be named like these.
*/
var _attributeBlacklist =
	Object.freeze( {
		'atRank' :
			true,
		'create' :
			true,
		'getPath' :
			true,
		'inherit' :
			true,
		'newUID' :
			true,
		'ranks' :
			true,
		'rankOf' :
			true,
		'setPath' :
			true,
		'type' :
			true,
		'twig' :
			true
	} );


/*
| A joobj definition may have these.
*/
var _joobjWhitelist =
	Object.freeze( {
		'alike' :
			true,
		'attributes' :
			true,
		'init' :
			true,
		'json' :
			true,
		'name' :
			true,
		'node' :
			true,
		'equals' :
			true,
		'subclass' :
			true,
		'singleton' :
			true,
		'twig' :
			true,
		'unit' :
			true,
	} );


/*
| Checks if a joobj concern definition looks ok.
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
			case 'unit' :

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
		joobj // the joobj definition
	)
{
	var
		alike,
		adef,
		ignores,
		name;

	alike = joobj.alike;
		
	if( !joobj.attributes )
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
			if( !joobj.attributes[ attr ] )
			{
				throw new Error(
					'alike ' + name + ' ignores unknown attribute ' + attr
				);
			}
		}
	}
};


/*
| Checks if a joobj attribute definition looks ok.
*/
var _checkAttribute =
	function(
		joobj,	// the joobj definition
		name	// the attribute name
	)
{
	var
		attr,
		value;

	if( _attributeBlacklist[ name ] )
	{
		throw new Error(
			'attribute must not be named "' + name + '"'
		);
	}

	attr = joobj.attributes[ name ];

	if( !Jools.isString( attr.type ) )
	{
		throw new Error(
			'type is missing from "' + name + '"'
		);
	}

	for( var key in attr )
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
						joobj.unit + '.' + joobj.name + ': ' +
						'defaultValue \"null\" implies allowsNull'
					);
				}

				break;

			case 'allowsUndefined' :

				if( attr.defaultValue === 'undefined' )
				{
					throw new Error(
						joobj.unit + '.' + joobj.name + ': ' +
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
			case 'unit' :

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
| Checks if a joobj definition looks ok.
*/
Validator.check =
	function(
		joobj // the jools object definition
	)
{
	var
		attr,
		name;

	if( !joobj )
	{
		throw new Error( );
	}

	for( name in joobj )
	{
		if( !_joobjWhitelist[ name ] )
		{
			throw new Error(
				'invalid joobj parameter: ' + name
			);
		}
	}

	if( !Jools.isString( joobj.name ) )
	{
		throw new Error(
			'name missing'
		);
	}

	attr = joobj.attributes;

	if( joobj.singleton && attr )
	{
		throw new Error(
			'singletons must not have attributes'
		);
	}

	if( attr )
	{
		for( name in attr )
		{
			_checkAttribute( joobj, name );
		}
	}

	if( joobj.alike )
	{
		_checkAlikes( joobj );
	}
};


/*
| Node export
*/
if( SERVER )
{
	module.exports = Validator;
}


} )( );
