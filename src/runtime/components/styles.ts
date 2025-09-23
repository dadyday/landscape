




export const nodeStyles:Partial<any> = {
  'default': {
    label: 'Fragment',
    icon: '❓',
    fill: '#F5F5F5',
    stroke: '#757575',
    titleColor: '#424242'
  },
  'server': {
    label: 'Server',
    icon: '📁',
    fill: '#E3F2FD80',
    stroke: '#1976D2',
    titleColor: '#1565C0'
  },
  'modul': {
    label: 'Modul',
    icon: '⚙️',
    fill: '#E8EAF6',
    stroke: '#3F51B5',
    titleColor: '#303F9F'
  },
  'api': {
    label: 'API',
    icon: '🔗',
    fill: '#E8F5E8',
    stroke: '#388E3C',
    titleColor: '#2E7D32'
  },
  'app': {
    label: 'Application',
    icon: '📱',
    fill: '#FFF3E0',
    stroke: '#F57C00',
    titleColor: '#EF6C00'
  },
  'cron': {
    label: 'Cronjob',
    icon: '⏰',
    fill: '#FCE4EC',
    stroke: '#C2185B',
    titleColor: '#AD1457'
  },
  'daemon': {
    label: 'Daemon',
    icon: '👹',
    fill: '#F1F8E9',
    stroke: '#689F38',
    titleColor: '#558B2F'
  },
  'script': {
    label: 'Script',
    icon: 'mdi:script-text-play-outline #00695C', //'📜',
    fill: '#E0F2F1',
    stroke: '#00695C',
    titleColor: '#00838F'
  },
  'db': {
    label: 'Database',
    icon: 'mdi:database orange',
    fill: '#fec',
    stroke: '#fc0',
    titleColor: '#fc0'
  },
  'file': {
    label: 'Filestore',
    icon: '📁',
    fill: '#fcc',
    stroke: '#f88',
    titleColor: '#f88'
  },
};

// Zentrale Datenstruktur für Link-Eigenschaften
export const linkStyles: Partial<any> = {
  'default': {
    label: 'Verbindung',
    icon: '➡️',
    color: '#000',
    toArrow: 'Standard',
  },

  'request': {
    label: 'Request',
    icon: '➡️',
    color: '#2196F3',
    toArrow: 'Standard',
  },
  'control': {
    label: 'Control',
    icon: '🎮',
    color: '#9C27B0',
    toArrow: 'Triangle',
    strokeDashArray: [4]
  },
  'notify': {
    label: 'Message',
    icon: '⚡',
    color: '#FF9800',
    toArrow: 'OpenTriangle',
  },
  'integration': {
    label: 'Integration',
    icon: '🔗',
    color: '#888',
    toArrow: 'OpenTriangle',
    strokeDashArray: [8]
  },
  'dependency': {
    label: 'Include',
    icon: '🔗',
    color: '#E91E63',
    toArrow: 'Circle',
    fromArrow: 'BackwardSemiCircle',
  },
};

export function linkProp(link: go.ObjectData, prop: string) {
  const style = linkStyles[link?.type] ?? []
  return style?.[prop] || linkStyles?.default?.[prop] || null
}

export function nodeProp(node: go.ObjectData, prop: string) {
  const style = nodeStyles[node?.type] ?? []
  return style?.[prop] || nodeStyles.default?.[prop] || null
}
