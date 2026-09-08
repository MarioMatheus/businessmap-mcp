import type { AxiosInstance } from 'axios';
import type { Card, SetCardCustomFieldParams } from '../../types/index.js';
import { CardClient } from './card-client.js';

function createClient(get: jest.Mock): CardClient {
  const client = new CardClient();
  client.initialize({ get } as unknown as AxiosInstance, {
    apiUrl: 'https://example.kanbanize.com/api/v2',
    apiToken: 'token',
  });
  return client;
}

describe('CardClient pagination', () => {
  const card = { card_id: 42, title: 'Example' } as Card;

  it('keeps getCards backward compatible with an array response', async () => {
    const get = jest.fn().mockResolvedValue({
      data: {
        data: {
          pagination: {
            all_pages: 3,
            current_page: 2,
            results_per_page: 50,
          },
          data: [card],
        },
      },
    });
    const client = createClient(get);

    await expect(client.getCards(7, { page: 2 })).resolves.toEqual([card]);
  });

  it('returns pagination metadata when explicitly requested', async () => {
    const payload = {
      pagination: {
        all_pages: 3,
        current_page: 2,
        results_per_page: 50,
      },
      data: [card],
    };
    const get = jest.fn().mockResolvedValue({ data: { data: payload } });
    const client = createClient(get);

    await expect(client.getCardsPage(7, { page: 2 })).resolves.toEqual(payload);
  });

  it('normalizes pagination metadata from the response meta object', async () => {
    const get = jest.fn().mockResolvedValue({
      data: {
        data: [card],
        meta: { total_count: 101, page: 2, per_page: 50 },
      },
    });
    const client = createClient(get);

    await expect(client.getCardsPage(7)).resolves.toEqual({
      data: [card],
      pagination: {
        all_pages: 3,
        current_page: 2,
        results_per_page: 50,
      },
    });
  });
});

describe('CardClient expanded card lookup', () => {
  const card = { card_id: 42, title: 'Archived card' } as Card;

  it('uses one request when the active card is found', async () => {
    const get = jest.fn().mockResolvedValue({ data: { data: [card] } });
    const client = createClient(get);

    await expect(client.getCardTransitions(42)).resolves.toBe(card);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get.mock.calls[0]?.[1]?.params.state).toBe('active');
  });

  it('checks archived and discarded states after the active lookup misses', async () => {
    const get = jest.fn().mockImplementation((_path, options) => {
      const state = options.params.state;
      return Promise.resolve({
        data: { data: state === 'archived' ? [card] : [] },
      });
    });
    const client = createClient(get);

    await expect(client.getCardTransitions(42)).resolves.toBe(card);
    expect(get.mock.calls.map((call) => call[1].params.state)).toEqual([
      'active',
      'archived',
      'discarded',
    ]);
  });
});

describe('CardClient custom field operations', () => {
  it('gets one custom field from a card', async () => {
    const field = { field_id: 7, value: 'Example', display_value: 'Example' };
    const get = jest.fn().mockResolvedValue({ data: { data: field } });
    const client = createClient(get);

    await expect(client.getCardCustomField(42, 7)).resolves.toEqual(field);
    expect(get).toHaveBeenCalledWith('/cards/42/customFields/7');
  });

  it('updates one custom field with the complete API payload', async () => {
    const params: SetCardCustomFieldParams = {
      value: 'Example',
      selected_values_to_add_or_update: [{ value_id: 11, position: 0 }],
      selected_value_ids_to_remove: [12],
      other_value: 'Other',
      contributor_ids_to_add: [3],
      contributor_ids_to_remove: [4],
      files_to_add: [{ file_name: 'file.txt', link: 'https://example.com/file', position: 0 }],
      files_to_update: [{ id: 20, file_name: 'updated.txt', link: 'https://example.com/updated', position: 0 }],
      file_ids_to_remove: [21],
      vote: 1,
      comment: 'Useful field',
      selected_cards_to_add_or_update: [{ selected_card_id: 99, position: 0 }],
      selected_card_ids_to_remove: [100],
    };
    const put = jest.fn().mockResolvedValue({ data: { data: { field_id: 7, value: 'Example' } } });
    const client = new CardClient();
    client.initialize({ put } as unknown as AxiosInstance, {
      apiUrl: 'https://example.kanbanize.com/api/v2',
      apiToken: 'token',
    });

    await expect(client.setCardCustomField(42, 7, params)).resolves.toEqual({
      field_id: 7,
      value: 'Example',
    });
    expect(put).toHaveBeenCalledWith('/cards/42/customFields/7', params);
  });

  it('accepts a successful update without a response body', async () => {
    const put = jest.fn().mockResolvedValue({ status: 204 });
    const client = new CardClient();
    client.initialize({ put } as unknown as AxiosInstance, {
      apiUrl: 'https://example.kanbanize.com/api/v2',
      apiToken: 'token',
    });

    await expect(client.setCardCustomField(42, 7, {})).resolves.toBeUndefined();
  });

  it('rejects custom field updates in read-only mode', async () => {
    const put = jest.fn();
    const client = new CardClient();
    client.initialize({ put } as unknown as AxiosInstance, {
      apiUrl: 'https://example.kanbanize.com/api/v2',
      apiToken: 'token',
      readOnlyMode: true,
    });

    await expect(client.setCardCustomField(42, 7, {})).rejects.toThrow(
      'Cannot update card custom field in read-only mode'
    );
    expect(put).not.toHaveBeenCalled();
  });
});
