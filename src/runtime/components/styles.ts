

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

export const nodeStyles = {
  'default': {
    icon: '❓',
    fill: '#F5F5F5',
    stroke: '#757575',
    titleColor: '#424242'
  },
  'group': {
    icon: '📁',
    fill: '#E3F2FD',
    stroke: '#1976D2',
    titleColor: '#1565C0'
  },
  'modul': {
    icon: '⚙️',
    fill: '#E8EAF6',
    stroke: '#3F51B5',
    titleColor: '#303F9F'
  },
  'api': {
    icon: '🔗',
    fill: '#E8F5E8',
    stroke: '#388E3C',
    titleColor: '#2E7D32'
  },
  'app': {
    icon: '📱',
    fill: '#FFF3E0',
    stroke: '#F57C00',
    titleColor: '#EF6C00'
  },
  'cron': {
    icon: '⏰',
    fill: '#FCE4EC',
    stroke: '#C2185B',
    titleColor: '#AD1457'
  },
  'daemon': {
    icon: '👹',
    fill: '#F1F8E9',
    stroke: '#689F38',
    titleColor: '#558B2F'
  },
  'script': {
    icon: 'mdi:script-text-play-outline #00695C', //'📜',
    fill: '#E0F2F1',
    stroke: '#00695C',
    titleColor: '#00838F'
  },
  'db': {
    icon: 'mdi:database orange',
    label: 'DB',
    color: '#f8c'
  },
  'file': {
    icon: '📁',
    label: 'Filestore',
    color: '#f88'
  },
};

// Zentrale Datenstruktur für Link-Eigenschaften
export const linkStyles = {
  'default': {
    icon: '➡️',
    color: '#000',
    width: 3,
    toArrow: 'Standard',
    fromArrow: '',
    strokeDashArray: []
  },

  'request': {
    icon: '➡️',
    color: '#2196F3',
    width: 3,
    toArrow: 'Standard',
    fromArrow: '',
  },
  'control': {
    icon: '🎮',
    color: '#9C27B0',
    width: 3,
    toArrow: 'Triangle',
    fromArrow: '',
    strokeDashArray: [4]
  },
  'notify': {
    icon: '⚡',
    color: '#FF9800',
    width: 3,
    toArrow: 'OpenTriangle',
    fromArrow: '',
  },
  'dependency': {
    icon: '🔗',
    color: '#E91E63',
    width: 3,
    toArrow: 'Standard',
    fromArrow: 'BackwardSemiCircle',
  },
};

export function linkProp(link, prop) {
  const style = linkStyles[link?.type] ?? []
  return style[prop] || linkStyles.default[prop] || null
}

export function nodeProp(node, prop) {
  const style = nodeStyles[node?.type] ?? []
  return style[prop] || nodeStyles.default[prop] || null
}
