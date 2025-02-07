<script lang="ts" setup>
import {ref, computed, onBeforeMount} from 'vue';
import {useCountriesStore} from '@/store/countries';
import Loading from '@/components/Loading.vue';
import {Country} from "@/model/Country";

const searchText = ref<string>('');
const countriesStore = useCountriesStore();

onBeforeMount(async () => {
  await countriesStore.fetchCountries();
});

const getFlagSrc = computed(() => (country: Country) => {
  return country.flags?.svg || '';
});

const filteredCountries = computed(() => {
  if (!searchText.value) {
    return countriesStore.countries;
  } else {
    const lowerCaseSearch = searchText.value.toLowerCase();
    return countriesStore.countries.filter((country) =>
      country.name.common.toLowerCase().includes(lowerCaseSearch)
    );
  }
});
</script>

<template>
  <v-container>
    <v-lazy>
      <v-row align="start" justify="center">
        <v-col cols="12" md="12">
          <v-card class="pa-5">
            <v-row align="start" justify="center">
              <h1 class="text-center pb-4">Country list</h1>
            </v-row>
            <v-row v-if="countriesStore.isLoading">
              <v-col class="text-center" cols="12">
                <Loading/>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12">
                <v-text-field id="CountryListSearchCountries" v-model="searchText" hide-details label="Search country"
                              variant="outlined"></v-text-field>
              </v-col>
              <v-col
                v-for="country in filteredCountries"
                :key="country.cca3"
                cols="12"
                lg="4"
                md="6"
              >
                <v-card :to="{ name: 'CountryDetail', params: { countryCode: country.cca3 } }" class="pa-2 fill-height d-flex align-center justify-center"
                        color="blue-grey-lighten-5">
                  <v-row align="center">
                    <v-col class="pr-0" cols="3">
                      <v-img :aspect-ratio="1" :src="getFlagSrc(country)" class="flag-image">
                        <template v-slot:placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular
                              color="grey-lighten-4"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                        </template>
                        <template v-slot:error>
                          <v-img :aspect-ratio="1" src="@/assets/logo.png"/>
                        </template>
                      </v-img>
                    </v-col>
                    <v-col cols="6">
                      <v-card-title class="pb-0 text-wrap">{{ country.name.common }}</v-card-title>
                      <v-card-subtitle>{{ country.region }}</v-card-subtitle>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col v-if="filteredCountries.length === 0 && !countriesStore.isLoading" class="text-center" cols="12">
                <h1 class="text-red">No countries were found.</h1>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-lazy>
  </v-container>
</template>

<style>

</style>
