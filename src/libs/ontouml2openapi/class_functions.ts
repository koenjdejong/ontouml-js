import { Class, ClassStereotype, Literal } from '@libs/ontouml';
import { Ontouml2Openapi } from './';
import { EnumSchema, ObjectSchema } from "./openapi/schema";
import { Name } from "./openapi/name";

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
  // Datatypes are transformed as primitive attributes
  if ([ClassStereotype.DATATYPE].includes(_class.stereotype)) return false;

  const name = new Name(_class.name.getText());
  const description = _class.description.getText();

  const classType = classTypeMap[_class.stereotype];
  if (classType === ClassType.SCHEMA) {
    return transformToSchema(transformer, _class, name, description);
  } else if (classType === ClassType.ENUM) {
    return transformToEnum(transformer, _class, name, description);
  } else {
    throw new Error(`Invalid class type: ${_class.stereotype} for class ${_class.name.getText()}`);
  }
}

function transformToSchema(transformer: Ontouml2Openapi, _class: Class, name: Name, description: string): boolean {
  const object = new ObjectSchema({ name, description });
  // if (transformer.options.addOntoUMLAttributes) {
  //   object.addOntoUMLAnnotation(_class.id, _class.stereotype, _class.isAbstract, _class.isDerived);
  // }
  // if (!_class.isAbstract) {
  //   object.createPath()
  // }
  transformer.addSchema(object);
  return true;
}

function transformToEnum(transformer: Ontouml2Openapi, _class: Class, name: Name, description: string): boolean {
  const literals = _class.literals.map((literal: Literal) => literal.name.getText())
  transformer.addSchema(new EnumSchema( { name, description, enum: literals }));
  return true;
}
