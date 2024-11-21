<template>
    <div>
      <h4>History</h4>
      <p>Reset upon logging out.</p>
      <div v-for="(log, index) in logs.slice().reverse()" :key="index">
        <img v-if="log.imageUrl" :src="log.imageUrl" alt="Uploaded Image" style="max-width: 100px;" />
        <p v-if="log.winProbability">Win Probability: {{ log.winProbability }}%</p>
        <p>{{ formatTimestamp(log.timestamp) }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      logs: {
        type: Array,
        required: true,
      },
    },
    methods: {
      formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };
        return date.toLocaleString('en-US', options);
      },
    },
  };
  </script>
  