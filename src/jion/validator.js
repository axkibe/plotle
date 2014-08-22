/*
| Checks if a jion definition is ok.
|
| Authors: Axel Kittenberger
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
| A jion definition may have these.
*/
var _jionWhitelist =
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
| Checks if a jion attribute definition looks ok.
*/
var _checkAttribute =
	function(
		jion,	// the jion definition
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

	attr = jion.attributes[ name ];

	if( !jools.isString( attr.type ) )
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
						jion.unit + '.' + jion.name + ': ' +
						'defaultValue \"null\" implies allowsNull'
					);
				}

				break;

			case 'allowsUndefined' :

				if( attr.defaultValue === 'undefined' )
				{
					throw new Error(
						jion.unit + '.' + jion.name + ': ' +
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

	if( !jools.isString( jion.name ) )
	{
		throw new Error(
			'name missing'
		);
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
};


/*
| Node export
*/
if( SERVER )
{
	module.exports = validator;
}


} )( );
