<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useEmail } from '@/views/apps/email/useEmail'

const props = defineProps({
    email: {
        type: null,
        required: true,
    },
    emailMeta: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits([
    'refresh',
    'navigated',
    'close',
    'trash',
    'unread',
    'read',
    'star',
    'unstar',
])

const { updateEmailLabels } = useEmail()
const { labels, resolveLabelColor, emailMoveToFolderActions, shallShowMoveToActionFor, moveSelectedEmailTo } = useEmail()

const handleMoveMailsTo = action => {
    moveSelectedEmailTo(action, [props.email.id])
    emit('refresh')
    emit('close')
}

const updateMailLabel = async label => {
    await updateEmailLabels([props.email.id], label)
    emit('refresh')
}
</script>

<template>
    <VNavigationDrawer
    temporary
    :model-value="!!props.email"
    location="right"
    :scrim="false"
    floating
    class="email-view"
    >
        <template v-if="props.email">
            hol
        </template>
    </VNavigationDrawer>
</template>