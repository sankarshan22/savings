# PWA Icons Guide

## 📱 You Need 2 Icon Sizes:
- **192x192** pixels → `public/icon-192x192.png`
- **512x512** pixels → `public/icon-512x512.png`

## 🎨 Quick Ways to Create Icons:

### Option 1: Use Online Tool (Easiest)
1. Go to **https://www.pwabuilder.com/imageGenerator**
2. Upload any image (logo, app icon)
3. Download the generated icons
4. Place them in the `public` folder

### Option 2: Use Canva (Free & Easy)
1. Go to **https://www.canva.com**
2. Create a design with dimensions:
   - First: 192x192 pixels
   - Second: 512x512 pixels
3. Design your app icon with:
   - App name "Savings"
   - Background color: #00C2A8 (teal/green)
   - Icon/symbol representing money/expenses
4. Download as PNG
5. Rename to `icon-192x192.png` and `icon-512x512.png`
6. Place in `public` folder

### Option 3: Use Figma
1. Create 192x192 and 512x512 frames
2. Design your icon
3. Export as PNG
4. Place in `public` folder

### Option 4: Simple Text Icon (Quick Test)
For testing, you can use any square image and resize it to 192x192 and 512x512.

## 🎯 Icon Design Tips:
- Use app theme colors (#00C2A8 - teal/green)
- Keep it simple and recognizable
- Avoid text (icons should work at small sizes)
- Use symbols: 💰, 💵, 📊, 💳
- Make sure background isn't transparent (use solid color)

## ✅ Once Icons Are Ready:
Place both files in the `public` folder:
```
public/
  ├── icon-192x192.png
  ├── icon-512x512.png
  ├── manifest.json
  └── sw.js
```

Then build and deploy your app!
