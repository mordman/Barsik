export const DOOR = { x: 7, y: 9 };

// мебель и её «физические» тайлы
export const FURNITURE = [
  { id: 'food',    x: 5.5,  y: 3.5 },
  { id: 'water',   x: 6.5,  y: 3.5 },
  { id: 'bed',     x: 10.5, y: 3.5 },
  { id: 'sofa',    x: 9,    y: 3.9 },
  { id: 'scratch', x: 4.5,  y: 4.5 },
  { id: 'lamp',    x: 10.5, y: 5.5 },
  { id: 'yarn',    x: 7.5,  y: 6.5 },
  { id: 'litter',  x: 10.5, y: 8.5 },
];
export const FURN_BLOCK = [
  [5,3],[6,3],[8,3],[9,3],[10,3],   // миски, диван, лежанка
  [4,4],[10,5],[7,6],[10,8],        // когтеточка, лампа, клубок, лоток
];

export const TREES = [[2,2],[15,2],[3,11],[15,11]];

export const FLOWERS = [
  { x:1.7,y:4.4,c:'#ff8a5c'},{ x:2.6,y:6.3,c:'#ffd166'},{ x:1.6,y:8.2,c:'#e86fa0' },
  { x:2.5,y:9.8,c:'#9ad0ff'},{ x:5.2,y:11.5,c:'#ff8a5c'},{ x:6.4,y:12.1,c:'#ffd166' },
  { x:9.4,y:11.7,c:'#e86fa0'},{ x:11.4,y:11.9,c:'#9ad0ff'},{ x:12.8,y:9.8,c:'#ff8a5c' },
  { x:14.5,y:8.6,c:'#ffd166'},{ x:14.6,y:5.6,c:'#e86fa0'},{ x:13.2,y:4.3,c:'#9ad0ff' },
  { x:9.6,y:1.6,c:'#ff8a5c'},{ x:5.4,y:1.5,c:'#ffd166' },
];

export const PATH_TILES = new Set(['7,10','7,11']);