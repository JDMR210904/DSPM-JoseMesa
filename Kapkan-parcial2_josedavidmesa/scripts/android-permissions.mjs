// Agrega los permisos que necesita la app al AndroidManifest.xml
// Uso: después de "npx cap add android" ejecuta "npm run android:perms"
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = 'android/app/src/main/AndroidManifest.xml';
if (!existsSync(file)) {
  console.error('No existe ' + file + '. Primero ejecuta: npx cap add android');
  process.exit(1);
}

const perms = [
  'android.permission.INTERNET',
  'android.permission.CAMERA',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.VIBRATE',
  'android.permission.POST_NOTIFICATIONS',
];

let xml = readFileSync(file, 'utf8');
const missing = perms.filter((p) => !xml.includes(`"${p}"`));
if (missing.length === 0) {
  console.log('Los permisos ya estaban configurados.');
} else {
  const lines = missing.map((p) => `    <uses-permission android:name="${p}" />`).join('\n');
  xml = xml.replace('</manifest>', `${lines}\n</manifest>`);
  writeFileSync(file, xml);
  console.log('Permisos agregados:\n' + missing.join('\n'));
}
