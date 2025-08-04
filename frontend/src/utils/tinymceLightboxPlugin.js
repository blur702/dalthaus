/**
 * TinyMCE Custom Lightbox Plugin
 * Allows photographers to assign separate lightbox images to content images
 */

export const initLightboxPlugin = (tinymce) => {
  if (!tinymce || !tinymce.PluginManager) {
    console.warn('TinyMCE not fully loaded, skipping lightbox plugin initialization');
    return;
  }
  
  tinymce.PluginManager.add('lightboximage', function(editor) {
    
    // Add button to insert image with lightbox
    editor.ui.registry.addButton('insertwithlightbox', {
      icon: 'gallery',
      tooltip: 'Insert Image with Lightbox',
      onAction: function() {
        openInsertWithLightboxDialog(editor);
      }
    });
    
    // Add button to toolbar with custom icon for existing images
    editor.ui.registry.addButton('lightboximage', {
      text: '🔍',
      tooltip: 'Set Lightbox Image for selected image',
      onAction: function() {
        const selectedNode = editor.selection.getNode();
        
        if (selectedNode && selectedNode.nodeName === 'IMG') {
          openLightboxDialog(editor, selectedNode);
        } else {
          editor.notificationManager.open({
            text: 'Please select an image first, then click this button to set its lightbox version',
            type: 'warning',
            timeout: 5000
          });
        }
      }
    });

    // Add context menu support if available (removed for compatibility)
    // Context menu might not be available in all TinyMCE versions

    // Function to insert image with lightbox
    function openInsertWithLightboxDialog(editor) {
      editor.windowManager.open({
        title: 'Insert Image with Lightbox',
        size: 'medium',
        body: {
          type: 'panel',
          items: [
            {
              type: 'htmlpanel',
              html: `
                <div style="padding: 15px; background: #e3f2fd; border-radius: 5px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 10px 0; color: #1976d2;">📸 Photography Image Upload</h3>
                  <p style="margin: 5px 0; color: #555;">Upload two versions of your image:</p>
                  <ul style="margin: 10px 0 0 20px; color: #666; font-size: 13px;">
                    <li><strong>Display Image:</strong> Optimized for article (800x600 recommended)</li>
                    <li><strong>Lightbox Image:</strong> Full resolution for detailed viewing</li>
                  </ul>
                </div>
              `
            },
            {
              type: 'dropzone',
              name: 'displayImage',
              label: '1. Display Image (shows in article)',
              text: 'Drop your article image here (800x600 recommended)'
            },
            {
              type: 'dropzone', 
              name: 'lightboxImage',
              label: '2. Lightbox Image (full resolution)',
              text: 'Drop your high-resolution image here'
            },
            {
              type: 'input',
              name: 'altText',
              label: 'Alt Text (for accessibility)',
              placeholder: 'Describe this image'
            },
            {
              type: 'htmlpanel',
              html: `
                <div style="background: #fff9c4; padding: 10px; border-radius: 4px; margin-top: 15px;">
                  <p style="margin: 0; color: #f57f17; font-size: 12px;">💡 <strong>Pro Tips:</strong></p>
                  <ul style="margin: 5px 0 0 20px; color: #666; font-size: 11px;">
                    <li>Display image will be shown at 4:3 aspect ratio</li>
                    <li>You can use the same image for both if needed</li>
                    <li>Lightbox opens when visitors click the display image</li>
                  </ul>
                </div>
              `
            }
          ]
        },
        buttons: [
          {
            type: 'cancel',
            text: 'Cancel'
          },
          {
            type: 'submit',
            text: 'Insert Images',
            primary: true
          }
        ],
        onSubmit: function(dialogApi) {
          const data = dialogApi.getData();
          
          if (!data.displayImage || data.displayImage.length === 0) {
            editor.notificationManager.open({
              text: 'Please upload a display image',
              type: 'error'
            });
            return;
          }
          
          // Upload display image first
          const displayFile = data.displayImage[0];
          uploadImage(displayFile).then(displayUrl => {
            // Create image element
            let imgHtml = `<img src="${displayUrl}" alt="${data.altText || ''}"`;
            
            // Upload lightbox image if provided
            if (data.lightboxImage && data.lightboxImage.length > 0) {
              const lightboxFile = data.lightboxImage[0];
              uploadImage(lightboxFile).then(lightboxUrl => {
                imgHtml += ` data-lightbox="${lightboxUrl}" data-has-lightbox="true" class="has-lightbox"`;
                imgHtml += ' />';
                editor.insertContent(imgHtml);
                editor.notificationManager.open({
                  text: 'Images inserted with lightbox!',
                  type: 'success'
                });
              }).catch(err => {
                // Insert without lightbox if upload fails
                imgHtml += ' />';
                editor.insertContent(imgHtml);
                editor.notificationManager.open({
                  text: 'Display image inserted (lightbox upload failed)',
                  type: 'warning'
                });
              });
            } else {
              // Insert without lightbox
              imgHtml += ' />';
              editor.insertContent(imgHtml);
              editor.notificationManager.open({
                text: 'Display image inserted',
                type: 'success'
              });
            }
            
            dialogApi.close();
          }).catch(err => {
            editor.notificationManager.open({
              text: 'Failed to upload display image',
              type: 'error'
            });
          });
        }
      });
      
      // Helper function to upload image
      function uploadImage(file) {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('image', file.blob, file.name);
          
          const xhr = new XMLHttpRequest();
          const token = localStorage.getItem('token');
          
          xhr.open('POST', '/api/upload/image');
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          xhr.onload = function() {
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response.url || response.imageUrl);
              } catch (e) {
                reject(e);
              }
            } else {
              reject(new Error('Upload failed: ' + xhr.status));
            }
          };
          
          xhr.onerror = function() {
            reject(new Error('Upload failed'));
          };
          
          xhr.send(formData);
        });
      }
    }

    // Function to open lightbox dialog
    function openLightboxDialog(editor, imgNode) {
      const currentLightbox = imgNode.getAttribute('data-lightbox') || '';
      const hasLightbox = !!currentLightbox;
      
      // Build the dialog items array dynamically
      const dialogItems = [
        {
          type: 'htmlpanel',
          html: `
            <div style="padding: 10px; background: #f0f0f0; border-radius: 4px; margin-bottom: 15px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">How Lightbox Works:</h4>
              <ol style="margin: 5px 0; padding-left: 20px; color: #666; font-size: 13px;">
                <li>The current image (below) is what displays in your article</li>
                <li>Upload a different/larger image for the lightbox popup</li>
                <li>When readers click the image, the lightbox version opens</li>
              </ol>
            </div>
          `
        },
        {
          type: 'htmlpanel',
          html: `
            <div style="margin-bottom: 15px;">
              <p style="margin: 5px 0; color: #666; font-size: 12px;"><strong>Display Image (currently in article):</strong></p>
              <div style="border: 1px solid #ddd; padding: 10px; background: white; border-radius: 4px;">
                <img src="${imgNode.src}" style="max-width: 100%; max-height: 150px; object-fit: contain; display: block; margin: 0 auto;" />
              </div>
              <p style="margin: 5px 0; color: #999; font-size: 11px; text-align: center;">This stays in your article at ${imgNode.width || 'original'} size</p>
            </div>
          `
        }
      ];

      // Conditionally add the lightbox status panel
      if (hasLightbox) {
        dialogItems.push({
          type: 'htmlpanel',
          html: `<div style="padding: 10px; background: #e8f5e9; border-radius: 4px; margin-bottom: 15px;"><p style="margin: 0; color: #2e7d32; font-size: 13px;">✓ Lightbox image already set: <code style="background: white; padding: 2px 4px; border-radius: 2px;">${currentLightbox.split('/').pop()}</code></p></div>`
        });
      }

      // Add the remaining items
      dialogItems.push(
        {
          type: 'htmlpanel',
          html: '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 10px;"><h4 style="margin: 0 0 10px 0; color: #333;">Set Lightbox Image (Full Resolution):</h4></div>'
        },
        {
          type: 'input',
          name: 'lightboxUrl',
          label: 'Option 1: Direct URL to lightbox image',
          value: currentLightbox,
          placeholder: '/uploads/lightbox/full-resolution.jpg'
        },
        {
          type: 'htmlpanel',
          html: '<div style="margin: 15px 0; text-align: center; color: #999; font-size: 12px;">— OR —</div>'
        },
        {
          type: 'button',
          text: 'Option 2: Upload New Lightbox Image',
          name: 'uploadBtn',
          primary: true
        },
        {
          type: 'htmlpanel',
          html: '<p style="margin: 10px 0 0 0; color: #999; font-size: 11px; font-style: italic;">Tip: Upload your highest quality version for the lightbox</p>'
        }
      );
      
      editor.windowManager.open({
        title: 'Configure Lightbox Image',
        size: 'medium',
        body: {
          type: 'panel',
          items: dialogItems
        },
        buttons: [
          {
            type: 'cancel',
            text: 'Cancel'
          },
          {
            type: 'submit',
            text: 'Save',
            primary: true
          }
        ],
        onAction: function(dialogApi, details) {
          if (details && details.name === 'uploadBtn') {
            // Create file input for upload
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            fileInput.onchange = function(e) {
              const file = e.target.files[0];
              if (file) {
                // Show loading
                editor.setProgressState(true);
                
                // Upload file
                const formData = new FormData();
                formData.append('image', file);
                formData.append('type', 'lightbox');
                
                const token = localStorage.getItem('token');
                
                fetch('/api/upload/lightbox', {
                  method: 'POST',
                  headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                  },
                  body: formData
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Upload failed: ${response.status}`);
                  }
                  return response.json();
                })
                .then(data => {
                  // Set the URL in the dialog
                  if (data && data.imageUrl) {
                    dialogApi.setData({ lightboxUrl: data.imageUrl });
                    
                    editor.setProgressState(false);
                    editor.notificationManager.open({
                      text: 'Lightbox image uploaded! Click the image to test in preview.',
                      type: 'success',
                      timeout: 5000
                    });
                  } else {
                    throw new Error('No URL returned from server');
                  }
                })
                .catch(error => {
                  console.error('Upload error:', error);
                  editor.setProgressState(false);
                  editor.notificationManager.open({
                    text: 'Failed to upload image: ' + (error.message || 'Unknown error'),
                    type: 'error'
                  });
                });
              }
            };
            
            fileInput.click();
          }
        },
        onSubmit: function(dialogApi) {
          const data = dialogApi.getData();
          
          if (data.lightboxUrl) {
            // Set the lightbox attribute on the image
            imgNode.setAttribute('data-lightbox', data.lightboxUrl);
            imgNode.setAttribute('data-has-lightbox', 'true');
            imgNode.classList.add('has-lightbox');
            
            // Add visual indicator in editor
            imgNode.style.outline = '2px solid #4CAF50';
            setTimeout(() => {
              imgNode.style.outline = '';
            }, 2000);
            
            editor.notificationManager.open({
              text: `Lightbox configured! Display: ${imgNode.src.split('/').pop()} → Lightbox: ${data.lightboxUrl.split('/').pop()}`,
              type: 'success',
              timeout: 6000
            });
          } else {
            // Remove lightbox if URL is empty
            imgNode.removeAttribute('data-lightbox');
            imgNode.removeAttribute('data-has-lightbox');
            imgNode.classList.remove('has-lightbox');
          }
          
          dialogApi.close();
        }
      });
    }

    // Add visual indicators for images with lightbox in editor
    editor.on('NodeChange', function(e) {
      const images = editor.dom.select('img[data-has-lightbox]');
      images.forEach(img => {
        if (!img.classList.contains('lightbox-indicator')) {
          img.classList.add('lightbox-indicator');
          img.title = 'Has lightbox image (click to view/edit)';
        }
      });
    });

    // Context toolbar removed for compatibility
    // Some TinyMCE versions don't support context toolbars
  });
};

// Helper function to extract lightbox mappings from content
export const extractLightboxMappings = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const mappings = {};
  
  doc.querySelectorAll('img[data-lightbox]').forEach(img => {
    const src = img.getAttribute('src');
    const lightbox = img.getAttribute('data-lightbox');
    if (src && lightbox) {
      mappings[src] = lightbox;
    }
  });
  
  return mappings;
};

// Add CSS for editor indicators
export const lightboxEditorStyles = `
  .mce-content-body img.lightbox-indicator {
    position: relative;
    cursor: pointer;
  }
  
  .mce-content-body img.lightbox-indicator::after {
    content: "🔍";
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(76, 175, 80, 0.9);
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    pointer-events: none;
  }
`;