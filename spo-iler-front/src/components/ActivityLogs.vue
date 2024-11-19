<template>
    <div>
      <h4>Activity Logs:</h4>
      <ul>
        <li v-for="(log, index) in logs" :key="index">
          <p><strong>Date:</strong> {{ log.timestamp }}</p>
          <p><strong>Image:</strong></p>
          <img v-if="log.imageUrl" :src="log.imageUrl" alt="Uploaded Image" style="max-width: 100px;" />
        </li>
      </ul>
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
  };
  </script>
  