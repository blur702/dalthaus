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
          'insertdatetime', 'media', 'table', 'wordcount', 'pagebreak'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'pagebreak | removeformat',
        pagebreak_separator: '<!-- pagebreak -->',
        pagebreak_split_block: true,
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } ' +
          // Style for ALL possible pagebreak implementations
          '.mce-pagebreak, div.mce-pagebreak, img.mce-pagebreak, div[data-mce-pagebreak], hr.mce-pagebreak { ' +
          'display: block !important; clear: both; width: 100% !important; ' +
          'height: 40px !important; margin: 20px 0 !important; padding: 0 !important; ' +
          'border: none !important; background: transparent !important; ' +
          'position: relative !important; overflow: visible !important; ' +
          'background-image: repeating-linear-gradient(90deg, #999 0, #999 10px, transparent 10px, transparent 20px) !important; ' +
          'background-size: 100% 2px !important; background-position: center center !important; ' +
          'background-repeat: no-repeat !important; } ' +
          // Add visible label
          '.mce-pagebreak::before, div.mce-pagebreak::before, img.mce-pagebreak::before, div[data-mce-pagebreak]::before, hr.mce-pagebreak::before { ' +
          'content: "PAGE BREAK" !important; position: absolute !important; ' +
          'left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; ' +
          'background: white !important; padding: 5px 20px !important; ' +
          'color: #666 !important; font-size: 12px !important; font-weight: bold !important; ' +
          'border: 2px solid #999 !important; border-radius: 4px !important; ' +
          'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; ' +
          'z-index: 1 !important; } ' +
          // Hover effect
          '.mce-pagebreak:hover, div.mce-pagebreak:hover, img.mce-pagebreak:hover, div[data-mce-pagebreak]:hover, hr.mce-pagebreak:hover { ' +
          'background-image: repeating-linear-gradient(90deg, #0066cc 0, #0066cc 10px, transparent 10px, transparent 20px) !important; } ' +
          '.mce-pagebreak:hover::before, div.mce-pagebreak:hover::before, img.mce-pagebreak:hover::before, div[data-mce-pagebreak]:hover::before, hr.mce-pagebreak:hover::before { ' +
          'background: #e3f2fd !important; color: #0066cc !important; border-color: #0066cc !important; }',
        // Visual representation in editor
        visual: true,
        visualblocks_default_state: false,
        // Self-hosted configuration
        base_url: '/tinymce',
        suffix: '.min',
        // Extended valid elements to include our custom pagebreak
        extended_valid_elements: 'div[class|style|contenteditable|data-mce-resize],p',
        valid_children: '+body[div],+div[div]',
        // Allow our custom styles
        valid_styles: {
          '*': 'display,width,height,margin,position,user-select,background,left,right,top,transform,padding,border,border-radius,color,font-size,font-weight,font-family'
        },
        // Setup function for pagebreak handling
        setup: (editor) => {
          
          // When editor initializes
          editor.on('init', () => {
            // Add enhanced styles for the pagebreak plugin
            const style = editor.dom.create('style');
            style.innerHTML = `
              /* Style the TinyMCE pagebreak plugin element */
              .mce-pagebreak {
                display: block !important;
                width: 100% !important;
                height: 5px !important;
                margin: 20px 0 !important;
                background: repeating-linear-gradient(
                  90deg,
                  #999 0,
                  #999 10px,
                  transparent 10px,
                  transparent 20px
                ) !important;
                border: none !important;
                clear: both !important;
                cursor: default !important;
                page-break-before: always !important;
              }
              
              /* Print styles */
              @media print {
                .mce-pagebreak {
                  display: block !important;
                  page-break-before: always !important;
                  page-break-after: auto !important;
                  break-before: page !important;
                  height: 0 !important;
                  margin: 0 !important;
                  border: none !important;
                  background: none !important;
                }
              }
            `;
            editor.getDoc().getElementsByTagName('head')[0].appendChild(style);
          });
        }
      }}
    />
  );
};

export default RichTextEditor;