import {
  ApiResponse,
  CustomField,
  CustomFieldAllowedValue,
  CustomFieldFilters,
} from '../../types/index.js';
import { BaseClientModuleImpl } from './base-client.js';

export class CustomFieldClient extends BaseClientModuleImpl {
  /**
   * Get custom fields, optionally filtered by their API-supported properties
   */
  async getCustomFields(filters: CustomFieldFilters = {}): Promise<CustomField[]> {
    const response = await this.http.get<ApiResponse<CustomField[]>>('/customFields', {
      params: filters,
    });
    return response.data.data;
  }

  /**
   * Get a specific custom field by ID
   */
  async getCustomField(customFieldId: number): Promise<CustomField> {
    const response = await this.http.get<ApiResponse<CustomField>>(
      `/customFields/${customFieldId}`
    );
    return response.data.data;
  }

  /**
   * Get the allowed values configured for a dropdown custom field
   */
  async getCustomFieldAllowedValues(fieldId: number): Promise<CustomFieldAllowedValue[]> {
    const response = await this.http.get<ApiResponse<CustomFieldAllowedValue[]>>(
      `/customFields/${fieldId}/allowedValues`
    );
    return response.data.data;
  }
}
