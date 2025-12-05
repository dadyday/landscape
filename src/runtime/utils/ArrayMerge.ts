/*
  items, this, result
  [], [baz] -> [baz]          all, none

  [foo], [], [foo]            none addall
  [foo], [foo], []            all removeall

  [foo], [baz] -> [foo, baz]    none addall
  [foo], [foo, baz] -> [baz]    all removeall

  [foo, bar], [foo] -> [foo, bar]     any
  [foo, bar], [foo, bar] -> []        all
  [foo, bar], [] -> [foo]  // third state   none restorelast

  [foo, bar], [foo, baz] -> [foo, bar, baz]   any remember addall
  [foo, bar], [foo, bar, baz] -> [baz]        all removeall
  [foo, bar], [baz] -> [foo, baz]  // third state   none restorelast reset

*/

class ArrayMerge<T> extends Array<T> {
  private lastTags: T[] = []

  addAll(items: T[]) {
    items.forEach((item: T) => this.find((i: T) => i === item) || this.push(item))
  }

  removeAll(items: T[]) {
    items.forEach((item: T) => this.find((i: T) => i === item) && this.splice(this.indexOf(item), 1))
  }

  remember() {
    this.lastTags = [...this]
  }

  restore() {
    this.splice(0, this.length, ...this.lastTags)
  }

  reset() {
    this.lastTags = []
  }

  hasAll(items: T[]) {
    return items.every((item: T) => this.includes(item))
  }

  hasAny(items: T[]) {
    return items.some((item: T) => this.includes(item))
  }

  hasNone(items: T[]) {
    return items.every((item: T) => !this.includes(item))
  }

  toggle(items: T[], debug = false) {
    const log: any[] = debug ? [items.join(), this.join()] : []

    if (this.hasAll(items)) {
      debug && log.push('all')
      this.removeAll(items)
      debug && log.push('remove')
    }
    else if (this.hasAny(items)) {
      debug && log.push('any')
      this.remember()
      debug && log.push('remember')
      this.addAll(items)
      debug && log.push('add')
    }
    else if (this.lastTags.length) {
      debug && log.push('none')
      this.restore()
      this.reset()
      debug && log.push('restore')
    }
    else {
      debug && log.push('none')
      this.addAll(items)
      debug && log.push('add')
    }

    debug && log.push(this.join())
    if (debug) console.log(log)
  }
}

export default ArrayMerge
