"use strict";

import { Depth } from "./Depth";
import { GameObject } from "./GameObject";
import { Transition } from "./Transition";

class DepthCalculator {
  objects: GameObject[];
  constructor(objects: GameObject[]) {
    this.objects = objects;
  }

  calculate(): void {
    this.calculateDepth();
    this.sortObjectTransitions();
    this.calculateDifficulty();
    this.reportUncraftable();
  }

  // Calculates the depth starting with natural and uncraftable objects.
  calculateDepth(): void {
    for (let object of this.objects) {
      if (object.isNatural() || object.transitionsToward.length === 0) {
        this.setObjectDepth(object, new Depth({value: 0, craftable: object.isNatural(), difficulty: 0}));
      }
    }
  }

  // Sets the object depth if it is lower than previously set
  // It then calculates the depth for each "away" transition
  setObjectDepth(object: GameObject, depth: Depth): void {
    if (depth.compare(object.depth) < 0) {
      // console.log("Depth set for", object.id, object.name, "to", depth.value);
      object.depth = depth;

      // Favor transitions where the actor or target remains
      // Otherwise we get broken tools as the easiest transition
      // I don't think this is necessary because of the difficulty sorting
      // const transitions = object.transitionsAway.sort((a, b) => (a.tool || a.targetRemains) ? -1 : 1);
      for (let transition of object.transitionsAway) {
        this.calculateTransition(transition);
      }
    }
  }

  // Calculates the transition depth by finding max of actor and target depths
  // If the depth was calculated, it sets it to the resulting object
  calculateTransition(transition: Transition): void {
    // Start in true state so adding transition can make to uncraftable
    const depth = new Depth({value: 0, craftable: true, difficulty: 0});
    depth.addTransition(transition);
    transition.depth = depth;

    if (transition.newActor)
      this.setObjectDepth(transition.newActor, depth);
    if (transition.newTarget)
      this.setObjectDepth(transition.newTarget, depth);
    if (transition.newExtraTarget)
      this.setObjectDepth(transition.newExtraTarget, depth);
  }

  sortObjectTransitions(): void {
    for (let object of this.objects) {
      object.transitionsToward.sort((a,b) => a.depth.compare(b.depth));
      object.transitionsAway.sort((a,b) => a.depth.compare(b.depth));
    }
  }

  calculateDifficulty(): void {
    const depths = this.objects.map(o => o.depth).filter(c => c.difficulty > 0).sort((a,b) => a.difficulty - b.difficulty);
    for (let i in depths) {
      depths[i].difficulty = parseFloat(i) / depths.length;
    }
  }

  reportUncraftable(): void {
    const objects = this.objects.filter(o => !o.depth.craftable && o.isVisible());
    console.log(objects.length + " objects are uncraftable");
    // for (let object of objects) {
    //   console.log(object.id, object.name, "unable to calculate depth");
    // }
  }
}

export { DepthCalculator }
