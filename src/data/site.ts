import { getCollection } from 'astro:content'

export const profile = {
  name: 'yumestk',
  alias: 'Kirari',
  role: 'Backend Developer · AI Agent Builder',
  intro: 'I’m a computing undergraduate building backend systems and AI agents. I write about what I learn from shipping projects, reading code, and contributing upstream.',
  interests: 'Off the clock, I’m usually into visual novels, J-pop, or drawing.',
}

export const socials = {
  github: 'https://github.com/yumestk',
  x: 'https://x.com/yumestk',
  email: '2231754412@qq.com',
  steam: 'https://steamcommunity.com/profiles/76561199706041351',
}

export const projects = [
  {
    id: 'vediomind',
    name: 'VedioMind',
    type: 'Video learning agent',
    summary: 'Learn from long videos with chapter summaries, timestamped answers, and notes grounded in the source.',
    detail: 'I’m exploring how a learning agent can stay grounded in transcripts and visual evidence. VedioMind indexes time-aligned excerpts so answers and notes can point back to the relevant moment. A persistent job state lets video analysis resume after an interrupted step.',
    stack: ['Spring Boot', 'RocketMQ', 'Qdrant'],
    url: 'https://github.com/yumestk/VedioMind',
  },
  {
    id: 'campusgo',
    name: 'CampusGo',
    type: 'Distributed systems practice',
    summary: 'A campus errands platform for exploring task lifecycles, reliable messaging, and service boundaries in Go.',
    detail: 'The platform models posting, claiming and settling campus errands. I use it to study explicit SQL transactions, idempotent consumers, and how scheduled events and database scans cooperate to recover overdue tasks.',
    stack: ['Go', 'MySQL', 'RocketMQ'],
    url: 'https://github.com/yumestk/CampusGo',
  },
] as const

export const contributions = [
  {
    repo: 'Apache dubbo-go',
    title: 'Propagate OpenAPI generator parameter errors',
    number: 3776,
    stack: ['Go', 'OpenAPI'],
    url: 'https://github.com/apache/dubbo-go/pull/3776',
  },
  {
    repo: 'Getty',
    title: 'Exclude reset sessions from the client pool',
    number: 163,
    stack: ['Go', 'Transport'],
    url: 'https://github.com/AlexStocks/getty/pull/163',
  },
  {
    repo: 'Getty',
    title: 'Avoid a self-wait during startup shutdown and clarify task pool limits',
    number: 168,
    stack: ['Go', 'Concurrency'],
    url: 'https://github.com/AlexStocks/getty/pull/168',
  },
]

type AcgnKind = 'Visual Novel' | 'Game' | 'Anime' | 'Manga' | 'Light Novel'
interface CollectionCover {
  title: string
  cover?: string
  lang?: string
}

interface AcgnItem extends CollectionCover {
  kind: AcgnKind
  rating?: number
}

interface MusicAlbum extends CollectionCover {
  artist: string
  year: number
}

export type CollectionItem = AcgnItem | MusicAlbum

export const acgnCollection: AcgnItem[] = [
  {
    title: 'WHITE ALBUM 2',
    kind: 'Visual Novel',
    rating: 9.9,
    // AQUAPLUS PlayStation 3 package: https://aquaplus.jp/wa2/product.html
    cover: '/images/collection/white-album-2.jpg',
  },
  {
    title: 'Ever17',
    kind: 'Visual Novel',
    rating: 9.7,
    // Hirameki PC box art: https://en.wikipedia.org/wiki/File:Ever17_Game_Box_Art_by_Hirameki.jpg
    cover: '/images/collection/ever17.jpg',
  },
  {
    title: '素晴らしき日々',
    kind: 'Visual Novel',
    rating: 9.3,
    lang: 'ja',
    // Frontwing library cover: https://store.steampowered.com/app/658620/
    cover: '/images/collection/subahibi.jpg',
  },
  {
    title: 'Remember11',
    kind: 'Visual Novel',
    rating: 9.1,
    // KID package artwork: https://en.wikipedia.org/wiki/File:Remember_11_cover.jpg
    cover: '/images/collection/remember11.jpg',
  },
]

export const musicCollection: MusicAlbum[] = [
  {
    title: '無罪モラトリアム',
    artist: '椎名林檎 (Sheena Ringo)',
    year: 1999,
    lang: 'ja',
    // Original CD cover: https://www.universal-music.co.jp/sheena-ringo/products/toct-24065/
    cover: '/images/collection/muzai-moratorium.jpg',
  },
]

export function pathTo(path: string) {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path
}

export async function getPosts() {
  const posts = await getCollection('writing')
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Shanghai',
  }).format(date)
}
