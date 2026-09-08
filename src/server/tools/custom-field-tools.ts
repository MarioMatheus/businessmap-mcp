import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BusinessMapClient } from '../../client/businessmap-client.js';
import {
  getCustomFieldAllowedValuesSchema,
  getCustomFieldSchema,
  listCustomFieldsSchema,
} from '../../schemas/custom-field-schemas.js';
import { BaseToolHandler, READ_ONLY, registerTool } from './base-tool.js';

export class CustomFieldToolHandler implements BaseToolHandler {
  registerTools(server: McpServer, client: BusinessMapClient): void {
    registerTool(server, {
      name: 'list_custom_fields',
      title: 'List Custom Fields',
      description: 'List custom field definitions, optionally filtered by ID, exact name, type, or status',
      schema: listCustomFieldsSchema,
      annotations: READ_ONLY,
      errorContext: 'listing custom fields',
      handler: async (filters) => {
        const customFields = await client.customFields.getCustomFields(filters);
        return { customFields, count: customFields.length };
      },
    });

    registerTool(server, {
      name: 'get_custom_field',
      title: 'Get Custom Field',
      description: 'Get details of a specific custom field by ID',
      schema: getCustomFieldSchema,
      annotations: READ_ONLY,
      errorContext: 'fetching custom field',
      handler: ({ custom_field_id }) => client.customFields.getCustomField(custom_field_id),
    });

    registerTool(server, {
      name: 'get_custom_field_allowed_values',
      title: 'Get Custom Field Allowed Values',
      description: 'Get the allowed values configured for a dropdown custom field',
      schema: getCustomFieldAllowedValuesSchema,
      annotations: READ_ONLY,
      errorContext: 'getting custom field allowed values',
      handler: async ({ field_id }) => {
        const allowedValues = await client.customFields.getCustomFieldAllowedValues(field_id);
        return { allowedValues, count: allowedValues.length };
      },
    });
  }
}
