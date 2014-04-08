/*
| Checks if a joobj definition is ok.
|
| Authors: Axel Kittenberger
*/


/*
| Exports.
*/
var
	Validator =
		{ };


/*
| Imports.
*/
var
	Jools;


/*
| Capsule (to make jshint happy)
*/
(function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	Jools =
		require( '../jools/jools' );
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
			case 'func' :
			case 'member' :
			case 'args' :

				break;

			default :

				throw new Error(
					'invalid concerns: "' + name + '"'
				);
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
	if( _attributeBlacklist[ name ] )
	{
		throw new Error(
			'attribute must not be named "' + name + '"'
		);
	}

	var
		attr =
			joobj.attributes[ name ],
		value;

	if( !Jools.isString( attr.type ) )
	{
		throw new Error(
			'type is missing from "' + name + '"'
		);
	}

	for( var key in attr )
	{
		value =
			attr[ key ];

		switch( key )
		{
			case 'defaultValue' :

				if ( !Jools.isString( value ) )
				{
					throw new Error(
						'defaultValue must be a string literal'
					);
				}

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

	attr =
		joobj.attributes;

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
			_checkAttribute(
				joobj,
				name
			);
		}
	}
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Validator;
}


} )( );
