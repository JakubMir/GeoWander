import {defineStore} from "pinia"
import {api} from "@/api"
import {ref} from "vue"
import {useRoute} from "vue-router"
import router from "@/router"
import {Country} from "@/model/Country"

export const useCountryDetailsStore = defineStore('country_details', () => {
  const countryDetail = ref<Country | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCountryDetail = async () => {
    const route = useRoute()
    const countryCode = route.params.countryCode as string
    isLoading.value = true
    error.value = null
    console.log(`Fetching details for country code: ${countryCode}`)
    try {
      const response = await api.get(`alpha/${countryCode}`)
      if (response.data && response.data.length > 0) {
        countryDetail.value = response.data[0]
      } else {
        await router.replace({name: "notfound"})
        console.error(error.value)
      }
    } catch (err) {
      error.value = "Error during loading country"
      throw new Error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  return {countryDetail: countryDetail, isLoading, error, fetchCountryDetail}
})
