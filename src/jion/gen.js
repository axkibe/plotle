/*
| Generates jion objects from a jion definition.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'jion.gen',
		node :
			true,
		attributes :
			{
				'jion' :
					{
						comment :
							'the jion definition',
						type :
							'Object'
					}
			},
		init :
			[ ]
	};
}


var
	astTools,
	gen,
	jools,
	shorthand,
	validator;


gen =
module.exports =
	require( '../jion/this' )( module );

shorthand = require( '../ast/shorthand' );

jools = require( '../jools/jools' );

astTools = require( '../ast/tools' );

validator = require( './validator' );

var
	astAnd,
	astArrayLiteral,
	astAssign,
	astBlock,
	astCall,
	astCommaList,
	astComment,
	astCondition,
	astDelete,
	astDiffers,
	astEquals,
	astFalse,
	astFile,
	astFunc,
	astGreaterThan,
	astIf,
	astInstanceof,
	astLessThan,
	astNew,
	astNot,
	astNull,
	astNumber,
	astObjLiteral,
	astOr,
	astPlus,
	astPlusAssign,
	astPreIncrement,
	astReturn,
	astReturnFalse,
	astReturnTrue,
	astString,
	astSwitch,
	astThis,
	astTrue,
	astTypeof,
	astUndefined,
	astVar,
	astVList;

/*
| Shorthanding Shorthands.
*/
astAnd = shorthand.astAnd;

astArrayLiteral = shorthand.astArrayLiteral;

astAssign = shorthand.astAssign;

astBlock = shorthand.astBlock;

astCall = shorthand.astCall;

astCommaList = shorthand.astCommaList;

astComment = shorthand.astComment;

astCondition = shorthand.astCondition;

astDelete = shorthand.astDelete;

astDiffers = shorthand.astDiffers;

astEquals = shorthand.astEquals;

astFalse = shorthand.astBoolean( false );

astFile = shorthand.astFile;

astFunc = shorthand.astFunc;

astGreaterThan = shorthand.astGreaterThan;

astIf = shorthand.astIf;

astInstanceof = shorthand.astInstanceof;

astLessThan = shorthand.astLessThan;

astNew = shorthand.astNew;

astNot = shorthand.astNot;

astNull = shorthand.astNull( );

astNumber = shorthand.astNumber;

astObjLiteral = shorthand.astObjLiteral;

astOr = shorthand.astOr;

astPlus = shorthand.astPlus;

astPlusAssign = shorthand.astPlusAssign;

astPreIncrement = shorthand.astPreIncrement;

astReturn = shorthand.astReturn;

astString = shorthand.astString;

astSwitch = shorthand.astSwitch;

astThis = shorthand.astVar( 'this' );

astTrue = shorthand.astBoolean( true );

astTypeof = shorthand.astTypeof;

astUndefined = shorthand.astVar( 'undefined' );

astVar = shorthand.astVar;

astVList = shorthand.astVList;

astReturnTrue = astReturn( astTrue );

astReturnFalse = astReturn( astFalse );


/*
| Converts a camel case string to a dash seperated string.
*/
var
camelCaseToDash =
	function( s )
{
	return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase( );
};


/*
| Initializes a generator.
*/
gen.prototype._init =
	function( )
{
	var
		a,
		aZ,
		assign,
		attr,
		attributes,
		attrList,
		attrType,
		attrUnit,
		concerns,
		concernsParts,
		concernsType,
		concernsUnit,
		constructorList,
		defaultValue,
		// sorted init list
		idParts,
		inits,
		jAttr,
		jdv,
		jion,
		ut,
		name,
		subParts,
		// twig id
		twigId,
		// processed twig table for generator use
		twig,
		// twig map to be used (the definition)
		twigDef,
		// twigs sorted alphabetically
		twigList,
		// units sorted alphabetically
		unitList,
		// units used
		units;

	attributes = { };

	constructorList = [ ];

	jion = this.jion;

	twig = null;

	twigDef = null;

	units =
		{
			jion :
				{
					proto :
						true
				}
		};

	this.hasJSON = !!jion.json;

	this.init = jion.init;

	this.node = !!jion.node;

	this.singleton = !!jion.singleton;

	idParts = jion.id.split( '.' );

	this.id = jion.id;

	this.unit = idParts[ 0 ];

	this.name = idParts[ 1 ];

	if( jion.subclass )
	{
		subParts = jion.subclass.split( '.' );

		if( subParts.length >=  2 )
		{
			if( subParts.length > 2 )
			{
				throw new Error(
					'subclass can only have one dot'
				);
			}

			if( !units[ subParts[ 0 ] ] )
			{
				units[ subParts[ 0 ] ] = { };
			}

			units[ subParts[ 0 ] ][ subParts[ 1 ] ] = true;

			this.subclass =
				astVar( subParts[ 0 ] ).astDot( subParts[ 1 ] );
		}
		else
		{
			this.subclass = astVar( jion.subclass );
		}
	}

	for( name in jion.attributes || { } )
	{
		jAttr = jion.attributes[ name ];

		if( jAttr.type.indexOf( '.' ) < 0  )
		{
			switch( jAttr.type )
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
						'attribute type misses unit: ' + jAttr.type
					);
			}
		}

		if( jAttr.type.indexOf( '.' ) >= 0 )
		{
			attrUnit = jAttr.type.split( '.' )[ 0 ];

			attrType = jAttr.type.split( '.' )[ 1 ];
		}
		else
		{
			attrUnit = undefined;

			attrType = jAttr.type;
		}

		if( jAttr.json )
		{
			this.hasJSON = true;
		}

		if( attrUnit )
		{
			if( !units[ attrUnit ] )
			{
				units[ attrUnit ] = { };
			}

			units[ attrUnit ][ attrType ] = true;
		}

		assign =
			jAttr.assign !== undefined
				?
				jAttr.assign
				:
				name;

		if(
			assign !== null
			||
			(
				this.init
				&&
				this.init.indexOf( name ) >= 0
			)
		)
		{
			constructorList.push( name );
		}

		defaultValue = null;

		concerns = jAttr.concerns;

		if( concerns && concerns.type )
		{
			concernsParts = concerns.type.split( '.' );

			if( concernsParts.length > 2 )
			{
				throw new Error(
					'concerns can only have one dot.'
				);
			}
			else if( concernsParts.length === 2 )
			{
				concernsUnit = concernsParts[ 0 ];

				concernsType = concernsParts[ 1 ];
			}
			else
			{
				throw new Error(
					'concerns misses type.'
				);
			}

			if( concernsUnit )
			{
				if( !units[ concernsUnit ] )
				{
					units[ concernsUnit ] = { };
				}

				units[ concernsUnit ][ concernsType ] = true;
			}
		}

		// tests also if defaultValue is defined to be `undefined`
		if( Object.keys( jAttr ).indexOf( 'defaultValue' ) >= 0 )
		{
			jdv = jAttr.defaultValue;

			if( jdv === null )
			{
				defaultValue = astNull;
			}
			else if( jdv === undefined )
			{
				defaultValue = astUndefined;
			}
			else if( jdv === false )
			{
				defaultValue = astFalse;
			}
			else if( jdv === true )
			{
				defaultValue = astTrue;
			}
			else if( typeof( jdv ) === 'number' )
			{
				defaultValue = astNumber( jAttr.defaultValue );
			}
			else if( jools.isString( jdv ) )
			{
				if( jdv[ 0 ] === "'" )
				{
					throw new Error(
						'invalid default Value: ' + jdv
					);
				}

				defaultValue = astString( jdv );
			}
			else
			{
				throw new Error( );
			}
		}

		attr =
		attributes[ name ] =
			Object.freeze( {
				allowsNull :
					jAttr.allowsNull
					||
					defaultValue === astNull,
				allowsUndefined :
					jAttr.allowsUndefined
					||
					defaultValue === astUndefined,
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns
					?
						Object.freeze( {
							unit :
								concernsUnit,
							type :
								concernsType,
							func :
								jAttr.concerns.func,
							args :
								jAttr.concerns.args,
							member :
								jAttr.concerns.member
						} )
					: null,
				defaultValue :
					defaultValue,
				json :
					jAttr.json,
				name :
					name,
				type :
					attrType,
				unit :
					attrUnit,
				v :
					astVar( 'v_' + name )
			} );
	}

	attrList = Object.keys( attributes ).sort ( );

	this.attrList = Object.freeze( attrList );

	this.attributes = Object.freeze( attributes );

	constructorList.sort( );

	if( jion.twig )
	{
		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
	}

	if( jion.ray )
	{
		constructorList.unshift( 'ray' );
	}

	if( jion.init )
	{
		inits = jion.init.slice( ).sort( );

		for(
			a = inits.length - 1;
			a >= 0;
			a--
		)
		{
			name = jion.init[ a ];

			if( attributes[ name ] )
			{
				continue;
			}

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :
				case 'ray' :
				case 'rayDup' :

					constructorList.unshift( name );

					break;

				default :

					throw new Error(
						'invalid init value: ' + name
					);
			}
		}
	}

	this.constructorList = Object.freeze( constructorList );

	if( jion.twig )
	{
		twig = { };

		if( jools.isString( jion.twig ) )
		{
			twigDef = require( '../typemaps/' + jion.twig.substr( 2 ) );
		}
		else
		{
			twigDef = jion.twig;
		}

		for(
			a = 0, aZ = twigDef.length;
			a < aZ;
			a++
		)
		{
			twigId = twigDef[ a ];

			ut = twigId.split( '.' );

			if( ut.length !== 2 )
			{
				throw new Error(
					'invalid twig id: ' + twigId
				);
			}

			if( !units[ ut[ 0 ] ] )
			{
				units[ ut[ 0 ] ] = { };
			}

			units[ ut[ 0 ] ][ ut[ 1 ] ] = true;

			twig[ twigId ] =
				Object.freeze( {
					unit :
						ut[ 0 ],
					type :
						ut[ 1 ]
				} );
		}

		this.twig = Object.freeze( twig );
	}
	else
	{
		twig =
		this.twig =
			null;
	}

	if( jion.ray )
	{
		this.ray =
			Object.freeze(
				jion.ray.slice( )
			);
	}

	unitList = Object.keys( units ).sort( );

	this.unitList = Object.freeze( unitList );

	this.units = Object.freeze( units );

	if( twig )
	{
		twigList = Object.keys( twig ).sort( );

		this.twigList = Object.freeze( twigList );
	}

	// FIXME make it a astVar
	this.reference =
		( this.unit === this.name )
		? this.name + 'Obj'
		: this.name;

	this.equals = jion.equals;

	this.alike = jion.alike;
};


/*
| Generates the imports.
*/
gen.prototype.genImports =
	function(
		capsule // block to append to
	)
{
	capsule = capsule.astComment( 'Imports.' );

	capsule = capsule
		.astVarDec( 'jion' )
		.astVarDec( 'jools' );

	// FUTURE when type checking is there this might become needed
	// without jsons
	if( this.hasJSON )
	{
		for(
			var a = 0, aZ = this.unitList.length;
			a < aZ;
			a++
		)
		{
			capsule = capsule
				.astVarDec( this.unitList[ a ] );
		}
	}

	return capsule;
};


/*
| Generates the node include.
*/
gen.prototype.genNodeIncludes =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		block,
		typeName,
		types,
		unitName,
		unit;

	capsule = capsule.astComment( 'Node includes.' );

	block = astBlock( )
		.astAssign(
			'jools',
			astCall(
				astVar( 'require' ),
				astString( '../../src/jools/jools' )
			)
		);

	// generates the unit objects

	for(
		a = 0, aZ = this.unitList.length;
		a < aZ;
		a++
	)
	{
		block = block
			.astAssign(
				astVar( this.unitList[ a ] ),
				astObjLiteral( )
			);
	}

	for(
		a = 0, aZ = this.unitList.length;
		a < aZ;
		a++
	)
	{
		unitName = this.unitList[ a ];

		unit = this.units[ this.unitList[ a ] ];

		types = Object.keys( unit );

		types.sort( );

		for(
			b = 0, bZ = types.length;
			b < bZ;
			b++
		)
		{
			typeName =
				types[ b ];

			block =
				block
				.astAssign(
					astVar( unitName ).astDot( typeName ),
					astCall(
						astVar( 'require' ),
						astString(
							'../../src/' +
								camelCaseToDash( unitName ) +
								'/' +
								camelCaseToDash( typeName )
						)
					)
				);
		}
	}

	capsule =
		capsule.astIf(
			astVar( 'SERVER' ),
			block
		);

	return capsule;
};


/*
| Generates the constructor.
*/
gen.prototype.genConstructor =
	function(
		capsule // block to append to
	)
{
	var
		a,
		assign,
		aZ,
		attr,
		block,
		constructor,
		initCall,
		jionObj,
		name;

	capsule = capsule.astComment( 'Constructor.' );

	block = astBlock( );

	// assigns the variables
	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		assign =
			astAssign(
				astThis.astDot( attr.assign ),
				attr.v
			);

		if( !attr.allowsUndefined )
		{
			block = block.append( assign );
		}
		else
		{
			block =
				block
				.astIf(
					astDiffers( attr.v, astUndefined ),
					astBlock( ).append( assign ) // FIXME
				);
		}
	}

	if( this.twig )
	{
		block =
			block
			.astAssign(
				astThis.astDot( 'twig' ),
				astVar( 'twig' )
			)
			.astAssign(
				astThis.astDot( 'ranks' ),
				astVar( 'ranks' )
			);
	}


	if( this.ray )
	{
		block =
			block
			.astAssign(
				astThis.astDot( 'ray' ),
				astVar( 'ray' )
			);
	}

	// calls the initializer
	if( this.init )
	{
		initCall = astCall( astThis.astDot( '_init' ) );

		for(
			a = 0, aZ = this.init.length;
			a < aZ;
			a++
		)
		{
			name = this.init[ a ];

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					initCall =
						initCall.append(
							astVar( this.init[ a ] )
						);

					continue;
			}

			attr = this.attributes[ name ];

			if( !attr )
			{
				throw new Error(
					'invalid parameter to init: ' + name
				);
			}

			initCall = initCall.append( ( attr.v ) );
		}

		block = block.append( initCall );
	}

	// immutes the new object
	// FIXME use object.freeze and only in checking
	block =
		block
		.astCall(
			astVar( 'jools' ).astDot( 'immute' ),
			astThis
		);

	if( this.twig )
	{
		// FIXME use object.freeze and only in checking
		block =
			block
			.astCall(
				astVar( 'jools' ).astDot( 'immute' ),
				astVar( 'twig' )
			)
			.astCall(
				astVar( 'jools' ).astDot( 'immute' ),
				astVar( 'ranks' )
			);
	}

	if( this.ray )
	{
		block =
			block
			.astCheck(
				astBlock( )
				.astCall(
					astVar( 'Object' ).astDot( 'freeze' ),
					astVar( 'ray' )
				)
			);
	}

	constructor = astFunc( block );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				constructor = constructor.astArg( 'inherit', 'inheritance' );

				break;

			case 'ranks' :

				constructor = constructor.astArg( 'ranks', 'twig ranks' );

				break;

			case 'ray' :

				constructor = constructor.astArg( 'ray', 'ray' );

				break;

			case 'rayDup' :

				constructor =
					constructor.astArg(
						'rayDup',
						'true if ray is already been duplicated'
					);

				break;

			case 'twig' :

				constructor =
					constructor.astArg( 'twig', 'twig' );

				break;

			case 'twigDup' :

				constructor =
					constructor.astArg(
						'twigDup',
						'true if twig is already been duplicated'
					);

				break;
			default :

				attr =
					this.attributes[ name ];

				constructor =
					constructor.astArg(
						attr.v.name,
						attr.comment
					);
		}
	}

	capsule =
		capsule.astVarDec( 'Constructor', constructor );

	// subclass
	if( this.subclass )
	{
		capsule =
			capsule
			.astComment( 'Subclass.' )
			.astCall(
				astVar( 'jools' ).astDot( 'subclass' ),
				astVar( 'Constructor' ),
				this.subclass
			);
	}

	// prototype shortcut
	capsule =
		capsule
		.astComment( 'Prototype shortcut' )
		.astVarDec(
			'prototype',
			astVar( 'Constructor' ).astDot( 'prototype' )
		);

	// the exported object
	capsule = capsule.astComment( 'Jion.' );

	jionObj =
		astObjLiteral( )
		.add(
			'prototype',
			astVar( 'prototype' )
		);

	capsule =
		capsule.astVarDec(
			this.reference,
			astAssign(
				astVar( this.unit ).astDot( this.name ),
				jionObj
			)
		);

	return capsule;
};



/*
| Generates the singleton decleration.
*/
gen.prototype.genSingleton =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.astComment( 'Singleton' )
		.astVarDec( '_singleton', astNull )
	);
};


/*
| Generates the creators variable list.
*/
gen.prototype.genCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].v.name );
	}

	varList.push( 'inherit' );

	if( this.twig )
	{
		varList.push(
			'key',
			'rank',
			'ranks',
			'twig',
			'twigDup'
		);
	}

	if( this.ray )
	{
		varList.push(
			'ray',
			'rayDup'
		);
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block = block.astVarDec( varList[ a ] );
	}

	return block;
};


/*
| Generates the creators inheritance receiver.
*/
gen.prototype.genCreatorInheritanceReceiver =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		thisCheck,
		name,
		receiver =
			astBlock( )
			.astAssign(
				astVar( 'inherit' ),
				astThis
			);

	if( this.twig )
	{
		receiver =
			receiver
			.astAssign(
				astVar( 'twig' ),
				astVar( 'inherit' ).astDot( 'twig' )
			)
			.astAssign(
				astVar( 'ranks' ),
				astVar( 'inherit' ).astDot( 'ranks' )
			)
			.astAssign(
				astVar( 'twigDup' ),
				astFalse
			);
	}

	if( this.ray )
	{
		receiver =
			receiver
			.astAssign(
				astVar( 'ray' ),
				astVar( 'inherit' ).astDot( 'ray' )
			)
			.astAssign(
				astVar( 'rayDup' ),
				astFalse
			);
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver
			.astAssign(
				attr.v,
				astThis.astDot ( attr.assign )
			);
	}

	thisCheck =
		astIf(
			astDiffers(
				astThis,
				astVar( this.reference )
			),
			receiver
		);

	if( this.twig )
	{
		thisCheck = thisCheck
			.astElsewise(
				astBlock( )
				.astAssign(
					astVar( 'twig' ),
					astObjLiteral( )
				)
				.astAssign(
					astVar( 'ranks' ),
					astArrayLiteral( )
				)
				.astAssign(
					astVar( 'twigDup' ),
					astTrue
				)
			);
	}

	if( this.ray )
	{
		thisCheck = thisCheck
			.astElsewise(
				astBlock( )
				.astAssign(
					astVar( 'ray' ),
					astArrayLiteral( )
				)
				.astAssign(
					astVar( 'rayDup' ),
					astTrue
				)
			);
	}


	return block.append( thisCheck );
};


/*
| Generates the creators free strings parser.
*/
gen.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		attr,
		loop,
		name,
		rayDupCheck,
		switchExpr,
		twigDupCheck;

	if(
		!this.twig
		&&
		!this.ray
		&&
		this.attrList.length === 0
	)
	{
		// no free strings parses needed
		// FIXME check for no arguments
		return block;
	}

	loop =
		astBlock( )
		.astVarDec(
			'arg',
			astVar( 'arguments' ).astMember(
				astPlus( 'a', 1 )
			)
		);

	switchExpr =
		astSwitch(
			astVar( 'arguments' ).astMember( astVar( 'a' ) )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		switchExpr =
			switchExpr
			.astCase(
				astString( name  ),
				astBlock( )
				.astIf(
					astDiffers(
						astVar( 'arg' ),
						astUndefined
					),
					astBlock( )
					.astAssign(
						attr.v,
						astVar( 'arg' )
					)
				)
			);
	}

	if( this.twig )
	{
		twigDupCheck =
			astIf(
				astNot( astVar( 'twigDup' ) ),
				astBlock( )
				.astAssign(
					astVar( 'twig' ),
					astCall(
						astVar( 'jools' ).astDot( 'copy' ),
						astVar( 'twig' )
					)
				)
				.astAssign(
					astVar( 'ranks' ),
					astCall(
						astVar( 'ranks' ).astDot( 'slice' )
					)
				)
				.astAssign(
					astVar( 'twigDup' ),
					astTrue
				)
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.astCase(
				astString( 'twig:add' ),
				astBlock( )
				.append( twigDupCheck )
				.astAssign(
					astVar( 'key' ),
					astVar( 'arg' )
				)
				.astAssign(
					astVar( 'arg' ),
					astVar( 'arguments' ).astMember(
						astPlus(
							astPreIncrement( astVar( 'a' ) ),
							1
						)
					)
				)
				.astIf(
					astDiffers(
						astVar( 'twig' ).astMember( astVar( 'key' ) ),
						astUndefined
					),
					astBlock( )
					.astFail(
						/*
						astPlus(
							astString( 'key "' ),
							astVar( 'key' ),
							astString( '" already in use' )
						)
						*/
					)
				)
				.astAssign(
					astVar( 'twig' ).astMember( astVar( 'key' ) ),
					astVar( 'arg' )
				)
				.astCall(
					astVar( 'ranks' ).astDot( 'push' ),
					astVar( 'key' )
				)
			)
			.astCase(
				astString( 'twig:set' ),
				astBlock( )
				.append( twigDupCheck )
				.astAssign(
					astVar( 'key' ),
					astVar( 'arg' )
				)
				.astAssign(
					astVar( 'arg' ),
					astVar( 'arguments' ).astMember(
						astPlus(
							astPreIncrement( astVar( 'a' ) ),
							1
						)
					)
				)
				.astIf(
					astEquals(
						astVar( 'twig' ).astMember( astVar( 'key' ) ),
						astUndefined
					),
					astBlock( )
					.astFail(
						/*
						astPlus(
							astString( 'key "' ),
							astVar( 'key' ),
							astString( '" not in use' )
						)
						*/
					)
				)
				.astAssign(
					astVar( 'twig' ).astMember( astVar( 'key' ) ),
					'arg'
				)
			)
			.astCase(
				astString( 'twig:insert' ),
				astBlock( )
				.append( twigDupCheck )
				.astAssign(
					astVar( 'key' ),
					astVar( 'arg' )
				)
				.astAssign(
					astVar( 'rank' ),
					astVar( 'arguments' )
						.astMember( astPlus( 'a', 2 ) )
				)
				.astAssign(
					astVar( 'arg' ),
					astVar( 'arguments' )
						.astMember( astPlus( 'a', 3 ) )
				)
				.append( // FIXME
					astPlusAssign( 'a', 2 )
				)
				.astIf(
					astDiffers(
						astVar( 'twig' ).astMember( astVar( 'key' ) ),
						astUndefined
					),
					astBlock( )
					.astFail(
						/*
						astPlus(
							astString( 'key "' ),
							astVar( 'key' ),
							astString( '" already in use' )
						)
						*/
					)
				)
				.astIf(
					astOr(
						astLessThan( 'rank', 0 ),
						astGreaterThan(
							astVar( 'rank' ),
							astVar( 'ranks' ).astDot( 'length' )
						)
					),
					astBlock( )
					.astFail(
						//astString( 'invalid rank' )
					)
				)
				.astAssign(
					astVar( 'twig' ).astMember( astVar( 'key' ) ),
					astVar( 'arg' )
				)
				.append( // FIXME
					astCall(
						astVar( 'ranks' ).astDot( 'splice' ),
						astVar( 'rank' ),
						astNumber( 0 ),
						astVar( 'key' )
					)
				)
			)
			.astCase(
				astString( 'twig:remove' ),
				astBlock( )
				.append( twigDupCheck )
				.astIf(
					astEquals(
						astVar( 'twig' ).astMember( astVar( 'arg' ) ),
						astUndefined
					),
					astBlock( )
					.astFail(
						/*
						astPlus(
							astString( 'key "' ),
							astVar( 'arg' ),
							astString( '" not in use' )
						)
						*/
					)
				)
				.append( // FIXME
					astDelete(
						astVar( 'twig' ).astMember( astVar( 'arg' ) )
					)
				)
				.append(
					astCall(
						astVar( 'ranks' ).astDot( 'splice' ),
						astCall(
							astVar( 'ranks' ).astDot( 'indexOf' ),
							astVar( 'arg' )
						),
						astNumber( 1 )
					)
				)
			);
	}

	if( this.ray )
	{
		rayDupCheck =
			astIf(
				astNot( astVar( 'rayDup' ) ),
				astBlock( )
				.astAssign(
					astVar( 'ray' ),
					astCall(
						astVar( 'ray' ).astDot( 'slice' )
					)
				)
				.astAssign(
					astVar( 'rayDup' ),
					astTrue
				)
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.astCase(
				astString( 'ray:init' ),
				astBlock( )
				.astAssign( astVar( 'ray' ), astVar( 'arg' ) )
				.astAssign( astVar( 'rayDup' ), astFalse )
			)
			.astCase(
				astString( 'ray:append' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					astVar( 'ray' ).astDot( 'push' ),
					astVar( 'arg' )
				)
			)
			.astCase(
				astString( 'ray:insert' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					astVar( 'ray' ).astDot( 'splice' ),
					astVar( 'arg' ),
					astNumber( 0 ),
					astVar( 'arguments' ).astMember(
						astPlus(
							astPreIncrement( astVar( 'a' ) ),
							astNumber( 1 )
						)
					)
				)
			)
			.astCase(
				astString( 'ray:remove' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					astVar( 'ray' ).astDot( 'splice' ),
					astVar( 'arg' ),
					astNumber( 1 )
				)
			)
			.astCase(
				astString( 'ray:set' ),
				astBlock( )
				.append( rayDupCheck )
				.astAssign(
					astVar( 'ray' ).astMember( astVar( 'arg' ) ),
					astVar( 'arguments' ).astMember(
						astPlus(
							astPreIncrement( astVar( 'a' ) ),
							astNumber( 1 )
						)
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			astBlock( )
			.astCheck(
				astBlock( )
				//.astFail( 'invalid argument' )
				.astFail( )
			)
		);

	loop = loop.append( switchExpr );

	block =
		block
		.astFor(
			astVList( )
				.astVarDec( 'a', astNumber( 0 ) )
				.astVarDec( 'aZ', astVar( 'arguments' ).astDot( 'length' ) ),
			astLessThan( astVar( 'a' ), astVar( 'aZ' ) ),
			astPlusAssign( astVar( 'a' ), astNumber( 2 ) ),
			loop
		);

	return block;
};


/*
| Generates the creators default values
*/
gen.prototype.genCreatorDefaults =
	function(
		block,   // block to append to
		json     // only do jsons
	)
{
	var
		a,
		aZ,
		attr,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( json && !attr.json )
		{
			continue;
		}

		if( attr.defaultValue !== null )
		{
			block =
				block
				.astIf(
					astEquals( attr.v, astUndefined ),
					astBlock( )
						.astAssign( attr.v, attr.defaultValue )
				);
		}
	}

	return block;
};


/*
| Generates the creators checks.
*/
gen.prototype.genCreatorChecks =
	function(
		block, // block to append to
		checkin  // do checks only when CHECKin
	)
{
	var
		attr,
		check,
		cond,
		name,
		tcheck,
		tfail;

	if( checkin )
	{
		check =
			astBlock( );
	}
	else
	{
		check =
			block;
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.allowsUndefined )
		{
			check =
				check.astIf(
					astEquals( attr.v, astUndefined ),
					astBlock( )
					//.astFail( 'undefined attribute ' + name )
					.astFail( )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.astIf(
					astEquals( attr.v, astNull ),
					astBlock( )
					//.astFail( 'attribute ' + name + ' must not be null.' )
					.astFail( )
				);
		}

		switch( attr.type )
		{
			case 'Array' :
			case 'Function' :
			case 'Object' :

				continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond =
				astDiffers( attr.v, astNull );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				astDiffers( attr.v, astUndefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				astAnd(
					astDiffers( attr.v, astNull ),
					astDiffers( attr.v, astUndefined )
				);
		}
		else
		{
			cond =
				null;
		}

		switch( attr.type )
		{
			case 'Boolean' :

				tcheck =
					astDiffers(
						astTypeof( attr.v ),
						astString( 'boolean' )
					);

				break;

			case 'Integer' :

				tcheck =
					astOr(
						astDiffers(
							astTypeof( attr.v ),
							astString( 'number' )
						),
						astDiffers(
							astCall(
								astVar( 'Math' ).astDot( 'floor' ),
								attr.v
							),
							attr.v
						)
					);

				break;

			case 'Number' :

				tcheck =
					astDiffers(
						astTypeof( attr.v ),
						astString( 'number' )
					);

				break;


			case 'String' :

				tcheck =
					astAnd(
						astDiffers(
							astTypeof( attr.v ),
							astString( 'string' )
						),
						astNot(
							astInstanceof(
								attr.v,
								astVar( 'String' )
							)
						)
					);

				break;

			default :

				tcheck =
					astDiffers(
						attr.v.astDot( 'reflectName' ), // FIXME
						astString( attr.type )
					);

				break;
		}

		tfail =
			astBlock( )
			//.astFail( 'type mismatch' );
			.astFail( );

		if( cond )
		{
			check =
				check.astIf(
					cond,
					astBlock( )
					.astIf(
						tcheck,
						tfail
					)
				);
		}
		else
		{
			check =
				check.astIf(
					tcheck,
					tfail
				);
		}
	}


	// FIXME, in case of check is empty
	//        do not append

	if( checkin )
	{
		block = block.astCheck( check );
	}

	return block;
};


/*
| Generates the creators concerns.
|
| 'func' is a call to a function
| 'member' is an access to an attribute ( without call )
*/
gen.prototype.genCreatorConcerns =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		args,
		b,
		bZ,
		bAttr,
		cExpr,
		concerns,
		func,
		member,
		name,
		type,
		unit;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		concerns = attr.concerns;

		if( !concerns )
		{
			continue;
		}

		unit = concerns.unit;

		type = concerns.type;

		args = concerns.args;

		func = concerns.func;

		member = concerns.member;

		if( func )
		{
			if( unit )
			{
				cExpr =
					astCall(
						astVar( unit ).astDot( type ).astDot( func )
					);
			}
			else
			{
				cExpr =
					astCall( astVar( func ) );
			}

			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				// FUTURE, make a gen.getCreatorVarName func

				bAttr = this.attributes[ args[ b ] ];

				if( !bAttr )
				{
					throw new Error(
						'unknown attribute: ' + args[ b ]
					);
				}

				cExpr = cExpr.append( bAttr.v );
			}
		}
		else
		{
			if( !member )
			{
				throw new Error(
					'concerns neither func or member'
				);
			}

			if( !args )
			{
				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error( 'FIXME' );
				}
				else if( attr.allowsNull )
				{
					cExpr =
						astCondition(
							astDiffers( attr.v, astNull ),
							attr.v.astDot( member ),
							astNull
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						astCondition(
							astDiffers( attr.v, astUndefined ),
							attr.v.astDot( member ),
							astNull
						);
				}
				else
				{
					cExpr =
						attr.v.astDot( member );
				}
			}
			else
			{
				cExpr =
					astCall(
						attr.v.astDot( member )
					);

				for(
					b = 0, bZ = args.length;
					b < bZ;
					b++
				)
				{
					bAttr =
						this.attributes[ args[ b ] ];

					if( !bAttr )
					{
						throw new Error(
							'unknown attribute: ' + args[ b ]
						);
					}

					cExpr = cExpr.append( bAttr.v );
				}
			}
		}

		block =
			block
			.astAssign( attr.v, cExpr );
	}

	return block;
};


/*
| Generates the creators unchanged detection,
|
| returning this object if so.
*/
gen.prototype.genCreatorUnchanged =
	function(
		block // block to append to
	)
{
	var
		attr,
		ceq,
		cond,
		equalsCall,
		name;

	cond = astVar( 'inherit' );

	if( this.twig )
	{
		cond =
			astAnd(
				cond,
				astNot( astVar( 'twigDup' ) )
			);
	}

	if( this.ray )
	{
		cond =
			astAnd(
				cond,
				astNot( astVar( 'rayDup' ) )
			);
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			cond =
				astAnd(
					cond,
					astEquals( attr.v, astNull )
				);

			continue;
		}

		// FIXME use genAttributeEquals

		switch( attr.type )
		{
			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Function' :
			case 'Integer' :
			case 'Number' :
			case 'Object' :
			case 'String' :

				ceq =
					astEquals(
						attr.v,
						astVar( 'inherit' ).astDot( attr.assign )
					);

				break;

			default :

				equalsCall =
					astCall(
						attr.v.astDot( 'equals' ),
						astVar( 'inherit' ).astDot( attr.assign )
					);

				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error(
						'cannot have allowsNull and allowsUndefined'
					);
				}

				if( attr.allowsNull )
				{
					ceq =
						astOr(
							astEquals(
								attr.v,
								astVar( 'inherit' ).astDot( attr.assign )
							),
							astAnd(
								attr.v,
								equalsCall
							)
						);
				}
				else if( attr.allowsUndefined )
				{
					ceq =
						astOr(
							astEquals(
								attr.v,
								astVar( 'inherit' ).astDot( attr.assign )
							),
							astAnd(
								attr.v,
								equalsCall
							)
						);
				}
				else
				{
					ceq = equalsCall;
				}
		}

		cond = astAnd( cond, ceq );
	}

	block =
		block.astIf(
			cond,
			astReturn( astVar( 'inherit' ) )
		);

	return block;
};


/*
| Generates the creators return statement
*/
gen.prototype.genCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	if( this.singleton )
	{
		return (
			block
			.astIf(
				astNot(
					astVar( '_singleton' )
				),
				astBlock( )
				.astAssign(
					astVar( '_singleton' ),
					astNew(
						astCall(
							astVar( 'Constructor' )
						)
					)
				)
			)
			.astReturn( astVar( '_singleton' ) )
		);
	}

	call =
		astCall(
			astVar( 'Constructor' )
		);

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :
			case 'twig' :
			case 'twigDup' :
			case 'ranks' :
			case 'ray' :
			case 'rayDup' :

				call = call.append( astVar( name ) );

				break;

			default :

				attr = this.attributes[ name ];

				call = call.append( attr.v );
		}
	}

	return block.astReturn( astNew( call ) );
};


/*
| Generates the creator.
*/
gen.prototype.genCreator =
	function(
		capsule // block to append to
	)
{
	var
		block,
		creator;

	capsule =
		capsule.astComment(
			'Creates a new ' + this.name + ' object.'
		);

	block = astBlock( );

	block = this.genCreatorVariables( block );

	block = this.genCreatorInheritanceReceiver( block );

	block = this.genCreatorFreeStringsParser( block );

	block = this.genCreatorDefaults( block, false );

	block = this.genCreatorChecks( block, true );

	block = this.genCreatorConcerns( block );

	block = this.genCreatorUnchanged( block );

	block = this.genCreatorReturn( block );

	creator =
		astFunc( block )
		.astArg( null, 'free strings' );


	capsule =
		capsule
		.astAssign(
			astVar( this.reference ).astDot( 'create' ),
			astAssign(
				astVar( 'prototype' ).astDot( 'create' ),
				creator
			)
		);

	return capsule;
};


/*
| Generates the fromJSONCreator's variable list.
*/
gen.prototype.genFromJSONCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		varList.push( attr.v.name );
	}

	varList.push( 'arg' );

	if( this.hasJSON )
	{
		if( this.twig )
		{
			varList.push(
				'a',
				'aZ',
				'key',
				'jval',
				'jwig',
				'ranks',
				'twig'
			);
		}

		if( this.ray )
		{
			varList.push(
				'ray'
			);
		}
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.astVarDec( varList[ a ] );
	}

	return block;
};

/*
| Generates the fromJSONCreator's JSON parser.
*/
gen.prototype.genFromJSONCreatorParser =
	function(
		block,   // block to append
		jsonList
	)
{
	var
		a,
		aZ,
		arg,
		attr,
		base,
		name,
		// the switch
		nameSwitch;

	nameSwitch =
		astSwitch( astVar( 'name' ) )
		.astCase(
			astString( 'type' ),
			astBlock( )
			.astIf(
				astDiffers(
					astVar( 'arg' ),
					astString( this.id )
				),
				astBlock( )
				// .astFail( 'invalid JSON' )
				.astFail( )
			)
		);

	if( this.twig )
	{
		nameSwitch = nameSwitch
			.astCase(
				astString( 'twig' ),
				astBlock( )
				.astAssign(
					astVar( 'jwig' ),
					astVar( 'arg' )
				)
			)
			.astCase(
				astString( 'ranks' ),
				astBlock( )
				.astAssign(
					astVar( 'ranks' ),
					astVar( 'arg' )
				)
			);
	}

	if( this.ray )
	{
		//XXX
	}

	for(
		a = 0, aZ = jsonList.length;
		a < aZ;
		a++
	)
	{
		name = jsonList[ a ];

		if( name === 'twig' || name === 'ranks' )
		{
			continue;
		}

		attr = this.attributes[ name ];

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :

				arg = astVar( 'arg' );

				break;

			default :

				if( attr.unit )
				{
					base = astVar( attr.unit ).astDot( attr.type );
				}
				else
				{
					// FUTURE remove this hack to disable
					// Object.createFromJSON creation
					// THIS code should not happen in future anyway.
					base =
						attr.type !== 'Object'
						? astVar( attr.type )
						: null;
				}

				if( base )
				{
					arg =
						astCall(
							base.astDot( 'createFromJSON' ),
							astVar( 'arg' )
						);
				}
				else
				{
					// FUTURE remove this hack to disable
					// Object.createFromJSON creation
					arg = astVar( 'arg' );
				}
		}

		nameSwitch = nameSwitch
			.astCase(
				astString( attr.name ),
				astBlock( )
				.astAssign( attr.v, arg )
			);
	}

	block =
		block
		.astForIn(
			'name',
			astVar( 'json' ),
			astBlock( )
			.astAssign(
				'arg',
				astVar( 'json' ).astMember( astVar( 'name' ) )
			)
			.append( nameSwitch )
		);

	return block;
};


/*
| Generates the fromJSONCreator's twig processing.
*/
gen.prototype.genFromJSONCreatorTwigProcessing =
	function(
		block // block to append to
	)
{
	var
		base,
		loop,
		switchExpr,
		twigId,
		ut;

	switchExpr =
		astSwitch(
			astVar( 'jval' ).astDot( 'type' )
		);

	for(
		var a = 0, aZ = this.twigList.length;
		a < aZ;
		a++
	)
	{
		twigId = this.twigList[ a ];

		ut = this.twig[ twigId ];

		base = astVar( ut.unit ).astDot( ut.type );

		switchExpr =
			switchExpr
			.astCase(
				astString( twigId ),
				astBlock( )
				.astAssign(
					astVar( 'twig' ).astMember( astVar( 'key' ) ),
					astCall(
						base.astDot( 'createFromJSON' ),
						astVar( 'jval' )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			astBlock( )
			//.astFail( 'invalid twig type' )
			.astFail( )
		);

	loop =
		astBlock( )
		.astAssign(
			astVar( 'key' ),
			astVar( 'ranks' ).astMember( astVar( 'a' ) )
		)
		.astIf(
			astNot(
				astVar( 'jwig' ).astMember( astVar( 'key' ) )
			),
			astBlock( )
			//.astFail( )
			.astFail( 'JSON ranks/twig mismatch' )
		)
		.astAssign(
			astVar( 'jval' ),
			astVar( 'jwig' ).astMember( astVar( 'key' ) )
		)
		.append( switchExpr );

	block =
		block
		.astAssign(
			astVar( 'twig' ),
			astObjLiteral( )
		)
		.astIf(
			astOr(
				astNot( astVar( 'jwig' ) ),
				astNot( astVar( 'ranks' ) )
			),
			astBlock( )
			//.astFail( 'ranks/twig information missing' )
			.astFail( )
		)
		.astFor(
			astCommaList( )
				.astAssign( 'a', 0 )
				.astAssign(
					'aZ',
					astVar( 'ranks' ).astDot( 'length' )
				),
			astLessThan( 'a', 'aZ' ),
			astPreIncrement( astVar( 'a' ) ),
			loop
		);

	return block;
};

/*
| Generates the fromJSONCreator's return statement
*/
gen.prototype.genFromJSONCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	call = astCall( astVar( 'Constructor' ) );

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				call = call.append( astNull );

				break;

			case 'rayDup' :
			case 'twigDup' :

				call = call.append( astTrue );

				break;

			case 'ranks' :
			case 'ray' :
			case 'twig' :

				call =
					call.append(
						astVar( name )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				if( attr.assign === null )
				{
					call = call.append( astNull );
				}
				else
				{
					call = call.append( attr.v );
				}
		}
	}

	return block.astReturn( astNew( call ) );
};


/*
| Generates the fromJSONCreator.
*/
gen.prototype.genFromJSONCreator =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		// function contents
		funcBlock,
		// all attributes expected from JSON
		name,
		jsonList;

	jsonList = [ ];

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.json )
		{
			jsonList.push( name );
		}
	}

	if( this.twig )
	{
		jsonList.push( 'twig', 'ranks' );
	}

	jsonList.sort( );

	capsule =
		capsule.astComment(
			'Creates a new ' + this.name + ' object from JSON.'
		);

	funcBlock =
		this.genFromJSONCreatorVariables(
			astBlock( )
		);

	funcBlock = this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock = this.genCreatorDefaults( funcBlock, true );

	funcBlock = this.genCreatorChecks( funcBlock, false );

	if( this.twig )
	{
		funcBlock = this.genFromJSONCreatorTwigProcessing( funcBlock );
	}

	funcBlock = this.genFromJSONCreatorReturn( funcBlock );

	capsule =
		capsule
		.astAssign(
			astVar( this.reference ).astDot( 'createFromJSON' ),
			astFunc( funcBlock )
			.astArg( 'json', 'the JSON object' )
		);

	return capsule;
};


/*
| Generates the node include section.
*/
gen.prototype.genReflection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.astComment( 'Reflection.' )
		.astAssign(
			astVar( 'prototype' ).astDot( 'reflect' ),
			astString( this.id )
		);

	capsule =
		capsule
		.astComment( 'Name Reflection.' )
		.astAssign(
			astVar( 'prototype' ).astDot( 'reflectName' ),
			astString( this.name )
		);

	return capsule;
};


/*
| Generates the jionProto stuff.
*/
gen.prototype.genJionProto =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.astComment( 'Sets values by path.' )
		.astAssign(
			astVar( 'prototype' ).astDot( 'setPath' ),
			astVar( 'jion' ).astDot( 'proto' ).astDot( 'setPath' )
		)
		.astComment( 'Gets values by path' )
		.astAssign(
			astVar( 'prototype' ).astDot( 'getPath' ),
			astVar( 'jion' ).astDot( 'proto' ).astDot( 'getPath' )
		);

	if( this.twig )
	{
		capsule =
			capsule
			.astComment( 'Returns a twig by rank.' )
			.astAssign(
				astVar( 'prototype' ).astDot( 'atRank' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'atRank' )
			)
			.astComment( 'Gets the rank of a key.' )
			.astAssign(
				// FIXME use proto
				astVar( 'Constructor' ).astDot( 'prototype' ).astDot( 'rankOf' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'rankOf' )
			)
			.astComment( 'Creates a new unique identifier.' )
			.astAssign(
				// FIXME use proto
				astVar( 'Constructor' ).astDot( 'prototype' ).astDot( 'newUID' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'newUID' )
			);
	}

	if( this.ray )
	{
		capsule =
			capsule
			.astComment( 'Appends an entry to the ray.' )
			.astAssign(
				astVar( 'prototype' ).astDot( 'append' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'rayAppend' )
			)
			.astComment(
				'Returns the length of the ray.'
			)
			.astCall(
				astVar( 'jools' ).astDot( 'lazyValue' ),
				astVar( 'prototype' ),
				astString( 'length' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'rayLength' )
			)
			.astComment(
				'Gets one entry from the ray.'
			)
			.astAssign(
				astVar( 'prototype' ).astDot( 'get' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'rayGet' )
			)
			.astComment( 'Returns a jion with one entry inserted to the ray.' )
			.astAssign(
				astVar( 'prototype' ).astDot( 'insert' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'rayInsert' )
			)
			.astComment(
				'Returns the jion with one entry of the ray set.'
			)
			.astAssign(
				astVar( 'prototype' ).astDot( 'set' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'raySet' )
			)
			.astComment( 'Returns a jion with one entry from the ray removed.' )
			.astAssign(
				astVar( 'prototype' ).astDot( 'remove' ),
				astVar( 'jion' ).astDot( 'proto' ).astDot( 'rayRemove' )
			);
	}

	return capsule;
};


/*
| Generates the toJSON converter.
*/
gen.prototype.genToJSON =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		name,
		olit;

	block = astBlock( ).astVarDec( 'json' );

	olit =
		astObjLiteral( )
		.add(
			'type',
			astString( this.id )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( !attr.json )
		{
			continue;
		}

		olit =
			olit
			.add(
				name,
				astThis.astDot( attr.assign )
			);
	}

	if( this.twig )
	{
		olit =
			olit
			.add(
				'ranks',
				astThis.astDot( 'ranks' )
			)
			.add(
				'twig',
				astThis.astDot( 'twig' )
			);
	}

	block = block
		.astAssign(
			astVar( 'json' ),
			astCall(
				astVar( 'Object' ).astDot( 'freeze' ),
				olit
			)
		)
		.astReturn(
			astFunc(
				astBlock( )
				.astReturn(
					astVar( 'json' )
				)
			)
		);

	capsule = capsule
		.astComment( 'Converts a ' + this.name + ' into JSON.' )
		.astCall(
			astVar( 'jools' ).astDot( 'lazyValue' ),
			// FIXME use proto
			astVar( 'Constructor' ).astDot( 'prototype' ),
			astString( 'toJSON' ),
			astFunc( block )
		);

	return capsule;
};


/*
| Generates the equals condition for an attribute.
*/
gen.prototype.genAttributeEquals =
	function(
		name, // attribute name
		le, // this value expression
		re  // other value expression
	)
{
	var
		attr,
		ceq;

	attr = this.attributes[ name ];

	switch( attr.type )
	{
		case 'Boolean' :
		case 'Integer' :
		case 'Number' :
		case 'Object' :
		case 'String' :

			ceq = astEquals( le, re );

			break;

		default :


			if( attr.allowNull && attr.allowsUndefined )
			{
				throw new Error(
					'cannot have allowsNull and allowsUndefined'
				);
			}

			if( attr.allowsNull)
			{
				ceq =
					astOr(
						astEquals( le, re ),
						astAnd(
							astDiffers( le, astNull ),
							astCall( le.astDot( 'equals' ), re )
						)
					);
			}
			else if( attr.allowsUndefined )
			{
				ceq =
					astOr(
						astEquals( le, re ),
						astAnd(
							astDiffers( le, astUndefined ),
							astCall( le.astDot( 'equals' ), re )
						)
					);
			}
			else
			{
				ceq = astCall( le.astDot( 'equals' ), re );
			}
	}

	return ceq;
};


/*
| Generates the equals test.
*/
gen.prototype.genEquals =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		cond,
		ceq,
		name,
		twigTest,
		twigTestLoopBody,
		vA,
		vKey;


	cond = null;

	switch( this.equals )
	{
		case false :

			return capsule;

		case 'primitive' :

			// FUTURE remove

			return (
				capsule
				.astComment( 'Tests equality of object.' )
				.astAssign(
					astVar( 'Constructor' )
					.astDot( 'prototype' )
					.astDot( 'equals' ),
					astFunc(
						astReturn(
							astEquals( astThis, astVar( 'obj' ) )
						)
					)
					.astArg( 'obj', 'object to compare to' )
				)
			);

		case true :
		case undefined :

			break;

		default :

			throw new Error(
				'invalid equals value'
			);
	}

	capsule = capsule
		.astComment( 'Tests equality of object.' );

	block = astBlock( );

	if( this.twig )
	{
		block = block
			.astVarDec( 'a' )
			.astVarDec( 'aZ' )
			.astVarDec( 'key' );
	}

	block =
		block
		.astIf(
			astEquals(
				astThis,
				astVar( 'obj' )
			),
			astReturn( astTrue )
		)
		.astIf(
			astNot(
				astVar( 'obj' )
			),
			astReturnFalse
		);

	if( this.twig )
	{
		vA = astVar( 'a' );

		vKey = astVar( 'key' );

		twigTestLoopBody =
			astBlock( )
			.astAssign(
				vKey,
				astThis.astDot( 'ranks' ).astMember( vA )
			)
			.astIf(
				astOr(
					astDiffers(
						astVar( 'key' ),
						astVar( 'obj' ).astDot( 'ranks' ).astMember( vA )
					),
					astCall(
						astCondition(
							astThis.astDot( 'twig' ).astMember( vKey ).astDot( 'equals' ),
							astNot(
								astCall(
									astThis
									.astDot( 'twig' )
									.astMember( vKey )
									.astDot( 'equals' ),

									astVar( 'obj' )
									.astDot( 'twig' )
									.astMember( vKey )
								)
							),
							astDiffers(
								astThis
									.astDot( 'twig' )
									.astMember( vKey ),
								astVar( 'obj' )
									.astDot( 'twig' )
									.astMember( vKey )
							)
						)
					)
				),
				astReturnFalse
			);

		twigTest =
			astBlock( )
			.astIf(
				astDiffers(
					astThis.astDot( 'ranks' ).astDot( 'length' ),
					astVar( 'obj' ).astDot( 'ranks' ).astDot( 'length' )
				),
				astReturnFalse
			)
			.astFor(
				astCommaList( )
					.astAssign( 'a', 0 )
					.astAssign(
						'aZ',
						astThis.astDot( 'ranks' ).astDot( 'length' )
					),
				astLessThan( astVar( 'a' ), astVar( 'aZ' ) ),
				astPreIncrement( astVar( 'a' ) ),
				twigTestLoopBody
			);

		block =
			block
			.astIf(
				astOr(
					astDiffers(
						astThis.astDot( 'tree' ),
						astVar( 'obj' ).astDot( 'tree' )
					),
					astDiffers(
						astThis.astDot( 'ranks' ),
						astVar( 'obj' ).astDot( 'ranks' )
					)
				),
				twigTest
			);
	}

	// FIXME this.ray!

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		ceq =
			this.genAttributeEquals(
				name,
				astThis.astDot( attr.assign ),
				astVar( 'obj' ).astDot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: astAnd( cond, ceq );
	}

	if( cond )
	{
		block = block.astReturn( cond );
	}
	else
	{
		block = block.astReturn( astTrue );
	}

	capsule =
		capsule
		.astAssign(
			// FIXME use proto
			astVar( 'Constructor' ).astDot( 'prototype' ).astDot( 'equals' ),
			astFunc( block )
			.astArg( 'obj', 'object to compare to' )
		);

	return capsule;
};


/*
| Generates the alike test(s).
*/
gen.prototype.genAlike =
	function(
		capsule // block to append to
	)
{
	var
		a, aZ,
		alikeList,
		alikeName,
		attr,
		block,
		ceq,
		cond,
		ignores,
		name;

	alikeList = Object.keys( this.alike );

	alikeList.sort( );

	cond = null;

	for(
		a = 0, aZ = alikeList.length;
		a < aZ;
		a++
	)
	{
		alikeName = alikeList[ a ];

		ignores = this.alike[ alikeName ].ignores;

		capsule = capsule.astComment( 'Tests partial equality.' );

		block =
			astBlock( )
			.astIf(
				astEquals( astThis, astVar( 'obj' ) ),
				astReturnTrue
			)
			.astIf(
				astNot( astVar( 'obj' ) ),
				astReturnFalse
			);

		if( this.twig )
		{
			// FIXME same test as in equals
			cond =
				astAnd(
					astEquals(
						astThis.astDot( 'tree' ),
						astVar( 'obj' ).astDot( 'tree' )
					),
					astEquals(
						astThis.astDot( 'ranks' ),
						astVar( 'obj' ).astDot( 'ranks' )
					)
				);
		}

		for(
			a = 0, aZ = this.attrList.length;
			a < aZ;
			a++
		)
		{
			name = this.attrList[ a ];

			attr = this.attributes[ name ];

			if(
				attr.assign === null
				||
				ignores[ name ]
			)
			{
				continue;
			}

			ceq =
				this.genAttributeEquals(
					name,
					astThis.astDot( attr.assign ),
					astVar( 'obj' ).astDot( attr.assign )
				);

			cond =
				cond === null
				? ceq
				: astAnd( cond, ceq );
		}

		block = block.astReturn( cond );

		capsule =
			capsule
			.astAssign(
				// FIXME use proto
				astVar( 'Constructor' )
				.astDot( 'prototype' )
				.astDot( alikeName ),

				astFunc( block )
				.astArg( 'obj', 'object to compare to' )
			);
	}

	return capsule;
};


/*
| Generates the export.
*/
gen.prototype.genNodeExport =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.astComment( 'Node export.' )
		.astIf(
			astVar( 'SERVER' ),
			astBlock( )
			.astAssign(
				astVar( 'module' ).astDot( 'exports' ),
				astVar( this.reference )
			)
		)
	);
};


/*
| Returns the generated export block.
*/
gen.prototype.genExport =
	function( block )
{
	block = block.astComment( 'Export.' );

	block = block
		.astVarDec(
			this.unit,
			astOr(
				astVar( this.unit ),
				astObjLiteral( )
			)
		);

	return block;
};


/*
| Returns the generated preamble.
*/
gen.prototype.genPreamble =
	function( )
{
	var
		block;

	block = astBlock( );

	block = this.genExport( block );

	block = this.genImports( block );

	return block;
};


/*
| Returns the generated capsule block.
*/
gen.prototype.genCapsule =
	function( )
{
	var
		capsule;

	capsule = astBlock( );

	if( this.node )
	{
		capsule = this.genNodeIncludes( capsule );
	}

	capsule = this.genConstructor( capsule );

	if( this.singleton )
	{
		capsule = this.genSingleton( capsule );
	}

	capsule = this.genCreator( capsule );

	if( this.hasJSON )
	{
		capsule =
			this.genFromJSONCreator( capsule );
	}

	capsule = this.genReflection( capsule );

	capsule = this.genJionProto( capsule );

	if( this.hasJSON )
	{
		capsule = this.genToJSON( capsule );
	}

	capsule = this.genEquals( capsule );

	if( this.alike )
	{
		capsule = this.genAlike( capsule );
	}

	if( this.node )
	{
		capsule = this.genNodeExport( capsule );
	}

	return capsule;
};


/*
| Generates code from a jools object definition.
*/
gen.generate =
	function(
		jion, // the jion definition
		skim
	)
{
	var
		file,
		gi;

	validator.check( jion );

	gi =
		gen.create(
			'jion', jion
		);

	if( skim )
	{
		file =
			astFile( )
			.create(
				'jionID',
					gi.id,
				'hasJSON',
					gi.hasJSON
			);

	}
	else
	{
		file =
			astFile( )
			.create(
				'header',
					astComment(
						'This is an auto generated file.',
						'',
						'DO NOT EDIT!'
					),
				'preamble',
					gi.genPreamble( ),
				'capsule',
					gi.genCapsule( ),
				'jionID',
					gi.id,
				'hasJSON',
					gi.hasJSON
			);
	}

	return file;
};


} )( );
