declare module '@nuxt/content/server' {
  import type { H3Event } from 'h3'
  import type { CollectionQueryBuilder, Collections } from '@nuxt/content'

  export const queryCollection: <T extends keyof Collections>(
    event: H3Event,
    collection: T,
  ) => CollectionQueryBuilder<Collections[T]>
}

export {}
