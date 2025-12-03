# Map Image Instructions

## Adding Your Map Image

1. Place your map image file in this `public` folder
2. Name it `map.jpg` (or update the path in `src/config.ts`)
3. Supported formats: JPG, PNG, WebP

## Recommended Specifications

- **Format**: JPG (best compression) or PNG (for transparency if needed)
- **Size**: As large as needed for detail - the app handles zooming
- **Aspect Ratio**: Any - the map viewer adapts to your image
- **File Size**: Optimize for web if needed (aim for < 5MB for better loading)

## Example

If your map is named `wedding-map.png`, update `src/config.ts`:

```typescript
mapImage: '/wedding-map.png',
```

## Testing

After adding your map image, run `npm run dev` and verify the map displays correctly.

