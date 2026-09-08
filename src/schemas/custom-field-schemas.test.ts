import {
  getCustomFieldAllowedValuesSchema,
  listCustomFieldsSchema,
} from './custom-field-schemas.js';

describe('listCustomFieldsSchema', () => {
  it('accepts field ID, exact name, and type filters', () => {
    expect(
      listCustomFieldsSchema.parse({
        field_ids: [7],
        name: 'Priority',
        availability: [0, 1],
        is_enabled: 1,
        is_immutable: 0,
        is_always_present: 1,
        types: ['dropdown'],
        expand: ['allowed_values'],
      })
    ).toMatchObject({ field_ids: [7], name: 'Priority', types: ['dropdown'] });
  });

  it('rejects invalid custom field types and flag values', () => {
    expect(() => listCustomFieldsSchema.parse({ types: ['checkbox'] })).toThrow();
    expect(() => listCustomFieldsSchema.parse({ is_enabled: 2 })).toThrow();
  });
});

describe('getCustomFieldAllowedValuesSchema', () => {
  it('requires a custom field ID', () => {
    expect(() => getCustomFieldAllowedValuesSchema.parse({})).toThrow();
    expect(getCustomFieldAllowedValuesSchema.parse({ field_id: 7 })).toEqual({ field_id: 7 });
  });
});
