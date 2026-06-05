/**
 * Strips Play-policy-sensitive permissions auto-injected into the merged
 * AndroidManifest by transitive Expo / RN modules even though LiftTrack
 * never uses the underlying capability at runtime.
 *
 * Removed:
 * - SYSTEM_ALERT_WINDOW: RN debug manifest declares it for dev-time red-box
 *   overlay; the merger leaks it into release builds. Play policy flag.
 * - RECORD_AUDIO: auto-added by expo-camera 17.x (video-with-audio capable
 *   even though LiftTrack only uses still-photo capture for meal scans).
 *   Play marks RECORD_AUDIO as a sensitive permission that requires runtime
 *   justification, and LiftTrack has none.
 *
 * Each permission gets `tools:node="remove"` so the manifest merger drops it.
 *
 * Verify after `eas build --local`:
 *   unzip -p build-*.aab base/manifest/AndroidManifest.xml | strings | grep ALERT
 *   unzip -p build-*.aab base/manifest/AndroidManifest.xml | strings | grep RECORD_AUDIO
 * Both should return empty after this plugin runs.
 */
const { withAndroidManifest } = require('@expo/config-plugins');

const TARGETS = [
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.RECORD_AUDIO',
];

module.exports = function withRemoveSystemAlertWindow(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;

    manifest.$ = manifest.$ || {};
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    const existing = manifest['uses-permission'] || [];
    const filtered = existing.filter(
      (p) => !TARGETS.includes(p?.$?.['android:name']),
    );

    for (const name of TARGETS) {
      filtered.push({
        $: {
          'android:name': name,
          'tools:node': 'remove',
        },
      });
    }

    manifest['uses-permission'] = filtered;
    return cfg;
  });
};
