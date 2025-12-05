<script setup lang="ts">
import Diagram from './diagram'
import go, {type ObjectData} from 'gojs'
import {nodeStyles, linkStyles} from './styles'
import {sleep} from "@antfu/utils";
import ArrayMerge from '../utils/ArrayMerge'

const diagramDiv = ref()
const el = useTemplateRef('diagramDiv')

const data = defineModel<[ObjectData[],ObjectData[]]>()

const diagram = Diagram()
function refreshDiagram() {
  // diagram.model = new go.GraphLinksModel(data.value?.[0] ?? [], data.value?.[1] ?? [])
  // diagram.layout.invalidateLayout();
  diagram.updateAllRelationshipsFromData();
  diagram.updateAllTargetBindings();
  // diagram.requestUpdate();
}

// Links

const selectedNode = ref<ObjectData>()
const selectedLink = ref<ObjectData>()
diagram.addDiagramListener('ChangedSelection', (ev) => {
  const obj = ev.subject.first() || null
  selectedNode.value = obj instanceof go.Node ? obj?.data : undefined
  selectedLink.value = obj instanceof go.Link ? obj?.data : undefined
  if (!obj) refreshFilters()
  else refreshDiagram()
})

const linkTargets = computed(() => data.value?.[0].map((item) => ({
    id: item.key,
    label: item.title,
    icon: nodeStyles[item.type]?.icon,
  })
))

const groupTargets = computed(() => data.value?.[0].filter((item) => item.isGroup).map((item) => ({
    id: item.key,
    label: item.title,
    icon: nodeStyles[item.type]?.icon,
  })
))


// tag adding
// ------------------------------------------------------
const adding = ref(false)
function toggleAdding() {
  adding.value = !adding.value
  refreshFilters()
}

function toggleTag(node: ObjectData) {
  if (!adding.value) return

  if (!node.tags) node.tags = new ArrayMerge()
  if (!(node.tags instanceof ArrayMerge)) node.tags = new ArrayMerge(...node.tags)

  node.tags.toggle(filterTags.value);
}

diagram.addDiagramListener('ObjectSingleClicked', (ev) => {
  const obj = ev.subject
  if (obj !instanceof go.Node) return
  toggleTag(selectedNode.value)
  refreshFilters()
})


// tag filtering
// ------------------------------------------------------
const filtering = ref(false)
function toggleFiltering() {
  filtering.value = !filtering.value
  adding.value = false
  refreshFilters()
}

const tags = computed(() => {
  const tags = new Set<string>()
  const addTags = (item: ObjectData) => {
    item.tags?.forEach((tag: string) => tags.add(tag))
  }
  data.value?.[1].forEach(addTags)
  data.value?.[0].forEach(addTags)
  return Array.from(tags)
})

function attachFilter(filterTags: string[] = []) {
  diagram.startTransaction()
  data.value?.[0].forEach((item: ObjectData) => {
    item.hidden = filtering.value || adding.value
      ? filterTags.length > 0 && !filterTags.some((tag) => item.tags?.includes(tag))
      : false
  })
  diagram.commitTransaction()
}

function refreshFilters() {
  attachFilter(filterTags.value)
  refreshDiagram()
}

const filterTags = ref(['foo'])
watch(filterTags, refreshFilters, { immediate: true })

// load & save
// ------------------------------------------------------
async function loadData() {
  data.value = await $fetch('/api/landscape')
  // if (data.value !instanceof Array) return
  sleep(1).then(() => { // works only desynced
    attachFilter(filterTags.value)
    diagram.model = new go.GraphLinksModel(data.value?.[0] ?? [], data.value?.[1] ?? [])
    diagram.commit(() => {
      diagram.layoutDiagram(true)
    })
  })
}

async function saveData() {
  await $fetch('/api/landscape', {
    method: 'POST',
    body: data.value,
  })
}

onMounted(() => {
  diagram.div = el.value as HTMLDivElement
  diagram.model = new go.GraphLinksModel(data.value?.[0] ?? [], data.value?.[1] ?? [])
  // loadData()
})
</script>

<template>
  <div>
    <div>Landscape</div>

    <div class="row">
      <UButton icon="mdi:file-upload-outline" label="Laden" @click="loadData" size="xs"></UButton>
      <UButton icon="mdi:content-save-outline" label="Speichern" @click="saveData" size="xs"></UButton>
      <UButtonGroup>
        <FieldSelectMulti v-model="filterTags" :options="tags" width="20%" :icon="adding ? 'mdi:tag-plus-outline' : 'mdi:tag-search-outline'"/>
        <UButton :variant="filtering && filterTags?.length ? 'solid' : 'subtle'" :disabled="!filterTags.length" icon="mdi:eye-outline" @click="toggleFiltering"></UButton>
        <UButton :variant="adding ? 'solid' : 'subtle'" :disabled="!filterTags.length" icon="mdi:target" @click="toggleAdding"></UButton>
      </UButtonGroup>
    </div>

    <div class="row">
      <div ref="diagramDiv" class="diagram" :class="{ 'cursor-pointer': adding }"></div>
    </div>

    <ToolBox
      v-show="selectedNode || selectedLink"
      :label="selectedNode ? 'Node Eigenschaften' : 'Link Eigenschaften'"
    >
      <NodeForm v-if="selectedNode"
        v-model="selectedNode"
        :types="nodeStyles"
        :targets="groupTargets"
        :tags
      />
      <LinkForm v-if="selectedLink"
        v-model="selectedLink"
        :types="linkStyles"
        :targets="linkTargets"
        :tags
      />
    </ToolBox>

  </div>
</template>

<style scoped>
@import "tailwindcss";

.diagram {
  width: 100%;
  height: 600px;
  background-color: #DAE4E4;

}
.row {
  @apply flex flex-row gap-1 items-stretch m-1;
}
.slide {
  width: 33%;
}

.v-enter-active {
  transition: width 0.5s ease;
}

.v-leave-active {
  transition: width 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  width: 0;
}
</style>
