Keep an inventory of all code files and a one-liner of the roles. Whenever you notice a discrepancy, or when you create/delete files, update this inventory. This is your map and should always be accurate.

Guidelines:

- Code always goes in src/
- Organize by features: src/features/{hooks,stores,components,utils} -- only create the directories when they are needed; i.e. don't preemptively create a "stores" component if the feature doesn't REALLY require one.
- Try to produce components as reusable as possible.

# File Inventory

- [`.commitlintrc.json`](.commitlintrc.json:0): Commitlint configuration.
- [`.editorconfig`](.editorconfig:0): Editor configuration.
- [`eslint.config.mjs`](eslint.config.mjs:0): ESLint configuration.
- [`.gitignore`](.gitignore:0): Specifies intentionally untracked files that Git should ignore.
- [`.npmrc`](.npmrc:0): NPM configuration file.
- [`.nvmrc`](.nvmrc:0): NVM configuration, specifies Node.js version.
- [`.prettierignore`](.prettierignore:0): Specifies files Prettier should ignore.
- [`.prettierrc.json`](.prettierrc.json:0): Prettier configuration.
- [`bun.lock`](bun.lock:0): Bun lockfile.
- [`components.json`](components.json:0): Shadcn/ui components configuration.
- [`context/SPEC.md`](context/SPEC.md:0): Specification document for the context feature.
- [`LICENSE.md`](LICENSE.md:0): Project license.
- [`next.config.ts`](next.config.ts:0): Next.js configuration.
- [`package.json`](package.json:0): Project manifest, lists dependencies and scripts.
- [`pnpm-lock.yaml`](pnpm-lock.yaml:0): PNPM lockfile.
- [`postcss.config.mjs`](postcss.config.mjs:0): PostCSS configuration.
- [`public/next.svg`](public/next.svg:0): Next.js logo SVG.
- [`public/vercel.svg`](public/vercel.svg:0): Vercel logo SVG.
- [`README.md`](README.md:0): Project README.
- [`redirects.ts`](redirects.ts:0): Defines URL redirects for the application.
- [`renovate.json`](renovate.json:0): Renovate bot configuration for dependency updates.
- [`src/app/favicon.ico`](src/app/favicon.ico:0): Application favicon.
- [`src/app/globals.css`](src/app/globals.css:0): Global CSS styles.
- [`src/app/layout.tsx`](src/app/layout.tsx:0): Root layout for the Next.js application, includes NDKHeadless setup.
- [`src/app/page.module.css`](src/app/page.module.css:0): CSS modules for the landing page.
- [`src/app/page.tsx`](src/app/page.tsx:0): Landing page, displays a Nostr event.
- [`src/app/p/[npub]/layout.tsx`](src/app/p/[npub]/layout.tsx:0): Layout for the user profile page, includes Hero and Tabs.
- [`src/app/p/[npub]/page.tsx`](src/app/p/[npub]/page.tsx:0): Default page for user profile, displays "Posts" section.
- [`src/app/p/[npub]/updates/page.tsx`](src/app/p/[npub]/updates/page.tsx:0): Page for user profile "Updates" section.
- [`src/components/ui/avatar.tsx`](src/components/ui/avatar.tsx:0): Shadcn/ui Avatar component.
- [`src/components/ui/button.tsx`](src/components/ui/button.tsx:0): Shadcn/ui Button component.
- [`src/components/ui/card.tsx`](src/components/ui/card.tsx:0): Shadcn/ui Card component.
- [`src/components/ui/checkbox.tsx`](src/components/ui/checkbox.tsx:0): Shadcn/ui Checkbox component.
- [`src/components/ui/dropdown-menu.tsx`](src/components/ui/dropdown-menu.tsx:0): Shadcn/ui Dropdown Menu component.
- [`src/components/ui/tabs.tsx`](src/components/ui/tabs.tsx:0): Shadcn/ui Tabs component.
- [`src/features/nostr/components/CardHeader.tsx`](src/features/nostr/components/CardHeader.tsx:0): Component for displaying the header of a Nostr event card.
- [`src/features/nostr/components/ImageEventCard.tsx`](src/features/nostr/components/ImageEventCard.tsx:0): Component for displaying a Nostr image event in a card format.
- [`src/features/nostr/components/ImageEventGridItem.tsx`](src/features/nostr/components/ImageEventGridItem.tsx:0): Component to display a single Nostr image event in a grid.
- [`src/features/nostr/components/UserAvatar.tsx`](src/features/nostr/components/UserAvatar.tsx:0): Component for displaying a user's avatar, typically from Nostr profile.
- [`src/features/profile/components/ImagePostGridItem.tsx`](src/features/profile/components/ImagePostGridItem.tsx:0): Component to display a single image in the profile posts grid.
- [`src/features/profile/components/ProfileHero.tsx`](src/features/profile/components/ProfileHero.tsx:0): Component to display user profile banner, avatar, and name.
- [`src/features/profile/components/ProfileTabs.tsx`](src/features/profile/components/ProfileTabs.tsx:0): Component for "Posts" and "Updates" tab navigation on profile page.
- [`src/lib/utils.ts`](src/lib/utils.ts:0): Utility functions for the application.
- [`tsconfig.json`](tsconfig.json:0): TypeScript configuration.
