<script setup>
const props = defineProps({
  languages: {
    type: Array,
    required: true,
  },
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
})

const { locale } = useI18n({ useScope: 'global' })
</script>

<!-- <template>
  <IconBtn>
    <VIcon
      size="26"
      icon="tabler-language"
    />

   +
    <VMenu
      activator="parent"
      :location="props.location"
      offset="14px"
    >
     
      <VList
        :selected="[locale]"
        color="primary"
        min-width="175px"
      >
        
        <VListItem
          v-for="lang in props.languages"
          :key="lang.i18nLang"
          :value="lang.i18nLang"
          @click="locale = lang.i18nLang"
        >
        
          <VListItemTitle>{{ lang.label }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template> -->
