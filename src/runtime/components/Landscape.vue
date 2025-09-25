<script setup lang="ts">
import Diagram from './diagram'
import go, {type ObjectData} from 'gojs'
import {nodeStyles, linkStyles} from './styles'
import {sleep} from "@antfu/utils";

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

function swapLinkTargets() {
  let tmp = selectedLink.value.from
  selectedLink.value.from = selectedLink.value.to
  selectedLink.value.to = tmp

  tmp = selectedLink.value.fromText
  selectedLink.value.fromText = selectedLink.value.toText
  selectedLink.value.toText = tmp
}

// tag adding
// ------------------------------------------------------
const adding = ref(false)
function toggleAdding() {
  adding.value = !adding.value
  refreshFilters()
}
const addingTag = ref('foo')
function toggleTag(node: ObjectData) {
  if (!adding.value || !addingTag.value) return
  if (!node.tags) node.tags = []
  if (node.tags.includes(addingTag.value)) {
    node.tags = node.tags.filter((tag) => tag !== addingTag.value)
  }
  else {
    node.tags.push(addingTag.value)
  }
}
diagram.addDiagramListener('ObjectSingleClicked', (ev) => {
  const obj = ev.subject
  if (obj !instanceof go.Node) return
  toggleTag(selectedNode.value)
  refreshFilters()
})
watch(addingTag, refreshFilters, {})



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
  const filters = adding.value ? [addingTag.value] : filterTags.value
  attachFilter(filters)
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
    Landscape
    {{ filterTags.length }}
    <div class="row">
      <UButton icon="mdi:file-upload-outline" label="Laden" @click="loadData" size="xs"></UButton>
      <UButton icon="mdi:content-save-outline" label="Speichern" @click="saveData" size="xs"></UButton>
      <UButtonGroup>
        <FieldSelectMulti v-model="filterTags" :options="tags" width="20%" icon="mdi:tag-search-outline"/>
        <UButton :variant="filtering && filterTags?.length ? 'solid' : 'subtle'" :disabled="!filterTags.length" icon="mdi:eye-outline" @click="toggleFiltering"></UButton>
      </UButtonGroup>
      <UButtonGroup>
        <FieldSelect v-model="addingTag" :options="tags" width="20%" icon="mdi:tag-plus-outline"/>
        <UButton :variant="adding ? 'solid' : 'subtle'" :disabled="!addingTag" icon="mdi:target" @click="toggleAdding"></UButton>
      </UButtonGroup>
    </div>
    <div class="row">
      <div ref="diagramDiv" class="diagram" :class="{ 'cursor-pointer': adding }"></div>
      <Transition>
        <div v-if="selectedNode || selectedLink" class="slide">
          <div v-if="selectedNode" class="col">
            <FieldInput v-model="selectedNode.title" label="Name" />
            <FieldSelect v-model="selectedNode.type" :options="nodeStyles" label="Type" />
            <FieldSelect v-model="selectedNode.group" :options="groupTargets" label="Gehört zu" />
            <UTextarea v-model="selectedNode.text" label="Beschreibung" divs="5" />
            <FieldSelectMulti v-model="selectedNode.tags" :options="tags" label="Tags" @change="refreshFilters"/>
          </div>
          <div v-if="selectedLink" class="col">
            <FieldInput v-model="selectedLink.label" label="Name" />
            <FieldSelect v-model="selectedLink.type" :options="linkStyles" label="Type" />
            <FieldRow>
              <FieldCol label="Von">
                <FieldSelect v-model="selectedLink.from" :options="linkTargets" />
                <FieldInput v-model="selectedLink.fromLabel" />
              </FieldCol>
              <UButton icon="mdi:swap-horizontal" @click="swapLinkTargets" variant="ghost" size="xs" />
              <FieldCol label="Zu">
                <FieldSelect v-model="selectedLink.to" :options="linkTargets" />
                <FieldInput v-model="selectedLink.toLabel" />
              </FieldCol>
            </FieldRow>
            <UTextarea v-model="selectedLink.text" label="Beschreibung" divs="5" />
          </div>
        </div>
      </Transition>
    </div>

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
.col {
  @apply flex flex-col gap-1;
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
