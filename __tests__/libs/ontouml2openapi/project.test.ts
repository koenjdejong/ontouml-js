import { generateOpenAPI } from './helpers';
import { Package } from '@libs/ontouml';

describe('Test OntoUML to OpenAPI', () => {
  let string;
  let model;

  beforeEach(() => {
    model = new Package();
    model.addName('My Model');

    string = model.createDatatype('String');
  });

  describe('Model', () => {
    it('should transform name correctly', () => {
      const result = generateOpenAPI(model);

      expect(result.info.title).toStrictEqual('My Model');
    });
  });

  describe('Stereoypes', () => {
    it('should transform kind stereotype and name correctly', () => {
      model.createKind('Person');

      const result = generateOpenAPI(model);

      expect(result.components.schemas['Person']).toStrictEqual({ type: 'object' });
    });

    it('should transform description correctly', () => {
      const person = model.createKind('Person');
      person.addDescription('A person in the real world.');

      const result = generateOpenAPI(model);

      expect(result.components.schemas['Person']).toStrictEqual({ type: 'object', description: 'A person in the real world.' });
    });

    it('should transform attributes correctly', () => {
      const person = model.createKind('Person');
      person.createAttribute(string, 'name');

      const result = generateOpenAPI(model);

      expect(result.components.schemas['Person']).toStrictEqual({ type: 'object', properties: { name: { type: 'string' } } });
    });

    it('should transform enum correctly', () => {
      const person = model.createKind('Person');
      const enumeration = model.createEnumeration('ageGroup');
      enumeration.createLiteral('child');
      enumeration.createLiteral('adult');
      person.createAttribute(enumeration, 'ageGroup');

      const result = generateOpenAPI(model);

      expect(result.components.schemas['ageGroup']).toStrictEqual({"properties": {"adult": {"type": "string"}, "child": {"type": "string"}}, "type": "object"});
      expect(result.components.schemas['Person']).toStrictEqual({ type: 'object', properties: { ageGroup: { '$ref': '#/components/schemas/ageGroup' } } });
    });
  });

  describe('Generalizations', () => {
    it('Between classes', () => {
      const person = model.createKind('Person');
      const man = model.createSubkind('Man');
      man.createAttribute(string, 'name');
      model.createGeneralization(person, man);

      const result = generateOpenAPI(model);
      expect(Object.keys(result.components.schemas['Man'].allOf).length).toStrictEqual(2);
      expect(result.components.schemas['Man'].properties).not.toBeDefined();
      expect(result.components.schemas['Man'].allOf[0].properties).toBeDefined();
      expect(result.components.schemas['Person']).toBeDefined();
    });

    it('Generalization sets', () => {
      const person = model.createKind('Person');
      const man = model.createSubkind('Man');
      const woman = model.createSubkind('Woman');
      const gen1 = model.createGeneralization(person, man);
      const gen2 = model.createGeneralization(person, woman);
      model.createGeneralizationSet([gen1, gen2], true, false);

      const result = generateOpenAPI(model);
      expect(result.components.schemas['Person'].properties['PersonType'].enum.length).toStrictEqual(2);
    });
  });

  describe('Relations', () => {
    it('should transform binary relations correctly', () => {
      const person = model.createKind('Person');
      const book = model.createKind('Book');
      model.createBinaryRelation(person, book, 'writes');

      const result = generateOpenAPI(model);

      expect(result.components.schemas['Person'].properties.Books.items).toStrictEqual({ '$ref': '#/components/schemas/Book' });
      expect(result.components.schemas['Book'].properties.Persons.items).toStrictEqual({ '$ref': '#/components/schemas/Person' });
      expect(result.components.schemas['writes']).not.toBeDefined();
    });

    it('should transform ternary relations correctly', () => {
      const person = model.createKind('Person');
      const book = model.createKind('Book');
      const library = model.createKind('Library');
      model.createTernaryRelation([person, book, library], 'Borrow');

      const result = generateOpenAPI(model);

      expect(result.components.schemas['Person'].properties.Borrow).toStrictEqual({ '$ref': '#/components/schemas/Borrow' });
      expect(result.components.schemas['Borrow'].properties.Persons.items).toStrictEqual({ '$ref': '#/components/schemas/Person' });
    });
  });

  describe('Paths', () => {
    it('should create paths for kinds', () => {
      const person = model.createKind('Person');
      person.createAttribute(string, 'name');

      const result = generateOpenAPI(model);

      expect(result.paths['/Person'].get.responses['200'].content['application/json'].schema).toStrictEqual({ '$ref': '#/components/schemas/Person' });
    });

    it('should not create paths for collectives (abstracts)', () => {

    });

    it('should not create paths for enums', () => {

    });
  });
});

