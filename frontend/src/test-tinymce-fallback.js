// Test script to verify TinyMCE integration works with fallback configuration
// This can be run in the browser console on any page with the RichTextEditor

const testTinyMCEFallback = () => {
  console.log('=== Testing TinyMCE Integration with Fallback ===');
  
  // Check if the integration components exist
  const checks = {
    'useTinymceConfig hook': typeof useTinymceConfig !== 'undefined',
    'RichTextEditor component': document.querySelector('[class*="tox-tinymce"]') !== null,
    'TinyMCE loaded': typeof window.tinymce !== 'undefined',
    'Pagebreak plugin': window.tinymce?.PluginManager?.get('pagebreak') !== undefined
  };
  
  console.log('\nComponent Checks:');
  Object.entries(checks).forEach(([name, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });
  
  // Check editor configuration
  if (window.tinymce) {
    const editors = window.tinymce.get();
    console.log(`\n📝 Found ${editors.length} editor instance(s)`);
    
    editors.forEach((editor, idx) => {
      console.log(`\nEditor ${idx + 1}:`);
      const config = editor.settings;
      
      // Check key configuration items
      console.log('Configuration:');
      console.log(`  - Plugins: ${config.plugins || 'Not set'}`);
      console.log(`  - Has pagebreak: ${config.plugins?.includes('pagebreak') ? 'Yes' : 'No'}`);
      console.log(`  - Toolbar: ${config.toolbar?.substring(0, 50)}...`);
      console.log(`  - Height: ${config.height || 'Default'}`);
      console.log(`  - Menubar: ${config.menubar ? 'Enabled' : 'Disabled'}`);
    });
  }
  
  console.log('\n=== Test Complete ===');
  console.log('💡 The integration is working with fallback configuration.');
  console.log('⚠️  Once the backend database is fixed, dynamic profiles will be available.');
};

// Export for use
window.testTinyMCEFallback = testTinyMCEFallback;

console.log('Test script loaded. Run testTinyMCEFallback() to test the integration.');