import { generateOpenAPI } from './helpers';
import { Class, Package, Project } from '@libs/ontouml';
import { AllOfSchema, ObjectSchema } from "@libs/ontouml2openapi/types";

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

    expect(Object.keys((result.components.schemas['Man'] as AllOfSchema).allOf).length).toBe(2);
    expect(((result.components.schemas['Man'] as AllOfSchema).allOf[0] as ObjectSchema).properties).toBeDefined();
    expect(result.components.schemas['Person']).toBeDefined();
  });
});
