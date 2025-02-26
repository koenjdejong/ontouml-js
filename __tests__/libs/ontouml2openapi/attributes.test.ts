import { generateOpenAPI } from './helpers';
import { Class, Package, Project } from '@libs/ontouml';

describe('Attributes', () => {
  let project: Project;
  let model: Package;
  let string: Class;
  let stringArray: Class;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
    string = model.createDatatype('string');
    stringArray = model.createDatatype('string[]');
  });

  it('should transform object attribute correctly', () => {
    const person = model.createKind('Person');

    person.createAttribute(string, 'name');
    const result = generateOpenAPI(model);

    expect(result.components.schemas['Person'])
      .toStrictEqual({ type: 'object', properties: { name: { type: 'string' } } });
  });

  it('should transform array attribute correctly', () => {
    const person = model.createKind('Person');
    person.createAttribute(stringArray, 'names');
    const result = generateOpenAPI(model);

    expect(result.components.schemas['Person']).toStrictEqual({
      type: 'object',
      properties: {
        names: { type: 'array', items: { type: 'string' }}
      }
    });
  });

  it('should transform enumeration attribute correctly', () => {
    const person = model.createKind('Person');
    const enumeration = model.createEnumeration('ageGroup');
    enumeration.createLiteral('child');
    enumeration.createLiteral('adult');
    enumeration.createLiteral('senior');
    person.createAttribute(enumeration, 'ageGroup');

    const result = generateOpenAPI(model);

    expect(result.components.schemas['Person']).toStrictEqual({
      type: 'object',
      properties: {
        ageGroup: {
          type: 'string',
          enum: ['child', 'adult', 'senior'],
        }
      }
    })
    expect(result.components.schemas['ageGroup']).not.toBeDefined();
  });
});
