import { generateOpenAPI } from './helpers';
import { Package, Project } from '@libs/ontouml';
import { EnumSchema, ObjectSchema } from "@libs/ontouml2openapi/types";

describe('Generalizations', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  it('Sub kind generalization set without attributes', () => {
    const person = model.createKind('Person');
    const man = model.createSubkind('Man');
    const woman = model.createSubkind('Woman');
    const gen1 = model.createGeneralization(person, man);
    const gen2 = model.createGeneralization(person, woman);
    model.createGeneralizationSet([gen1, gen2], true, false);

    const result = generateOpenAPI(model);
    expect(((result.components.schemas['Person'] as ObjectSchema).properties['PersonType'] as EnumSchema).enum.length)
      .toBe(2);
  });
});
