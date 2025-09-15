
type Scalar = string | number

type Icon = string | {
  name?: string,
  color?: string,
  text?: string,
} | undefined

type Option = {
  id: Scalar,
  value?: Scalar,
  label: Scalar,
  icon?: Icon,
  color?: string,
  disabled?: boolean,
}
type Options = Scalar[] | Option[] | Record<Scalar, Option>


const normalizeIcon = (icon: Icon) => {
  switch (typeof icon) {
    case 'string':
      const matches = icon?.match(/^(\w+:\S+|i-\S+)\s*(.*)?$/) ?? []
      return {
        name: matches?.[1],
        color: matches?.[2],
        text: icon,
      }
    case 'object':
      return icon
    default:
      return undefined
  }
}

function normalizeOptions(options: Options): Options {
  const items = options instanceof Array ? options : Object.entries(options).map(([id, item]) => ({ ...item, id }))
  return items.reduce((result: Options, item: Scalar|Option, index: number) => {
    if (typeof item !== 'object') {
      item = { id: index, label: item } satisfies Option
    }
    item.icon = normalizeIcon(item.icon) ?? undefined
    item.id = item.id ?? item.value
    result[item.id] = item
    return result
  }, {} as Options)
}

export {
  normalizeOptions,
  type Option,
  type Options,
  normalizeIcon,
}
