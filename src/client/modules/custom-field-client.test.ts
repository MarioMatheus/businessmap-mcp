import type { AxiosInstance } from 'axios';
import type { CustomFieldFilters } from '../../types/index.js';
import { CustomFieldClient } from './custom-field-client.js';

function createClient(get: jest.Mock): CustomFieldClient {
  const client = new CustomFieldClient();
  client.initialize({ get } as unknown as AxiosInstance, {
    apiUrl: 'https://example.kanbanize.com/api/v2',
    apiToken: 'token',
  });
  return client;
}

describe('CustomFieldClient', () => {
  it('lists custom fields with API filters', async () => {
    const fields = [{ field_id: 7, name: 'Priority', type: 'dropdown' }];
    const get = jest.fn().mockResolvedValue({ data: { data: fields } });
    const client = createClient(get);
    const filters: CustomFieldFilters = {
      field_ids: [7],
      name: 'Priority',
      availability: [0, 1],
      is_enabled: 1 as const,
      is_immutable: 0 as const,
      is_always_present: 0 as const,
      types: ['dropdown'],
      expand: ['allowed_values'],
    };

    await expect(client.getCustomFields(filters)).resolves.toEqual(fields);
    expect(get).toHaveBeenCalledWith('/customFields', { params: filters });
  });

  it('gets allowed dropdown values for a custom field', async () => {
    const values = [{ value_id: 11, value: 'High', position: 0, is_enabled: 1, is_default: 0 }];
    const get = jest.fn().mockResolvedValue({ data: { data: values } });
    const client = createClient(get);

    await expect(client.getCustomFieldAllowedValues(7)).resolves.toEqual(values);
    expect(get).toHaveBeenCalledWith('/customFields/7/allowedValues');
  });
});
