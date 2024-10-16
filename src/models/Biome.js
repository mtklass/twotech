import GameObject from './GameObject';

export default class Biome {
  static setup(ids, names) {
    this.biomesMap = {};
    for (let i in ids) {
      this.biomesMap[ids[i]] = new Biome(ids[i], names[i]);
    }
  }

  static biomes() {
    return Object.values(this.biomesMap);
  }

  static find(id) {
    if (!id) return;
    return this.biomesMap[id.split("-")[0]];
  }

  static async findAndLoad(id) {
    const biome = this.find(id);
    if (!biome) return Promise.resolve(null);
    return biome.loadData().then(() => biome);
  }

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.data = null;
  }

  url() {
    let path = `biomes/${this.id}`;
    if (this.name) {
      path += encodeURIComponent(`-${this.name.replace(/\W+/g, '-')}`);
    }
    return '/' + path;
  }

  loadData() {
    if (this.data || this.loading) return Promise.resolve(this.data);
    this.loading = true;
    return fetch(`${global.staticPath}/biomes/${this.id}.json`)
      .then(data => data.json())
      .then(data => {
        this.loading = false;
        this.data = data;
        return this.data;
      });
  }

  objects() {
    if (!this.data) return [];
    return this.data.objects.map(o => GameObject.find(o.id));
  }

  spawnChance(object) {
    if (!this.data) return;
    return this.data.objects.find(o => o.id == object.id).spawnChance;
  }
}
