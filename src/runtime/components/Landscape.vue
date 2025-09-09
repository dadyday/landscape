<script setup lang="ts">
import Diagram from './diagram'
import go from 'gojs'
import { linkProp } from './styles'

const diagramDiv = ref()
const el = useTemplateRef('diagramDiv')

const data = defineModel<[[],[]]>()

const nodeTemplate = new go.Node("Auto")
  .add(
    new go.Shape("RoundedRectangle")
      .bind("fill", "color"),
    new go.TextBlock({ margin: 10 })
      .bind("text", "title")
  )

const linkTemplate = new go.Link()
  .add(
    new go.Shape({ strokeWidth: 2 })
      .bind('', '', (link, obj) => {
        obj.stroke = linkProp(link, 'color')
        obj.strokeDashArray = linkProp(link, 'strokeDashArray') || []
      }),
    new go.Shape({ strokeWidth: 1, scale: 1 })
      .bind('', '', (link, obj) => {
        obj.stroke = linkProp(link, 'color')
        obj.fill = linkProp(link, 'color')
        obj.fromArrow = linkProp(link, 'fromArrow') || ''
      }),
    new go.Shape({ strokeWidth: 1, scale: 1 })
      .bind('', '', (link, obj) => {
        obj.stroke = linkProp(link, 'color')
        obj.fill = linkProp(link, 'color')
        obj.toArrow = linkProp(link, 'toArrow') || ''
      }),
  )

const diagram = Diagram({
  nodeTemplate,
  linkTemplate,
})

onMounted(() => {
  diagram.div = el.value as HTMLDivElement
  diagram.model = new go.GraphLinksModel(data.value[0] ?? [], data.value[1] ?? [])
  // loadData()
})
</script>

<template>
  <div>
    Landscape
    <div ref="diagramDiv" class="diagram"></div>
  </div>
</template>

<style scoped>
.diagram {
  width: 100%;
  height: 400px;
  background-color: #DAE4E4;
}
</style>
