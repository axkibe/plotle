/*
| Generates jion objects from a jion definition.
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
			'jion_generator',
		attributes :
			{
				'jion' :
					{
						comment :
							'the jion definition',
						type :
							'protean',
						assign :
							null
					}
			},
		init :
			[ 'jion' ]
	};
}


var
	$,
	$and,
	$assign,
	$block,
	$call,
	$capsule,
	$check,
	$comment,
	$condition,
	$differs,
	$equals,
	$fail,
	$func,
	$if,
	$instanceof,
	$new,
	$not,
	$number,
	$objLiteral,
	$or,
	$plus,
	$plusAssign,
	$return,
	$returnFalse,
	$returnTrue,
	$string,
	$switch,
	$this,
	$typeof,
	$var,
	jion_id,
	generator,
	jion_attribute,
	jion_attributeGroup,
	jion_concern,
	jion_idGroup,
	jion_stringRay,
	jion_validator,
	jools,
	shorthand;


generator = require( '../jion/this' )( module );

jion_id = require( './id' );

jion_idGroup = require( './idGroup' );

jion_stringRay = require( './stringRay' );

jools = require( '../jools/jools' );

jion_attribute = require( './attribute' );

jion_attributeGroup = require( './attributeGroup' );

jion_concern = require( './concern' );

jion_validator = require( './validator' );

shorthand = require( '../ast/shorthand' );

/*
| Shorthanding Shorthands.
*/
$ = shorthand.$;

$and = shorthand.$and;

$assign = shorthand.$assign;

$block = shorthand.$block;

$call = shorthand.$call;

$capsule = shorthand.$capsule;

$check = shorthand.$check;

$comment = shorthand.$comment;

$condition = shorthand.$condition;

$differs = shorthand.$differs;

$equals = shorthand.$equals;

$fail = shorthand.$fail;

$func = shorthand.$func;

$if = shorthand.$if;

$instanceof = shorthand.$instanceof;

$new = shorthand.$new;

$not = shorthand.$not;

$number = shorthand.$number;

$objLiteral = shorthand.$objLiteral;

$or = shorthand.$or;

$plus = shorthand.$plus;

$plusAssign = shorthand.$plusAssign;

$return = shorthand.$return;

$string = shorthand.$string;

$switch = shorthand.$switch;

$this = shorthand.$var( 'this' );

$typeof = shorthand.$typeof;

$var = shorthand.$var;

$returnTrue = $return( true );

$returnFalse = $return( false );


/*
| Initializes a generator.
*/
generator.prototype._init =
	function(
		jion
	)
{
	var
		a,
		abstractConstructorList,
		aid,
		assign,
		attr,
		attributes,
		concerns,
		concernsID,
		constructorList,
		defaultValue,
		groupDef,
		inits, // sorted init list
		jAttr,
		jdv,
		name,
		rayDef,
		type,
		twigDef, // twig map to be used (the definition)
		units; // units used

	attributes = jion_attributeGroup.create( );

	abstractConstructorList = [ ];

	constructorList = [ ];

	units = jion_idGroup.create( );

	units = units.add( jion_id.createFromString( 'jion_proto' ) );

	this.hasJson = !!jion.json;

	this.init = jion.init;

	this.singleton = !!jion.singleton;

	this.id = jion_id.createFromString( jion.id );

	for( name in jion.attributes || { } )
	{
		jAttr = jion.attributes[ name ];

		type = jAttr.type;

		if( jools.isString( type ) && type.substring( 0, 2 ) === '->' )
		{
			type = require( '../typemaps/' + type.substring( 2 ) );
		}

		if( !Array.isArray( type ) )
		{
			aid = jion_id.createFromString( type );

			units = units.add( aid );
		}
		else
		{
			aid = jion_idGroup.createFromIDStrings( type );

			units = units.addGroup( aid );
		}

		if( jAttr.json )
		{
			this.hasJson = true;
		}

		assign =
			jAttr.assign !== undefined
			? jAttr.assign
			: name;

		if( assign !== null )
		{
			abstractConstructorList.push( name );

			constructorList.push( name );
		}
		else if( this.init && this.init.indexOf( name ) >= 0 )
		{
			constructorList.push( name );
		}

		defaultValue = undefined;

		concerns = jAttr.concerns;

		if( concerns && concerns.type )
		{
			concernsID = jion_id.createFromString( concerns.type );

			units = units.add( concernsID );
		}

		jdv = jAttr.defaultValue;

		if( jdv )
		{
			if( jdv === 'undefined' )
			{
				defaultValue = shorthand.$undefined;
			}
			else
			{
				defaultValue = $( jdv );
			}
		}

		attr =
			jion_attribute.create(
				'allowsNull',
					jAttr.allowsNull
					|| shorthand.$null.equals( defaultValue ),
				'allowsUndefined',
					jAttr.allowsUndefined
					|| shorthand.$undefined.equals( defaultValue ),
				'assign', assign,
				'comment', jAttr.comment,
				'concerns',
					jAttr.concerns
					? jion_concern.create(
						'id', concernsID,
						'func', jAttr.concerns.func,
						'args',
							jAttr.concerns.args
							&&
							jion_stringRay.create(
								'ray:init', jAttr.concerns.args
							),
						'member', jAttr.concerns.member
					)
					: null,
				'defaultValue', defaultValue,
				'json', !!jAttr.json,
				'name', name,
				'id', aid,
				'varRef', $var( 'v_' + name )
			);

		attributes = attributes.set( name, attr );
	}

	this.attributes = attributes;

	abstractConstructorList.sort( );

	constructorList.sort( );

	if( jion.group )
	{
		abstractConstructorList.unshift( 'group' );

		constructorList.unshift( 'group' );
	}

	if( jion.ray )
	{
		abstractConstructorList.unshift( 'ray' );

		constructorList.unshift( 'ray' );
	}

	if( jion.twig )
	{
		abstractConstructorList.unshift( 'ranks' );

		abstractConstructorList.unshift( 'twig' );

		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
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

			if( attributes.get( name ) )
			{
				continue;
			}

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :
				case 'group' :
				case 'groupDup' :
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

	if( FREEZE )
	{
		Object.freeze( abstractConstructorList );

		Object.freeze( constructorList );
	}

	this.abstractConstructorList = abstractConstructorList;

	this.constructorList = constructorList;

	if( jion.group )
	{
		if( jools.isString( jion.group ) )
		{
			groupDef = require( '../typemaps/' + jion.group.substring( 2 ) );
		}
		else
		{
			groupDef = jion.group;
		}

		this.group = jion_idGroup.createFromIDStrings( groupDef );

		units = units.addGroup( this.group );
	}
	else
	{
		this.group = null;
	}

	if( jion.ray )
	{
		if( jools.isString( jion.ray ) )
		{
			rayDef = require( '../typemaps/' + jion.ray.substring( 2 ) );
		}
		else
		{
			rayDef = jion.ray;
		}

		this.ray = jion_idGroup.createFromIDStrings( rayDef );

		units = units.addGroup( this.ray );
	}
	else
	{
		this.ray = null;
	}

	if( jion.twig )
	{
		if( jools.isString( jion.twig ) )
		{
			twigDef = require( '../typemaps/' + jion.twig.substring( 2 ) );
		}
		else
		{
			twigDef = jion.twig;
		}

		this.twig = jion_idGroup.createFromIDStrings( twigDef );

		units = units.addGroup( this.twig );

	}
	else
	{
		this.twig = null;
	}

	this.units = units;

	this.alike = jion.alike;

	this.creatorHasFreeStringsParser =
		this.group
		|| this.ray
		|| this.twig
		|| this.attributes.size > 0;
};


/*
| Generates the imports.
*/
generator.prototype.genImports =
	function( )
{
	var
		a,
		aZ,
		b,
		bZ,
		nameList,
		result,
		unitList;

	result =
		$block( )
		.$comment( 'Imports.' )
		.$varDec( 'jools' );

	// FIXME: when type checking is there,
	// this might become needed always.

	unitList = this.units.unitList;

	// FIXME this is akward
	// just put them all together into one simple id list
	for(
		a = 0, aZ = unitList.length;
		a < aZ;
		a++
	)
	{
		nameList = this.units.nameListOfUnit( unitList[ a ] );

		for(
			b = 0, bZ = nameList.length;
			b < bZ;
			b++
		)
		{
			result =
				result
				.$varDec( unitList[ a ] + '_' + nameList[ b ] );
		}
	}

	return result;
};


/*
| Generates the node include.
*/
generator.prototype.genNodeIncludes =
	function( )
{
	var
		a,
		aZ,
		b,
		bZ,
		block,
		name,
		nameList,
		unitList,
		unitStr;

	block =
		$block( )
		.$( 'jools = require( "../../src/jools/jools" )' );

	// generates the unit objects

	unitList = this.units.unitList;

	for(
		a = 0, aZ = unitList.length;
		a < aZ;
		a++
	)
	{
		unitStr = unitList[ a ];

		nameList = this.units.nameListOfUnit( unitStr );

		for(
			b = 0, bZ = nameList.length;
			b < bZ;
			b++
		)
		{
			name = nameList[ b ];

			if( unitStr + '_' + name === this.id.global )
			{
				continue;
			}

			block =
				block
				.$assign(
					$var( unitStr + '_' + name ),
					$call(
						'require',
						$string(
							'../../src/'
							+ unitStr
							+ '/'
							+ name
						)
					)
				);
		}
	}

	return(
		$block( )
		.$comment( 'Node includes.' )
		.$if( 'SERVER', block )
	);
};


/*
| Generates the constructor.
*/
generator.prototype.genConstructor =
	function(
		abstract // if true generate abstract constructor
	)
{
	var
		a,
		assign,
		aZ,
		attr,
		block,
		cf,
		cList,
		freezeBlock,
		initCall,
		name;

	block = $block( );

	if( !abstract )
	{
		block =
			block.$if(
				'FREEZE',
				$if(
					'prototype.__have_lazy',
					$( 'this.__lazy = { }' )
				)
			);
	}

	// assigns the variables
	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		if( attr.assign === null )
		{
			continue;
		}

		assign = $assign( $this.$dot( attr.assign ), attr.varRef );

		if( !abstract && !attr.allowsUndefined )
		{
			block = block.append( assign );
		}
		else
		{
			block =
				block
				.$if(
					$differs( attr.varRef, undefined ),
					assign
				);
		}
	}

	if( this.group )
	{
		block = block.$( 'this.group = group' );
	}

	if( this.ray )
	{
		block = block.$( 'this.ray = ray' );
	}

	if( this.twig )
	{
		block =
			block
			.$( 'this.twig = twig' )
			.$( 'this.ranks = ranks' );
	}

	// calls the initializer
	if( !abstract && this.init )
	{
		initCall = $( 'this._init( )' );

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
						initCall.addArgument( this.init[ a ] );

					continue;
			}

			attr = this.attributes.get( name );

			if( !attr )
			{
				throw new Error(
					'invalid parameter to init: ' + name
				);
			}

			initCall = initCall.addArgument( ( attr.varRef ) );
		}

		block = block.append( initCall );
	}


	// immutes the new object
	freezeBlock = $block( );

	if( this.group )
	{
		freezeBlock =
			freezeBlock
			.$( 'Object.freeze( group )' );
	}

	if( this.ray )
	{
		freezeBlock =
			freezeBlock
			.$( 'Object.freeze( ray )' );
	}

	if( this.twig )
	{
		freezeBlock =
			freezeBlock
			.$( 'Object.freeze( twig )' )
			.$( 'Object.freeze( ranks )' );
	}

	freezeBlock =
		freezeBlock
		.$( 'Object.freeze( this )' );

	block = block.$if( 'FREEZE', freezeBlock );

	cf = $func( block );

	cList =
		abstract
		? this.abstractConstructorList
		: this.constructorList;

	for( a = 0, aZ = cList.length; a < aZ; a++ )
	{
		name = cList[ a ];

		switch( name )
		{
			case 'inherit' :

				cf = cf.$arg( 'inherit', 'inheritance' );

				break;

			case 'group' :

				cf = cf.$arg( 'group', 'group' );

				break;

			case 'groupDup' :

				cf =
					cf.$arg(
						'groupDup',
						'true if group is already been duplicated'
					);

				break;

			case 'ranks' :

				cf = cf.$arg( 'ranks', 'twig ranks' );

				break;

			case 'ray' :

				cf = cf.$arg( 'ray', 'ray' );

				break;

			case 'rayDup' :

				cf =
					cf.$arg(
						'rayDup',
						'true if ray is already been duplicated'
					);

				break;

			case 'twig' :

				cf = cf.$arg( 'twig', 'twig' );

				break;

			case 'twigDup' :

				cf =
					cf.$arg(
						'twigDup',
						'true if twig is already been duplicated'
					);

				break;

			default :

				attr = this.attributes.get( name );

				cf = cf.$arg( attr.varRef.name, attr.comment );

				break;
		}
	}

	if( !abstract )
	{
		return(
			$block( )
			.$comment( 'Constructor.' )
			.$varDec( 'Constructor' )
			.$varDec( 'prototype' )
			.$assign( 'Constructor', cf )
			.$comment( 'Prototype shortcut' )
			.$assign( 'prototype', 'Constructor.prototype' )
			.$assign( this.id.$global.$dot( 'prototype' ), 'prototype' )
		);
	}
	else
	{
		return(
			$block( )
			.$comment( 'Abstract constructor.' )
			.$varDec( 'AbstractConstructor' )
			.$assign( 'AbstractConstructor', cf )
		);
	}
};



/*
| Generates the singleton decleration.
*/
generator.prototype.genSingleton =
	function( )
{
	return(
		$block( )
		.$comment( 'Singleton' )
		.$varDec( '_singleton' )
		.$assign( '_singleton', null )
	);
};


/*
| Generates the creators variable list.
*/
generator.prototype.genCreatorVariables =
	function( )
{
	var
		a,
		aZ,
		name,
		result,
		varList;

	varList = [ ];

	for( name in this.attributes.group )
	{
		varList.push( this.attributes.get( name ).varRef.name );
	}

	varList.push( 'inherit' );

	if( this.creatorHasFreeStringsParser )
	{
		varList.push( 'arg', 'a', 'aZ' );
	}

	if( this.group )
	{
		varList.push( 'o', 'group', 'groupDup' );
	}

	if( this.ray )
	{
		varList.push( 'o', 'r', 'rZ', 'ray', 'rayDup' );
	}

	if( this.twig )
	{
		varList.push( 'o', 'key', 'rank', 'ranks', 'twig', 'twigDup' );
	}

	varList.sort( );

	result = $block( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		result = result.$varDec( varList[ a ] );
	}

	return result;
};


/*
| Generates the creators inheritance receiver.
*/
generator.prototype.genCreatorInheritanceReceiver =
	function( )
{
	var
		a,
		aZ,
		attr,
		name,
		receiver,
		result;

	receiver = $block( ).$( 'inherit = this' );

	if( this.group )
	{
		receiver =
			receiver
			.$( 'group = inherit.group' )
			.$( 'groupDup = false' );
	}

	if( this.ray )
	{
		receiver =
			receiver
			.$( 'ray = inherit.ray' )
			.$( 'rayDup = false' );
	}

	if( this.twig )
	{
		receiver =
			receiver
			.$( 'twig = inherit.twig' )
			.$( 'ranks = inherit.ranks' )
			.$( 'twigDup = false' );
	}

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver
			.$assign(
				attr.varRef,
				$this.$dot( attr.assign )
			);
	}

	result =
		$if(
			$differs( $this, this.id.global ),
			receiver
		);

	if( this.group )
	{
		result =
			result
			.$elsewise(
				$block( )
				.$( 'group = { }' )
				.$( 'groupDup = true' )
			);
	}

	if( this.ray )
	{
		result =
			result
			.$elsewise(
				$block( )
				.$( 'ray = [ ]' )
				.$( 'rayDup = true' )
			);
	}

	if( this.twig )
	{
		result =
			result
			.$elsewise(
				$block( )
				.$( 'twig = { }' )
				.$( 'ranks = [ ]' )
				.$( 'twigDup = true' )
			);
	}

	return result;
};


/*
| Generates the creators free strings parser.
*/
generator.prototype.genCreatorFreeStringsParser =
	function( )
{
	var
		a,
		aZ,
		attr,
		groupDupCheck,
		loop,
		name,
		rayDupCheck,
		switchExpr,
		twigDupCheck;

	loop =
		$block( )
		.$assign( 'arg', 'arguments[ a + 1 ]' );

	switchExpr = $switch( 'arguments[ a ]' );

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		switchExpr =
			switchExpr
			.$case(
				$string( name ),
				$if(
					'arg !== undefined',
					$assign( attr.varRef, 'arg' )
				)
			);
	}

	if( this.group )
	{
		groupDupCheck =
			$if(
				'!groupDup',
				$block( )
				.$( 'group = jools.copy( group )' )
				.$( 'groupDup = true' )
			);

		switchExpr =
			switchExpr
			.$case(
				'"group:init"',
				$block( )
				.$( 'group = arg' )
				.$( 'groupDup = "init"' )
			)
			.$case(
				'"group:set"',
				$block( )
				.append( groupDupCheck )
				.$( 'group[ arg ] = arguments[ ++a + 1 ]' )
			)
			.$case(
				'"group:remove"',
				$block( )
				.append( groupDupCheck )
				.$( 'delete group[ arg ]' )
			);
	}

	if( this.ray )
	{
		rayDupCheck =
			$if(
				'!rayDup',
				$block( )
				.$( 'ray = ray.slice( )' )
				.$( 'rayDup = true' )
			);

		switchExpr =
			switchExpr
			.$case(
				'"ray:init"',
				$block( )
				.$check(
					$if( '!Array.isArray( arg )', $fail( ) )
				)
				.$( 'ray = arg' )
				.$( 'rayDup = "init"' )
			)
			.$case(
				'"ray:append"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.push( arg )' )
			)
			.$case(
				'"ray:insert"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.splice( arg, 0, arguments[ ++a + 1 ] )' )
			)
			.$case(
				'"ray:remove"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray.splice( arg, 1 ) ' )
			)
			.$case(
				'"ray:set"',
				$block( )
				.append( rayDupCheck )
				.$( 'ray[ arg ] = arguments[ ++a + 1 ]' )
			);
	}

	if( this.twig )
	{
		twigDupCheck =
			$if(
				'twigDup !== true',
				$block( )
				.$( 'twig = jools.copy( twig )' )
				.$( 'ranks = ranks.slice( )' )
				.$( 'twigDup = true' )
			);

		switchExpr =
			switchExpr
			.$case(
				'"twig:add"',
				$block( )
				.$( twigDupCheck )
				.$( 'key = arg' )
				.$( 'arg = arguments[ ++a + 1 ]' )
				.$if(
					'twig[ key ] !== undefined',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
				.$( 'ranks.push( key )' )
			)
			.$case(
				'"twig:set"',
				$block( )
				.$( twigDupCheck )
				.$( 'key = arg' )
				.$( 'arg = arguments[ ++a + 1 ]' )
				.$if(
					'twig[ key ] === undefined',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
			)
			.$case(
				'"twig:insert"',
				$block( )
				.append( twigDupCheck )
				.$( 'key = arg' )
				.$( 'rank = arguments[ a + 2 ]' )
				.$( 'arg = arguments[ a +  3 ]' )
				.$( 'a += 2' )
				.$if(
					'twig[ key ] !== undefined',
					$fail( )
				)
				.$if(
					'rank < 0 || rank > ranks.length',
					$fail( )
				)
				.$( 'twig[ key ] = arg' )
				.$( 'ranks.splice( rank, 0, key )' )
			)
			.$case(
				'"twig:remove"',
				$block( )
				.append( twigDupCheck )
				.$if(
					'twig[ arg ] === undefined',
					$fail( )
				)
				.$( 'delete twig[ arg ]' )
				.$( 'ranks.splice( ranks.indexOf( arg ), 1 )' )
			);
	}

	switchExpr =
		switchExpr
		.$default(
			$block( )
			.$check( $fail( ) )
		);

	loop = loop.append( switchExpr );

	return(
		$block( )
		.$for(
			'a = 0, aZ = arguments.length',
			'a < aZ',
			'a += 2',
			loop
		)
	);
};


/*
| Generates the creators default values
*/
generator.prototype.genCreatorDefaults =
	function(
		json     // only do jsons
	)
{
	var
		a,
		aZ,
		attr,
		name,
		result;

	result = $block( );

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		if( json && !attr.json )
		{
			continue;
		}

		if(
			attr.defaultValue !== undefined
			&&
			!attr.defaultValue.equals( shorthand.$undefined )
		)
		{
			result =
				result
				.$if(
					$equals( attr.varRef, undefined ),
					$assign( attr.varRef, attr.defaultValue )
				);
		}
	}

	return result;
};


/*
| Generates a type check of a non set variable.
|
| It is true if the variable fails the check.
*/
generator.prototype.genSingleTypeCheckFailCondition =
	function(
		aVar,
		id
	)
{
	switch( id.string )
	{
		case 'boolean' :

			return $differs( $typeof( aVar ), '"boolean"' );

		case 'integer' :

			return(
				$or(
					$differs( $typeof( aVar ), '"number"' ),
					$differs( $call( 'Math.floor', aVar ), aVar )
				)
			);

		case 'function' :

			return $differs( $typeof( aVar ), '"function"' );

		case 'null' :

			throw new Error( );

		case 'number' :

			return $differs( $typeof( aVar ), '"number"' );

		case 'string' :

			return(
				$and(
					$differs( $typeof( aVar ), '"string"' ),
					$not( $instanceof( aVar, 'String' ) )
				)
			);

		default :

			return $differs( aVar.$dot( 'reflect' ), id.$string );
	}
};


/*
| Generates a type check of a variable.
*/
generator.prototype.genTypeCheckFailCondition =
	function(
		aVar,  // the variable to check
		idx  // the id or idGroup it has to match
	)
{
	var
		a,
		aZ,
		condArray,
		idList;

	if( idx.reflect === 'jion_id' )
	{
		return this.genSingleTypeCheckFailCondition( aVar, idx );
	}

/**/if( CHECK )
/**/{
/**/	if( idx.reflect !== 'jion_idGroup' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( idx.size === 1 )
	{
		return(
			this.genSingleTypeCheckFailCondition(
				aVar,
				idx.get( idx.keys[ 0 ] )
			)
		);
	}

	condArray = [ ];

	idList = idx.idList;

	for(
		a = 0, aZ = idList.length;
		a < aZ;
		a++
	)
	{
		if( idList[ a ].string === 'null' )
		{
			condArray.unshift( $differs( aVar, 'null' ) );

			continue;
		}

		condArray.push(
			this.genSingleTypeCheckFailCondition( aVar, idList[ a ] )
		);
	}

	return $and.apply( $and, condArray );
};



/*
| Generates the creators checks.
*/
generator.prototype.genCreatorChecks =
	function(
		json    // do checks for fromJsonCreator
	)
{
	var
		a,
		attr,
		av,
		aZ,
		check,
		cond,
		name,
		tcheck;

	check = $block( );

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		if( json && !attr.json )
		{
			continue;
		}

		av = attr.varRef;

		if( !attr.allowsUndefined )
		{
			check =
				check
				.$if(
					$equals( av, undefined ),
					$fail( )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check
				.$if(
					$equals( av, null ),
					$fail( )
				);
		}

		if( attr.id.string === 'protean' )
		{
			continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond = $differs( av, null );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond = $differs( av, undefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				$and(
					$differs( av, null ),
					$differs( av, undefined )
				);
		}
		else
		{
			cond = null;
		}

		tcheck = this.genTypeCheckFailCondition( attr.varRef, attr.id );

		if( cond )
		{
			check =
				check
				.$if( cond, $if( tcheck, $fail( ) ) );
		}
		else
		{
			check = check.$if( tcheck, $fail( ) );
		}
	}

	if( this.group )
	{
		check =
			check
			.$forIn(
				'k',
				'group',
				$block( )
				.$( 'o = group[ k ]' )
				.$if(
					this.genTypeCheckFailCondition( $( 'o' ), this.group ),
					$fail( )
				)
			);
	}

	if( this.ray )
	{
		check =
			check
			.$for(
				'r = 0, rZ = ray.length',
				'r < rZ',
				'++r',
				$block( )
				.$( 'o = ray[ r ]' )
				.$if(
					this.genTypeCheckFailCondition( $( 'o' ), this.ray ),
					$fail( )
				)
			);
	}

	if( this.twig )
	{
		// FIXME check if ranks and twig keys match
		check =
			check
			.$for(
				'a = 0, aZ = ranks.length',
				'a < aZ',
				'++a',
				$block( )
				.$( 'o = twig[ ranks[ a ] ]' )
				.$if(
					this.genTypeCheckFailCondition(
						$( 'o' ),
						this.twig
					),
					$fail( )
				)
			);
	}

	if( !json )
	{
		if( check.length > 0 )
		{
			return $block( ).$check( check );
		}
		else
		{
			return $block( );
		}
	}
	else
	{
		return check;
	}
};


/*
| Generates the creators concerns.
|
| 'func' is a call to a function
| 'member' is an access to an attribute ( without call )
*/
generator.prototype.genCreatorConcerns =
	function( )
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
		id,
		member,
		name,
		result;

	result = $block( );

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		concerns = attr.concerns;

		if( !concerns )
		{
			continue;
		}

		args = concerns.args;

		func = concerns.func;

		id = concerns.id;

		member = concerns.member;

		if( func )
		{
			if( id )
			{
				cExpr = $call( id.$global.$dot( func ) );
			}
			else
			{
				cExpr = $call( func );
			}

			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				// FIXME, make a generator.getCreatorVarName func

				bAttr = this.attributes.get( args.get( b ) );

				if( !bAttr )
				{
					throw new Error(
						'unknown attribute: ' + args.get( b )
					);
				}

				cExpr = cExpr.addArgument( bAttr.varRef );
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
						$condition(
							$differs( attr.varRef, null ),
							attr.varRef.$dot( member ),
							null
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						$condition(
							$differs( attr.varRef, undefined ),
							attr.varRef.$dot( member ),
							null
						);
				}
				else
				{
					cExpr = attr.varRef.$dot( member );
				}
			}
			else
			{
				cExpr = $call( attr.varRef.$dot( member ) );

				for(
					b = 0, bZ = args.length;
					b < bZ;
					b++
				)
				{
					bAttr = this.attributes.get( args.get( b ) );

					if( !bAttr )
					{
						throw new Error(
							'unknown attribute: ' + args.get( b )
						);
					}

					cExpr = cExpr.append( bAttr.varRef );
				}
			}
		}

		result = result.$assign( attr.varRef, cExpr );
	}

	return result;
};


/*
| Generates the creators unchanged detection,
|
| returning this object if so.
*/
generator.prototype.genCreatorUnchanged =
	function( )
{
	var
		a,
		aZ,
		attr,
		ceq,
		cond,
		name;

	cond = $var( 'inherit' );

	if( this.group )
	{
		cond = $and( cond, 'groupDup === false' );
	}

	if( this.ray )
	{
		cond = $and( cond, 'rayDup === false' );
	}

	if( this.twig )
	{
		cond = $and( cond, 'twigDup === false' );
	}

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		if( attr.assign === null )
		{
			cond = $and( cond, $equals( attr.varRef, null ) );

			continue;
		}

		ceq =
			this.genAttributeEquals(
				name,
				attr.varRef,
				$var( 'inherit' ).$dot( attr.assign ),
				'equals'
			);

		cond = $and( cond, ceq );
	}

	return $block( ).$if( cond, $return( 'inherit' ) );
};


/*
| Generates the creators return statement
*/
generator.prototype.genCreatorReturn =
	function( )
{
	var
		a,
		aZ,
		attr,
		call,
		name;

	if( this.singleton )
	{
		return(
			$block( )
			.$if(
				'!_singleton',
				$( '_singleton = new Constructor( )' )
			)
			.$return( '_singleton' )
		);
	}

	call = $call( 'Constructor' );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'group' :
			case 'groupDup' :
			case 'inherit' :
			case 'ranks' :
			case 'ray' :
			case 'rayDup' :
			case 'twig' :
			case 'twigDup' :

				call = call.addArgument( name );

				break;

			default :

				attr = this.attributes.get( name );

				call = call.addArgument( attr.varRef );
		}
	}

	return $block( ).$return( $new( call ) );
};


/*
| Generates the creator.
*/
generator.prototype.genCreator =
	function( )
{
	var
		block,
		creator;

	block =
		$block( )
		.$( this.genCreatorVariables( ) )
		.$( this.genCreatorInheritanceReceiver( ) );

	if( this.creatorHasFreeStringsParser )
	{
		block = block.$( this.genCreatorFreeStringsParser( ) );
	}

	block =
		block
		.$( this.genCreatorDefaults( false ) )
		.$( this.genCreatorChecks( false ) )
		.$( this.genCreatorConcerns( ) )
		.$( this.genCreatorUnchanged( ) )
		.$( this.genCreatorReturn( block ) );

	creator =
		$func( block )
		.$arg( null, 'free strings' );

	return(
		$block( )
		.$comment( 'Creates a new ' + this.id.name + ' object.')
		.$assign(
			$var( this.id.global ).$dot( 'create' ),
			$assign( 'prototype.create', creator )
		)
	);
};


/*
| Generates the fromJsonCreator's variable list.
*/
generator.prototype.genFromJsonCreatorVariables =
	function( )
{
	var
		a,
		aZ,
		attr,
		name,
		varList,
		result;

	varList = [ ];

	for( name in this.attributes.group )
	{
		attr = this.attributes.get( name );

		if( attr.assign === null )
		{
			continue;
		}

		varList.push( attr.varRef.name );
	}

	varList.push( 'arg' );

	if( this.hasJson )
	{
		if( this.group )
		{
			varList.push( 'gray', 'group', 'k', 'o' );
		}

		if( this.ray )
		{
			varList.push( 'jray', 'o', 'ray', 'r', 'rZ' );
		}

		if( this.twig )
		{
			varList.push(
				'a',
				'aZ',
				'key',
				'jval',
				'jwig',
				'o',
				'ranks',
				'twig'
			);
		}
	}

	varList.sort( );

	result = $block( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		result = result.$varDec( varList[ a ] );
	}

	return result;
};

/*
| Generates a fromJsonCreator's json parser for one attribute
*/
generator.prototype.genFromJsonCreatorAttributeParser =
	function(
		attr
	)
{
	var
		code, // code to return
		cSwitch, // the code switch
		idList,
		mif, // the multi if
		sif, // a signle if
		t,
		tZ;

	switch( attr.id.string )
	{
		case 'boolean' :
		case 'integer' :
		case 'number' :
		case 'string' :

			code = $assign( attr.varRef, 'arg' );

			break;

		default :

			if( attr.id.reflect === 'jion_id' )
			{
				code =
					$assign(
						attr.varRef,
						$call(
							attr.id.$global.$dot( 'createFromJSON' ),
							'arg'
						)
					);
			}
			else
			{
				mif = null;

				code = $block( );

				cSwitch = null;

				idList = attr.id.idList;

				for(
					t = 0, tZ = idList.length;
					t < tZ;
					t++
				)
				{
					switch( idList[ t ].string )
					{
						case 'boolean' :

							sif =
								$if(
									'typeof( arg ) === "boolean"',
									$assign( attr.varRef, 'arg' )
								);

							break;

						case 'number' :

							sif =
								$if(
									'typeof( arg ) === "number"',
									$assign( attr.varRef, 'arg' )
								);

							break;

						case 'string' :

							sif =
								$if(
									$or(
										'typeof( arg ) === "string"',
										'arg instanceof String'
									),
									$assign( attr.varRef, 'arg' )
								);

							break;

						default :

							sif = null;

							break;
					}

					if( sif )
					{
						if( !mif )
						{
							mif = sif;
						}
						else
						{
							mif = mif.$elsewise( sif );
						}
					}
					else
					{
						if( cSwitch === null )
						{
							cSwitch =
								$switch( 'arg.type' )
								.$default( $fail( ) );
						}

						cSwitch =
							cSwitch
							.$case(
								idList[ t ].$string,
								$assign(
									attr.varRef,
									$call(
										idList[ t ].$global
										.$dot( 'createFromJSON' ),
										'arg'
									)
								)
							);
					}
				}

				if( mif )
				{
					if( cSwitch )
					{
						code = mif.$elsewise( cSwitch );
					}
					else
					{
						code = mif;
					}
				}
				else
				{
					if( !cSwitch )
					{
						throw new Error( );
					}

					code = cSwitch;
				}
			}
	}

	if( attr.allowsNull )
	{
		code =
			$if(
				'arg === null ',
				/* then */ $assign( attr.varRef, null ),
				/* else */ code
			);
	}

	return code;
};


/*
| Generates the fromJsonCreator's json parser.
*/
generator.prototype.genFromJsonCreatorParser =
	function(
		jsonList
	)
{
	var
		a,
		aZ,
		attr,
		name,
		// the switch
		nameSwitch;

	nameSwitch =
		$switch( 'name' )
		.$case(
			'"type"',
			$if(
				$differs( 'arg', this.id.$string ),
				$fail( )
			)
		);

	if( this.group )
	{
		nameSwitch =
			nameSwitch
			.$case( '"group"', 'jgroup = arg' );
	}

	if( this.ray )
	{
		nameSwitch =
			nameSwitch
			.$case( '"ray"', 'jray = arg' );
	}

	if( this.twig )
	{
		nameSwitch =
			nameSwitch
			.$case( '"twig"', 'jwig = arg' )
			.$case( '"ranks"', 'ranks = arg' );
	}

	for(
		a = 0, aZ = jsonList.length;
		a < aZ;
		a++
	)
	{
		name = jsonList[ a ];

		if(
			name === 'group'
			|| name === 'ranks'
			|| name === 'ray'
			|| name === 'twig'
		)
		{
			continue;
		}

		attr = this.attributes.get( name );

		nameSwitch =
			nameSwitch
			.$case(
				$string( attr.name ),
				this.genFromJsonCreatorAttributeParser( attr )
			);
	}

	return(
		$block( )
		.$forIn(
			'name',
			'json',
			$block( )
			.$( 'arg = json[ name ]' )
			.append( nameSwitch )
		)
	);
};


/*
| Generates the fromJsonCreator's group processing.
*/
generator.prototype.genFromJsonCreatorGroupProcessing =
	function( )
{
	var
		haveNull,
		idList,
		loopBody,
		loopSwitch,
		g,
		gid,
		gZ,
		result;

	haveNull = false;

	result =
		$block( )
		.$if( '!jgroup', $fail( ) )
		.$( 'group = { }' );

	idList = this.group.idList;

	loopSwitch =
		$switch( 'jgroup[ r ].type' )
		.$default( $fail( ) );

	for(
		g = 0, gZ = idList.length;
		g < gZ;
		g++
	)
	{
		gid = idList[ g ];

		if( gid.string === 'null' )
		{
			haveNull = true;

			continue;
		}

		loopSwitch =
			loopSwitch
			.$case(
				gid.$string,
				$assign(
					'group[ k ]',
					$call(
						gid.$global.$dot( 'createFromJSON' ),
						'jgroup[ k ]'
					)
				)
			);
	}

	if( !haveNull )
	{
		loopBody = loopSwitch;
	}
	else
	{
		loopBody =
			$block( ).
			$if(
				'jgroup[ k ] === null',
				$block( )
				.$(' group[ k ] = null' )
				.$continue( )
			)
			.$( loopSwitch );
	}

	return(
		result
		.$forIn(
			'k',
			'jgroup',
			loopBody
		)
	);
};

/*
| Generates the fromJsonCreator's twig processing.
*/
generator.prototype.genFromJsonCreatorRayProcessing =
	function( )
{
	var
		haveNull,
		idList,
		loopBody,
		loopSwitch,
		r,
		result,
		rid,
		rZ;

	haveNull = false;

	result =
		$block( )
		.$if( '!jray', $fail( ) )
		.$( 'ray = [ ]' );

	idList = this.ray.idList;

	loopSwitch =
		$switch( 'jray[ r ].type' )
		.$default( $fail( ) );

	for(
		r = 0, rZ = idList.length;
		r < rZ;
		r++
	)
	{
		rid = idList[ r ];

		if( rid.string === 'null' )
		{
			haveNull = true;

			continue;
		}

		loopSwitch =
			loopSwitch
			.$case(
				rid.$string,
				$assign(
					'ray[ r ]',
					$call(
						rid.$global.$dot( 'createFromJSON' ),
						'jray[ r ]'
					)
				)
			);
	}

	if( !haveNull )
	{
		loopBody = loopSwitch;
	}
	else
	{
		loopBody =
			$block( ).
			$if(
				'jray[ r ] === null',
				$block( )
				.$( 'ray [ r ] = null' )
				.$continue( )
			)
			.append( loopSwitch );
	}

	return(
		result
		.$for(
			'r = 0, rZ = jray.length',
			'r < rZ',
			'++r',
			loopBody
		)
	);
};


/*
| Generates the fromJsonCreator's twig processing.
*/
generator.prototype.genFromJsonCreatorTwigProcessing =
	function( )
{
	var
		a,
		aZ,
		loop,
		switchExpr,
		twigID,
		twigList;

	switchExpr = $switch( 'jval.type' );

	twigList = this.twig.idList;

	for(
		a = 0, aZ = twigList.length;
		a < aZ;
		a++
	)
	{
		twigID = twigList[ a ];

		switchExpr =
			switchExpr
			.$case(
				twigID.$string,
				$assign(
					'twig[ key ]',
					$call(
						twigID.$global.$dot( 'createFromJSON' ),
						'jval'
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.$default(
			// invalid twig type
			$fail( )
		);

	loop =
		$block( )
		.$( 'key = ranks[ a ]' )
		.$if(
			'!jwig[ key ]',
			// json ranks/twig mismatch
			$fail( )
		)
		.$( 'jval = jwig[ key ]' )
		.append( switchExpr );

	return(
		$block( )
		.$assign( 'twig', $objLiteral( ) )
		.$if(
			'!jwig || !ranks',
			// ranks/twig information missing
			$fail( )
		)
		.$for(
			'a = 0, aZ = ranks.length',
			'a < aZ',
			'++a',
			loop
		)
	);
};


/*
| Generates the fromJsonCreator's return statement
*/
generator.prototype.genFromJsonCreatorReturn =
	function( )
{
	var
		a,
		aZ,
		attr,
		call,
		name;

	call = $( 'Constructor( )' );

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

				call = call.addArgument( null );

				break;

			case 'groupDup' :
			case 'rayDup' :
			case 'twigDup' :

				call = call.addArgument( true );

				break;

			case 'group' :
			case 'ranks' :
			case 'ray' :
			case 'twig' :

				call = call.addArgument( name );

				break;

			default :

				attr = this.attributes.get( name );

				if( attr.assign === null )
				{
					call = call.addArgument( null );
				}
				else
				{
					call = call.addArgument( attr.varRef );
				}
		}
	}

	return $return( $new( call ) );
};


/*
| Generates the fromJsonCreator.
*/
generator.prototype.genFromJsonCreator =
	function( )
{
	var
		a,
		aZ,
		attr,
		// function contents
		funcBlock,
		// all attributes expected from json
		name,
		jsonList;

	jsonList = [ ];

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

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

	funcBlock =
		this.genFromJsonCreatorVariables( )
		.$( this.genFromJsonCreatorParser( jsonList ) )
		.$( this.genCreatorDefaults( true ) );

	if( this.group )
	{
		funcBlock =
			funcBlock
			.$( this.genFromJsonCreatorGroupProcessing( ) );
	}

	if( this.ray )
	{
		funcBlock =
			funcBlock
			.$( this.genFromJsonCreatorRayProcessing( ) );
	}

	if( this.twig )
	{
		funcBlock =
			funcBlock
			.$( this.genFromJsonCreatorTwigProcessing( ) );
	}

	funcBlock =
		funcBlock
		.$( this.genCreatorChecks( true ) )
		.$( this.genFromJsonCreatorReturn( ) );

	return(
		$block( )
		.$comment( 'Creates a new ' + this.id.name + ' object from json.' )
		.$assign(
			$var( this.id.global ).$dot( 'createFromJSON' ),
			$func( funcBlock )
			.$arg( 'json', 'the json object' )
		)
	);
};


/*
| Generates the node include section.
*/
generator.prototype.genReflection =
	function( )
{
	return(
		$block( )
		.$comment( 'Reflection.' )
		.$assign( 'prototype.reflect', this.id.$string )
		.$comment( 'Name Reflection.' )
		.$assign(
			'prototype.reflectName',
			$string( this.id.name )
		)
	);
};


/*
| Generates the jionProto stuff.
*/
generator.prototype.genJionProto =
	function( )
{
	var
		result;

	result =
		$block( )
		.$comment( 'Sets values by path.' )
		.$( 'prototype.setPath = jion_proto.setPath' )

		.$comment( 'Gets values by path' )
		.$( 'prototype.getPath = jion_proto.getPath' );

	if( this.group )
	{
		result =
			result

			.$comment(
				'Returns the group with another group added,',
				'overwriting collisions.'
			)
			.$( 'prototype.addGroup = jion_proto.groupAddGroup' )

			.$comment( 'Gets one element from the group.' )
			.$( 'prototype.get = jion_proto.groupGet' )

			.$comment( 'Returns the group keys.')
			.$( 'jools.lazyValue( prototype, "keys", jion_proto.groupKeys )' )

			.$comment( 'Returns the sorted group keys.')
			.$( 'jools.lazyValue( prototype, "sortedKeys", jion_proto.groupSortedKeys )' )

			.$comment( 'Returns the group with one element removed.' )
			.$( 'prototype.remove = jion_proto.groupRemove' )

			.$comment( 'Returns the group with one element set.' )
			.$( 'prototype.set = jion_proto.groupSet' )

			.$comment( 'Returns the size of the group.')
			.$( 'jools.lazyValue( prototype, "size", jion_proto.groupSize )' );
	}

	if( this.ray )
	{
		result =
			result
			.$comment( 'Returns the ray with an element appended.' )
			.$( 'prototype.append = jion_proto.rayAppend' )

			.$comment( 'Returns the ray with another ray appended.' )
			.$( 'prototype.appendRay = jion_proto.rayAppendRay' )

			.$comment( 'Returns the length of the ray.')
			.$(
				'jools.lazyValue( prototype, "length", jion_proto.rayLength )'
			)

			.$comment( 'Returns one element from the ray.' )
			.$( 'prototype.get = jion_proto.rayGet' )

			.$comment( 'Returns the ray with one element inserted.' )
			.$( 'prototype.insert = jion_proto.rayInsert' )

			.$comment( 'Returns the ray with one element removed.' )
			.$( 'prototype.remove = jion_proto.rayRemove' )

			.$comment( 'Returns the ray with one element set.' )
			.$( 'prototype.set = jion_proto.raySet' );
	}

	if( this.twig )
	{
		result =
			result
			.$comment( 'Returns the element at rank.' )
			.$( 'prototype.atRank = jion_proto.twigAtRank' )

			.$comment( 'Returns the element by key.' )
			.$( 'prototype.get = jion_proto.twigGet' )

			.$comment( 'Returns the key at a rank.' )
			.$( 'prototype.getKey = jion_proto.twigGetKey' )

			.$comment( 'Returns the length of the twig.')
			.$(
				'jools.lazyValue( prototype, "length", jion_proto.twigLength )'
			)

			.$comment( 'Creates a new unique identifier.' )
			.$( 'prototype.newUID = jion_proto.newUID' )

			.$comment( 'Returns the rank of the key.' )
			.$(
				'jools.lazyFunctionString( '
				+ 'prototype, "rankOf", jion_proto.twigRankOf '
				+ ')'
			)

			.$comment( 'Returns the twig with the element at key set.' )
			.$( 'prototype.set = jion_proto.twigSet' );
	}

	return result;
};


/*
| Generates the toJson converter.
*/
generator.prototype.genToJson =
	function( )
{
	var
		a,
		aZ,
		attr,
		block,
		name,
		olit;

	block = $block( ).$varDec( 'json' );

	olit =
		$objLiteral( )
		.add( 'type', this.id.$string );

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		if( !attr.json )
		{
			continue;
		}

		olit = olit.add( name, $this.$dot( attr.assign ) );
	}

	if( this.group )
	{
		olit = olit.add( 'group', 'this.group' );
	}

	if( this.ray )
	{
		olit = olit.add( 'ray', 'this.ray' );
	}

	if( this.twig )
	{
		olit =
			olit
			.add( 'ranks', 'this.ranks' )
			.add( 'twig', 'this.twig' );
	}

	block =
		block
		.$assign( 'json', olit )
		.$if(
			'FREEZE',
			$( 'Object.freeze( json )' )
		)
		.$return(
			$func( $return( 'json' ) )
		);

	return(
		$block( )
		.$comment( 'Converts a ' + this.id.name + ' into json.' )
		.$call(
			'jools.lazyValue',
			'prototype',
			'"toJSON"',
			$func( block )
		)
	);
};


/*
| Generates the equals condition for an attribute.
|
| FIXME: in case of idLists this is still wonky
|         it needs to differenciate primitives correctly
*/
generator.prototype.genAttributeEquals =
	function(
		name, // attribute name
		le, // this value expression
		re, // other value expression
		eqFuncName // the equals function name to call
	)
{
	var
		attr,
		ceq;

	attr = this.attributes.get( name );

	switch( attr.id.string )
	{
		case 'boolean' :
		case 'function' :
		case 'integer' :
		case 'number' :
		case 'protean' :
		case 'string' :

			ceq = $equals( le, re );

			break;

		default :

			if( attr.allowsNull && attr.allowsUndefined )
			{
				ceq =
					$or(
						$equals( le, re ),
						$and(
							$differs( le, null ),
							$differs( le, undefined ),
							$call( le.$dot( eqFuncName ), re )
						)
					);
			}
			else if( attr.allowsNull)
			{
				ceq =
					$or(
						$equals( le, re ),
						$and(
							$differs( le, null ),
							$call( le.$dot( eqFuncName ), re )
						)
					);
			}
			else if( attr.allowsUndefined )
			{
				ceq =
					$or(
						$equals( le, re ),
						$and(
							$differs( le, undefined ),
							$call( le.$dot( eqFuncName ), re )
						)
					);
			}
			else
			{
				ceq =
					$or(
						$equals( le, re ),
						$and(
							le.$dot( eqFuncName ),
							$call( le.$dot( eqFuncName ), re )
						)
					);
			}
	}

	return ceq;
};


/*
| Generates the body of an equals test.
*/
generator.prototype.genEqualsFuncBody =
	function(
		mode,       // 'normal' or 'json'
		eqFuncName  // name of equals func to call
	)
{
	var
		a,
		aZ,
		attr,
		body,
		cond,
		ceq,
		name,
		groupTest,
		groupTestLoopBody,
		rayTest,
		rayTestLoopBody,
		twigTest,
		twigTestLoopBody;

	body = $block( );

	cond = null;

	if( this.ray || this.twig )
	{
		body =
			body
			.$varDec( 'a' )
			.$varDec( 'aZ' );
	}

	if( this.twig )
	{
		body = body.$varDec( 'key' );
	}

	body =
		body
		.$if( 'this === obj', $returnTrue )
		.$if( '!obj', $returnFalse )
		.$if( $differs( 'obj.reflect', this.id.$string ), $returnFalse );

	if( this.group )
	{
		groupTestLoopBody =
			$block( )
			.$if(
				$and(
					'this.group[ k ] !== obj.group[ k ]',
					$or(
						'!this.group[ k ].' + eqFuncName,
						'!this.group[ k ].' + eqFuncName + '( obj.group[ k ] )'
					)
				),
				$returnFalse
			);

		groupTest =
			$block( )
			.$if(
				'this.size !== obj.size',
				$returnFalse
			)
			.$forIn(
				'k',
				'this.group',
				groupTestLoopBody
			);

		body = body.$if( 'this.group !== obj.group', groupTest );
	}

	if( this.ray )
	{
		rayTestLoopBody =
			$block( )
			.$if(
				$and(
					'this.ray[ a ] !== obj.ray[ a ]',
					$or(
						'!this.ray[ a ].' + eqFuncName,
						'!this.ray[ a ].' + eqFuncName + '( obj.ray[ a ] )'
					)
				),
				$returnFalse
			);

		rayTest =
			$block( )
			.$if(
				'this.ray.length !== obj.ray.length',
				$returnFalse
			)
			.$for(
				// this.length?
				'a = 0, aZ = this.ray.length',
				'a < aZ',
				'++a',
				rayTestLoopBody
			);

		body = body.$if( 'this.ray !== obj.ray', rayTest );
	}

	if( this.twig )
	{
		twigTestLoopBody =
			$block( )
			.$( 'key = this.ranks[ a ]' )
			.$if(
				$or(
					'key !== obj.ranks[ a ]',
					$condition(
						'this.twig[ key ].' + eqFuncName,
						'!this.twig[ key ].'
						+ eqFuncName
						+ '( obj.twig[ key ] )',
						'this.twig[ key ] !== obj.twig[ key ]'
					)
				),
				$returnFalse
			);

		twigTest =
			$block( )
			.$if(
				'this.length !== obj.length',
				$returnFalse
			)
			.$for(
				'a = 0, aZ = this.ranks.length',
				'a < aZ',
				'++a',
				twigTestLoopBody
			);

		body =
			body
			.$if(
				$or(
					'this.tree !== obj.tree',
					'this.ranks !== obj.ranks'
				),
				twigTest
			);
	}

	for(
		a = 0, aZ = this.attributes.size;
		a < aZ;
		a++
	)
	{
		name = this.attributes.sortedKeys[ a ];

		attr = this.attributes.get( name );

		if( attr.assign === null )
		{
			continue;
		}

		if( mode === 'json' && !attr.json )
		{
			continue;
		}

		ceq =
			this.genAttributeEquals(
				name,
				$this.$dot( attr.assign ),
				$var( 'obj' ).$dot( attr.assign ),
				eqFuncName
			);

		cond =
			cond === null
			? ceq
			: $and( cond, ceq );
	}

	if( cond )
	{
		body = body.$return( cond );
	}
	else
	{
		body = body.$return( true );
	}

	return body;
};

/*
| Generates the equals tests.
*/
generator.prototype.genEquals =
	function( )
{
	var
		block,
		normalEqFuncBody,
		jsonEqFuncBody;

	block = $block( );

	normalEqFuncBody = this.genEqualsFuncBody( 'normal', 'equals' );

	if( this.hasJson )
	{
		jsonEqFuncBody = this.genEqualsFuncBody( 'json', 'equalsJSON' );
	}

	if( !normalEqFuncBody.equals( jsonEqFuncBody ) )
	{
		block = block.$comment( 'Tests equality of object.' );

		block =
			block
			.$assign(
				'prototype.equals',
				$func( normalEqFuncBody )
				.$arg( 'obj', 'object to compare to' )
			);

		if( this.hasJson )
		{
			block = block.$comment( 'Tests equality of json representation.' );

			block =
				block
				.$assign(
					'prototype.equalsJSON',
					$func( jsonEqFuncBody )
					.$arg( 'obj', 'object to compare to' )
				);
		}
	}
	else
	{
		// equals and equalsJSON have identical
		// function bodies.

		block =
			block
			.$comment(
				'Tests equality of object.',
				'Tests equality of json representation.'
			)
			.$assign(
				'prototype.equals',
				$assign(
					'prototype.equalsJSON',
					$func( normalEqFuncBody )
					.$arg( 'obj', 'object to compare to' )
				)
			);
	}

	return block;
};


/*
| Generates the alike test(s).
*/
generator.prototype.genAlike =
	function( )
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
		name,
		result;

	alikeList = Object.keys( this.alike );

	alikeList.sort( );

	cond = null;

	result = $block( );

	for(
		a = 0, aZ = alikeList.length;
		a < aZ;
		a++
	)
	{
		alikeName = alikeList[ a ];

		ignores = this.alike[ alikeName ].ignores;

		result = result.$comment( 'Tests partial equality.' );

		block =
			$block( )
			.$if( 'this === obj', $returnTrue )
			.$if( '!obj', $returnFalse );

		if( this.twig )
		{
			// FIXME same test as in equals
			cond =
				$and(
					'this.tree === obj.tree',
					'this.ranks === obj.ranks'
				);
		}

		for(
			a = 0, aZ = this.attributes.size;
			a < aZ;
			a++
		)
		{
			name = this.attributes.sortedKeys[ a ];

			attr = this.attributes.get( name );

			if( attr.assign === null || ignores[ name ] )
			{
				continue;
			}

			ceq =
				this.genAttributeEquals(
					name,
					$this.$dot( attr.assign ),
					$var( 'obj' ).$dot( attr.assign ),
					'equals'
				);

			cond =
				cond === null
				? ceq
				: $and( cond, ceq );
		}

		block = block.$return( cond );

		result =
			result
			.$assign(
				$var( 'prototype' ).$dot( alikeName ),
				$func( block )
				.$arg( 'obj', 'object to compare to' )
			);
	}

	return result;
};


/*
| Returns the generated export block.
*/
generator.prototype.genExport =
	function( )
{
	return(
		$block( )
		.$comment( 'Export.' )
		.$varDec( this.id.global )
		.$if(
			'SERVER',
			$assign( this.id.global, 'module.exports' ),
			$assign( this.id.global, $objLiteral( ) )
		)
	);
};


/*
| Generates the preamble.
*/
generator.prototype.genPreamble =
	function(
		block // block to append to
	)
{
	return block;
};


/*
| Returns the generated capsule block.
*/
generator.prototype.genCapsule =
	function( )
{
	var
		capsule;

	capsule =
		$block( )
		.$( '"use strict"' )
		.$( this.genNodeIncludes( ) )
		.$( this.genConstructor( true ) )
		.$( this.genConstructor( false ) );

	if( this.singleton )
	{
		capsule = capsule.$( this.genSingleton( ) );
	}

	capsule = capsule.$( this.genCreator( ) );

	if( this.hasJson )
	{
		capsule = capsule.$( this.genFromJsonCreator( ) );
	}

	capsule =
		capsule
		.$( this.genReflection( ) )
		.$( this.genJionProto( ) );

	if( this.hasJson )
	{
		capsule = capsule.$( this.genToJson( ) );
	}

	capsule = capsule.$( this.genEquals( ) );

	if( this.alike )
	{
		capsule = capsule.$( this.genAlike( ) );
	}

	return(
		$block( )
		.$comment( 'Capsule' )
		.append( $capsule( capsule ) )
	);
};


/*
| Generates code from a jools object definition.
*/
generator.generate =
	function(
		jion // the jion definition
	)
{
	var
		result,
		gi;

	jion_validator.check( jion );

	gi = generator.create( 'jion', jion );

	result =
		$block( )
		.$comment(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		)
		.$( gi.genExport( ) )
		.$( gi.genImports( ) )
		.$( gi.genCapsule( ) );

	return result;
};


} )( );
