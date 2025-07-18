import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Import TinyMCE so we can use it locally
import tinymce from 'tinymce/tinymce';

// Import TinyMCE themes and plugins
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

// Import plugins
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/pagebreak';

// Import TinyMCE icons
import 'tinymce/icons/default';

// Import skin
import 'tinymce/skins/ui/oxide/skin.css';

// Import content CSS
import 'tinymce/skins/content/default/content.css';

const RichTextEditor = ({ value, onChange, height = 500 }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize TinyMCE
    return () => {
      // Cleanup on unmount
      if (editorRef.current) {
        tinymce.remove(editorRef.current);
      }
    };
  }, []);

  const handleEditorChange = (content, editor) => {
    onChange(content);
  };

  return (
    <Editor
      tinymceScriptSrc={undefined} // Use local TinyMCE instead of CDN
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={handleEditorChange}
      init={{
        height: height,
        menubar: true,
        skin: false, // Disable skin loading since we import it
        content_css: false, // Disable content CSS loading since we import it
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'pagebreak'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'pagebreak | removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } ' +
          // Style for TinyMCE's default pagebreak
          'div.mce-pagebreak, div[data-mce-type="pagebreak"] { ' +
          'display: block !important; clear: both; width: 100%; height: 5px; ' +
          'border: none; border-top: 2px dashed #999; margin: 20px 0; ' +
          'page-break-before: always; position: relative; } ' +
          // Add label to pagebreak
          'div.mce-pagebreak::after, div[data-mce-type="pagebreak"]::after { ' +
          'content: "PAGE BREAK"; position: absolute; left: 50%; top: -10px; ' +
          'transform: translateX(-50%); background: #f8f8f8; padding: 2px 15px; ' +
          'color: #666; font-size: 11px; font-weight: bold; border: 1px solid #ddd; ' +
          'border-radius: 3px; font-family: sans-serif; } ' +
          // Make pagebreak more visible on hover
          'div.mce-pagebreak:hover, div[data-mce-type="pagebreak"]:hover { ' +
          'border-top-color: #0066cc; cursor: not-allowed; } ' +
          'div.mce-pagebreak:hover::after, div[data-mce-type="pagebreak"]:hover::after { ' +
          'background: #e3f2fd; color: #0066cc; border-color: #0066cc; }',
        pagebreak_separator: '<!-- pagebreak -->',
        pagebreak_split_block: true,
        // Visual representation of page breaks in editor
        visual: true,
        visualblocks_default_state: false,
        // Self-hosted configuration
        base_url: '/tinymce',
        suffix: '.min',
        // Make pagebreaks visible and non-editable
        noneditable_noneditable_class: 'mce-pagebreak',
        // Extended valid elements to include pagebreak
        extended_valid_elements: 'div[class|data-mce-type|contenteditable]'
      }}
    />
  );
};

export default RichTextEditor;