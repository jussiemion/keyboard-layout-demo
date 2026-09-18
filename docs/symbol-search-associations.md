# Associative symbol search

People may search for a topic, an activity or a familiar association rather than
an exact symbol name. These keywords supplement Unicode names, CLDR annotations
and localized names. They do not replace the standard names in the palette
footer.

## Topic groups

| Group                   | Example queries                                           | Related symbols                           |
| ----------------------- | --------------------------------------------------------- | ----------------------------------------- |
| Gambling and casinos    | gambling, casino, betting, poker, roulette, playing cards | 🎰 🎲 🃏 ♠ ♥ ♦ ♣ and the playing-card set |
| Linux and free software | linux, Tux, Ubuntu, Debian, open source                   | 🐧                                        |
| Programming             | coding, developer, programming, algorithm                 | 💻 🖥 ⌨ 💾 ⚙ 🤖                            |
| Bugs and debugging      | bug, debug, debugging, fix                                | 🐛 🪲 🔧 🛠                                |
| Internet and networks   | internet, website, network, wifi                          | 🌐 🌍 📡 📶 🔗                            |
| Writing and editing     | writing, author, copywriting, editor, draft               | ✍ ✏ 🖊 📝 📖                              |
| Typography              | typography, typesetting, punctuation, proofreading        | « » — … § ¶ and other typographic marks   |
| Design and creativity   | design, drawing, illustration, art                        | 🎨 🖌 ✏ 📐 📏                              |
| Work and business       | work, office, career, meeting                             | 💼 🏢 📊 📈 📋 📅                         |
| Education and learning  | study, school, university, exam                           | 🎓 📚 📖 📝 🏫                            |
| Science and research    | science, experiment, laboratory, chemistry                | 🔬 🔭 🧪 ⚗ 🧬 ⚛                           |
| Travel                  | travel, vacation, tourism, trip                           | ✈ 🚆 🚗 🧳 🌍 🗺 🏖 🏨                      |
| Medicine and health     | doctor, hospital, treatment, pharmacy                     | ⚕ 🏥 🩺 💊 💉 🩹                          |
| Music                   | music, song, concert, melody                              | ♪ ♫ ♬ 🎵 🎶 🎼 🎤 🎧 🎸 🎹                |
| Sports                  | sport, fitness, training, competition                     | ⚽ 🏀 🎾 🏋 🏃 🏆 🥇                      |
| Gaming                  | gaming, gamer, console, esports                           | 🎮 🕹 👾 🎲 ♟                              |
| Nature and ecology      | nature, ecology, garden, green                            | 🌿 🌱 🌳 🌲 🌻 🍃 ♻ 🌍                    |
| Weather                 | weather, forecast, temperature, rain                      | ☀ 🌤 ☁ 🌧 ⛈ ❄ 🌈 🌡 ☂                        |
| Space                   | space, astronomy, universe, galaxy                        | 🚀 🛸 🛰 🌌 🌠 🪐 🌙 ⭐                    |
| Shopping                | shopping, store, sale, discount                           | 🛒 🛍 💳 💰 🏷 🎁                           |
| Food and cooking        | food, eat, cooking, restaurant                            | 🍽 🍴 🍕 🍔 🥗 🍲 🍳 👨‍🍳 👩‍🍳                 |
| Photography and film    | photo, camera, video, filming, cinema                     | 📷 📸 🎥 📹 🎬 🖼                          |

Each group includes keywords in all 14 interface languages. Search uses them
regardless of the selected interface language: both `linux` and the Russian
query `линукс` find the penguin in any localization.

Existing groups cover approval, disapproval, love, laughter, sadness, anger,
gratitude, celebration, surprise, questions, warnings, completion, errors,
waiting, money, ideas, energy, sleep, greetings, embarrassment, coffee, search,
security and links.

## Extending the dictionary

The data lives in `lib/symbol-search-associations.json`. Each new group has a
stable `id`, an explicit `symbols` list and a `terms` dictionary for every
language. A symbol can belong to several groups.

- Include familiar queries, conversational variants and transliterations.
- Do not associate a symbol with a topic merely to expand the results. The
  connection should make sense to the user.
- Keep instructions and promotional descriptions out of search keywords.
- Emoji skin-tone variants inherit the base symbol's keywords.
- Check both expected matches and the absence of obviously unrelated matches.
  The dictionary is not exhaustive: new user queries should inform additions and
  regression tests.
