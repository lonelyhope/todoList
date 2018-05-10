export function findId(noteLists, id) {
  for(let i = 0; i < noteLists.length; i++) {
    if (noteLists[i] == id) return i;
  }
  return null;
}
  
export function bindThis(funs) {
  funs.forEach((fun) => {
    this[fun.name] = fun.bind(this)
  })
}