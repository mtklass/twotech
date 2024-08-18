export default class Version {
  static find(id) {
    if (this.id == 20316) console.log("find on id " + id);
    if (!id) return;
    if (!this.versionsMap)
      this.versionsMap = {};
    if (this.versionsMap[id])
      return this.versionsMap[id];
    // Going to return new Version
    const version = new Version(id);
    this.versionsMap[id] = version;
    return version;
  }

  static async findAndLoad(id) {
    const version = this.find(id);
    if (!version) return null;
    if (this.id == 20316) console.log("findAndLoad 1: version.data length = ", JSON.stringify(version.data).length);
    await version.loadData();
    if (this.id == 20316) console.log("findAndLoad 2: version.data length = ", JSON.stringify(version.data).length);
    return version;
  }

  static isLoading() {
    if (!this.versionsMap)
      return false;
    for (let version of Object.values(this.versionsMap)) {
      if (!version.data)
        return true;
    }
    return false;
  }

  constructor(id, name) {
    this.id = id;
    this.data = null;
    this.loading = false;
    // this.loadData();
  }

  fetchData(callback) {
    if (this.id == 20316) console.log("fetchData: doing the fetch");
    fetch(`${global.staticPath}/versions/${this.id}.json`).
      then(data => data.json()).
      then(data => callback(data));
  }

  async loadData() {
    if (this.id == 20316) console.log(`loadData (${this.id})`);
    if (this.data || this.loading) {
      if (this.id == 20316) console.log(`loadData (${this.id}): returning early`);
      return;
    }
    this.loading = true;
    if (this.id == 20316) console.log(`loadData 1: loading data for `, this.id);

    try {
      if (this.id == 20316) console.log(`loadData 1.a: fetching data for `, this.id);
      const response = await fetch(`${global.staticPath}/versions/${this.id}.json`);
      if (this.id == 20316) console.log(`loadData 1.b: JSONing data for `, this.id);
      const data = await response.json();
      if (this.id == 20316) console.log(`loadData 2: fetched data for ${this.id}: ${JSON.stringify(data)}`);
      this.data = data;
      if (this.id == 20316) console.log(`loadData 3: this.data length = `, JSON.stringify(this.data).length);
    } catch (error) {
      if (this.id == 20316) console.error(`Error fetching data:`, error);
    } finally {
      if (this.id == 20316) console.log(`loadData 4`);
      this.loading = false;
    }
  }

}
