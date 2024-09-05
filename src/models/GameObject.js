export default class GameObject {
  static load(callback) {
    this.fetchObjects(data => {
      // objectsMap is an Object whose keys are object id numbers, and values are GameObjects, as defined in this file.
      // The data must be available in objects.json outputted from the processing scripts (see ExportedObjectsData in GameData.ts)
      this.objectsMap = {};
      for (let i in data.ids) {
        this.objectsMap[data.ids[i]] = new GameObject({
          id: data.ids[i],
          name: data.names[i],
          difficulty: data.difficulty[i],
          numSlots: data.numSlots[i],
          slotSize: data.slotSize[i],
          clothingType: data.clothingType[i],
          craftable: data.craftable[i],
          biomes: data.biomes[i],
          immediateFood: data.immediateFood[i],
          bonusFood: data.bonusFood[i],
          totalFood: data.totalFood[i],
          numUses: data.numUses[i],
          useChance: data.useChance[i],
          insulation: data.insulation[i],
          deadlyDistance: data.deadlyDistance[i],
          useDistance: data.useDistance[i],
          size: data.size[i],
          minPickupAge: data.minPickupAge[i],
          speedMult: data.speedMult[i],
          moveType: data.moveType[i],
        });
      }
      this.ids = data.ids;
      this.filters = data.filters;
      this.badges = data.badges;
      this.date = new Date(data.date);
      this.versions = data.versions;
      this.foodEatBonus = data.foodEatBonus;
      this.legacyObjectsMap = {};
      callback(data);
    });
  }

  static fetchObjects(callback) {
    fetch(`${global.staticPath}/objects.json`).
      then(data => data.json()).
      then(callback);
  }

  static allExtraObjectsData() {
    return Object.values(this.objectsMap);
  }

  static allObjects() {
    return Object.values(this.objectsMap);
  }

  static sort(objects, sortBy) {
    switch (sortBy) {
      case "difficulty":
        return objects.sort((a,b) => (a.difficulty || 0) - (b.difficulty || 0));
      case "name":
        return objects.sort((a,b) => a.name.localeCompare(b.name));
      case "numSlots":
        return objects.sort((a,b) => a.numSlots - b.numSlots);
      default: // recent
        return objects.sort((a,b) => b.id - a.id);
    }
  }

  static byNameLength(hideUncraftable) {
    let objects = Object.values(this.objectsMap);
    if (hideUncraftable) {
      objects = objects.filter(o => {
        return o.craftable === true;
      });
    }
    return objects.sort((a,b) => a.name.length - b.name.length);
  }

  static objects(amount, filter, sortBy, descending, hideUncraftable) {
    let objects;
    if (filter) {
      objects = filter.ids.map(id => this.objectsMap[id]);
    } else if (sortBy == "difficulty") {
      objects = Object.values(this.objectsMap).filter(o => o.difficulty);
    } else {
      objects = Object.values(this.objectsMap);
    }
    if (hideUncraftable) {
      objects = objects.filter(o => {
        return o.craftable === true;
      });
    }
    let sorted = this.sort(objects, sortBy);
    if (descending) {
      sorted.reverse();
    }
    return sorted.slice(0, amount);
  }

  static find(id) {
    if (!id) return;
    // Only grab the number in the beginning of the id.
    return this.objectsMap[id.split("-")[0]] || this.legacyObjectsMap[id.split("-")[0]];
  }

  static findByName(name) {
    if (!name) return;
    return Object.values(this.objectsMap).find(o => o.name == name);
  }

  static async findAndLoad(id) {
    const object = this.find(id);
    if (!object) return null;
    await object.loadData();
    let test = object.slotSizeString();
    return object;
  }

  static async findAndLoadByName(name) {
    const object = this.findByName(name);
    if (!object) return null;
    await object.loadData();
    return object;
  }

  static findFilter(key_path_parts) {
    if (typeof key_path_parts=== 'string') {
      key_path_parts = [key_path_parts];
    }

    let filter = this.filters[key_path_parts.shift()];
    for (let part of key_path_parts) {
      if (filter && filter.subfilters) {
        filter = filter.subfilters[part];
      } else {
        return null; // Return null if any part of the path is invalid
      }
    }
    return filter;
  }

  static filter(filters) {
    let objects = [];

    const objectValues = Object.values(this.objectsMap);

    // Map through all objects without batching
    objectValues.forEach(object => {
        let includeObject = true;

        for (let filter of filters) {
          if (filter.name === "hideUncraftable") {
            if (!object.craftable)
              includeObject = false;
          } else if (filter.name === "numSlots") {
            // Handle null/undefined values for numSlots
            if (object.numSlots === null || object.numSlots === undefined)
              object.numSlots = 0;
            if (object.numSlots < filter.min || object.numSlots > filter.max)
              includeObject = false;
          } else if (filter.name === "slotSize") {
            // Handle null/undefined values for slotSize
            if (object.slotSize === null || object.slotSize === undefined)
              object.slotSize = 0;
            if (object.slotSize < filter.min || object.slotSize > filter.max)
              includeObject = false;
          } else if (filter.name === "clothingType") {
            if (
              (!filter.includeHeadItems && object.clothingType === "Head")
              || (!filter.includeTopItems && object.clothingType === "Top")
              || (!filter.includeBottomItems && object.clothingType === "Bottom")
              || (!filter.includeShoeItems && object.clothingType === "Shoe")
              || (!filter.includePackItems && object.clothingType === "Pack")
              || (!filter.includeNoneItems && object.clothingType === "None")
            ) {
              includeObject = false;
            }
          }
        }

        // Add the object to the result if it matches the filters
        if (includeObject) {
            objects.push(object);
        }
    });

    return objects; // Return the filtered objects
  }
  
  static addLegacyObject(attributes) {
    if (this.legacyObjectsMap[attributes.id])
      return;
    const object = new GameObject(attributes.id, attributes.name, null);
    if (attributes.category) {
      object.category = true;
    } else {
      object.legacy = true;
    }
    this.legacyObjectsMap[object.id] = object;
  }

  constructor({
    id,
    name,
    difficulty,
    numSlots,
    slotSize,
    clothingType,
    craftable,
    biomes,
    immediateFood,
    bonusFood,
    totalFood,
    numUses,
    useChance,
    insulation,
    deadlyDistance,
    useDistance,
    size,
    minPickupAge,
    speedMult,
    moveType,
  }) {
    this.id = id;
    this.name = name;
    if(this.name)
      this.lowerCaseName = name.toLocaleLowerCase(); // for guessing-engine (speed up)
    this.craftable = craftable;
    this.difficulty = difficulty;
    this.numSlots = numSlots;
    this.slotSize = slotSize;
    this.clothingType = clothingType;
    this.biomes = biomes;
    this.immediateFood = immediateFood;
    this.bonusfood = bonusFood;
    this.totalFood = totalFood;
    this.numUses = numUses;
    this.useChance = useChance;
    this.insulation = insulation;
    this.deadlyDistance = deadlyDistance;
    this.useDistance = useDistance;
    this.size = size;
    this.minPickupAge = minPickupAge;
    this.speedMult = speedMult;
    this.moveType = moveType;
    this.data = null;
  }

  baseName() {
    return this.name.split(' - ')[0];
  }

  subName() {
    if (!this.name.includes(' - ')) {
      return;
    }
    return this.name.substring(this.name.indexOf(' - ')+3);
  }

  badges() {
    const badges = [];
    for (let key in GameObject.badges) {
      const index = GameObject.badges[key].ids.indexOf(this.id);
      if (index != -1) {
        const values = GameObject.badges[key].values || [];
        badges.push({key: key, value: values[index]});
      }
    }
    return badges;
  }

  url(subpath) {
    if (this.legacy)
      return "/not-found";
    const path = [`${this.id}-${this.name.replace(/\W+/g, '-')}`];
    if (subpath) path.push(subpath);
    let ret = '/' + path.map(encodeURIComponent).join("/");
    return ret;
  }

  clothingPart() {
    if (!this.data)
      return null;
    const parts = {'h': "Head", 't': "Chest", 'b': "Bottom", 's': "Foot", 'p': "Back"};
    return parts[this.data.clothing];
  }

  hasInsulation() {
    return this.data && !isNaN(this.data.insulation);
  }

  insulationPercent() {
    return this.toPercent(this.data.insulation, 2);
  }

  toPercent(num, places) {
    return +(num*100).toFixed(places);
  }

  sizeText(size) {
    if (size == 3) return "Extra Large";
    if (size > 1) return "Large";
    if (size == 1) return "Small";
    return "Tiny";
  }

  slotSizeString() {
    return this.sizeText(this.data.slotSize).toLowerCase();
  }

  sizeString() {
    return this.sizeText(this.data.size);
  }

  spawnText() {
    if (!this.mapChanceData()) return;
    const level = Math.ceil(parseFloat(this.mapChanceData())*15)-1;
    if (level == 0) return "Very Rare";
    if (level < 3) return "Rare";
    if (level < 7) return "Uncommon";
    return "Common";
  }

  mapChanceData() {
    return this.mapChance || this.data && this.data.mapChance;
  }

  fetchData(callback) {
    fetch(`${global.staticPath}/objects/${this.id}.json`).
      then(data => data.json()).
      then(callback);
  }
  
  async loadData() {
    if (this.data || this.loading) return await Promise.resolve(this.data);
    this.loading = true;
    return await fetch(`${global.staticPath}/objects/${this.id}.json`)
      .then(data => data.json())
      .then(data => {
        this.loading = false;
        this.data = data;
      });
  }

}
