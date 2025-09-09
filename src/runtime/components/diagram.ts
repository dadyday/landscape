import go from 'gojs'

export default (options: go.DiagramInitOptions): go.Diagram => {
  const diagram =  new go.Diagram(options)

  return diagram
}
