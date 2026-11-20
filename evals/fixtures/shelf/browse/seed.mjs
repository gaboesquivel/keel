// Deterministic seed: 24 tools lent by 9 households on Alder Street.
const owners = ['Ana (no. 4)', 'Bilal (no. 7)', 'Chen (no. 12)', 'Dora (no. 15)', 'Emeka (no. 18)', 'Fay (no. 21)', 'Gus (no. 26)', 'Hana (no. 30)', 'Ivo (no. 33)']
const tools = [
  ['Cordless drill', 'Power tools'], ['Hammer drill', 'Power tools'], ['Jigsaw', 'Power tools'], ['Orbital sander', 'Power tools'],
  ['Circular saw', 'Power tools'], ['Stud finder', 'Hand tools'], ['Spirit level (120 cm)', 'Hand tools'], ['Socket set', 'Hand tools'],
  ['Pipe wrench', 'Plumbing'], ['Plunger and auger', 'Plumbing'], ['Tile cutter', 'Flooring'], ['Carpet stretcher', 'Flooring'],
  ['Extension ladder', 'Ladders'], ['Step ladder', 'Ladders'], ['Pressure washer', 'Garden'], ['Hedge trimmer', 'Garden'],
  ['Lawn aerator', 'Garden'], ['Wheelbarrow', 'Garden'], ['Wallpaper steamer', 'Decorating'], ['Paint sprayer', 'Decorating'],
  ['Folding workbench', 'Workshop'], ['Clamps (set of 6)', 'Workshop'], ['Camping stove', 'Outdoors'], ['Car jump starter', 'Car'],
]
export const TOOLS = tools.map(([name, category], i) => ({
  id: i + 1,
  name,
  category,
  owner: owners[i % owners.length],
  condition: ['Like new', 'Good', 'Well used'][i % 3],
  notes: i % 4 === 0 ? 'Batteries and charger included.' : '',
}))
