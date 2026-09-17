import { z } from 'zod/v3';

// Schema for getting details of a specific custom field
export const getCustomFieldSchema = z.object({
  custom_field_id: z.number().describe('The ID of the custom field'),
});

export const listCustomFieldsSchema = z.object({
  field_ids: z.array(z.number()).optional().describe('Custom field IDs to return'),
  name: z.string().optional().describe('Exact custom field name to return'),
  availability: z
    .array(z.union([z.literal(0), z.literal(1), z.literal(2)]))
    .optional()
    .describe('Availability levels: 0=on-demand, 1=auto, 2=global'),
  is_enabled: z
    .union([z.literal(0), z.literal(1)])
    .optional()
    .describe('Filter enabled custom fields: 0=no, 1=yes'),
  is_immutable: z
    .union([z.literal(0), z.literal(1)])
    .optional()
    .describe('Filter immutable custom fields: 0=no, 1=yes'),
  is_always_present: z
    .union([z.literal(0), z.literal(1)])
    .optional()
    .describe('Filter fields required on all board cards: 0=no, 1=yes'),
  types: z
    .array(
      z.enum([
        'single_line_text',
        'multi_line_text',
        'number',
        'date',
        'link',
        'dropdown',
        'contributor',
        'file',
        'vote',
        'card_picker',
        'calculated_number',
        'calculated_date',
      ])
    )
    .optional()
    .describe('Custom field types to return'),
  expand: z
    .array(
      z.enum([
        'allowed_values',
        'boards',
        'board_count',
        'card_count',
        'outcome_count',
        'default_contributors',
        'business_rules',
      ])
    )
    .optional()
    .describe('Additional custom field properties to include'),
});

export const getCustomFieldAllowedValuesSchema = z.object({
  field_id: z.number().describe('The ID of the dropdown custom field'),
});
