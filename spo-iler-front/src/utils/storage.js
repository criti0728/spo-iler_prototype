// utils/storage.js
export const saveToLocalStorage = (key, data) => {
    const existingData = JSON.parse(localStorage.getItem(key)) || [];
    existingData.push(data);
    localStorage.setItem(key, JSON.stringify(existingData));
  };
  
  export const getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
  };
  