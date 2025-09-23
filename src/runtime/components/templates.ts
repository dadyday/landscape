import go, {type Link, type ObjectData, type Part} from "gojs";
import {nodeProp, linkProp} from "./styles";
import {GradientLink} from "./GradienLink";
import "./Arrowheads";

/*
function loadIcon(node: Part, callback: (geom: go.Geometry, color: string) => void) {
  const icon = nodeProp(node, 'icon')
  const [_, lib, name, color] = icon?.match(/^([\w-]+):([\w-]+)\s*(.+)?$/) ?? []
  if (!name) return icon
  else if (icons[name]) return icons[name]

  // const p = 'F M2.6582600000000003 6.65405 C2.38581 8.738150000000001 2.22032 10.85575 2.16746 13.00145 C5.06344 14.21045 7.81786 15.690949999999999 10.39893 17.41105 C12.98003 15.690949999999999 15.73443 14.21045 18.63043 13.00145 C18.57753 10.85585 18.41203 8.738150000000001 18.13963 6.65415 M2.6582600000000003 6.65405 C1.78255 6.35975 0.89622 6.088520000000001 0 5.841150000000001 C3.2453900000000004 3.5663199999999997 6.72634 1.60465 10.39893 0 C14.07163 1.60465 17.55253 3.5663300000000002 20.79793 5.84116 C19.90173 6.08854 19.01533 6.359780000000001 18.13963 6.65415 M2.6582600000000003 6.65405 C5.34549 7.55735 7.932729999999999 8.67835 10.39903 9.99605 C12.86523 8.67835 15.45243 7.55735 18.13963 6.65415 M5.14893 11.50745 C5.56314 11.50745 5.89893 11.17165 5.89893 10.75745 C5.89893 10.343250000000001 5.56314 10.00745 5.14893 10.00745 C4.73472 10.00745 4.39893 10.343250000000001 4.39893 10.75745 C4.39893 11.17165 4.73472 11.50745 5.14893 11.50745z M5.14893 11.50745 L5.14893 7.831950000000001 C6.840400000000001 6.780950000000001 8.59253 5.818390000000001 10.39893 4.95074 M3.3915699999999998 16.500049999999998 C4.56314 15.328550000000002 5.14893 13.79295 5.14893 12.25745 L5.14893 10.75745'
  // trg.geometry = go.Geometry.parse(p, true)
  fetch("http://localhost:3000/api/_nuxt_icon/mdi.json?icons="+name)
    .then(res => {
      res.json().then((json) => {
        const path = json.icons[name].body.match(/d="(.*)"/)[1]
        icons[name] = go.Geometry.parse(path, true)
        callback(icons[name], color)
      })
    })
}
*/

function makeRgb(color: string) {
  const d = document.createElement("div");
  d.style.color = color;
  document.body.appendChild(d)
  const rgb = window.getComputedStyle(d).color
  document.body.removeChild(d)
  return rgb
}

function makeTransparent(color: string, alpha = 0.0) {
  const rgb = makeRgb(color)
  const [r,g,b] = rgb?.match(/\d+/g)?.map(Number) ?? [0,0,0]
  return `rgba(${r},${g},${b},${alpha})`
}

const icons: Record<string, go.Geometry> = {}
function loadIcon(name: string) {
  return fetch("http://localhost:3000/api/_nuxt_icon/mdi.json?icons="+name)
    .then(res => {
      return res.json().then((json) => {
        const path = json.icons[name].body.match(/d="(.*)"/)[1]
        return go.Geometry.parse(path, true)
      })
    })
}

function bindIcon(node: Part) {
  const icon = nodeProp(node.data, 'icon')
  const symbol = node.findObject('iconSymbol') as go.TextBlock
  const glyph = node.findObject('iconGlyph') as go.Shape

  const [_, lib, name, c] = icon?.match(/^([\w-]+):([\w-]+)\s*(.+)?$/) ?? []
  if (!name) symbol.text = icon
  else {
    if (icons[name]) glyph.geometry = icons[name]
    loadIcon(name).then((geom) => {
      glyph.geometry = icons[name] = geom
    })
    glyph.fill = c
    glyph.visible = true
  }
}

function bindNode(node: Part, obj: Partial<any>) {
  const color = nodeProp(node.data, 'color')
  const transp = makeTransparent(color, 0)
  const back = node.findObject('back') as go.Shape
  const title = node.findObject('title') as go.TextBlock

  obj.opacity = node.data.hidden ? 0.1 : 1
  back.fill = nodeProp(node.data, 'fill')
  back.stroke = nodeProp(node.data, 'stroke')
  title.text = node.data?.title
  bindIcon(node)
}

function bindLink(link: Link, obj: Partial<any>) {
  const color = linkProp(link.data, 'color')
  const transp = makeTransparent(color, 0)
  const fromNode = link.fromNode?.data
  const toNode = link.toNode?.data
  const fromArrow = link.findObject('fromArrow') as go.Shape
  const toArrow = link.findObject('toArrow') as go.Shape
  const fromText = link.findObject('fromText') as go.TextBlock
  const toText = link.findObject('toText') as go.TextBlock
  const midText = link.findObject('lineText') as go.TextBlock

  obj.fromShortLength = (fromArrow.fromArrow = linkProp(link.data, 'fromArrow') || '') ? 6 : 2
  obj.toShortLength = (toArrow.toArrow = linkProp(link.data, 'toArrow') || '') ? 6 : 2
  fromArrow.fill = toArrow.fill = color
  obj.strokeDashArray = linkProp(link.data, 'strokeDashArray')

  // obj.opacity = fromNode?.hidden && toNode?.hidden ? 0 : 1.0
  obj.startColor = fromNode?.hidden ? transp : color
  obj.midColor = transp
  obj.endColor = toNode?.hidden ? transp : color
  fromArrow.opacity = fromNode?.hidden ? 0.1 : 1.0
  toArrow.opacity = toNode?.hidden ? 0.1 : 1.0

  fromText.text = toText.text = midText.text = ''
  if (!fromNode?.hidden && !toNode?.hidden) {
    fromText.text = link.data?.fromLabel
    toText.text = link.data?.toLabel
    midText.text = link.data?.label
  }
  else if (!fromNode?.hidden) {
    fromText.text = link.data?.fromLabel ?? link.data?.label
  }
  else if (!toNode?.hidden) {
    toText.text = link.data?.toLabel ?? link.data?.label
  }

  obj.updateBrush()
}


const nodeTooltip = new go.TextBlock({ margin: 4 })
  .bind("text", "description")


const groupTemplate = new go.Group('Vertical', {
  locationSpot:              go.Spot.Center,
  padding:                   5,
  handlesDragDropForMembers: true,
  computesBoundsAfterDrag:   true,
  // computesBoundsIncludingLocation: true,
  selectable: true,
})
  .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
  .bindObject('background', 'isHighlighted', (h) => (h ? 'rgba(255,255,255,0.1)' : 'transparent'))
  .add(
    new go.TextBlock({
      name:      'title',
      alignment: go.Spot.Left,
      font:      '12px georgia',
      editable:  true,
    }).bindTwoWay('text', 'title'),
    new go.Panel('Auto')
      .add(
        new go.Shape("RoundedRectangle", {
          strokeDashArray: [4],
        })
          .bind('', '', (node, obj) => {
            obj.stroke = nodeProp(node, 'stroke')
            obj.fill = nodeProp(node, 'fill')
          }),
        new go.Placeholder({ padding: 5 }),
      ),
  )

const nodeTemplate = new go.Node("Auto", {
  // toolTip: go.GraphObject.build('ToolTip').add(nodeTooltip),
  // selectionAdornmentTemplate: nodeAdornment,
})
  .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
  .bindObject('', '', bindNode)
  .add(
    new go.Shape("RoundedRectangle",{
      name: 'back',
      fill: 'white',
      portId: "",
      fromLinkable: true,
      toLinkable: true,
    }),
    new go.Panel('Horizontal', {
      name: 'head',
      margin: 10,
    }).add(
      new go.TextBlock({
        name: 'iconSymbol',
        text: '',
      }),
      new go.Shape({
        name: 'iconGlyph',
        alignment: new go.Spot(0, 0),
         margin: new go.Margin(-1, 3, 0, 0),
         height: 12,
         width: 12,
         fill: 'black',
         strokeWidth: 0,
         visible: false,
      }),
      new go.TextBlock({
        name: 'title',
      }),
    )
  )


const linkTemplate = new GradientLink({
  // routing:    go.Routing.AvoidsNodes,
  curve:        go.Curve.Bezier, // go.Curve.JumpGap,
  // corner:     4,
  mouseEnter: (e, link) => link.elt(0).strokeWidth = 4,
  mouseLeave: (e, link) => link.elt(0).strokeWidth = 1.5,

  // fromSpot:             go.Spot.LeftRightSides,
  fromEndSegmentLength: 16,
  fromShortLength:      6,
  relinkableFrom:       true,
  startColor:           'red',
  endColor:             'blue',

  // toSpot:             go.Spot, // go.Spot.LeftSide,
  toEndSegmentLength:   16,
  toShortLength:        6,
  relinkableTo:         true,

  reshapable:    true,
  resegmentable: true,
})

  .bindObject('', '', bindLink)
  .add(new go.Shape({
    name:         'line',
    strokeWidth:  2,
    strokeCap:    "round",
  }))
  .add(new go.Shape({
    name:         'fromArrow',
    strokeWidth:  0,
    fromArrow:    'Standard',
  }))
  .add(new go.Shape({
    name:         'toArrow',
    strokeWidth:  0,
    toArrow:      'Standard',
  }))
  .add(new go.TextBlock({
    name:               'lineText',
    font:               '8pt georgia',
    segmentOffset:      new go.Point(0, -10),
    segmentOrientation: go.Orientation.Upright,
  }))
  .add(new go.TextBlock({
    name:               'fromText',
    font:               '8pt georgia',
    segmentIndex:       0,
    segmentOffset:      new go.Point(NaN, -10),
    segmentOrientation: go.Orientation.Upright,
    segmentFraction:    0.1,
  }))
  .add(new go.TextBlock({
    name:               'toText',
    font:               '8pt georgia',
    segmentIndex:       -1,
    segmentOffset:      new go.Point(NaN, -10),
    segmentOrientation: go.Orientation.Upright,
    segmentFraction:    0.9,
  }))


export {groupTemplate, nodeTemplate, linkTemplate}
