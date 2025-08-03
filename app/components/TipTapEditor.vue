<template>
  <div>
    <div v-if="editor" class="mb-2 d-flex flex-wrap gap-2">
      <v-btn
        size="small"
        icon="mdi-format-bold"
        :color="editor.isActive('bold') ? 'primary' : undefined"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        @click="editor.chain().focus().toggleBold().run()"
        title="Bold"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-italic"
        :color="editor.isActive('italic') ? 'primary' : undefined"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Italic"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-strikethrough-variant"
        :color="editor.isActive('strike') ? 'primary' : undefined"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        @click="editor.chain().focus().toggleStrike().run()"
        title="Strike"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-code-tags"
        :color="editor.isActive('code') ? 'primary' : undefined"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        @click="editor.chain().focus().toggleCode().run()"
        title="Code"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-clear"
        @click="editor.chain().focus().unsetAllMarks().run()"
        title="Clear Marks"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-paragraph"
        :color="editor.isActive('paragraph') ? 'primary' : undefined"
        @click="editor.chain().focus().setParagraph().run()"
        title="Paragraph"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-header-1"
        :color="
          editor.isActive('heading', { level: 1 }) ? 'primary' : undefined
        "
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        title="H1"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-header-2"
        :color="
          editor.isActive('heading', { level: 2 }) ? 'primary' : undefined
        "
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        title="H2"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-header-3"
        :color="
          editor.isActive('heading', { level: 3 }) ? 'primary' : undefined
        "
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        title="H3"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-list-bulleted"
        :color="editor.isActive('bulletList') ? 'primary' : undefined"
        @click="editor.chain().focus().toggleBulletList().run()"
        title="Bullet List"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-list-numbered"
        :color="editor.isActive('orderedList') ? 'primary' : undefined"
        @click="editor.chain().focus().toggleOrderedList().run()"
        title="Ordered List"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-code-block-tags"
        :color="editor.isActive('codeBlock') ? 'primary' : undefined"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        title="Code Block"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-format-quote-close"
        :color="editor.isActive('blockquote') ? 'primary' : undefined"
        @click="editor.chain().focus().toggleBlockquote().run()"
        title="Blockquote"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-minus"
        @click="editor.chain().focus().setHorizontalRule().run()"
        title="Horizontal Rule"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-keyboard-return"
        @click="editor.chain().focus().setHardBreak().run()"
        title="Hard Break"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-undo"
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()"
        title="Undo"
        flat
      />
      <v-btn
        size="small"
        icon="mdi-redo"
        :disabled="!editor.can().chain().focus().redo().run()"
        @click="editor.chain().focus().redo().run()"
        title="Redo"
        flat
      />
    </div>
    <TiptapEditorContent
      :editor="editor"
      class="border border-black rounded px-10 py-6"
      style="min-height: 180px"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue ?? "<p>Start writing...</p>",
  extensions: [TiptapStarterKit],
  onUpdate({ editor }) {
    emit("update:modelValue", editor.getHTML());
  },
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (unref(editor) && newVal && newVal !== unref(editor).getHTML()) {
      unref(editor).commands.setContent(newVal, false);
    }
  }
);
onBeforeUnmount(() => {
  unref(editor).destroy();
});
</script>
