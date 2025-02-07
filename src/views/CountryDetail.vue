<script lang="ts" setup>
import {ref, onMounted, computed} from 'vue'
import {useCountryDetailsStore} from "@/store/countryDetail"
import Loading from "@/components/Loading.vue"
import {Country} from "@/model/Country"
import Error from "@/components/Error.vue";

const countryDetailsStore = useCountryDetailsStore()

const countryDetail = ref<Country | null>(null)


onMounted(async () => {
  try {
    await countryDetailsStore.fetchCountryDetail()
    countryDetail.value = countryDetailsStore.countryDetail
  } catch (err) {
    console.error(err)
  }
})

const flagSrc = computed(() => {
  return countryDetail.value?.flags.svg || ''
})

const capital = computed(() => {
  return countryDetail.value?.capital ? countryDetail.value.capital[0] : 'N/A'
})

const getLanguages = computed(() => {
  if (!countryDetail.value?.languages) return ''
  return Object.values(countryDetail.value.languages).join(', ')
})

const getCurrency = computed(() => {
  if (!countryDetail.value?.currencies || Object.keys(countryDetail.value.currencies).length === 0) return ''

  const currencyCode = Object.keys(countryDetail.value.currencies)[0]
  const currencyInfo = countryDetail.value.currencies[currencyCode]

  return `${currencyInfo.name} - ${currencyInfo.symbol}`
})
</script>

<template>
  <v-container>
    <Error v-if="countryDetailsStore.error" :message="countryDetailsStore.error"/>
    <v-row v-else justify="center">
      <v-col cols="12">
        <v-card class="pa-10">
          <v-row v-if="countryDetailsStore.isLoading">
            <v-col class="text-center" cols="12">
              <Loading/>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col class="mx-auto align-center justify-center" cols="12" md="6">
              <v-img :src="flagSrc"></v-img>
            </v-col>
            <v-col class="pt-0" cols="12" md="6">
              <v-card-title class="text-h4 font-weight-bold text-wrap pt-0">{{
                  countryDetail?.name.common
                }}
              </v-card-title>
              <v-card-subtitle class=" mt-3 text-h5 text-wrap">Population: {{
                  countryDetail?.population
                }}
              </v-card-subtitle>
              <v-card-text class="text-h6 font-weight-regular">
                <p><strong>Region:</strong> {{ countryDetail?.region }}</p>
                <p><strong>Subregion:</strong> {{ countryDetail?.subregion }}</p>
                <p><strong>Capital:</strong> {{ capital }}</p>
                <p><strong>Area:</strong> {{ countryDetail?.area }} km²</p>
                <p><strong>Languages:</strong> {{ getLanguages }}</p>
                <p><strong>Currencies:</strong> {{ getCurrency }}</p>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
