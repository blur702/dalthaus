import React from 'react';
import DOMPurify from 'dompurify';

// Configure DOMPurify to only allow specific tags
const ALLOWED_TAGS = ['br', 'strong', 'em', 'b', 'i', 'span'];
const ALLOWED_ATTR = ['class', 'id', 'style'];

// Configure DOMPurify hooks to validate styles
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName === 'style') {
    // Allow only safe CSS properties
    const allowedStyles = [
      'color',
      'background-color',
      'font-size',
      'font-weight',
      'font-style',
      'text-decoration',
      'text-align',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'display',
      'opacity',
      'visibility',
      'border',
      'border-radius',
      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'line-height',
      'letter-spacing',
      'text-transform',
      'vertical-align',
      'white-space'
    ];
    
    const styleValue = data.attrValue;
    const styles = styleValue.split(';').filter(s => s.trim());
    const validStyles = [];
    
    for (const style of styles) {
      const [property, value] = style.split(':').map(s => s.trim());
      if (property && value && allowedStyles.includes(property.toLowerCase())) {
        // Additional validation for specific properties
        if (property.toLowerCase() === 'display') {
          // Only allow safe display values
          const safeDisplayValues = ['block', 'inline', 'inline-block', 'none', 'flex', 'inline-flex'];
          if (!safeDisplayValues.includes(value.toLowerCase())) {
            continue;
          }
        }
        validStyles.push(`${property}: ${value}`);
      }
    }
    
    data.attrValue = validStyles.join('; ');
  }
});

const SafeHTML = ({ html, component: Component = 'span', ...props }) => {
  // Sanitize the HTML
  const sanitizedHTML = DOMPurify.sanitize(html || '', {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    KEEP_CONTENT: true,
  });

  return (
    <Component 
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default SafeHTML;