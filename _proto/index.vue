<script setup lang="ts">
import go, { type ObjectData } from 'gojs'
import Diagram, { linkTypes, nodeTypes } from '~/pages/landscape/diagram'

const nodeCols = ref([
  { value: 'key', label: 'Id' },
  { value: 'type', label: 'Typ' },
  { value: 'title', label: 'Name' },
  { value: 'text', label: 'Beschreibung' },
  { value: 'group', label: 'Server' },
  { value: 'loc', label: 'Pos' },
])

const linkCols = ref([
  { value: 'type', label: 'Typ' },
  { value: 'from', label: 'Von' },
  { value: 'to', label: 'Zu' },
  { value: 'title', label: 'Name' },
  { value: 'text', label: 'Beschreibung' },
])

const data = ref([[], []])


async function loadData() {
  data.value = await $fetch('/api/landscape')
  diagram.model = new go.GraphLinksModel(data.value[0] ?? [], data.value[1] ?? [])
}

async function saveData() {
  await $fetch('/api/landscape', {
    method: 'POST',
    body:   data.value,
  })
}

const linkTargets = computed(() => data.value[0]
    .filter((item) => !item.isGroup)
    .map((item) => ({
      value: item.key,
      label: item.text,
    })),
)


const el = useTemplateRef('diagram')
const diagram = Diagram()
const selectedNode = ref<ObjectData>()
const selectedLink = ref<ObjectData>()
diagram.addDiagramListener('ChangedSelection', (ev) => {
  const obj = ev.subject.first()
  selectedNode.value = obj instanceof go.Node ? obj?.data : null
  selectedLink.value = obj instanceof go.Link ? obj?.data : null
})
watchEffect(() => {
  if (selectedNode.value || selectedLink.value) {
    diagram.updateAllRelationshipsFromData()
    diagram.updateAllTargetBindings()
  }
})

onMounted(() => {
  diagram.div = el.value as HTMLDivElement
  diagram.model.modelData = { foo: 'bar', loc: '' }
  // diagram.model = new go.GraphLinksModel(data.value[0], data.value[1])
  loadData()
})
</script>

<template>
  <div>
    <Row>
      <FieldButton icon="mdi:file-upload-outline" label="Laden" @click="loadData"></FieldButton>
      <FieldButton icon="mdi:content-save-outline" label="Speichern" @click="saveData"></FieldButton>
    </Row>
    <Row class="items-stretch">
      <div ref="diagram" class="diagram"></div>
      <Transition>
        <Col v-if="selectedNode || selectedLink" class="w-1/3 ">
          <div v-if="selectedNode">
            <Row>
              <FieldSelect v-model="selectedNode.type" label="Type" :options="nodeTypes" width="50%" />
            </Row>
            <Row>
              <FieldString v-model="selectedNode.title" label="Name" width="100%" />
            </Row>
            <Row>
              <FieldText v-model="selectedNode.text" label="Beschreibung" rows="2" width="100%" />
            </Row>
          </div>
          <div v-else-if="selectedLink">
            <Row>
              <FieldSelect v-model="selectedLink.type" label="Type" :options="linkTypes" width="50%" />
            </Row>
            <Row>
              <FieldSelect v-model="selectedLink.from" label="Von" :options="linkTargets" width="50%" />
              <FieldSelect v-model="selectedLink.to" label="Zu" :options="linkTargets" width="50%" />
            </Row>
            <Row>
              <FieldString v-model="selectedNode.title" label="Name" width="100%" />
            </Row>
            <Row>
              <FieldText v-model="selectedLink.text" label="Beschreibung" rows="2" width="100%" />
            </Row>
          </div>
        </Col>
      </Transition>
    </Row>

    <DataTable :columns="nodeCols" :items="data[0]" />
    <DataTable :columns="linkCols" :items="data[1]" />

  </div>
</template>

<style scoped>
.diagram {
  width: 100%;
  height: 400px;
  background-color: #DAE4E4;
}

.server {
  fill: #fc8;
}

.growIn {

}

.v-enter-active {
  transition: width 0.5s ease;
}

.v-leave-active {
  transition: width 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  width: 0
}
</style>