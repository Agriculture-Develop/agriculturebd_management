import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useNewsStore = defineStore('news', () => {
  type InewsList = {
    total: number
    list: {
      id?: number | undefined
      title?: string | undefined
      category_id?: number | undefined
      category?: string | undefined
      abstract?: string | undefined
      keyword?: string[] | undefined
      source?: string | undefined
      content?: string | undefined
      cover_url?: string | undefined
      files_url?: string[] | undefined
      status?: string | undefined
      author?: string | undefined
      type?: string | undefined
      created_at?: string | undefined
      updated_at?: string | undefined
    }[]
  }
  type Inew = {
    list: {
      id?: number | undefined
      title?: string | undefined
      category_id?: number | undefined
      category?: string | undefined
      abstract?: string | undefined
      keyword?: string[] | undefined
      source?: string | undefined
      content?: string | undefined
      cover_url?: string | undefined
      files_url?: string[] | undefined
      status?: string | undefined
      author?: string | undefined
      type?: string | undefined
      created_at?: string | undefined
      updated_at?: string | undefined
    }[]
  }
  const newsList = ref<InewsList>()
  const news = ref<Inew>()
  const newsId = ref<string>()
  const getNewsList = async () => {
    const res = await Apis.news.get_admin_news_list({ params: {} })
    newsList.value = res.data
  }
  const getNewsID = async (id: string) => {
    const res = await Apis.news.get_admin_news_id({
      pathParams: { id },
      cache: 'no-cache',
      cacheFor: 0,
    })
    return res.data
  }

  return {
    newsList,
    news,
    getNewsList,
    getNewsID,
    newsId,
  }
})
