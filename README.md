# Base Bot Discord.js (v14)

Une base de bot simple et moderne basée sur Discord.js v14 : handlers, slash commands, **Components V2**, modals nouvelle génération et logs simplifiés.

## Fonctionnalités

- Chargement automatique des commandes (sous-dossiers compris) et des événements
- Messages entièrement construits en **Components V2** (conteneurs, sections, galeries, séparateurs)
- Routage automatique des boutons, menus et modals vers leur commande via le `customId`
- Modal d'exemple avec boutons radio, champ texte et envoi de fichiers
- Logs colorés dans la console et dans `logs/`, avec la trace complète des erreurs
- Aucune dépendance en plus de `discord.js`

## Prérequis

- [Node.js](https://nodejs.org/fr) 22.12 ou plus récent
- Un bot créé sur le [portail des développeurs Discord](https://discord.com/developers/applications)

## Installation

1. Clonez le dépôt et installez les dépendances

   ```shell
   git clone https://github.com/mfr4y/base-bot-discordjs-v14.git
   cd base-bot-discordjs-v14
   npm install
   ```

2. Copiez `.env.example` en `.env` puis remplissez-le

   | Variable              | Obligatoire | Description                                                     |
   | --------------------- | ----------- | --------------------------------------------------------------- |
   | `DISCORD_TOKEN`       | oui         | Token du bot (onglet **Bot** du portail)                        |
   | `CLIENT_ID`           | oui         | Identifiant de l'application (onglet **General Information**)   |
   | `DEV_GUILD_ID`        | non         | Serveur de test : les commandes y sont déployées instantanément |
   | `FEEDBACK_CHANNEL_ID` | non         | Salon où le bot publie les retours envoyés avec `/feedback`     |

3. Déployez les slash commands (à refaire uniquement quand vous ajoutez ou modifiez une commande)

   ```shell
   npm run deploy
   ```

4. Lancez le bot
   ```shell
   npm start
   ```

## Scripts

| Commande         | Effet                                              |
| ---------------- | -------------------------------------------------- |
| `npm start`      | Lance le bot                                       |
| `npm run dev`    | Lance le bot et le redémarre à chaque modification |
| `npm run deploy` | Envoie les slash commands à Discord                |
| `npm run lint`   | Vérifie le code avec ESLint                        |
| `npm run format` | Formate le code avec Prettier                      |

## Structure

```
├── index.js                  Point d'entrée
├── scripts/
│   └── deploy-commands.js    Déploiement des slash commands
└── src/
    ├── config.js             Lecture du fichier .env
    ├── commands/             Une commande par fichier, rangées par dossier
    ├── events/               Un événement Discord par fichier
    ├── handlers/             Chargement des commandes et des événements
    └── utils/
        ├── logger.js         Logs console et fichiers
        └── ui.js             Raccourcis Components V2
```

## Créer une commande

Ajoutez un fichier dans un sous-dossier de `src/commands/` :

```js
const { Colors, InteractionContextType, SlashCommandBuilder } = require('discord.js');
const { notice, v2 } = require('../../utils/ui');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Dire bonjour')
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    await interaction.reply(v2([notice(Colors.Blurple, 'Bonjour !', `Salut ${interaction.user}`)]));
  },
};
```

Une commande peut aussi exporter `component(interaction)` pour ses boutons et menus, et `modal(interaction)` pour ses modals. Il suffit que le `customId` commence par le nom de la commande suivi de `:` (par exemple `hello:refresh`).

Lancez ensuite `npm run deploy` pour que Discord connaisse la nouvelle commande.

## Intents

Le bot ne demande que l'intent `Guilds`, suffisant pour les slash commands. Si vous avez besoin d'autres événements (messages, membres…), ajoutez l'intent correspondant dans `index.js`. Pour `GuildMembers`, `GuildPresences` et `MessageContent`, activez-les aussi dans l'onglet **Bot** du portail.

## Contribution

Pour me soutenir, vous pouvez ajouter une étoile au dépôt et/ou me faire un don sur [Stripe](https://donate.stripe.com/6oE9Ci2CN2c9cPm002).
