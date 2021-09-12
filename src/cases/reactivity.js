class Dep {
  static __Active__Effect__ = null;
  static target2HashMap = new WeakMap();

  _effects = new Set();
  _val = null;

  constructor(val) {
    this._depend();
    this._val = val;
  }

  get value() {
    this._depend();
    return this._val;
  }

  set value(nextVal) {
    this._val = nextVal;
    this._notify();
  }

  _depend() {
    if (Dep.__Active__Effect__) {
      this._effects.add(Dep.__Active__Effect__);
    }
  }

  _notify() {
    this._effects.forEach((effect) => {
      effect();
    });
  }
}

const reactivityProxyHandler = {
  get(target, key) {
    const value = getDep(target, key).value;

    if (value && typeof value === "object") {
      return reactivity(value);
    } else {
      return value;
    }
  },

  set(target, key, nextVal) {
    getDep(target, key).value = nextVal;
  }
};

function getDep(target, key) {
  let depMap = Dep.target2HashMap.get(target);

  if (!depMap) {
    depMap = new Map();
    Dep.target2HashMap.set(target, depMap);
  }

  let dep = depMap.get(key);
  if (!dep) {
    dep = new Dep(target[key]);
    depMap.set(key, dep);
  }

  return dep;
}

export function myRender(externalRenderFunc) {
  Dep.__Active__Effect__ = externalRenderFunc;
  externalRenderFunc();
  Dep.__Active__Effect__ = null;
}

export function watchEffect(effect) {
  Dep.__Active__Effect__ = effect;
  effect();
  Dep.__Active__Effect__ = null;
}

export function reactivity(target) {
  return new Proxy(target, reactivityProxyHandler);
}
