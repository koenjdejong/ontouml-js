import { generateOpenAPI } from './helpers';
import { Class, Package, Project } from '@libs/ontouml';
import {AllOfSchema, ObjectSchema, ReferenceSchema} from "@libs/ontouml2openapi/openapi/schema";

describe('Generalizations', () => {
  let project: Project;
  let model: Package;
  let string: Class;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
    string = model.createDatatype('string');
  });

  it('Between classes', () => {
    const person = model.createKind('Person');
    const man = model.createSubkind('Man');
    man.createAttribute(string, 'name');
    model.createGeneralization(person, man);

    const result = generateOpenAPI(model);

    expect(Object.keys((result.components.schemas['man'] as AllOfSchema).allOf).length).toBe(2);
    expect(((result.components.schemas['man'] as AllOfSchema).allOf[0] as ObjectSchema).type).toBe('object');
    expect(((result.components.schemas['man'] as AllOfSchema).allOf[1] as ReferenceSchema).$ref).toBe('#/components/schemas/person');
    expect(result.components.schemas['person']).toBeDefined();
  });
});
