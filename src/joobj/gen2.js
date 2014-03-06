/*
| Generates jools like objects from a jools definition.
|
| Version 2
|
| Authors: Axel Kittenberger
*/


/*
| Exports.
*/
var
	Generator =
		{ };


/*
| Imports.
*/
var
	Code,
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
	Code =
		{
			File :
				require( '../code/file' )
		};

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
		'ranks' :
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
var _check =
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
| Creates the data structures to work with.
*/
/*
var
buildJJ =
	function(
		joobj
	)
{
	var
		aName,
		attr,
		// alphabetical sorted attribute names
		attrList =
			[ ],
		attributes =
			{ },
		// list of all arguments passed to
		// constructor
		conVars =
			{ },
		hasJSON =
			!!joobj.json,
		jsonList =
			[ ],
		// units sorted alphabetically
		unitList =
			null,
		// units used
		units =
			{ };

	// list of attributes
	if( joobj.attributes )
	{
		for( aName in joobj.attributes )
		{
			attr =
				joobj.attributes[ aName ];

			attributes[ aName ] =
				Object.freeze(
					{
						aName :
							aName,
						allowsNull :
							attr.allowsNull
							||
							attr.defaultValue === 'null',
						allowsUndefined :
							attr.allowsUndefined
							||
							attr.defaultValue === 'undefined',
						assign :
							attr.assign !== undefined
								?
								attr.assign
								:
								aName,
						comment :
							attr.comment,
						concerns :
							attr.concerns,
						defaultValue :
							attr.defaultValue,
						json :
							attr.json,
						type :
							attr.type,
						unit :
							attr.unit,
						vName :
							'v_' + aName
					}
				);

			if( attr.unit )
			{
				units[ attr.unit ] =
					true;
			}

			if( attr.json )
			{
				hasJSON =
					true;

				jsonList.push( aName );
			}

			// skips unused attributes
			if(
				attr.assign !== null
				||
				(
					joobj.init
					&&
					joobj.init.indexOf( aName ) >= 0
				)
			)
			{
				conVars[ aName ] =
					Object.freeze(
						{
							aName :
								aName,
							comment :
								attr.comment,
							vName :
								attributes[ aName ].vName
						}
					);
			}
		}

		attrList =
			Object
				.keys( joobj.attributes )
				.sort( );
	}

	unitList =
		Object.keys( units ).sort( );

	if(
		joobj.init
		&&
		joobj.init.indexOf( 'inherit' ) >= 0
	)
	{
		conVars.inherit =
			Object.freeze(
				{
					aName :
						'inherit',
					comment :
						'inheritance',
					vName :
						'inherit'
				}
			);
	}

	if( joobj.twig )
	{
		conVars.twig =
			Object.freeze(
				{
					aName :
						'twig',
					comment :
						'twig, set upon change',
					vName :
						'twig'
				}
			);

		conVars.ranks =
			Object.freeze(
				{
					aName :
						'ranks',
					comment :
						'twig order, set upon change',
					vName :
						'ranks'
				}
			);

		if( hasJSON )
		{
			jsonList.push( 'twig' );
			jsonList.push( 'ranks' );
		}
	}

	var
		conList =
			Object.keys( conVars );

	conList.sort(
		function( o, p )
		{
			return (
				Jools.compare(
					conVars[ o ].vName,
					conVars[ p ].vName
				)
			);
		}
	);

	jsonList.sort( );

	return Object.freeze(
		{
			attrList :
				attrList,
			attributes :
				attributes,
			conList :
				conList,
			conVars :
				conVars,
			equals :
				joobj.equals,
			init :
				joobj.init,
			hasJSON :
				hasJSON,
			jsonList :
				jsonList,
			name :
				joobj.name,
			node :
				joobj.node,
			// in case unit and joobj are named identically
			// the shortcut will be renamed
			reference :
				( joobj.unit === joobj.name )
				?
				joobj.name + 'Obj'
				:
				joobj.name,
			singleton :
				joobj.singleton,
			subclass :
				joobj.subclass,
			twig :
				joobj.twig,
			unit :
				joobj.unit,
			unitList :
				unitList
		}
	);
};
*/


/*
| Generates code from a jools object definition.
*/
Generator.generate =
	function(
		joobj // the jools object definition
	)
{
	var
		file;

	_check( joobj );

	file =
		Code.File.create(
			'header',
				[
					'This is an autogenerated file.',
					'',
					'DO NOT EDIT!'
				]
		);

	return file;
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Generator;
}


} )( );
