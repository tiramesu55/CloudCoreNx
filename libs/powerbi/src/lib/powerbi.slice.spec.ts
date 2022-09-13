import { fetchPowerbi, powerbiAdapter, powerbiReducer } from './powerbi.slice';

describe('powerbi reducer', () => {
  it('should handle initial state', () => {
    const expected = powerbiAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(powerbiReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchPowerbis', () => {
    let state = powerbiReducer(undefined, fetchPowerbi.pending(null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = powerbiReducer(
      state,
      fetchPowerbi.fulfilled([{ id: 1 }], null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = powerbiReducer(
      state,
      fetchPowerbi.rejected(new Error('Uh oh'), null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    );
  });
});
