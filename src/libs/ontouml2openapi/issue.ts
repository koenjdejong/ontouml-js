import { ModelElement, Relation, Class, Property, OntoumlType } from '@libs/ontouml';
import { ServiceIssue } from '@libs/service_issue';
import { ServiceIssueSeverity } from '@libs/service_issue_severity';

import uniqid from "uniqid";

export const IssueType = {
  MISSING_CLASS_NAME: {
    code: 'missing_class_name',
    severity: ServiceIssueSeverity.ERROR,
    title: 'Missing class name'
  },
  MISSING_RELATION_NAME: {
    code: 'missing_relation_name',
    severity: ServiceIssueSeverity.WARNING,
    title: 'Missing relation name'
  },
  MISSING_ATTRIBUTE_NAME: {
    code: 'missing_attribute_name',
    severity: ServiceIssueSeverity.WARNING,
    title: 'Missing attribute name'
  },
  MISSING_ATTRIBUTE_TYPE: {
    code: 'missing_attribute_type',
    severity: ServiceIssueSeverity.WARNING,
    title: 'Missing attribute type'
  },
};

export class Issue implements ServiceIssue {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: ServiceIssueSeverity;
  data: any;

  constructor(base: Partial<Issue>) {
    this.id = base.id || uniqid();
    this.code = base.code;
    this.title = base.title;
    this.description = base.description;
    this.severity = base.severity;
    this.data = base.data;
  }

  static GET_ELEMENT_DATA(element: ModelElement): any {
    return {
      id: element.id,
      type: element.type,
      name: element.name,
    };
  }

  static CREATE_MISSING_CLASS_NAME(_class: Class): Issue {
    const error = {
      ...IssueType.MISSING_CLASS_NAME,
      description: `Missing name on Class ${_class.name.getText()}.`,
      data: Issue.GET_ELEMENT_DATA(_class),
    };

    return new Issue(error);
  }

  static CREATE_MISSING_RELATION_NAME(relation: Relation): Issue {
    const classNames = relation.properties.map((property: Property) => property.propertyType.name.getText() || '');
    const warning = {
      ...IssueType.MISSING_RELATION_NAME,
      description: `Missing name on Relation between classes ${classNames.join(', ')}, defaulting to ${classNames.join('')}Relation.`,
      data: Issue.GET_ELEMENT_DATA(relation),
    };

    return new Issue(warning);
  }

  static CREATE_MISSING_ATTRIBUTE_NAME(attribute: Property): Issue {
    const warning = {
      ...IssueType.MISSING_ATTRIBUTE_NAME,
      description: `Missing name on Attribute ${attribute.name.getText()}.`,
      data: Issue.GET_ELEMENT_DATA(attribute),
    };

    return new Issue(warning);
  }

  static CREATE_MISSING_ATTRIBUTE_TYPE(attribute: Property): Issue {
    const warning = {
      ...IssueType.MISSING_ATTRIBUTE_TYPE,
      description: `Missing type on Attribute ${attribute.name.getText()}, defaulting to String.`,
      data: Issue.GET_ELEMENT_DATA(attribute),
    };

    return new Issue(warning);
  }
}
