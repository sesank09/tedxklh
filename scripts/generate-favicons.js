const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createIcoFromPngs(pngBuffersWithSizes) {
  const count = pngBuffersWithSizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);     // Reserved
  header.writeUInt16LE(1, 2);     // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  let currentOffset = 6 + count * 16;
  const dirEntries = [];
  const imageBuffers = [];

  for (const item of pngBuffersWithSizes) {
    const { buffer, size } = item;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2);                      // Color palette (0 = no palette)
    entry.writeUInt8(0, 3);                      // Reserved
    entry.writeUInt16LE(1, 4);                   // Color planes
    entry.writeUInt16LE(32, 6);                  // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8);       // Image size
    entry.writeUInt32LE(currentOffset, 12);      // Image offset

    dirEntries.push(entry);
    imageBuffers.push(buffer);
    currentOffset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

async function generate() {
  const root = path.join(__dirname, '..');
  const src = path.join(root, 'public/icon-512.png');

  if (!fs.existsSync(src)) {
    console.error('Source icon-512.png not found at', src);
    process.exit(1);
  }

  console.log('Generating crisp favicons and app icons from:', src);

  // Ensure 32-bit RGBA for maximum compatibility
  const b16 = await sharp(src).resize(16, 16).ensureAlpha().png().toBuffer();
  const b32 = await sharp(src).resize(32, 32).ensureAlpha().png().toBuffer();
  const b48 = await sharp(src).resize(48, 48).ensureAlpha().png().toBuffer();
  const b96 = await sharp(src).resize(96, 96).ensureAlpha().png().toBuffer();
  const b180 = await sharp(src).resize(180, 180).ensureAlpha().png().toBuffer();
  const b192 = await sharp(src).resize(192, 192).ensureAlpha().png().toBuffer();
  const b512 = await sharp(src).resize(512, 512).ensureAlpha().png().toBuffer();

  // Write PNG assets to public/
  fs.writeFileSync(path.join(root, 'public/favicon-16x16.png'), b16);
  fs.writeFileSync(path.join(root, 'public/favicon-32x32.png'), b32);
  fs.writeFileSync(path.join(root, 'public/favicon-48x48.png'), b48);
  fs.writeFileSync(path.join(root, 'public/favicon-96x96.png'), b96);
  fs.writeFileSync(path.join(root, 'public/apple-touch-icon.png'), b180);
  fs.writeFileSync(path.join(root, 'public/icon-192.png'), b192);
  fs.writeFileSync(path.join(root, 'public/icon-512.png'), b512);

  // Create real multi-size .ico in public/
  const icoBuffer = createIcoFromPngs([
    { buffer: b16, size: 16 },
    { buffer: b32, size: 32 },
    { buffer: b48, size: 48 },
  ]);
  fs.writeFileSync(path.join(root, 'public/favicon.ico'), icoBuffer);

  // src/app/icon.png (Next.js automatically uses this to generate the page favicon link!)
  fs.writeFileSync(path.join(root, 'src/app/icon.png'), b512);
  fs.writeFileSync(path.join(root, 'src/app/apple-icon.png'), b180);

  // If src/app/favicon.ico exists, remove it so Turbopack uses icon.png cleanly without decode conflict
  const appFavicon = path.join(root, 'src/app/favicon.ico');
  if (fs.existsSync(appFavicon)) {
    fs.unlinkSync(appFavicon);
    console.log('Removed src/app/favicon.ico (Turbopack uses src/app/icon.png cleanly)');
  }

  console.log('Favicon generation completed successfully!');
}

generate().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
