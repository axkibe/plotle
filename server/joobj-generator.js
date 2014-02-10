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
		require( '../shared/jools' );


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
		for( aName in attr )
		{
			if(
				aName === 'create'
				||
				aName === 'inherit'
				||
				aName === 'type'
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

					case 'allowNull' :
					case 'assign' :
					case 'comment' :
					case 'locate' :
					case 'refuse' :
					case 'type' :
					case 'unit' :

						break;

					case 'concerns' :

						for( var aooName in attr[ aName ][ aoName ] )
						{
							switch( aooName )
							{
								case 'func' :
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
		a,
		aZ,
		aName,
		attr,

		reference,

		// alphabetical sorted attribute names
		aList =
			[ ],

		// list of all arguments passed to
		// constructor
		conList,

		// units sorted alphabetically
		unitList =
			null,

		// units used
		units =
			{ };

	// in case unit and joobj are named identically
	// the shortcut will be renamed
	if( joobj.unit === joobj.name )
	{
		reference =
			joobj.name + 'Obj';
	}
	else
	{
		reference =
			joobj.name;
	}

	// attribute list

	if( joobj.attributes )
	{
		aList =
			Object.keys( joobj.attributes ).sort( );

		// unitList

		for(
			a = 0, aZ = aList.length;
			a < aZ;
			a++
		)
		{
			aName =
				aList[ a ];

			attr =
				joobj.attributes[ aName ];

			if( attr.unit )
			{
				units[ attr.unit ] =
					true;
			}
		}

		unitList =
			Object.keys( units ).sort( );
	}

	// constructor list

	conList =
		[ ];

	for(
		a = 0, aZ = aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			aList[ a ];

		attr =
			joobj.attributes[ aName ];

		// skips unused attributes
		if(
			attr.assign === null
			&&
			!(
				joobj.init
				&&
				joobj.init.indexOf( aName ) >= 0
			)
		)
		{
			continue;
		}

		conList.push( aName );
	}

	if( joobj.init )
	{
		if(
			joobj.init.indexOf( 'inherit' ) >= 0
		)
		{
			conList.push( 'inherit' );
		}
	}

	conList.sort( );

	return Object.freeze(
		{
			aList :
				aList,

			attributes :
				joobj.attributes,

			conList :
				conList,

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

			reference :
				reference,

			singleton :
				joobj.singleton,

			subclass :
				joobj.subclass,

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
		'\t\trequire( \'../shared/jools\' );'
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
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

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
						'\t\trequire( \'../' +
							attr.locate + '/' +
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

		// longest attribute name in
		// the constructor list
		maxConNameLen =
			0;

	if( jj.aList )
	{
		for(
			a = 0, aZ = jj.conList.length;
			a < aZ;
			a++
		)
		{
			aName =
				jj.conList[ a ];

			if( aName.length > maxConNameLen )
			{
				maxConNameLen =
					aName.length;
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
			(
				jj.conList.length > 0 ?  ',' : ''
			)
	);

	for(
		a = 0, aZ = jj.conList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.conList[ a ];

		var
			comment,

			comma =
				a + 1 < aZ;

		switch( aName )
		{
			case 'inherit' :

				comment =
					'inheritance';

				break;

			default :

				comment =
					jj.attributes[ aName ].comment;

				break;
		}

		r.push(
			'\t\t' + aName +
				( comma ? ',' : '' ) +
				( comment ?
					whiteSpace(
						maxConNameLen -
							aName.length +
							(comma ? 0 : 1 )
					) + ' // ' + comment
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
		'/**/}',
		''
	);

	// creates assigns for all assignable attributes
	for(
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

		attr =
			jj.attributes[ aName ];

		if( attr.assign === null )
		{
			continue;
		}

		r.push(
			'\tthis.' +
				( attr.assign || aName ) +
				' =',
			'\t\t' + aName + ';',
			''
		);
	}

	if( jj.init )
	{
		if( jj.init.length === 0 )
		{
			r.push(
				'\tthis._init( );'
			);
		}
		else
		{
			r.push(
				'\tthis._init('
			);

			for(
				a = 0, aZ = jj.init.length;
				a < aZ;
				a++
			)
			{
				r.push(
					'\t\t' + jj.init[ a ] +
						( a + 1 < aZ ? ',' : '' )
				);
			}

			r.push(
				'\t);',
				''
			);
		}
	}

	r.push(
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
		// TODO
	}

	for(
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

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
			'\t\t' + aName + ' =',
			'\t\t\tthis.' +
				( attr.asign || aName ) +
				';'
		);
	}

	r.push(
		'\t}',
		''
	);
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
		aName;

	r.push(
		'',
		'\tfor(',
		'\t\tvar _a_ = 0, _aZ_ = arguments.length;',
		'\t\t_a_ < _aZ_;',
		'\t\t_a_ += 2',
		'\t)',
		'\t{',
		'\t\tvar',
		'\t\t\t_arg_ =',
		'\t\t\t\targuments[ _a_ + 1 ];',
		'',
		'\t\tswitch( arguments[ _a_ ] )',
		'\t\t{'
	);

	for(
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

		r.push(
			'\t\t\tcase \'' + aName + '\' :',
			'',
			'\t\t\t\tif( _arg_ !== undefined )',
			'\t\t\t\t{',
			'\t\t\t\t\t' + aName + ' =',
			'\t\t\t\t\t\t_arg_;',
			'\t\t\t\t}',
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
		'/**/\t\t\t\t\t\'invalid argument: \' + arguments[ _a_ ]',
		'/**/\t\t\t\t);',
		'/**/\t\t\t}',
		'\t\t}',
		'\t}',
		''
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
		aName,
		attr;

	for(
		var a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

		attr =
			jj.attributes[ aName ];

		if( attr.defaultVal )
		{
			r.push(
				'\tif( ' + aName + ' === undefined )',
				'\t{',
				'\t\t' + aName + ' =',
				'\t\t\t' + attr.defaultVal + ';',
				'\t}',
				''
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
		aName,
		attr;

	// generates checks
	if( jj.aList.length === 0 )
	{
		return;
	}

	r.push(
		'/**/if( CHECK )',
		'/**/{'
	);

	for(
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

		attr =
			jj.attributes[ aName ];

		r.push(
			'/**/\tif( ' + aName + ' === undefined )',
			'/**/\t{',
			'/**/\t\tthrow new Error(',
			'/**/\t\t\t\'undefined attribute ' + aName + '\'',
			'/**/\t\t);',
			'/**/\t}'
		);

		if( !attr.allowNull )
		{
			r.push(
				'/**/',
				'/**/\tif( ' + aName + ' === null )',
				'/**/\t{',
				'/**/\t\tthrow new Error(',
				'/**/\t\t\t\'' + aName + ' must not be null\'',
				'/**/\t\t);',
				'/**/\t}'
			);
		}

		r.push(
			'/**/',
			'/**/\tif( ' + aName + ' !== null )',
			'/**/\t{'
		);

		switch( attr.type )
		{
			case 'Boolean' :

				r.push(
					'/**/\t\tif(',
					'/**/\t\t\ttypeof( ' + aName  + ' ) !== \'boolean\'',
					'/**/\t\t)'
				);

				break;

			case 'Integer' :

				r.push(
					'/**/\t\tif(',
					'/**/\t\t\ttypeof( ' + aName  + ' ) !== \'number\' ||',
					'/**/\t\t\tMath.floor( ' + aName + ' ) !== ' + aName,
					'/**/\t\t)'
				);

				break;

			case 'String' :

				r.push(
					'/**/\t\tif(',
					'/**/\t\t\ttypeof( ' + aName  + ' ) !== \'string\' &&',
					'/**/\t\t\t!( ' + aName + ' instanceof String )',
					'/**/\t\t)'
				);

				break;

			case 'Number' :

				r.push(
					'/**/\t\tif(',
					'/**/\t\t\ttypeof( ' + aName  + ' ) !== \'number\'',
					'/**/\t\t)'
				);

				break;

			case 'Action' :
			case 'Array' :
			case 'Item' :
			case 'Mark' :
			case 'Tree' :

				// FIXME
				r.push(
					'/**/\t\tif( false )'
				);

				break;

			default :

				r.push(
					'/**/\t\tif( ' +
						aName + '.reflect !== \'' + attr.type + '\'' +
						' )'
				);
		}

		r.push(
			'/**/\t\t{',
			'/**/\t\t\tthrow new Error(',
			'/**/\t\t\t\t\'type mismatch\'',
			'/**/\t\t\t);',
			'/**/\t\t}'
		);

		if( attr.refuse )
		{
			r.push(
				'/**/',
				'/**/\t\tif('
			);

			for(
				var b = 0, bZ = attr.refuse.length;
				b < bZ;
				b++
			)
			{
				r.push(
					'/**/\t\t\t( ' +
						aName + ' ' +
						attr.refuse[ b ] +
						' )'
					);

				if( b + 1 < bZ )
				{
					r.push(
						'/**/\t\t\t||'
					);
				}
			}

			r.push(
				'/**/\t\t)',
				'/**/\t\t{',
				'/**/\t\t\tthrow new Error(',
				'/**/\t\t\t\t\'refusing value\'',
				'/**/\t\t\t);',
				'/**/\t\t}'
			);
		}

		r.push(
			'/**/\t}'
		);

		if( a + 1 < aZ )
		{
			r.push(
				'/**/'
			);
		}
	}

	r.push(
		'/**/}',
		''
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
	var
		a,
		aZ,
		aName,
		attr;

	for(
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

		attr =
			jj.attributes[ aName ];

		if( !attr.concerns )
		{
			continue;
		}

		var
			func =
				attr.concerns.func,

			args =
				attr.concerns.args;

		r.push(
			'\t' + ( attr.assign  || aName ) + ' ='
		);

		if( args === null )
		{
			r.push(
				'\t\t' + func + ';',
				''
			);
		}
		else if( args.length === 0 )
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

			for(
				var b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				r.push(
					'\t\t\t' + args[ b ] +
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
		aName,
		attr;

	if( jj.aList.length === 0 )
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
			'/**/}',
			''
		);

		return;
	}

	r.push(
		'\tif(',
		'\t\tinherit',
		'\t\t&&'
	);

	for(
		var a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

		attr =
			jj.attributes[ aName ];

		if( a > 0 )
		{
			r.push(
				'\t\t&&'
			);
		}

		if( attr.assign === null )
		{
			r.push(
				'\t\t' + aName + ' === null'
			);

			continue;
		}

		switch( attr.type )
		{
			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'String' :
			case 'Tree' : // FIXME

				r.push(
					'\t\t' + aName + ' === inherit.' +
						( attr.assign || aName )
				);

				break;

			default :

				if( !attr.allowNull )
				{
					r.push(
						'\t\t' + aName +
							'.equals( inherit.' +
							( attr.assign || aName ) +
							' )'
					);
				}
				else
				{
					r.push(
						'\t\t(',
						'\t\t\t' + aName + ' === inherit.' +
							( attr.assign || aName ),
						'\t\t\t||',
						'\t\t\t(',
						'\t\t\t\t' + aName + ' !== null',
						'\t\t\t\t&&',
						'\t\t\t\t' + aName +
							'.equals( inherit.' +
							( attr.assign || aName ) +
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
	var
		aName;

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
			aName =
				jj.conList[ a ];

			r.push(
				'\t\t\t' + aName +
					( a + 1 < jj.conList.length ? ',' : '' )
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
		r,  // result array
		jj  // the joobj working object
	)
{
	var
		a,
		aZ,
		aName;

	r.push(
		'\tvar',
		'\t\tinherit' +
			( jj.aList.length > 0 ? ',' : ';' )
	);

	for(
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

		r.push(
			'\t\t' + aName +
				( a + 1 >= jj.aList.length ? ';' : ',' )
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

	if( jj.aList )
	{
		r.push(
			'\t\t// free strings'
		);
	}

	r.push(
		'\t)',
		'{'
	);

	generateAttributeVariables( r, jj );

	if( jj.aList.length > 0 )
	{
		generateCreatorInheritanceReceiver( r, jj );

		generateCreatorFreeStringsParser( r, jj );
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
		aName,
		attr;

	r.push(
		'/*',
		'| Creates a new ' + jj.name + ' object from JSON',
		'*/',
		jj.reference + '.createFromJSON =',
		'\tfunction(',
		'\t\t_json_ // the json object',
		'\t)',
		'{'
	);

	// XXX TODO remove
	r.push(
		'\tif( _json_._$grown ) return _json_;'
	);

	generateAttributeVariables( r, jj );

	r.push(
		'\tfor( var _aName_ in _json_ )',
		'\t{',
		'\t\tvar',
		'\t\t\t_arg_ =',
		'\t\t\t\t_json_[ _aName_ ];',
		'',
		'\t\tswitch( _aName_ )',
		'\t\t{',
		'\t\t\tcase \'type\' :',
		'',
		'\t\t\t\tif( _arg_ !== \'' + jj.name + '\')',
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
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ],

		attr =
			jj.attributes[ aName ];

		if( attr.assign === null )
		{
			continue;
		}

		r.push(
			'\t\t\tcase \'' + aName + '\' :',
			'',
			'\t\t\t\t' + aName + ' ='
		);

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :

				r.push(
					'\t\t\t\t\t_arg_;'
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
					'\t\t\t\t\t\t_arg_',
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
		'\t\t\t\t\t\'invalid JSON: \' + _aName_',
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
		var a = 0, aZ = jj.conList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.conList[ a ];

		if( aName === 'inherit' )
		{
			r.push(
				'\t\t\tnull'
			);

			continue;
		}

		r.push(
			'\t\t\t' + aName +
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
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ];

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
		a = 0, aZ = jj.aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			jj.aList[ a ],

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
					'\t\tthis.' +
						( attr.assign || aName ) +
						' === obj.' +
						( attr.assign || aName )
				);

				break;

			default :

				if( !attr.allowNull )
				{
					r.push(
						'\t\tthis.' +
							( attr.assign || aName ) +
							'.equals( obj.' +
							( attr.assign || aName ) +
							' )'
					);
				}
				else
				{
					r.push(
						'\t\t(',
						'\t\t\tthis.' +
							( attr.assign || aName ) +
							' === obj.' +
							( attr.assign || aName ) +
							' ||',
						'\t\t\t(',
						'\t\t\t\tthis.' + ( attr.assign || aName ) +
							' !== null',
						'\t\t\t\t&&',
						'\t\t\t\tthis.' +
							( attr.assign || aName ) +
							'.equals( obj.' +
							( attr.assign || aName ) +
							' )',
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
