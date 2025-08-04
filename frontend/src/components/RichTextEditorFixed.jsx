import React, { useRef, useEffect, useMemo } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import useTinymceConfig from '../hooks/useTinymceConfig';

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

const RichTextEditor = ({ 
  value, 
  onChange, 
  height = 500, 
  editorConfig,
  profileId = null,
  contentType = null,
  disabled = false,
  placeholder = ''
}) => {
  const editorRef = useRef(null);
  
  // Fetch configuration based on profile or content type
  const { config, loading, error, isUsingFallback } = useTinymceConfig(profileId, {
    contentType,
    useCache: true
  });

  const handleEditorChange = (content, editor) => {
    onChange(content);
  };

  // Create upload handler function
  const createImageUploadHandler = () => {
    return (blobInfo, progress) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', blobInfo.blob(), blobInfo.filename());

        const token = localStorage.getItem('token');
        
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            progress(e.loaded / e.total * 100);
          }
        };
        
        xhr.onload = () => {
          if (xhr.status === 403) {
            reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
            return;
          }
          
          if (xhr.status < 200 || xhr.status >= 300) {
            reject('HTTP Error: ' + xhr.status);
            return;
          }
          
          try {
            const json = JSON.parse(xhr.responseText);
            
            if (!json) {
              reject('Invalid JSON response');
              return;
            }
            
            const location = json.url || json.imageUrl || json.location;
            
            if (!location) {
              reject('No valid location in response');
            } else {
              resolve(location);
            }
          } catch (e) {
            reject('Invalid JSON: ' + xhr.responseText);
          }
        };
        
        xhr.onerror = () => {
          reject('XMLHttpRequest error');
        };
        
        xhr.open('POST', '/api/upload/image');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
      });
    };
  };

  // Default configuration
  const defaultConfig = {
    license_key: 'gpl',
    height: height,
    menubar: true,
    skin: false,
    content_css: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'wordcount', 'pagebreak'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'link image media | pagebreak | removeformat | code',
    pagebreak_separator: '<!-- pagebreak -->',
    pagebreak_split_block: true,
    relative_urls: false,
    remove_script_host: false,
    convert_urls: false,
    document_base_url: window.location.origin + '/',
    base_url: '/tinymce',
    suffix: '.min',
    automatic_uploads: true,
    images_reuse_filename: true,
    images_upload_handler: createImageUploadHandler(),
    file_picker_types: 'image',
    file_picker_callback: (callback, value, meta) => {
      if (meta.filetype === 'image') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        
        input.onchange = function() {
          const file = this.files[0];
          
          if (!file) {
            return;
          }
          
          const reader = new FileReader();
          reader.onload = function() {
            try {
              const id = 'blobid' + (new Date()).getTime();
              const blobCache = tinymce.activeEditor.editorUpload.blobCache;
              const base64 = reader.result.split(',')[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              
              callback(blobInfo.blobUri(), { title: file.name });
            } catch (e) {
              console.error('File picker error:', e);
            }
          };
          
          reader.onerror = function() {
            console.error('Failed to read file');
          };
          
          reader.readAsDataURL(file);
        };
        
        input.click();
      }
    },
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } ' +
      'img { max-width: 100%; height: auto; display: block; margin: 10px 0; } ' +
      '.mce-pagebreak, div.mce-pagebreak, img.mce-pagebreak { ' +
      'display: block !important; clear: both; width: 100% !important; ' +
      'height: 40px !important; margin: 20px 0 !important; padding: 0 !important; ' +
      'page-break-before: always; border: 0; ' +
      'background: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) ' +
      'repeat-x center center; border-top: 1px dashed #ccc !important; } ' +
      'div.pagebreak { ' +
      'page-break-after: always; clear: both; display: block !important; ' +
      'width: 100% !important; height: 40px !important; margin: 20px 0 !important; ' +
      'padding: 0 !important; background: repeating-linear-gradient(90deg, #999 0, #999 10px, transparent 10px, transparent 20px); ' +
      'border: 0 !important; position: relative !important; ' +
      'user-select: none !important; } ' +
      'div.pagebreak::before { content: "Page Break"; position: absolute; ' +
      'left: 50%; top: 50%; transform: translate(-50%, -50%); ' +
      'background: white; padding: 0 10px; color: #666; font-size: 12px; }',
    valid_elements: '*[*]',
    extended_valid_elements: 'div[class|style|data-mce-pagebreak|data-lightbox|data-has-lightbox]',
    valid_styles: {
      '*': 'display,width,height,margin,position,user-select,background,left,right,top,transform,padding,border,border-radius,color,font-size,font-weight,font-family'
    },
    setup: (editor) => {
      editor.on('init', () => {
        // Add pagebreak styles
        const style = editor.dom.create('style');
        style.innerHTML = `
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
            );
            border: 0 !important;
            page-break-before: always !important;
            position: relative !important;
          }
          
          .mce-pagebreak::before {
            content: "Page Break";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2px 8px;
            color: #666;
            font-size: 11px;
            border: 1px solid #999;
            border-radius: 3px;
          }
        `;
        editor.dom.doc.head.appendChild(style);
      });
      
      editor.on('GetContent', (e) => {
        // Ensure pagebreak format is preserved
        e.content = e.content.replace(
          /<img[^>]*class="mce-pagebreak"[^>]*>/gi,
          '<!-- pagebreak -->'
        );
      });
      
      editor.on('SetContent', (e) => {
        // Handle incoming content with pagebreaks
        if (e.content && e.content.includes('<!-- pagebreak -->')) {
          console.log('Content contains pagebreaks');
        }
      });
    }
  };

  // Merge configurations
  const mergedConfig = useMemo(() => {
    if (loading) return defaultConfig;
    
    if (editorConfig) {
      return { ...defaultConfig, ...editorConfig };
    }
    
    if (config && !isUsingFallback) {
      // Use fetched config but keep critical settings
      return {
        ...defaultConfig,
        ...config,
        base_url: '/tinymce',
        suffix: '.min',
        skin: false,
        content_css: false,
        images_upload_handler: createImageUploadHandler(),
      };
    }
    
    return defaultConfig;
  }, [config, editorConfig, loading, isUsingFallback, height]);

  if (loading) {
    return (
      <div style={{ 
        height: height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9'
      }}>
        Loading editor...
      </div>
    );
  }

  if (error && !isUsingFallback) {
    console.error('TinyMCE config error:', error);
  }

  return (
    <div className="rich-text-editor">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={value}
        value={value}
        onEditorChange={handleEditorChange}
        init={mergedConfig}
        disabled={disabled}
      />
    </div>
  );
};

export default RichTextEditor;