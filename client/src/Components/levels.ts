// levels.ts
import { Levels } from "./types";
import data from "../lookuplvl.json";

const levels: Levels[] = data;
/*
let exp = 100;
let diff = 0;
let level = 0;
const x = 0.035;
const y = 3;

for (let index = 1; index < 256; index++) {
  level = index;

  exp += (level / x) ^ y;
  const nextLevelExp = (((level + 1) / x) ^ y) + exp;
  diff = nextLevelExp - exp;

  levels.push({ exp, level, diff });

  console.log("lvl", level, "exp", exp, "diff", diff);
}

console.log(levels);
*/
export default levels;
