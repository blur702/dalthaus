// Helper to handle edit requests from the public frontend
export function checkEditRequest() {
  // Check if we have a hash with edit ID
  const hash = window.location.hash;
  if (hash && hash.startsWith('#edit=')) {
    const editId = hash.substring(6);
    return editId;
  }
  
  // Also check localStorage for edit request
  const editContentId = localStorage.getItem('editContentId');
  if (editContentId) {
    localStorage.removeItem('editContentId'); // Clear it after reading
    return editContentId;
  }
  
  return null;
}

// Function to trigger edit in the management components
export function triggerEdit(contentList, handleEdit) {
  const editId = checkEditRequest();
  if (editId && contentList.length > 0) {
    const itemToEdit = contentList.find(item => item.id === editId);
    if (itemToEdit) {
      // Clear the hash
      window.location.hash = '';
      // Trigger the edit
      setTimeout(() => handleEdit(itemToEdit), 100);
    }
  }
}