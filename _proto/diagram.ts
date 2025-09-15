import go from 'gojs'
import AvoidsLinksRouter from '~/pages/landscape/AvoidsLinksRouter'

import '~/pages/landscape/Arrowheads.js'

go.Shape.defineArrowheadGeometry('Feather', 'm 0,0 l 3,4 -3,4')

export const nodeTypes = {
  server: { label: 'Server', color: '#444' },
  app:    { label: 'App', color: '#cfc' },
  api:    { label: 'API', color: '#ccf' },
  module: { label: 'Module', color: '#fc8' },
  cron:   { label: 'Cronjob', color: '#ff8' },
  daemon: { label: 'Daemon', color: '#8fc' },
  db:     { label: 'DB', color: '#f8c' },
  file:   { label: 'Filestore', color: '#f88' },
}

export const linkTypes = {
  include: { label: 'Include', color: '#880', fromArrow: 'Circle', strokeDashArray: [4] },
  api:     { label: 'Api', color: '#048', fromArrow: 'StretchedDiamond' },
  notify:  { label: 'Notify', color: '#084' },
  message: { label: 'Message', color: '#800' },
  read:    { label: 'Read', color: '#840' },
}

// helper

// dragging
let lastGroup: Partial<any> | null = null

function enterDrag(e, group: Partial<any>) {
  // console.log('enter', group?.key)
  if (lastGroup) lastGroup.isHighlighted = false
  if (group) {
    group.isHighlighted = true
    lastGroup = group
  }
}

function leaveDrag(e, group) {
  // console.log('leave', grp?.key)
}

function stopDrag(e, group) {
  // console.log('stop', grp?.key)
  if (lastGroup) lastGroup.isHighlighted = false
  lastGroup = null
  if (group) {
    group.addMembers(group.diagram.selection, true)
  }
}

// diagram
export default (): go.Diagram => {
  const diagram = new go.Diagram({
    'undoManager.isEnabled':               true,
    'commandHandler.memberValidation':     function (group, node) {
      // Nur normale Nodes können zu Groups hinzugefügt werden, nicht andere Groups
      return !(node instanceof go.Group)
    },
    'commandHandler.archetypeGroupData':   { isGroup: true, text: 'Subnet' },
    'clickCreatingTool.archetypeNodeData': { title: 'Neue Node', text: '', type: '' },
    //
    // mouseDrop:                        stopDrag,
    'draggingTool.isGridSnapEnabled': true,
    maxSelectionCount:                1,
  })

  diagram.grid = new go.Panel('Grid', { gridCellSize: new go.Size(10, 10) })
    .add(
      new go.Shape('LineH', { strokeWidth: 0.2, strokeDashArray: [1, 9] }),
      // new go.Shape('LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
      // new go.Shape('LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
    )

  diagram.routers.add(new AvoidsLinksRouter())

  diagram.groupTemplate = new go.Group('Vertical', {
    locationSpot:              go.Spot.Center,
    padding:                   5,
    mouseDragEnter:            enterDrag, // (e, grp, prev) => highlightGroup(e, grp, true),
    mouseDragLeave:            leaveDrag, // (e, grp, next) => highlightGroup(e, grp, false),
    mouseDrop:                 stopDrag, // (e, nod) => finishDrop(e, nod),
    handlesDragDropForMembers: true,
    computesBoundsAfterDrag:   true,
    // computesBoundsIncludingLocation: true,
    selectable: true,
  })
    .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
    .bindObject('background', 'isHighlighted', (h) => (h ? 'rgba(255,255,255,0.1)' : 'transparent'))
    .add(
      new go.TextBlock({
        alignment: go.Spot.Left,
        font:      '12px georgia',
        editable:  true,
      }).bindTwoWay('text', 'title'),
      new go.Panel('Auto')
        .add(
          new go.Shape('RoundedRectangle', {
            strokeDashArray: [2, 2],
            stroke:          '#333',
            fill:            'rgba(0,0,0,0)',
          }),
          new go.Placeholder({ padding: 5 }),
        ),
    )

  diagram.nodeTemplate = new go.Node('Auto', {
    // locationSpot:        go.Spot.Center,
    // locationObjectName:  'BODY',
    // selectionObjectName: 'BODY',
    selectable: true,
  })
    .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
    .add(
      new go.Shape({
        figure:       'RoundedRectangle',
        fromSpot:     go.Spot.LeftRightSides,  // coming out from middle-right
        toSpot:       go.Spot.LeftRightSides,   // going into middle-left
        fromLinkable: true,
        toLinkable:   true,
        portId:       '',
      })
        .bind('fill', '', (node) => nodeTypes[node?.type]?.color ?? '#ccc'),
      new go.Panel('Horizontal')
        .add(
          new go.Shape({
            width:       1,
            height:      25,
            fill:        'transparent',
            strokeWidth: 0,
          }),
          new go.TextBlock({
            editable: true,
          })
            .bindTwoWay('text', 'title'),
        ),
    )


  diagram.linkTemplate = new go.Link({
    // routing:        go.Routing.Orthogonal,
    routing:    go.Routing.Orthogonal, // AvoidsNodes,
    curve:      go.Curve.JumpOver, // go.Curve.JumpGap
    corner:     4,
    mouseEnter: (e, link) => link.elt(0).strokeWidth = 2.5,
    mouseLeave: (e, link) => link.elt(0).strokeWidth = 1.5,

    fromSpot:             go.Spot.RightSide,
    fromEndSegmentLength: 16,
    fromShortLength:      4,
    relinkableFrom:       true,

    toSpot:             go.Spot.LeftSide,
    toEndSegmentLength: 16,
    toShortLength:      4,
    relinkableTo:       true,

    reshapable:    true,
    resegmentable: true,
  })
    .add(
      new go.Shape({ strokeWidth: 1.5 })
        .bind('', '', (link, obj) => {
          obj.stroke = linkTypes[link?.type]?.color ?? '#444'
          obj.strokeDashArray = linkTypes[link?.type]?.strokeDashArray ?? []
        }),
      new go.Shape({ strokeWidth: 0, scale: 1 })
        .bind('', '', (link, obj) => {
          obj.stroke = linkTypes[link?.type]?.color ?? '#444'
          obj.fill = linkTypes[link?.type]?.color ?? '#444'
          obj.fromArrow = linkTypes[link?.type]?.fromArrow || ''
        }),
      new go.Shape({ strokeWidth: 0, scale: 1 })
        .bind('', '', (link, obj) => {
          obj.stroke = linkTypes[link?.type]?.color ?? '#444'
          obj.fill = linkTypes[link?.type]?.color ?? '#444'
          obj.toArrow = linkTypes[link?.type]?.toArrow || 'Triangle'
        }),
    )

  // Event-Listener für Rechtsklick auf Hintergrund
  diagram.addDiagramListener('BackgroundContextClicked', function (e) {
    const point = e.diagram.lastInput.documentPoint
    createNodeAtPoint(point)
  })

  // Event-Listener für Rechtsklick auf Objekte (Nodes/Groups)
  diagram.addDiagramListener('ObjectContextClicked', function (e) {
    const point = e.diagram.lastInput.documentPoint
    const obj = e.subject.part
    if (obj instanceof go.Group) {
      createNodeAtPoint(point, obj)
    }

  })


  function createNodeAtPoint(point, group = null) {
    diagram.startTransaction('create node')
    const data = {
      title:       'New Node',
      description: '',
      type:        'server',
      isGroup:     !group,
      group:       group,
      loc:         go.Point.stringify(point),
    }

    diagram.model.addNodeData(data)
    diagram.commitTransaction('create node')
  }

  return diagram
}




