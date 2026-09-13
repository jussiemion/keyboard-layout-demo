import canonical from './diacritics.json' with { type: 'json' };
import national from './national-diacritics.json' with { type: 'json' };

// Keep browser language additions separate from the canonical native snapshot:
// sync:layout may replace diacritics.json, but must not erase these profiles.
const diacriticProfiles = {
  ...canonical,
  profiles: { ...canonical.profiles, ...national },
};

export default diacriticProfiles;
