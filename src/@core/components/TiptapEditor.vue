<script setup>
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { StarterKit } from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import {
  EditorContent,
  useEditor,
} from '@tiptap/vue-3'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: [
        'heading',
        'paragraph',
      ],
    }),
    Placeholder.configure({ placeholder: props.placeholder ?? 'Escribe algo aquí...' }),
    Underline,
    Highlight,
  ],
  onUpdate() {
    if (!editor.value)
      return
    emit('update:modelValue', editor.value.getHTML())
  },
})

watch(() => props.modelValue, () => {
  const isSame = editor.value?.getHTML() === props.modelValue
  if (isSame)
    return
  editor.value?.commands.setContent(props.modelValue)
})
</script>

<template>
  <div class="border rounded py-2 px-4">
    <div
      v-if="editor"
      class="d-flex gap-3 pa-2 flex-wrap align-center"
    >
      <VIcon
        class="font-weight-medium"
        icon="tabler-bold"
        :color="editor.isActive('bold') ? 'primary' : 'default'"
        size="20"
        @click="editor.chain().focus().toggleBold().run()"
      />

      <VIcon
        :color="editor.isActive('underline') ? 'primary' : 'default'"
        icon="tabler-underline"
        size="20"
        @click="editor.commands.toggleUnderline()"
      />

      <VIcon
        :color="editor.isActive('italic') ? 'primary' : 'default'"
        icon="tabler-italic"
        size="20"
        @click="editor.chain().focus().toggleItalic().run()"
      />

      <VIcon
        icon="tabler-strikethrough"
        size="20"
        :color="editor.isActive('strike') ? 'primary' : 'default'"
        @click="editor.chain().focus().toggleStrike().run()"
      />

      <VIcon
        :color="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
        icon="tabler-align-left"
        size="20"
        @click="editor.chain().focus().setTextAlign('left').run()"
      />

      <VIcon
        icon="tabler-align-center"
        size="20"
        :color="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
        @click="editor.chain().focus().setTextAlign('center').run()"
      />

      <VIcon
        :color="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
        icon="tabler-align-right"
        size="20"
        @click="editor.chain().focus().setTextAlign('right').run()"
      />

      <VIcon
        :color="editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
        icon="tabler-align-justified"
        size="20"
        @click="editor.chain().focus().setTextAlign('justify').run()"
      />
      <VIcon :color="editor.isActive('bulletList') ? 'primary' : 'default'" 
      icon="tabler-list" size="20"
      @click="editor.chain().focus().toggleBulletList().run()" />

      <VIcon :color="editor.isActive('orderedList') ? 'primary' : 'default'" 
      icon="tabler-list-numbers" size="20"
      @click="editor.chain().focus().toggleOrderedList().run()" />

      <VIcon :color="editor.isActive('highlight') ? 'primary' : 'default'"
      icon="tabler-highlight  " size="20"
      @click="editor.chain().focus().toggleHighlight().run()" 
      />
    </div>

    <VDivider />

    <EditorContent
      ref="editorRef"
      :editor="editor"
    />
  </div>
</template>

<style lang="scss">
.ProseMirror {
  padding: 0.5rem;
  min-block-size: 15vh;
  
  > * + * {
    margin-block-start: 0.75em;
  }

  outline: none;
  overflow-y: auto;
  padding-inline: 0.5rem;

  ul,
  ol {
    padding-block: 0;
    padding-inline: 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    border-radius: 0.5rem;
    background: #0d0d0d;
    color: #fff;
    font-family: JetBrainsMono, monospace;
    padding-block: 0.75rem;
    padding-inline: 1rem;

    code {
      padding: 0;
      background: none;
      color: inherit;
      font-size: 0.8rem;
    }
  }

  img {
    block-size: auto;
    max-inline-size: 100%;
  }

  blockquote {
    border-inline-start: 2px solid rgba(#0d0d0d, 0.1);
    padding-inline-start: 1rem;
  }

  hr {
    border: none;
    border-block-start: 2px solid rgba(#0d0d0d, 0.1);
    margin-block: 2rem;
    margin-inline: 0;
  }

  p {
    margin-block-end: 0;
  }

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: inline-start;
    pointer-events: none;
  }
}

.is-active {
    border-color: rgba(var(--v-theme-primary), var(--v-border-opacity)) !important;
    background-color: rgba(var(--v-theme-primary), var(--v-activated-opacity));
    color: rgb(var(--v-theme-primary));
  }

  .ProseMirror-focused{
    outline: none !important;
  }
</style>
