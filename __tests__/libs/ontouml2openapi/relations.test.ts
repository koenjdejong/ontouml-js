import { generateOpenAPI } from './helpers';
import { Package, Project } from '@libs/ontouml';
import { ArraySchema, ObjectSchema } from "@libs/ontouml2openapi/types";

describe('Relations', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  it('should transform binary relations correctly', () => {
    const person = model.createKind('Person');
    const book = model.createKind('Book');
    model.createBinaryRelation(person, book, 'writes');

    const result = generateOpenAPI(model);

    expect(((result.components.schemas['Person'] as ObjectSchema).properties.Books as ArraySchema).items)
      .toStrictEqual({ '$ref': '#/components/schemas/Book' });
    expect(((result.components.schemas['Book'] as ObjectSchema).properties.Persons as ArraySchema).items)
      .toStrictEqual({ '$ref': '#/components/schemas/Person' });
    expect(result.components.schemas['writes']).not.toBeDefined();
  });

  it('should transform ternary relations correctly', () => {
    const person = model.createKind('Person');
    const book = model.createKind('Book');
    const library = model.createKind('Library');
    model.createTernaryRelation([person, book, library], 'Borrow');

    const result = generateOpenAPI(model);

    expect((result.components.schemas['Person'] as ObjectSchema).properties.Borrow)
      .toStrictEqual({ '$ref': '#/components/schemas/Borrow' });
    expect(((result.components.schemas['Borrow'] as ObjectSchema).properties.Persons as ArraySchema).items)
      .toStrictEqual({ '$ref': '#/components/schemas/Person' });
  });
});
