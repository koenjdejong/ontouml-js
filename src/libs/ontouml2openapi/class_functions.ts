import { Class, ClassStereotype, Literal } from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import { EnumSchema, ObjectSchema } from "@libs/ontouml2openapi/types";

enum ClassType {
  SCHEMA = 'schema',
  ENUM = 'enum',
}

const classTypeMap = {
  [ClassStereotype.KIND]: ClassType.SCHEMA,
  [ClassStereotype.QUANTITY]: ClassType.SCHEMA,
  [ClassStereotype.COLLECTIVE]: ClassType.SCHEMA,
  [ClassStereotype.RELATOR]: ClassType.SCHEMA,
  [ClassStereotype.MODE]: null,
  [ClassStereotype.QUALITY]: null,
  [ClassStereotype.SUBKIND]: ClassType.SCHEMA,
  [ClassStereotype.ROLE]: ClassType.SCHEMA,
  [ClassStereotype.HISTORICAL_ROLE]: null,
  [ClassStereotype.HISTORICAL_ROLE_MIXIN]: null,
  [ClassStereotype.PHASE]: ClassType.SCHEMA,
  [ClassStereotype.CATEGORY]: ClassType.SCHEMA,
  [ClassStereotype.MIXIN]: ClassType.SCHEMA,
  [ClassStereotype.ROLE_MIXIN]: ClassType.SCHEMA,
  [ClassStereotype.PHASE_MIXIN]: ClassType.SCHEMA,
  [ClassStereotype.EVENT]: null,
  [ClassStereotype.SITUATION]: null,
  [ClassStereotype.TYPE]: null,
  [ClassStereotype.ABSTRACT]: ClassType.SCHEMA,
  [ClassStereotype.DATATYPE]: null,
  [ClassStereotype.ENUMERATION]: ClassType.ENUM,
};

export function transformClass(transformer: Ontouml2Openapi, _class: Class): boolean {
  const classType = classTypeMap[_class.stereotype];
  if (!classType) return false;

  if (classType === ClassType.SCHEMA) {
    return transformToSchema(transformer, _class);
  } else if (classType === ClassType.ENUM) {
    return transformToEnum(transformer, _class);
  }

  return true;
}

function transformToSchema(transformer: Ontouml2Openapi, _class: Class): boolean {
  const object = new ObjectSchema()
  object.description = _class.description.getText();
  if (transformer.options.addOntoUMLAttributes) {
    object.addOntoUMLAnnotation(_class.id, _class.stereotype, _class.isAbstract, _class.isDerived);
  }
  if (!_class.isAbstract) {
    object.createPath()
  }
  transformer.addSchema(_class.name.getText(), object);
  return true;
}

function transformToEnum(transformer: Ontouml2Openapi, _class: Class): boolean {
  const literals = _class.literals.map((literal: Literal) => literal.name.getText())
  transformer.addSchema(_class.name.getText(), new EnumSchema(literals));
  return true;
}
