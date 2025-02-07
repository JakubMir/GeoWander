import {defineStore} from 'pinia'
import {ref} from 'vue'
import {Country} from '@/model/Country'
import {api} from '@/api'
import router from "@/router"

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCountries = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('all')
      countries.value = response.data
    } catch (err) {
      await router.replace({name: "notfound"})
      console.error(error.value, err)
    } finally {
      isLoading.value = false
    }
  }

  return {countries, isLoading, error, fetchCountries}
})
