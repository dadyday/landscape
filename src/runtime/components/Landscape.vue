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

const selectedNode = ref<ObjectData>()
const selectedLink = ref<ObjectData>()
diagram.addDiagramListener('ChangedSelection', (ev) => {
  const obj = ev.subject.first() || null
  selectedNode.value = obj instanceof go.Node ? obj?.data : undefined
  selectedLink.value = obj instanceof go.Link ? obj?.data : undefined
})
watchEffect(() => {
  if (selectedNode.value || selectedLink.value) {
    refreshDiagram()
  }
})

const linkTargets = computed(() => data.value?.[0].map((item) => ({
    id: item.key,
    label: item.title,
    icon: nodeStyles[item.type]?.icon,
  })
))

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
    item.hidden = filterTags.length > 0 && !filterTags.some((tag) => item.tags?.includes(tag))
  })
  diagram.commitTransaction()
}

const filterTags = ref(['foo'])
watch(filterTags, () => {
  attachFilter(filterTags.value)
  refreshDiagram()
}, { immediate: true })


async function loadData() {
  data.value = await $fetch('/api/landscape')
  // if (data.value !instanceof Array) return
  sleep(1).then(() => { // works only desynced
    attachFilter(filterTags.value)
    diagram.model = new go.GraphLinksModel(data.value?.[0] ?? [], data.value?.[1] ?? [])
    diagram.layoutDiagram(true)
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
    <div class="row">
      <UButton icon="mdi:file-upload-outline" label="Laden" @click="loadData" size="xs"></UButton>
      <UButton icon="mdi:content-save-outline" label="Speichern" @click="saveData" size="xs"></UButton>
      <FieldSelectMulti v-model="filterTags" :options="tags" width="50%" />
    </div>
    <div class="row">
      <div ref="diagramDiv" class="diagram"></div>
      <Transition>
        <div v-if="selectedNode || selectedLink" class="slide">
          <div v-if="selectedNode" class="col">
            <FieldSelect v-model="selectedNode.type" :options="nodeStyles" label="Type" width="50%" />
            <FieldSelectMulti v-model="selectedNode.tags" :options="tags" label="Tags" width="50%" />
            <UInput v-model="selectedNode.title" label="Name" width="100%" />
            <UTextarea v-model="selectedNode.text" label="Beschreibung" divs="2" width="100%" />
          </div>
          <div v-if="selectedLink" class="col">
            <FieldSelect v-model="selectedLink.type" :options="linkStyles" label="Type" width="50%" />
            <FieldSelect v-model="selectedLink.from" :options="linkTargets" label="Von" width="50%" />
            <FieldSelect v-model="selectedLink.to" :options="linkTargets" label="Zu" width="50%" />
            <FieldSelectMulti v-model="selectedLink.tags" :options="tags" label="Tags" width="50%" />
            <UInput v-model="selectedLink.title" label="Name" width="100%" />
            <UTextarea v-model="selectedLink.text" label="Beschreibung" divs="2" width="100%" />
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
