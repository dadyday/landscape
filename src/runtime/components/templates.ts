import go, {type ObjectData, type Part} from "gojs";
import {nodeProp, linkProp} from "./styles";
import {GradientLink} from "./GradienLink";
import "./Arrowheads";


function loadIcon(node: Part, obj: Partial<any>) {
  const icon = nodeProp(node, 'icon')
  const [_,lib,name, color] = icon?.match(/^([\w-]+):([\w-]+)\s*(.+)?$/) ?? []
  if (!name) {
    obj.text = icon
  }
  else {
    // const p = 'F M2.6582600000000003 6.65405 C2.38581 8.738150000000001 2.22032 10.85575 2.16746 13.00145 C5.06344 14.21045 7.81786 15.690949999999999 10.39893 17.41105 C12.98003 15.690949999999999 15.73443 14.21045 18.63043 13.00145 C18.57753 10.85585 18.41203 8.738150000000001 18.13963 6.65415 M2.6582600000000003 6.65405 C1.78255 6.35975 0.89622 6.088520000000001 0 5.841150000000001 C3.2453900000000004 3.5663199999999997 6.72634 1.60465 10.39893 0 C14.07163 1.60465 17.55253 3.5663300000000002 20.79793 5.84116 C19.90173 6.08854 19.01533 6.359780000000001 18.13963 6.65415 M2.6582600000000003 6.65405 C5.34549 7.55735 7.932729999999999 8.67835 10.39903 9.99605 C12.86523 8.67835 15.45243 7.55735 18.13963 6.65415 M5.14893 11.50745 C5.56314 11.50745 5.89893 11.17165 5.89893 10.75745 C5.89893 10.343250000000001 5.56314 10.00745 5.14893 10.00745 C4.73472 10.00745 4.39893 10.343250000000001 4.39893 10.75745 C4.39893 11.17165 4.73472 11.50745 5.14893 11.50745z M5.14893 11.50745 L5.14893 7.831950000000001 C6.840400000000001 6.780950000000001 8.59253 5.818390000000001 10.39893 4.95074 M3.3915699999999998 16.500049999999998 C4.56314 15.328550000000002 5.14893 13.79295 5.14893 12.25745 L5.14893 10.75745'
    // trg.geometry = go.Geometry.parse(p, true)
    fetch("http://localhost:3000/api/_nuxt_icon/mdi.json?icons="+name)
      .then(res => {
        res.json().then((json) => {
          const path = json.icons[name].body.match(/d="(.*)"/)[1]
          // console.log(path)
          obj.geometry = go.Geometry.parse(path, true)
          obj.visible = true
          obj.fill = color
        })
      })
  }
}

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

const nodeTemplate = new go.Node("Auto")
  .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
  .bind('', '', (node, obj) => {
    obj.opacity = node.hidden ? 0.1 : 1
  })
  .add(
    new go.Shape("RoundedRectangle")
      .bind('', '', (node, obj) => {
        obj.stroke = nodeProp(node, 'stroke')
        obj.fill = nodeProp(node, 'fill')
      }),
    new go.Panel('Horizontal', { margin: 10 })
      .add(
        new go.TextBlock({
          text: '',
        })
          .bind('', '', loadIcon),
        new go.Shape({
          alignment: new go.Spot(0, 0),
          margin: new go.Margin(-1, 3, 0, 0),
          height: 12,
          width: 12,
          fill: 'black',
          strokeWidth: 0,
          visible: false,
        })
          .bind('', '', loadIcon),
        new go.TextBlock({
        })
          .bind('text', 'title'),
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
  endColor:           'blue',

  // toSpot:             go.Spot, // go.Spot.LeftSide,
  toEndSegmentLength: 16,
  toShortLength:      6,
  relinkableTo:       true,

  reshapable:    true,
  resegmentable: true,
})
  .bindObject('', '', (link, obj) => {
    const color = linkProp(link.data, 'color')
    const transp = makeTransparent(color, 0.1)
    const fromNode = link.fromNode?.data
    const toNode = link.toNode?.data
    const [path, from, to] = Array.from(link.elements) as go.Shape[]

    obj.fromShortLength = (from.fromArrow = linkProp(link.data, 'fromArrow') || '') ? 6 : 2
    obj.toShortLength = (to.toArrow = linkProp(link.data, 'toArrow') || '') ? 6 : 2
    from.fill = to.fill = color
    obj.strokeDashArray = linkProp(link.data, 'strokeDashArray')

    // obj.opacity = from?.hidden && to?.hidden ? 0.1 : 1.0
    obj.startColor = fromNode?.hidden ? transp : color
    obj.midColor = transp
    obj.endColor = toNode?.hidden ? transp : color
    from.opacity = fromNode?.hidden ? 0.1 : 1.0
    to.opacity = toNode?.hidden ? 0.1 : 1.0

    obj.updateBrush()
  })
  .add(new go.Shape({ strokeWidth: 2, strokeCap: "round" }))
  .add(new go.Shape({ strokeWidth: 0, fromArrow: 'Standard'}))
  .add(new go.Shape({ strokeWidth: 0, toArrow: 'Standard'}))


export {groupTemplate, nodeTemplate, linkTemplate}
