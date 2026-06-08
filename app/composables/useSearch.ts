import MiniSearch from 'minisearch'
import { ref, watch } from 'vue'

export type SearchDocument = {
  path: string
  title: string
  description: string
  category: string
  date: string
  tags: string[]
  body?: string
}

let miniSearch: MiniSearch<SearchDocument> | null = null
let loadPromise: Promise<MiniSearch<SearchDocument>> | null = null

async function getSearchIndex() {
  if (miniSearch) return miniSearch
  if (!loadPromise) {
    const baseURL = useRuntimeConfig().app.baseURL || '/'
    const searchIndexUrl = `${baseURL.replace(/\/$/, '')}/search.json` || '/search.json'
    loadPromise = $fetch<SearchDocument[]>(searchIndexUrl).then((documents) => {
      const index = new MiniSearch<SearchDocument>({
        fields: ['title', 'description', 'body', 'category', 'tags'],
        storeFields: ['path', 'title', 'description', 'category', 'date', 'tags'],
        searchOptions: {
          boost: { title: 3, description: 2, tags: 2 },
          fuzzy: 0.2,
          prefix: true,
        },
      })
      index.addAll(documents)
      miniSearch = index
      return index
    })
  }
  return loadPromise
}

export async function searchPosts(query: string, limit = 20) {
  const trimmed = query.trim()
  if (!trimmed) return [] as SearchDocument[]

  const index = await getSearchIndex()
  return index.search(trimmed, { combineWith: 'AND' }).slice(0, limit) as unknown as SearchDocument[]
}

export function useSearch() {
  const search = ref('')
  const results = ref<SearchDocument[]>([])
  const isSearching = ref(false)

  watch(search, async (query) => {
    isSearching.value = true
    try {
      results.value = await searchPosts(query)
    } finally {
      isSearching.value = false
    }
  })

  return {
    search,
    results,
    isSearching,
  }
}
