import { generateOpenAPI } from './helpers';
import { ClassStereotype, Package, Project } from '@libs/ontouml';

describe('Classes', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  it('should transform class, name and description correctly', () => {
    const person = model.createKind('Person');
    person.addDescription('A person in the real world.');
    const result = generateOpenAPI(model);

    expect(result.components.schemas['Person']).toStrictEqual({type: 'object', description: 'A person in the real world.'});
  });

  it('should transform enumeration correctly', () => {
    const person = model.createKind('Person');
    const enumeration = model.createEnumeration('ageGroup');
    enumeration.createLiteral('child');
    enumeration.createLiteral('adult');
    enumeration.createLiteral('senior');
    person.createAttribute(enumeration, 'ageGroup');

    const result = generateOpenAPI(model);

    expect(result.components.schemas['ageGroup']).not.toBeDefined();
  });

  it('should transform stereotypes as objects', () => {
    const stereotypes = {
      [ClassStereotype.KIND]: 'Person',
      [ClassStereotype.QUANTITY]: 'Wine',
      [ClassStereotype.COLLECTIVE]: 'Group',
      [ClassStereotype.RELATOR]: 'Employment',
      [ClassStereotype.SUBKIND]: 'Man',
      [ClassStereotype.ROLE]: 'Employee',
      [ClassStereotype.PHASE]: 'Childhood',
      [ClassStereotype.CATEGORY]: 'Category',
      [ClassStereotype.MIXIN]: 'Mixin',
      [ClassStereotype.ROLE_MIXIN]: 'RoleMixin',
      [ClassStereotype.PHASE_MIXIN]: 'PhaseMixin',
      [ClassStereotype.ABSTRACT]: 'Abstract',
    }

    Object.entries(stereotypes).forEach(([stereotype, name]: [ClassStereotype, string]) => {
      model = new Package();
      model.createClass(name, stereotype);
      const result = generateOpenAPI(model);

      expect(result.components.schemas[name]).toStrictEqual({ type: 'object' });
      expect(Object.keys(result.components.schemas).length).toBe(1);
    })
  });

  it('should not transform all other stereotypes ', () => {
    const stereotypes = [
      ClassStereotype.MODE,
      ClassStereotype.QUALITY,
      ClassStereotype.HISTORICAL_ROLE,
      ClassStereotype.HISTORICAL_ROLE_MIXIN,
      ClassStereotype.EVENT,
      ClassStereotype.SITUATION,
      ClassStereotype.TYPE,
      ClassStereotype.DATATYPE,
    ];

    stereotypes.forEach((stereotype: ClassStereotype) => {
      model = new Package();
      model.createClass('Stereotype', stereotype);
      const result = generateOpenAPI(model);

      expect(result.components.schemas['Stereotype']).toBeUndefined();
      expect(Object.keys(result.components.schemas).length).toBe(0);
    });
  });
});
