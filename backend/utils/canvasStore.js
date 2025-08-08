
// In-memory canvas store (can be replaced with database)

const store = {};

exports.init = (id, width, height) => {
  store[id] = { width, height, elements: [] };
};

exports.get = (id) => store[id];
