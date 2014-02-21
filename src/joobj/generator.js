/*
| Generates jools like objects from a jools definition.
|
| Authors: Axel Kittenberger
*/

/*
| Capsule (to make jshint happy)
*/
(function( ) {
'use strict';


var
	Jools =
		require( '../jools/jools' );


/*
| Checks if a joobj definition looks ok.
*/
var
	checkJoobj =
		function(
			joobj // the jools object definition
		)
{
	var
		aName;

	if( !joobj )
	{
		throw new Error( );
	}

	for( aName in joobj )
	{
		switch( aName )
		{
			case 'attributes' :
			case 'hasJSON' :
			case 'init' :
			case 'name' :
			case 'node' :
			case 'equals' :
			case 'subclass' :
			case 'singleton' :
			case 'twig' :
			case 'unit' :

				break;

			default :

				throw new Error(
					'invalid joobj parameter: ' + aName
				);
		}
	}

	if( !Jools.isString( joobj.name ) )
	{
		throw new Error(
			'name missing'
		);
	}

	var
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
		var
			blacklist =
				{
					'create' :
						true,
					'inherit' :
						true,
					'ranks' :
						true,
					'type' :
						true,
					'twig' :
						true
				};

		for( aName in attr )
		{
			if(
				blacklist[ aName ]
			)
			{
				throw new Error(
					'attribute must not be named "' + aName + '"'
				);
			}

			for( var aoName in attr[ aName ] )
			{
				switch( aoName )
				{
					case 'defaultVal' :

						if ( !Jools.isString( attr[ aName ][ aoName ] ) )
						{
							throw new Error(
								'defaultVal must be a string literal'
							);
						}

						break;

					case 'allowsNull' :

						if( attr[ aName ].defaultVal === 'null' )
						{
							throw new Error(
								joobj.unit + '.' + joobj.name + ': ' +
								'defaultVal \"null\" implies allowsNull'
							);
						}

						break;

					case 'allowsUndefined' :

						if( attr[ aName ].defaultVal === 'undefined' )
						{
							throw new Error(
								joobj.unit + '.' + joobj.name + ': ' +
								'defaultVal \"undefined\" implies allowsUndefined'
							);
						}

						break;


					case 'assign' :
					case 'comment' :
					case 'type' :
					case 'unit' :

						break;

					case 'concerns' :

						for( var aooName in attr[ aName ][ aoName ] )
						{
							switch( aooName )
							{
								case 'func' :
								case 'member' :
								case 'args' :

									break;

								default :

									throw new Error(
										'invalid spec: "' +
											aoName +
											'"'
									);
							}
						}

						break;

					default :

						throw new Error(
							'attribute ' +
								'"' + aName + '"' +
								' has invalid specifier: ' +
								'"' + aoName + '"'
						);
				}
			}

			if( !Jools.isString( attr[ aName ].type ) )
			{
				throw new Error(
					'type is missing from "' + aName + '"'
				);
			}
		}
	}
};


/*
| Creates the data structures to work with.
*/
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
							attr.defaultVal === 'null',
						allowsUndefined :
							attr.allowsUndefined
							||
							attr.defaultVal === 'undefined',
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
						defaultVal :
							attr.defaultVal,
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
			hasJSON :
				joobj.hasJSON,
			init :
				joobj.init,
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


/*
| Returns a white spaced string with the 'len' length.
*/
var
whiteSpace =
	function(
		len
	)
{
	var
		w =
			'';

	for(
		var a = 0;
		a < len;
		a++
	)
	{
		w += ' ';
	}

	return w;
};


/*
| Generates the file header.
*/
var
generateFileHeader =
	function(
		r // result array
	)
{
	r.push(
		'/*',
		'| This is an autogenerated file.',
		'|',
		'| DO NOT EDIT!',
		'*/'
	);
};


/*
| Generates a section seperator.
*/
var
generateSeperator =
	function(
		r // result array
	)
{
	r.push(
		'',
		''
	);
};


/*
| Generates the export section.
*/
var
generateExportSection =
	function(
		r,   // result array
		jj   // the jj working object
	)
{
	var
		unit =
			jj.unit;

	r.push(
		'/*',
		'| Export',
		'*/',
		'var'
	);

	if( unit )
	{
		r.push(
			'\t' + unit + ' =',
			'\t\t' + unit + ' || { };'
		);
	}
	else
	{
		r.push(
			'\t' + jj.name + ';'
		);
	}
};


/*
| Generates the imports section.
*/
var
generateImportsSection =
	function(
		r,  // result array
		jj  // joobj working object
	)
{
	r.push(
		'/*',
		'| Imports',
		'*/',
		'var',
		'\tJools' +
			( jj.unitList && jj.unitList.length > 0 ? ',' : ';' )
	);

	if( jj.unitList )
	{
		for(
			var a = 0, aZ = jj.unitList.length;
			a < aZ;
			a++
		)
		{
			r.push(
				'\t' + jj.unitList[ a ] +
					( a + 1 < aZ ? ',' : ';' )
			);
		}
	}
};


/*
| Generates the capsule header.
*/
var
generateCapsuleHeader =
	function(
		r      // result array
		// jj  // the joobj working object
	)
{
	r.push(
		'/*',
		'| Capsule',
		'*/',
		'(function( ) {',
		'\'use strict\';'
	);

	r.push(
		'',
		'',
		'var',
		'\t_tag =',
		'\t\t' + Math.floor( Math.random( ) * 1000000000 ) + ';'
	);
};


/*
| Generates the capsule footer.
*/
var
generateCapsuleFooter =
	function(
		r // result array
	)
{
	r.push(
		'} )( );',
		''
	);
};


/*
| Generates the node include section.
*/
var
generateNodeIncludesSection =
	function(
		r,   // result array
		jj   // the joobj working object
	)
{
	var
		a,
		aZ,
		aName,
		attr,
		ref;

	r.push(
		'/*',
		'| Node includes',
		'*/',
		'if( SERVER )',
		'{',
		'\tJools =',
		'\t\trequire( \'../src/jools/jools\' );'
	);

	for(
		a = 0, aZ = jj.unitList.length;
		a < aZ;
		a++
	)
	{
		r.push(
			'',
			'\t' + jj.unitList[ a ] + ' =',
			'\t\t{ };'
		);
	}

	var
		// a list of stuff already generated
		generated =
			{ };

	for(
		a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.attrList[ a ];

		attr =
			jj.attributes[ aName ];

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :

				break;

			default :

				ref =
					attr.unit + '.' + attr.type;

				if( generated[ ref ] )
				{
					continue;
				}

				generated[ ref ] =
					true;

				if( attr.unit )
				{
					r.push(
						'',
						'\t' + ref + ' =',
						'\t\trequire( \'../src/' +
							attr.unit.toLowerCase( ) + '/' +
							attr.type.toLowerCase( ) +
							'\' );'
					);
				}
				else
				{
					// FIXME
				}
		}
	}

	r.push(
		'}'
	);
};


/*
| Generates the node export section.
*/
var
generateNodeExportSection =
	function(
		r,  // result array
		jj  // the joobj working object
	)
{
	r.push(
		'/*',
		'| Node export',
		'*/',
		'if( SERVER )',
		'{',
		'\tmodule.exports =',
		'\t\t' + jj.reference + ';',
		'}'
	);
};



/*
| Generates the constructor.
*/
var
generateConstructor =
	function(
		r,  // result array
		jj  // the joobj working object
	)
{
	var
		a,
		aZ,

		// attribute name
		aName,

		// the attribute
		attr,

		con,
		comma,

		// longest attribute name in
		// the constructor list
		maxVNameLen =
			0,

		vName;

	if( jj.attrList )
	{
		for(
			a = 0, aZ = jj.conList.length;
			a < aZ;
			a++
		)
		{
			con =
				jj.conVars[ jj.conList[ a ] ];

			vName =
				con.vName;

			if( vName.length > maxVNameLen )
			{
				maxVNameLen =
					vName.length;
			}
		}
	}

	r.push(
		'/*',
		'| Constructor.',
		'*/'
	);

	if( jj.unit )
	{
		r.push(
			'var ' + jj.reference + ' =',
			jj.unit + '.' + jj.name + ' ='
		);
	}
	else
	{
		r.push(
			jj.reference + ' ='
		);
	}

	r.push(
		'\tfunction(',
		'\t\ttag' +
			( jj.conList.length > 0 ?  ',' : '' )
	);

	for(
		a = 0, aZ = jj.conList.length;
		a < aZ;
		a++
	)
	{
		con =
			jj.conVars[ jj.conList[ a ] ];

		comma =
			a + 1 < aZ;

		r.push(
			'\t\t' + con.vName +
				( comma ? ',' : '' ) +
				( con.comment ?
					whiteSpace(
						maxVNameLen -
							con.vName.length +
							(comma ? 0 : 1 )
					) + ' // ' + con.comment
					:
					''
				)
		);
	}

	r.push(
		'\t)',
		'{'
	);

	r.push(
		'',
		'/**/if( CHECK )',
		'/**/{',
		'/**/\tif( tag !== _tag )',
		'/**/\t{',
		'/**/\t\tthrow new Error(',
		'/**/\t\t\t\'tag mismatch\'',
		'/**/\t\t);',
		'/**/\t}',
		'/**/}'
	);

	// creates assigns for all assignable attributes
	for(
		a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.attrList[ a ];

		attr =
			jj.attributes[ aName ];

		if( attr.assign === null )
		{
			continue;
		}

		if( !attr.allowsUndefined )
		{
			r.push(
				'',
				'\tthis.' + attr.assign + ' =',
				'\t\t' + attr.vName + ';'
			);
		}
		else
		{
			r.push(
				'',
				'\tif( ' + attr.vName + ' !== undefined )',
				'\t{',
				'\t\tthis.' + attr.assign + ' =',
				'\t\t\t' + attr.vName + ';',
				'\t}'
			);
		}
	}

	if( jj.twig )
	{
		r.push(
			'',
			'\tthis.twig =',
			'\t\ttwig;',
			'',
			'\tthis.ranks =',
			'\t\tranks;'
		);
	}

	if( jj.init )
	{
		if( jj.init.length === 0 )
		{
			r.push(
				'',
				'\tthis._init( );'
			);
		}
		else
		{
			r.push(
				'',
				'\tthis._init('
			);

			for(
				a = 0, aZ = jj.init.length;
				a < aZ;
				a++
			)
			{
				attr =
					jj.conVars[ jj.init[ a ] ];

				if( !attr )
				{
					throw new Error(
						'unknown constructor variable: ' +
							jj.init[ a ]
					);
				}

				r.push(
					'\t\t' + attr.vName +
						( a + 1 < aZ ? ',' : '' )
				);
			}

			r.push(
				'\t);'
			);
		}
	}

	r.push(
		'',
		'\tJools.immute( this );',
		'};'
	);
};


/*
| Generates the singleton section.
*/
var
generateSingletonSection =
	function(
		r // result array
	)
{
	r.push(
		'/*',
		'| Singleton',
		'*/',
		'var',
		'\t_singleton =',
		'\t\tnull;'
	);
};


/*
| Generates the subclass.
*/
var
generateSubclassSection =
	function(
		r,  // result array
		jj  // the joobj working object
	)
{
	r.push(
		'Jools.subclass(',
		'\t' + jj.reference + ',',
		'\t' + jj.subclass,
		');'
	);
};



/*
| Generates the inheritance receiver
| of the creator.
*/
var
generateCreatorInheritanceReceiver =
	function
	(
		r,  // result array
		jj  // the joobj working object
	)
{
	var
		a,
		aZ,
		aName,
		attr;

	r.push(
		'\tif( this !== ' + jj.reference + ' )',
		'\t{',
		'\t\tinherit =',
		'\t\t\tthis;',
		''
	);

	if( jj.twig )
	{
		r.push(
			'\t\ttwig =',
			'\t\t\tinherit.twig;',
			'',
			'\t\tranks =',
			'\t\t\tinherit.ranks;',
			'',
			'\t\ttwigdup =',
			'\t\t\tfalse;',
			''
		);
	}

	for(
		a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.attrList[ a ];

		attr =
			jj.attributes[ aName ];

		if( attr.assign === null )
		{
			continue;
		}

		if( a > 0 )
		{
			r.push(
				''
			);
		}

		r.push(
			'\t\t' + attr.vName + ' =',
			'\t\t\tthis.' +
				attr.assign +
				';'
		);
	}

	r.push(
		'\t}'
	);

	if( jj.twig )
	{
		r.push(
			'\telse',
			'\t{',
			'\t\ttwig =',
			'\t\t\t{ };',
			'',
			'\t\tranks =',
			'\t\t\t[ ];',
			'',
			'\t\ttwigdup =',
			'\t\t\ttrue;',
			'\t}'
		);
	}
};


/*
| Generates the free strings parser
| of the creator.
*/
var
generateCreatorFreeStringsParser =
	function(
		r,  // result array
		jj  // the joobj working object
	)
{
	var
		a,
		aZ,
		attr;

	r.push(
		'',
		'\tfor(',
		'\t\tvar a = 0, aZ = arguments.length;',
		'\t\ta < aZ;',
		'\t\ta += 2',
		'\t)',
		'\t{',
		'\t\tvar',
		'\t\t\targ =',
		'\t\t\t\targuments[ a + 1 ];',
		'',
		'\t\tswitch( arguments[ a ] )',
		'\t\t{'
	);

	for(
		a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		attr =
			jj.attributes[ jj.attrList[ a ] ];

		r.push(
			'\t\t\tcase \'' + attr.aName + '\' :',
			'',
			'\t\t\t\tif( arg !== undefined )',
			'\t\t\t\t{',
			'\t\t\t\t\t' + attr.vName + ' =',
			'\t\t\t\t\t\targ;',
			'\t\t\t\t}',
			'',
			'\t\t\t\tbreak;',
			''
		);
	}

	if( jj.twig )
	{
		r.push(
			'\t\t\tcase \'twig:add\' :',
			'',
			'\t\t\t\tif( !twigdup )',
			'\t\t\t\t{',
			'\t\t\t\t\ttwig =',
			'\t\t\t\t\t\tJools.copy( twig );',
			'',
			'\t\t\t\t\tranks =',
			'\t\t\t\t\t\tranks.slice( );',
			'',
			'\t\t\t\t\ttwigdup =',
			'\t\t\t\t\t\ttrue;',
			'\t\t\t\t}',
			'',
			'\t\t\t\tkey =',
			'\t\t\t\t\targ;',
			'',
			'\t\t\t\targ =',
			'\t\t\t\t\targuments[ ++a + 1 ];',
			'',
			'\t\t\t\tif( twig[ key ] !== undefined )',
			'\t\t\t\t{',
			'\t\t\t\t\tthrow new Error(',
			'\t\t\t\t\t\t\'key "\' + key + \'" already in use\'',
			'\t\t\t\t\t);',
			'\t\t\t\t}',
			'',
			// TODO check if arg is of correct type
			'\t\t\t\ttwig[ key ] =',
			'\t\t\t\t\targ;',
			'',
			'\t\t\t\tranks.push( key );',
			'',
			'\t\t\t\tbreak;',
			''
		);
	}

	r.push(
		'\t\t\tdefault :',
		'',
		'/**/\t\t\tif( CHECK )',
		'/**/\t\t\t{',
		'/**/\t\t\t\tthrow new Error(',
		'/**/\t\t\t\t\t\'invalid argument: \' + arguments[ a ]',
		'/**/\t\t\t\t);',
		'/**/\t\t\t}',
		'\t\t}',
		'\t}'
	);
};


/*
| Generates the creators default values filler.
*/
var
generateDefaultValues =
	function
	(
		r,  // result array
		jj  // the joobj working object
	)
{
	var
		attr;

	for(
		var a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		attr =
			jj.attributes[ jj.attrList[ a ] ];

		if( attr.defaultVal )
		{
			r.push(
				'',
				'\tif( ' + attr.vName + ' === undefined )',
				'\t{',
				'\t\t' + attr.vName + ' =',
				'\t\t\t' + attr.defaultVal + ';',
				'\t}'
			);
		}
	}
};


/*
| Generates the creators checks.
*/
var
generateChecks =
	function
	(
		r,  // result array
		jj  // the joobj working object
	)
{
	var
		a,
		aZ,
		attr;

	if( jj.attrList.length === 0 )
	{
		return;
	}

	r.push(
		'',
		'/**/if( CHECK )',
		'/**/{'
	);

	for(
		a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		attr =
			jj.attributes[ jj.attrList[ a ] ];

		if( !attr.allowsUndefined )
		{
			r.push(
				'/**/',
				'/**/\tif( ' + attr.vName + ' === undefined )',
				'/**/\t{',
				'/**/\t\tthrow new Error(',
				'/**/\t\t\t\'undefined attribute ' + attr.aName + '\'',
				'/**/\t\t);',
				'/**/\t}'
			);
		}

		if( !attr.allowsNull )
		{
			r.push(
				'/**/',
				'/**/\tif( ' + attr.vName + ' === null )',
				'/**/\t{',
				'/**/\t\tthrow new Error(',
				'/**/\t\t\t\'' + attr.aName + ' must not be null\'',
				'/**/\t\t);',
				'/**/\t}'
			);
		}

		var
			skip =
				false;

		switch( attr.type )
		{
			case 'Action' :
			case 'Array' :
			case 'Function' :
			case 'Item' :
			case 'Mark' :
			case 'Object' :
			case 'Tree' :

				skip =
					true;
		}

		if( !skip )
		{
			var
				indent =
					'/**/\t',

				defCheck =
					false;

			if( attr.allowsNull && !attr.allowsUndefined )
			{
				r.push(
					'/**/',
					'/**/\tif( ' + attr.vName + ' !== null )',
					'/**/\t{'
				);

				indent += '\t';

				defCheck =
					true;
			}
			else if( !attr.allowsNull && attr.allowsUndefined )
			{
				r.push(
					'/**/',
					'/**/\tif( ' + attr.vName + ' !== undefined )',
					'/**/\t{'
				);

				indent += '\t';

				defCheck =
					true;
			}
			else if( attr.allowsNull && attr.allowsUndefined )
			{
				r.push(
					'/**/',
					'/**/\tif(',
					'/**/\t\t' + attr.vName + ' !== null',
					'/**/\t\t&&',
					'/**/\t\t' + attr.vName + ' !== undefined',
					'/**/\t)',
					'/**/\t{'
				);

				indent += '\t';

				defCheck =
					true;
			}

			switch( attr.type )
			{
				case 'Boolean' :

					r.push(
						indent + 'if(',
						indent +
							'\ttypeof( ' + attr.vName  + ' )' +
							' !== \'boolean\'',
						indent + ')'
					);

					break;

				case 'Integer' :

					r.push(
						indent +
							'if(',
						indent +
							'\ttypeof( ' + attr.vName  + ' )' +
							' !== \'number\'',
						indent +
							'\t||',
						indent +
							'\tMath.floor( ' + attr.vName + ' )' +
							' !== ' + attr.vName,
						indent +
							')'
					);

					break;

				case 'String' :

					r.push(
						indent + 'if(',
						indent + '\ttypeof( ' + attr.vName  + ' )' +
							' !== \'string\'',
						indent + '\t&&',
						indent + '\t!( ' + attr.vName + ' instanceof String )',
						indent + ')'
				);

					break;

				case 'Number' :

					r.push(
						indent + 'if(',
						indent + '\ttypeof( ' + attr.vName  + ' )' +
							' !== \'number\'',
						indent + ')'
					);

					break;

				default :

					r.push(
						indent + 'if( ' +
							attr.vName + '.reflect !==' +
							' \'' + attr.type + '\'' + ' )'
					);
			}

			r.push(
				indent + '{',
				indent + '\tthrow new Error(',
				indent + '\t\t\'type mismatch\'',
				indent + '\t);',
				indent + '}'
			);

			if( defCheck )
			{
				r.push(
					'/**/\t}'
				);
			}
		}
	}

	r.push(
		'/**/}'
	);
};


/*
| Generates the creators concers section
*/
var
generateCreatorConcerns =
	function
	(
		r,  // result array
		jj  // the joobj working object
	)
{
	for(
		var a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		var
			attr =
				jj.attributes[ jj.attrList[ a ] ];

		if( !attr.concerns )
		{
			continue;
		}

		var
			args =
				attr.concerns.args,

			b,
			bZ,

			func =
				attr.concerns.func,

			member =
				attr.concerns.member;

		r.push(
			'\t' + attr.vName + ' ='
		);

		if( func )
		{
			if( args.length === 0 )
			{
				r.push(
					'\t\t' + func + '( );',
					''
				);
			}
			else
			{
				r.push(
					'\t\t' + func + '('
				);

			}
		}
		else
		{
			// member
			if( !args )
			{
				if( attr.allowsNull )
				{
					r.push(
						'\t\t' + attr.vName + ' !== null ?',
						'\t\t\t' + attr.vName + '.' + member + ':',
						'\t\t\tnull;'
					);
				}
				else
				{
					r.push(
						'\t\t' + attr.vName + '.' + member + ';'
					);
				}
			}
			else
			{
				r.push(
					'\t\t' + attr.vName + '.' + member + '('
				);

			}
		}

		if( args && args.length > 0 )
		{
			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				attr =
					jj.attributes[ args[ b ] ];

				if( !attr )
				{
					throw new Error(
						'unknown attribute: ' + args[ b ]
					);
				}

				r.push(
					'\t\t\t' + attr.vName +
						( b + 1 < bZ ? ',' : '' )
				);
			}

			r.push(
				'\t\t);',
				''
			);
		}
	}
};

/*
| Generates the creators full inheritance shortcut.
*/
var
generateCreatorFullInheritance =
	function
	(
		r,  // result array
		jj  // the joobj working object
	)
{
	var
		attr;

	if( jj.attrList.length === 0 )
	{
		r.push(
			'',
			'/**/if( CHECK )',
			'/**/{',
			'/**/\tif( arguments.length > 0 )',
			'/**/\t{',
			'/**/\t\tthrow new Error(',
			'/**/\t\t\t\'invalid argument\'',
			'/**/\t\t);',
			'/**/\t}',
			'/**/}'
		);

		return;
	}

	r.push(
		'',
		'\tif(',
		'\t\tinherit',
		'\t\t&&'
	);

	if( jj.twig )
	{
		r.push(
			'\t\t!twigdup',
			'\t\t&&'
		);
	}

	for(
		var a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		attr =
			jj.attributes[ jj.attrList[ a ] ];

		if( a > 0 )
		{
			r.push(
				'\t\t&&'
			);
		}

		if( attr.assign === null )
		{
			r.push(
				'\t\t' + attr.vName + ' === null'
			);

			continue;
		}

		switch( attr.type )
		{
			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Function' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'Object' :
			case 'String' :
			case 'Tree' : // FIXME

				r.push(
					'\t\t' + attr.vName +
						' === inherit.' + attr.assign
				);

				break;

			default :

				if( !attr.allowsNull )
				{
					r.push(
						'\t\t' + attr.vName +
							'.equals( inherit.' + attr.assign + ' )'
					);
				}
				else
				{
					r.push(
						'\t\t(',
						'\t\t\t' + attr.vName + ' === inherit.' + attr.assign,
						'\t\t\t||',
						'\t\t\t(',
						'\t\t\t\t' + attr.vName + ' !== null',
						'\t\t\t\t&&',
						'\t\t\t\t' + attr.vName +
							'.equals( inherit.' + attr.assign +
							' )',
						'\t\t\t)',
						'\t\t)'
					);
				}

				break;
		}
	}

	r.push(
		'\t)',
		'\t{',
		'\t\treturn inherit;',
		'\t}',
		''
	);
};


/*
| Generates the creators final return statement.
*/
var
generateCreatorReturn =
	function(
		r,    // result array
		jj    // the joobj working object
	)
{
	if( jj.singleton )
	{
		r.push(
			'\tif( !_singleton )',
			'\t{',
			'\t\t_singleton =',
			'\t\t\tnew ' + jj.reference + '(',
			'\t\t\t\t_tag',
			'\t\t\t);',
			'\t}',
			'',
			'\treturn _singleton;'
		);
	}
	else
	{
		r.push(
			'\treturn (',
			'\t\tnew ' + jj.reference + '(',
			'\t\t\t_tag,'
		);

		for(
			var a = 0, aZ = jj.conList.length;
			a < aZ;
			a++
		)
		{
			var
				con =
					jj.conVars[ jj.conList[ a ] ],

				sep =
					a + 1 < aZ ?  ',' : '';

				r.push(
					'\t\t\t' + con.vName + sep
				);
		}

		r.push(
			'\t\t)',
			'\t);'
		);
	}
};


/*
| Generates the attribute variables for the creators.
*/
var
generateAttributeVariables =
	function(
		r,   // result array
		jj   // the joobj working object
		// ...  addtional to variable list ( 'inherit' )
	)
{
	var
		a,
		aZ,
		aName,
		attr,

		list =
			[ ];

	for( aName in jj.attributes )
	{
		attr =
			jj.attributes[ aName ];

		list.push( attr.vName );
	}

	for(
		a = 2, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		if( arguments[ a ] )
		{
			list.push(
				arguments[ a ]
			);
		}
	}

	list.sort( );

	if( list.length > 0 )
	{
		r.push(
			'\tvar'
		);
	}

	for(
		a = 0, aZ = list.length;
		a < aZ;
		a++
	)
	{
		r.push(
			'\t\t' + list[ a ] +
				( a + 1 >= list.length ? ';' : ',' )
		);
	}

	r.push(
		''
	);
};


/*
| Generates the creator.
*/
var
generateCreator =
	function(
		r,  // result array
		jj  // the joobj working object
	)
{
	r.push(
		'/*',
		'| Creates a new ' + jj.name + ' object.',
		'*/',
		jj.reference + '.create =',
		jj.reference + '.prototype.create =',
		'\tfunction('
	);

	if( jj.attrList )
	{
		r.push(
			'\t\t// free strings'
		);
	}

	r.push(
		'\t)',
		'{'
	);


	if( jj.attrList.length > 0 )
	{
		generateAttributeVariables(
			r,
			jj,
			'inherit',
			jj.twig ? 'twig' : null,
			jj.twig ? 'ranks' : null,
			jj.twig ? 'twigdup' : null,
			jj.twig ? 'key' : null
		);

		generateCreatorInheritanceReceiver( r, jj );

		generateCreatorFreeStringsParser( r, jj );
	}
	else
	{
		generateAttributeVariables( r, jj );
	}

	generateDefaultValues( r, jj );

	generateChecks( r, jj );

	generateCreatorConcerns( r, jj );

	generateCreatorFullInheritance( r, jj );

	generateCreatorReturn( r, jj );

	r.push( '};' );
};


/*
| Generates the from JSON create
*/
var
generateFromJSONCreator =
	function(
		r,  // result array
		jj  // the joobj working object
	)
{
	var
		a,
		aZ,
		attr;

	r.push(
		'/*',
		'| Creates a new ' + jj.name + ' object from JSON',
		'*/',
		jj.reference + '.createFromJSON =',
		'\tfunction(',
		'\t\tjson // the json object',
		'\t)',
		'{'
	);

	// XXX TODO remove
	r.push(
		'\tif( json._$grown ) return json;'
	);

	generateAttributeVariables( r, jj );

	r.push(
		'\tfor( var aName in json )',
		'\t{',
		'\t\tvar',
		'\t\t\targ =',
		'\t\t\t\tjson[ aName ];',
		'',
		'\t\tswitch( aName )',
		'\t\t{',
		'\t\t\tcase \'type\' :',
		'',
		'\t\t\t\tif( arg !== \'' + jj.name + '\')',
		'\t\t\t\t{',
		'\t\t\t\t\tthrow new Error(',
		'\t\t\t\t\t\t\'invalid JSON\'',
		'\t\t\t\t\t);',
		'\t\t\t\t}',
		'',
		'\t\t\t\tbreak;',
		''
	);

	for(
		a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		attr =
			jj.attributes[ jj.attrList[ a ] ];

		if( attr.assign === null )
		{
			continue;
		}

		r.push(
			'\t\t\tcase \'' + attr.aName + '\' :',
			'',
			'\t\t\t\t' + attr.vName + ' ='
		);

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :

				r.push(
					'\t\t\t\t\targ;'
				);

				break;

			default :

				r.push(
					'\t\t\t\t\t' +
						(
							attr.unit ?
							( attr.unit + '.' )
							:
							''
						) +
						attr.type + '.createFromJSON(',
					'\t\t\t\t\t\targ',
					'\t\t\t\t\t);'
				);

				break;
		}

		r.push(
			'',
			'\t\t\t\tbreak;',
			''
		);
	}

	r.push(
		'\t\t\tdefault :',
		'',
		'\t\t\t\tthrow new Error(',
		'\t\t\t\t\t\'invalid JSON: \' + aName',
		'\t\t\t\t);',
		'\t\t}',
		'\t}',
		''
	);

	generateDefaultValues( r, jj );

	generateChecks( r, jj );

	r.push(
		'\treturn (',
		'\t\tnew ' + jj.reference + '(',
		'\t\t\t_tag,'
	);

	for(
		a = 0, aZ = jj.conList.length;
		a < aZ;
		a++
	)
	{
		var
			con =
				jj.conVars[ jj.conList[ a ] ];

		if( con.aName === 'inherit' )
		{
			r.push(
				'\t\t\tnull'
			);

			continue;
		}

		r.push(
			'\t\t\t' + con.vName +
				( a + 1 < jj.conList.length ? ',' : '' )
		);
	}

	r.push(
		'\t\t)',
		'\t);',
		'};'
	);
};


/*
| Generates the reflection section.
*/
var
generateReflectionSection =
	function(
		r,   // result array
		jj   // the joobj working object
	)
{
	r.push(
		'/*',
		'| Reflection.',
		'*/',
		jj.reference + '.prototype.reflect =',
		'\t\'' + jj.name + '\';'
	);

	// FIXME this is some workaround
	if( jj.hasJSON )
	{
		r.push(
			'',
			'',
			'/*',
			'| Workaround meshverse growing',
			'*/',
			jj.reference + '.prototype._$grown =',
			'\ttrue;'
		);
	}
};


/*
| Generates the toJSON section.
*/
var
generateToJSONSection =
	function(
		r,   // result array
		jj   // the joobj working object
	)
{
	var
		a,
		aZ,
		aName;

	r.push(
		'/*',
		'| Convers the object into a JSON.',
		'*/',
		'Jools.lazyFunction(',
		'\t' + jj.reference + '.prototype,',
		'\t\'toJSON\',',
		'\tfunction( )',
		'\t{',
		'\t\treturn Object.freeze( {',
		'',
		'\t\t\ttype :',
		'\t\t\t\t\'' + jj.name + '\',',
		''
	);

	for(
		a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.attrList[ a ];

		if( aName === 'create' )
		{
			continue;
		}

		r.push(
			'\t\t\t\'' + aName + '\' :',
			'\t\t\t\tthis.' + aName +
				( a + 1 < aZ ? ',' : '' ),
			''
		);
	}


	r.push(
		'\t\t} );',
		'\t}',
		');'
	);
};



/*
| Generates a primitive equals check.
*/
var
generatePrimitiveEqualsCheck =
	function(
		r,   // result array
		jj   // the joobj working object
	)
{
	r.push(
		'/*',
		'| Checks for equal objects.',
		'*/',
		jj.reference + '.prototype.equals =',
		'\tfunction(',
		'\t\tobj',
		'\t)',
		'{',
		'\treturn this === obj;',
		'};'
	);
};


/*
| Generates the equals check.
*/
var
generateEqualsCheck =
	function(
		r,   // result array
		jj   // the joobj working object
	)
{
	var
		a,
		aZ,

		// attribute name
		aName,
		attr;

	r.push(
		'/*',
		'| Checks for equal objects.',
		'*/',
		jj.reference + '.prototype.equals =',
		'\tfunction(',
		'\t\tobj',
		'\t)',
		'{',
		'\tif( this === obj )',
		'\t{',
		'\t\treturn true;',
		'\t}',
		'',
		'\tif( !obj )',
		'\t{',
		'\t\treturn false;',
		'\t}',
		'',
		'\treturn ('
	);

	var
		first =
			true;

	for(
		a = 0, aZ = jj.attrList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.attrList[ a ],

		attr =
			jj.attributes[ aName ];

		if( attr.assign === null )
		{
			continue;
		}

		if( !first )
		{
			r.push(
				'\t\t&&'
			);
		}
		else
		{
			first =
				false;
		}

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'String' :
			case 'Tree' : // FIXME

				r.push(
					'\t\tthis.' + attr.assign +
						' === obj.' + attr.assign
				);

				break;

			default :

				if( !attr.allowsNull )
				{
					r.push(
						'\t\tthis.' + attr.assign +
							'.equals( obj.' + attr.assign + ' )'
					);
				}
				else
				{
					r.push(
						'\t\t(',
						'\t\t\tthis.' + attr.assign +
							' === obj.' + attr.assign +
							' ||',
						'\t\t\t(',
						'\t\t\t\tthis.' + attr.assign + ' !== null',
						'\t\t\t\t&&',
						'\t\t\t\tthis.' + attr.assign +
							'.equals( obj.' + attr.assign + ' )',
						'\t\t\t)',
						'\t\t)'
					);
				}

				break;
		}
	}

	r.push(
		'\t);',
		'};'
	);
};


/*
| Generates code from a jools object definition.
*/
var
joobjGenerator =
	function(
		joobj // the jools object definition
	)
{
	var
		// the result array
		r =
			[ ];

	// tests if the joobj looks ok
	checkJoobj( joobj );

	// create joobj the datastructures to work with
	var
		jj =
			buildJJ( joobj );

	generateFileHeader( r );

	generateSeperator( r );

	generateExportSection(
		r,
		jj
	);

	generateSeperator( r );

	generateImportsSection( r, jj );

	generateSeperator( r );

	generateCapsuleHeader( r, jj );

	generateSeperator( r );

	if( jj.node )
	{
		generateNodeIncludesSection( r, jj );

		generateSeperator( r );
	}

	generateConstructor( r, jj );

	generateSeperator( r );

	if( jj.singleton )
	{
		generateSingletonSection( r );

		generateSeperator( r );
	}


	if( jj.subclass )
	{
		generateSubclassSection( r, jj );

		generateSeperator( r );
	}

	generateCreator( r, jj );

	generateSeperator( r );

	if( jj.hasJSON )
	{
		generateFromJSONCreator( r, jj );

		generateSeperator( r );
	}

	generateReflectionSection( r, jj );

	generateSeperator( r );

	if( jj.hasJSON )
	{
		generateToJSONSection( r, jj );

		generateSeperator( r );
	}

	switch( jj.equals )
	{
		case false :

			break;

		case undefined :
		case true :

			generateEqualsCheck( r, jj );

			generateSeperator( r );

			break;

		case 'primitive' :

			generatePrimitiveEqualsCheck( r, jj );

			generateSeperator( r );

			break;

		default :

			throw new Error(
				'invalid equals value: ' + jj.equals
			);
	}

	if( jj.node )
	{
		generateNodeExportSection( r, jj );

		generateSeperator( r );
	}

	generateCapsuleFooter( r );

	return r.join( '\n' );
};


/*
| Node export
*/
module.exports =
	joobjGenerator;


} )( );
