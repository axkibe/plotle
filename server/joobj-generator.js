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


if( typeof( require ) === 'undefined' )
{
	throw new Error(
		'this code requires node!'
	);
}


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
			case 'abstract' :
			case 'attributes' :
			case 'hasJSON' :
			case 'name' :
			case 'node' :
			case 'notag' :
			case 'equals' :
			case 'subclass' :
			case 'singleton' :
			case 'unit' :

				break;

			default :

				throw new Error(
					'invalid joobj parameter: ' + aName
				);
		}
	}

	if(
		!Jools.isString( joobj.name )
	)
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
			if( aName === 'inherit' )
			{
				throw new Error(
					'attribute must not be named "inherit"'
				);
			}

			if( aName === 'json' )
			{
				throw new Error(
					'attribute must not be named "json"'
				);
			}

			for( var aoname in attr[ aName ] )
			{
				switch( aoname )
				{
					case 'allowNull' :
					case 'comment' :
					case 'defaultVal' :
					case 'locate' :
					case 'refuse' :
					case 'type' :
					case 'unit' :

						break;

					default :

						throw new Error(
							'attribute ' +
								'"' + aName + '"' +
								' has invalid specifier: ' +
								'"' + aoname + '"'
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
		r,     // result array
		joobj  // the joobj definition
	)
{
	var
		unit =
			joobj.unit;

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
			'\t' + joobj.name + ';'
		);
	}
};


/*
| Generates the imports section.
*/
var
generateImportsSection =
	function(
		r,       // result array
		unitList // list of units
	)
{
	r.push(
		'/*',
		'| Imports',
		'*/',
		'var',
		'\tJools' +
			( unitList && unitList.length > 0 ? ',' : ';' )
	);

	if( unitList )
	{
		for(
			var a = 0, aZ = unitList.length;
			a < aZ;
			a++
		)
		{
			r.push(
				'\t' + unitList[ a ] +
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
		r,     // result array
		joobj  // the joobj definition
	)
{
	r.push(
		'/*',
		'| Capsule',
		'*/',
		'(function( ) {',
		'\'use strict\';'
	);

	if( !joobj.notag )
	{
		r.push(
			'',
			'',
			'var',
			'\t_tag =',
			'\t\t' + Math.floor( Math.random( ) * 1000000000 ) + ';'
		);
	}
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
		r,         // result array
		joobj,     // the joobj definition
		aList,     // attribute name list
		unitList   // unit list
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
		'if( typeof( module ) !== \'undefined\' )',
		'{',
		'\tJools =',
		'\t\trequire( \'../shared/jools\' );'
	);

	for(
		a = 0, aZ = unitList.length;
		a < aZ;
		a++
	)
	{
		r.push(
			'',
			'\t' + unitList[ a ] + ' =',
			'\t\t{ };'
		);
	}

	var
		// a list of stuff already generated
		generated =
			{ };

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

		switch( attr.type )
		{
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
					// TODO
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
		r,        // result array
		reference // the joobj reference name
	)
{
	r.push(
		'/*',
		'| Node export',
		'*/',
		'if( typeof( module ) !== \'undefined\' )',
		'{',
		'\tmodule.exports =',
		'\t\t' + reference + ';',
		'}'
	);
};




/*
| Generates the constructor.
*/
var
generateConstructor =
	function(
		r,         // result array
		joobj,     // the joobj definition
		reference, // the joobj reference name
		aList      // attribute name list
	)
{
	var
		a,
		aZ,

		// attribute name
		aName,

		// longest attribute name
		maxANameLen =
			0;

	if( aList )
	{
		for(
			a = 0, aZ = aList.length;
			a < aZ;
			a++
		)
		{
			aName =
				aList[ a ];

			if( aName.length > maxANameLen )
			{
				maxANameLen =
					aName.length;
			}
		}
	}

	r.push(
		'/*',
		'| Constructor.',
		'*/'
	);

	if( joobj.unit )
	{
		r.push(
			'var ' + reference + ' =',
			joobj.unit + '.' + joobj.name + ' ='
		);
	}
	else
	{
		r.push(
			reference + ' ='
		);
	}

	r.push(
		'\tfunction('
	);

	if( !joobj.notag )
	{
		r.push(
			'\t\ttag' +
				(
					aList && aList.length > 0
					?
					','
					:
					''
				)
		);
	}

	if( aList )
	{
		for(
			a = 0, aZ = aList.length;
			a < aZ;
			a++
		)
		{
			aName =
				aList[ a ];

			var
				comment =
					joobj.attributes[ aName ].comment,

				comma =
					a + 1 < aZ;

			r.push(
				'\t\t' + aName +
					( comma ? ',' : '' ) +
					( comment ?
						whiteSpace(
							maxANameLen - aName.length + (comma ? 0 : 1 )
						) + ' // ' + comment
						:
						''
					)
			);
		}
	}

	r.push(
		'\t)',
		'{'
	);

	if( !joobj.notag )
	{
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
	}

	if( aList )
	{
		r.push(
			'/**/if( CHECK )',
			'/**/{'
		);

		for(
			a = 0, aZ = aList.length;
			a < aZ;
			a++
		)
		{
			aName =
				aList[ a ];

			var
				attr =
					joobj.attributes[ aName ];

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

				case 'Item' :
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

		for(
			a = 0, aZ = aList.length;
			a < aZ;
			a++
		)
		{
			aName =
				aList[ a ];

			r.push(
				'\tthis.' + aName + ' =',
				'\t\t' + aName + ';',
				''
			);
		}
	}

	if( joobj.subclass )
	{
		r.push(
			'\t' + joobj.subclass + '.call( this );',
			'};'
		);
	}
	else
	{
		r.push(
			'\tJools.immute( this );',
			'};'
		);
	}
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
		r,        // result array
		joobj,    // the joobj definition
		reference // the reference name for the joobj
	)
{
	r.push(
		'Jools.subclass(',
		'\t' + reference + ',',
		'\t' + joobj.subclass,
		');'
	);
};


/*
| Generates the creator.
*/
var
generateCreator =
	function(
		r,         // result array
		joobj,     // the joobj definition
		reference, // the reference name for the joobj
		aList      // attribute name list
	)
{
	var
		a,
		aZ,

		// attribute name
		aName,

		// the attribute
		attr,

		// alphabetical sorted attribute names
		// including 'inherit'
		aListPlus =
			null;

	if( aList )
	{
		aListPlus =
			aList.slice( );

		aListPlus.push( 'inherit' );

		if( joobj.hasJSON )
		{
			aListPlus.push( 'json' );
		}

		aListPlus.sort( );
	}

	r.push(
		'/*',
		'| Creates a new ' + joobj.name + ' object.',
		'*/',
		reference + '.create =',
		'\tfunction('
	);

	if( aList )
	{
		r.push(
			'\t\t// free strings'
		);
	}

	r.push(
		'\t)',
		'{'
	);

	if( aListPlus )
	{
		r.push(
			'\tvar'
		);

		for(
			a = 0, aZ = aListPlus.length;
			a < aZ;
			a++
		)
		{
			aName =
				aListPlus[ a ];

			r.push(
				'\t\t' + aName +
					( a + 1 >= aListPlus.length ? ';' : ',' )
			);
		}

		r.push(
			'',
			'\tfor(',
			'\t\tvar a = 0, aZ = arguments.length;',
			'\t\ta < aZ;',
			'\t\ta += 2',
			'\t)',
			'\t{',
			'\t\tswitch( arguments[ a ] )',
			'\t\t{'
		);

		for(
			a = 0, aZ = aListPlus.length;
			a < aZ;
			a++
		)
		{
			aName =
				aListPlus[ a ];

			r.push(
				'\t\t\tcase \'' + aName + '\' :',
				'',
				'\t\t\t\t' + aName + ' =',
				'\t\t\t\t\targuments[ a + 1 ];',
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
			'\t}',
			''
		);

		// generates JSON data aquisition
		if( joobj.hasJSON )
		{
			r.push(
				'\tif( json )',
				'\t{'
			);

			for(
				a = 0, aZ = aList.length;
				a < aZ;
				a++
			)
			{
				aName =
					aList[ a ],

				attr =
					joobj.attributes[ aName ];

				if( a > 0 )
				{
					r.push(
						''
					);
				}

				r.push(
					'\t\tif( ' + aName + ' === undefined )',
					'\t\t{',
					'\t\t\t' + aName + ' ='
				);

				switch( attr.type )
				{
					case 'Integer' :
					case 'Number' :
					case 'String' :

						r.push(
							'\t\t\t\tjson.' + aName + ';'
						);

						break;

					default :

						if( attr.unit )
						{
							r.push(
								'\t\t\t\t' +
									attr.unit + '.' +
									attr.type + '.create('
							);
						}
						else
						{
							r.push(
								'\t\t\t\t' +
									attr.type + '.create('
							);
						}

						r.push(
							'\t\t\t\t\t\'json\',',
							'\t\t\t\t\t\tjson.' + aName,
							'\t\t\t\t);'
						);

						break;
				}

				r.push(
					'\t\t}'
				);
			}

			r.push(
				'\t}',
				''
			);
		}

		// generates inheritance
		r.push(
			'\tif( inherit )',
			'\t{'
		);

		for(
			a = 0, aZ = aList.length;
			a < aZ;
			a++
		)
		{
			aName =
				aList[ a ];

			if( a > 0 )
			{
				r.push(
					''
				);
			}

			r.push(
				'\t\tif( ' + aName + ' === undefined )',
				'\t\t{',
				'\t\t\t' + aName + ' =',
				'\t\t\t\tinherit.' + aName + ';',
				'\t\t}'
			);
		}

		r.push(
			'\t}',
			''
		);

		// generates default values

		if( aList )
		{
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
		}

		// generates the full inheritance shortcut check

		r.push(
			'\tif(',
			'\t\tinherit',
			'\t\t&&'
		);


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

			if( a > 0 )
			{
				r.push(
					'\t\t&&'
				);
			}

			switch( attr.type )
			{
				case 'Integer' :
				case 'Number' :
				case 'String' :
				case 'Tree' :

					r.push(
						'\t\t' + aName + ' === inherit.' + aName
					);

					break;

				default :

					if( !attr.allowNull )
					{
						r.push(
							'\t\t' + aName +
								'.equals( inherit.' + aName + ' )'
						);
					}
					else
					{
						r.push(
							'\t\t(',
							'\t\t\t' + aName + ' === inherit.' + aName,
							'\t\t\t||',
							'\t\t\t(',
							'\t\t\t\t' + aName + ' !== null',
							'\t\t\t\t&&',
							'\t\t\t\t' + aName +
								'.equals( inherit.' + aName + ' )',
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
	}
	else
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
	}

	// fills in default values


	if( joobj.singleton )
	{
		r.push(
			'\tif( !_singleton )',
			'\t{',
			'\t\t_singleton ='
		);

		if( joobj.notag )
		{
			r.push(
				'\t\t\tnew ' + reference + '( );'
			);
		}
		else
		{
			r.push(
				'\t\t\tnew ' + reference + '(',
				'\t\t\t\t_tag',
				'\t\t\t);'
			);
		}

		r.push(
			'\t}',
			'',
			'\treturn _singleton;'
		);
	}
	else
	{
		r.push(
			'\treturn (',
			'\t\tnew ' + reference + '('
		);

		if( !joobj.notag )
		{
			r.push(
				'\t\t\t_tag,'
			);
		}

		for(
			a = 0, aZ = aList.length;
			a < aZ;
			a++
		)
		{
			aName =
				aList[ a ];

			r.push(
				'\t\t\t' + aName +
					( a + 1 < aList.length ? ',' : '' )
			);
		}

		r.push(
			'\t\t)',
			'\t);'
		);
	}

	r.push(
		'};'
	);
};


/*
| Generates the reflection section.
*/
var
generateReflectionSection =
	function(
		r,        // result array
		joobj,    // the joobj definition
		reference // the reference name for the joobj
	)
{
	r.push(
		'/*',
		'| Reflection.',
		'*/',
		reference + '.prototype.reflect =',
		'\t\'' + joobj.name + '\';'
	);

	// FIXME this is some workaround
	if( joobj.hasJSON )
	{
		r.push(
			'',
			'',
			'/*',
			'| Workaround meshverse growing',
			'*/',
			reference + '.prototype._$grown =',
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
		r,         // result array
		joobj,     // the joobj definition
		reference, // the reference name for the joobj
		aList      // attribute name list
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
		'\t' + reference + '.prototype,',
		'\t\'toJSON\',',
		'\tfunction( )',
		'\t{',
		'\t\treturn Object.freeze( {',
		'',
		'\t\t\ttype :',
		'\t\t\t\t\'' + joobj.name + '\',',
		''
	);

	for(
		a = 0, aZ = aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			aList[ a ];

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
		r,        // result array
		joobj,    // the joobj definition
		reference // the reference name for the joobj
	)
{
	r.push(
		'/*',
		'| Checks for equal objects.',
		'*/',
		reference + '.prototype.equals =',
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
		r,         // result array
		joobj,     // the joobj definition
		reference, // the reference name for the joobj
		aList      // attribute name list
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
		reference + '.prototype.equals =',
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

	for(
		a = 0, aZ = aList.length;
		a < aZ;
		a++
	)
	{
		aName =
			aList[ a ],

		attr =
			joobj.attributes[ aName ];

		if( a > 0 )
		{
			r.push(
				'\t\t&&'
			);
		}

		switch( attr.type )
		{
			case 'Integer' :
			case 'Number' :
			case 'String' :
			case 'Tree' :

				r.push(
					'\t\tthis.' + aName + ' === obj.' + aName
				);

				break;

			default :

				if( !attr.allowNull )
				{
					r.push(
						'\t\tthis.' + aName +
							'.equals( obj.' + aName + ' )'
					);
				}
				else
				{
					r.push(
						'\t\t(',
						'\t\t\tthis.' + aName +
							' === inherit.' + aName + ' ||',
						'\t\t\t(',
						'\t\t\t\t' + aName + ' !== null',
						'\t\t\t\t&&',
						'\t\t\t\tthis.' + aName +
							'.equals( obj.' + aName + ' )',
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
		a,
		aZ,
		aName,
		attr,

		// alphabetical sorted attribute names
		aList =
			null,

		// the result array
		r =
			[ ],

		// units used
		units =
			{ },

		// units sorted alphabetically
		unitList =
			null;

	// tests if the joobj looks ok
	checkJoobj( joobj );

	var
		reference =
			null;

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

	if( joobj.attributes )
	{
		aList =
			Object.keys( joobj.attributes ).sort( );

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


	generateFileHeader( r );

	generateSeperator( r );

	generateExportSection( r, joobj );

	generateSeperator( r );

	generateImportsSection( r, unitList );

	generateSeperator( r );

	generateCapsuleHeader( r, joobj );

	generateSeperator( r );

	if( joobj.node )
	{
		generateNodeIncludesSection( r, joobj, aList, unitList );

		generateSeperator( r );
	}

	generateConstructor( r, joobj, reference, aList );

	generateSeperator( r );

	if( joobj.singleton )
	{
		generateSingletonSection( r );

		generateSeperator( r );
	}


	if( joobj.subclass )
	{
		generateSubclassSection( r, joobj, reference );

		generateSeperator( r );
	}

	if( !joobj.abstract )
	{
		generateCreator( r, joobj, reference, aList );

		generateSeperator( r );
	}

	generateReflectionSection( r, joobj, reference );

	generateSeperator( r );

	if( joobj.hasJSON )
	{
		generateToJSONSection( r, joobj, reference, aList );

		generateSeperator( r );
	}

	switch( joobj.equals )
	{
		case false :

			break;

		case undefined :
		case true :

			generateEqualsCheck( r, joobj, reference, aList );

			generateSeperator( r );

			break;

		case 'primitive' :

			generatePrimitiveEqualsCheck( r, joobj, reference );

			generateSeperator( r );

			break;

		default :

			throw new Error(
				'invalid equals value: ' + joobj.equals
			);
	}

	if( joobj.node )
	{
		generateNodeExportSection( r, reference );

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
