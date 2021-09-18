import Paragraph from 'editorjs-paragraph-with-alignment';
import Header from '@editorjs/header';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import NestedList from '@editorjs/nested-list';
import Warning from '@editorjs/warning';
import Underline from '@editorjs/underline';

export default {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+P',
  },
  header: {
    class: Header,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+H',
  },
  Marker: {
    class: Marker,
    shortcut: 'CMD+SHIFT+M',
  },
  inlineCode: {
    class: InlineCode,
    shortcut: 'CMD+SHIFT+C',
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+L',
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+W',
  },
  underline: Underline,
};
