const BrowserStorage = {
  storage: window.sessionStorage,
  legacyStorage: {},

  setItem: function(key, value) {
    if (this.storage) {
      console.log("setting (" + key + ", " + value + ")");
      this.storage.setItem(key, value);
    } else {
      this.legacyStorage[key] = value;
    }
  },

  getItem: function(key, value) {
    if (this.storage) {
      return this.storage.getItem(key);
    } else {
      return this.legacyStorage[key];
    }
  },

  clear: function() {
    if (this.storage) {
      this.storage.clear();
    } else {
      this.legacyStorage = {};
    }
  }
};

export default BrowserStorage;
