// src/utils/remove-undefined.ts
function removeUndefined(value) {
  const obj = value;
  Object.keys(obj).forEach((key) => {
    if (obj[key] === void 0) delete obj[key];
  });
  return value;
}

export {
  removeUndefined
};
