// Custom Field Types for BusinessMap API

export interface CustomField {
  field_id: number;
  name: string;
  color: string;
  type:
    | 'single_line_text'
    | 'multi_line_text'
    | 'dropdown'
    | 'number'
    | 'date'
    | 'checkbox'
    | string;
  is_immutable: number;
  is_always_present: number;
  all_properties_are_locked: number;
  availability: number;
  is_enabled: number;
  display_width: number;
  prefix: string;
  suffix: string;
  uniqueness_of_values: number;
  value_is_required: number;
  default_value: string;
}

export interface CustomFieldFilters {
  field_ids?: number[];
  name?: string;
  availability?: Array<0 | 1 | 2>;
  is_enabled?: 0 | 1;
  is_immutable?: 0 | 1;
  is_always_present?: 0 | 1;
  types?: CustomFieldType[];
  expand?: CustomFieldExpand[];
}

export type CustomFieldType =
  | 'single_line_text'
  | 'multi_line_text'
  | 'number'
  | 'date'
  | 'link'
  | 'dropdown'
  | 'contributor'
  | 'file'
  | 'vote'
  | 'card_picker'
  | 'calculated_number'
  | 'calculated_date';

export type CustomFieldExpand =
  | 'allowed_values'
  | 'boards'
  | 'board_count'
  | 'card_count'
  | 'outcome_count'
  | 'default_contributors'
  | 'business_rules';

export interface CustomFieldAllowedValue {
  value_id: number;
  position: number;
  is_enabled: 0 | 1;
  is_default: 0 | 1;
  value: string;
}
