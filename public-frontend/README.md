# Public Frontend - Admin Edit Mode

## How to Enable Admin Edit Mode

There are several ways to enable admin edit mode on the public frontend:

### Method 1: URL Parameter (Recommended)
Visit any page with `?adminMode=true`:
- http://localhost:3000?adminMode=true
- http://localhost:3000/photobooks.html?adminMode=true
- http://localhost:3000/article.html?slug=example&adminMode=true

This will:
- Enable admin mode
- Show an admin toolbar at the top
- Display edit links on all content
- Persist across page navigation

### Method 2: Browser Console
Open the browser console and run:
```javascript
localStorage.setItem('adminPreviewMode', 'true');
location.reload();
```

### Method 3: Admin Preview Page
Visit: http://localhost:3000/admin-preview.html

## Features When Admin Mode is Active

1. **Admin Toolbar** - A dark toolbar at the top showing "👁️ Admin Mode Active"
2. **Edit Links** - Appear on:
   - Article cards (on hover)
   - Photo book cards (on hover)
   - Article detail pages (top right)
   - Photo book detail pages (top right)
   - Page detail views (top right)

3. **Direct Edit Access** - Click any edit link to open the content in the CMS editor

## To Disable Admin Mode

Click the "Disable Admin Mode" button in the admin toolbar, or visit any page with `?adminMode=false`

## Troubleshooting

If edit links aren't showing:
1. Make sure admin mode is active (check for the toolbar)
2. Ensure content is published (draft content won't show)
3. Refresh the page after enabling admin mode
4. Check that JavaScript is enabled in your browser