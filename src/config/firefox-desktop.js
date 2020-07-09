export default {
  sampleRate: 0.1,
  dimensions: {
    os: {
      title: 'OS',
      key: 'os',
      values: [
        { key: '*', label: 'All OSes' },
        { key: 'Windows', label: 'Windows' },
        { key: 'Mac', label: 'Mac' },
        { key: 'Linux', label: 'Linux' },
      ],
    },
    channel: {
      title: 'Channel',
      key: 'channel',
      values: [
        { key: 'nightly', label: 'Nightly' },
        { key: 'beta', label: 'Beta' },
        { key: 'release', label: 'Release' },
      ],
      isValidKey(key, probe) {
        return (probe.prerelease && key !== 'release') || !probe.prerelease;
      },
    },
    aggregationLevel: {
      title: 'Aggregation Level',
      key: 'aggregationLevel',
      values: [
        { key: 'build_id', label: 'Build ID' },
        { key: 'version', label: 'Major Version' },
      ],
    },
    process: {
      title: 'Process',
      key: 'process',
      values: [
        { key: 'parent', label: 'Parent' },
        { key: 'content', label: 'Content' },
        { key: 'gpu', label: 'GPU' },
      ],
    },
  },
  getParamsForQueryString(store) {
    return {
      channel: store.productDimensions.channel,
      os: store.productDimensions.os,
      aggregationLevel: store.productDimensions.aggregationLevel,
      process: store.productDimensions.process,
      timeHorizon: store.timeHorizon,
      proportionMetricType: store.proportionMetricType,
      activeBuckets: store.activeBuckets,
      visiblePercentiles: store.visiblePercentiles,
      reference: store.reference,
    };
  },
  getParamsforDataAPI(store) {
    return {
      channel: store.productDimensions.channel,
      os: store.productDimensions.os,
      probe: store.probeName,
      process: store.productDimensions.process,
      aggregationLevel: store.productDimensions.aggregationLevel,
    };
  },
  setDefaultsForProbe(store, probe) {
    const state = store.getState();
    // accommodate only valid processes.
    if (
      !isSelectedProcessValid(
        probe.record_in_processes,
        state.productDimensions.process
      )
    ) {
      let newProcess = probe.record_in_processes[0];
      if (newProcess === 'main') newProcess = 'parent';
      store.setDimension('process', newProcess);
    }
    // accommodate prerelease-only probes by resetting to nightly (if needed)
    if (state.productDimensions.channel === 'release' && probe.prerelease) {
      store.setDimension('channel', 'nightly');
    }
  },
};
