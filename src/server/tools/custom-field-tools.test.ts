import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BusinessMapClient } from '../../client/businessmap-client.js';
import { config } from '../../config/environment.js';
import { CustomFieldToolHandler } from './custom-field-tools.js';

interface TextToolResponse {
  content: Array<{ text: string }>;
}

describe('CustomFieldToolHandler', () => {
  const originalProfile = config.businessMap.toolProfile;

  afterEach(() => {
    config.businessMap.toolProfile = originalProfile;
  });

  it('lists custom fields with their filters in the full profile', async () => {
    config.businessMap.toolProfile = 'full';
    const getCustomFields = jest.fn().mockResolvedValue([{ field_id: 7, name: 'Priority' }]);
    const client = { customFields: { getCustomFields } } as unknown as BusinessMapClient;
    const registerTool = jest.fn();

    new CustomFieldToolHandler().registerTools({ registerTool } as unknown as McpServer, client);
    const registration = registerTool.mock.calls.find(([name]) => name === 'list_custom_fields');
    const callback = registration?.[2] as (args: {
      name: string;
      types: string[];
    }) => Promise<TextToolResponse>;
    const response = await callback({ name: 'Priority', types: ['dropdown'] });

    expect(getCustomFields).toHaveBeenCalledWith({ name: 'Priority', types: ['dropdown'] });
    expect(JSON.parse(response.content[0]!.text)).toEqual({
      customFields: [{ field_id: 7, name: 'Priority' }],
      count: 1,
    });
  });

  it('gets dropdown allowed values in the full profile', async () => {
    config.businessMap.toolProfile = 'full';
    const getCustomFieldAllowedValues = jest
      .fn()
      .mockResolvedValue([{ value_id: 11, value: 'High' }]);
    const client = { customFields: { getCustomFieldAllowedValues } } as unknown as BusinessMapClient;
    const registerTool = jest.fn();

    new CustomFieldToolHandler().registerTools({ registerTool } as unknown as McpServer, client);
    const registration = registerTool.mock.calls.find(
      ([name]) => name === 'get_custom_field_allowed_values'
    );
    const callback = registration?.[2] as (args: { field_id: number }) => Promise<TextToolResponse>;
    const response = await callback({ field_id: 7 });

    expect(getCustomFieldAllowedValues).toHaveBeenCalledWith(7);
    expect(JSON.parse(response.content[0]!.text)).toEqual({
      allowedValues: [{ value_id: 11, value: 'High' }],
      count: 1,
    });
  });

  it('omits the new tools from the essential profile', () => {
    config.businessMap.toolProfile = 'essential';
    const registerTool = jest.fn();

    new CustomFieldToolHandler().registerTools(
      { registerTool } as unknown as McpServer,
      {} as BusinessMapClient
    );

    const names = registerTool.mock.calls.map(([name]) => name);
    expect(names).not.toContain('list_custom_fields');
    expect(names).not.toContain('get_custom_field_allowed_values');
  });
});
