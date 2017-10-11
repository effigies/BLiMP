import { Transformation } from './coretypes';

// Todo: Add more transformations, from pybids
// At first, only allow transformations that occur in place
// Include: scale, orthogonalize, threshold


// Later: allow transformations w/ predictable names,
// but need to implement detecting new column names and making them available
// for subsequent transformations.

const transformationSchema = {
  title: 'Transformation Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { enum: ['scale', 'orthogonalize'] },
      parameters: {
        type: 'array',
        items: {
          name: { type: 'string' },
          kind: { type: 'boolean' },
          value: {
            anyOf: [{ type: 'boolean' }, { type: 'array' }]
          }
        }
      }
    }
  }
};

const transformDefinitions: Transformation[] = [
  {
    name: 'scale',
    parameters: [
      {
        name: 'demean',
        kind: 'boolean',
        value: false // default value
      },
      {
        name: 'rescale',
        kind: 'boolean',
        value: true // default value
      }
    ]
  },
  {
    name: 'orthogonalize',
    parameters: [
      {
        name: 'other',
        kind: 'predictors',
        value: []
      }
    ]
  }
];

export default transformDefinitions;
