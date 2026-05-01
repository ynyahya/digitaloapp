# BuilderOS Pro Redesign Plan

## Tujuan

Membangun ulang semua builder menjadi satu pengalaman **Creator Launch Workspace** yang premium, modern, cepat, dan konsisten untuk:

- Product Builder
- Course Builder
- Event Builder
- Service Builder

Target akhir bukan sekadar mengganti warna menjadi gelap, tetapi merombak workflow builder agar terasa seperti produk global-standard: cepat, guided, visual, preview-first, launch-oriented, dan tidak terasa seperti form admin biasa.

## Prinsip utama

1. **Builder lama boleh dihapus atau diganti total**
   - UI lama hanya dipakai sebagai referensi domain.
   - Jika shell lama, layout lama, section lama, atau komponen lama terasa kaku, boleh dirombak.
   - Backend/action/data model yang masih benar dapat dipertahankan.

2. **Satu sistem builder untuk semua offering**
   - Semua builder menggunakan pola shell, state, preview, launch, readiness, dan visual language yang sama.
   - Domain tetap berbeda, tetapi pengalaman terasa satu produk.

3. **Premium dark + electric lime**
   - Seluruh builder harus mengikuti direction landing page: dark premium, glass surface, lime accent, subtle grain/grid, high contrast.
   - Hindari dominasi gaya lama seperti `indigo`, `violet`, `bg-background`, `bg-paper`, atau form admin terang.

4. **Creator-first workflow**
   - Builder harus membantu creator menyelesaikan dan meluncurkan offering.
   - Setiap builder perlu guidance, preview, readiness score, launch checklist, dan share flow.

5. **No monolithic builder pages**
   - Event dan Service builder lama yang berupa file besar harus dipecah.
   - State, autosave, preview, readiness, dan domain sections harus punya struktur jelas.

## Masalah builder saat ini

### Product Builder

Kondisi saat ini paling matang:

- Sudah punya mode `build`, `preview`, `launch`.
- Sudah punya provider/reducer state.
- Sudah punya autosave, dirty tracking, undo/redo, launch center, utility dock, dan copilot.

Masalah:

- Visual belum sepenuhnya mengikuti dark premium landing theme.
- Komponen shell masih product-specific, belum bisa dipakai builder lain.
- Readiness logic masih product-only.

### Course Builder

Kondisi saat ini cukup kuat secara domain:

- Sudah ada course provider.
- Sudah ada curriculum sidebar.
- Sudah ada lesson canvas dan context panel.
- Sudah ada chapter/lesson CRUD dan beberapa block lesson.

Masalah:

- UI masih terasa light/admin.
- Undo/redo belum sematang Product Studio.
- Workflow belum launch-oriented.
- Preview sebagai student/sales page belum cukup kuat.
- Ada potensi duplikasi action antara file course actions.

### Event Builder

Kondisi saat ini masih terlalu monolithic:

- Satu client page besar.
- Local state dan autosave langsung di page.
- Header/sidebar/preview dibuat sendiri.
- Tickets, questions, speakers, theme, details, settings bercampur.

Masalah:

- Tidak memakai shared shell.
- Tidak ada readiness launch center.
- Tidak ada undo/redo.
- Theme presets terlalu random/colorful dan belum sesuai dark premium.
- Route builder kurang ideal karena memakai query string `/dashboard/events/builder?slug=...`.

### Service Builder

Kondisi saat ini juga masih monolithic:

- Satu client page besar.
- Local state dan autosave sendiri.
- Preview rail sederhana.
- Section masih terasa form-based.

Masalah:

- Tidak memakai shared shell.
- Tidak ada readiness launch center.
- Tidak ada undo/redo.
- Service packaging belum terasa seperti pro offering builder.
- Visual masih campur gaya lama.

## Target pengalaman BuilderOS

Setiap builder idealnya memiliki struktur:

```txt
Header
  Back / Title / Status / Save State / Undo / Redo / Preview / Publish

Left Rail
  Sections / Structure / Readiness / AI / Help

Main Canvas
  Editable domain sections
  Inline suggestions
  Smart empty states

Right Rail
  Live preview
  Context inspector
  Launch/readiness hints

Modes
  Build / Preview / Launch
```

Untuk Course, mode bisa diperluas:

```txt
Overview / Curriculum / Content / Design / Preview / Launch
```

## Arsitektur baru

### Shared builder components

Buat fondasi baru:

```txt
components/builder/
  builder-shell.tsx
  builder-header.tsx
  builder-sidebar.tsx
  builder-canvas.tsx
  builder-inspector.tsx
  builder-preview-rail.tsx
  builder-mode-tabs.tsx
  builder-launch-center.tsx
  builder-readiness-panel.tsx
  builder-save-indicator.tsx
  builder-status-badge.tsx
  builder-command-menu.tsx
  builder-empty-state.tsx
  builder-danger-zone.tsx
  builder-section-card.tsx
  builder-field.tsx
  builder-toolbar.tsx
```

### Shared state engine

Buat reusable builder state:

```txt
hooks/use-builder-state.tsx
```

Fitur wajib:

- debounced autosave
- manual save
- dirty field tracking
- optimistic update
- undo/redo
- save error state
- retry save
- last saved timestamp
- before-unload warning
- keyboard shortcuts
- field-level validation
- publish/unpublish coordination

Keyboard shortcuts:

- `Cmd/Ctrl + S`: save
- `Cmd/Ctrl + Z`: undo
- `Cmd/Ctrl + Shift + Z`: redo
- `Cmd/Ctrl + K`: command menu
- `Esc`: close active modal/panel

### Domain builder hooks

Setiap builder punya hook/domain adapter:

```txt
hooks/use-product-builder.tsx
hooks/use-course-builder.tsx
hooks/use-event-builder.tsx
hooks/use-service-builder.tsx
```

Adapter ideal:

```ts
type BuilderAdapter<T> = {
  type: "product" | "course" | "event" | "service";
  backHref: string;
  previewHref: (entity: T) => string;
  saveFields: (id: string, fields: Partial<T>) => Promise<void>;
  publish: (id: string) => Promise<void>;
  unpublish: (id: string) => Promise<void>;
  sections: BuilderSection[];
  readiness: ReadinessCheck<T>[];
};
```

### Readiness engine

Buat sistem readiness global:

```txt
lib/builder/readiness/
  product.ts
  course.ts
  event.ts
  service.ts
```

Format readiness item:

```ts
type ReadinessCheck = {
  id: string;
  label: string;
  description: string;
  severity: "required" | "recommended" | "optional";
  done: boolean;
  actionLabel: string;
  targetSection: string;
};
```

## Visual design direction

BuilderOS harus terasa sebagai kelanjutan natural dari UI TESKEL sekarang, bukan redesign terpisah. Referensi utama adalah dashboard/landing dark theme yang sudah dipakai saat ini:

- background app near-black `#08080A`
- foreground chalk/near-white
- accent utama electric lime `#B4F300`
- surfaces `night`, `night-raised`, `paper`, `surface-night`, `surface-glass-dark`
- border halus `border-white/[0.06]` sampai `border-white/[0.12]`
- cards rounded besar `rounded-2xl`, `rounded-[20px]`, `rounded-[28px]`
- CTA utama lime dengan text night
- secondary action berupa dark glass button
- subtle grid, grain, radial lime/violet glow hanya sebagai depth, bukan dekorasi ramai

### Surfaces

- App background: near-black/night.
- Panels: glass dark cards.
- Border: subtle white opacity.
- Accent: electric lime / emerald glow.
- Secondary text: muted slate/chalk.
- Effects: grain overlay, subtle grid, radial lime glow.

### Avoid

- Dominant indigo/violet primary.
- White admin-card layouts.
- Generic dashboard form feel.
- Random colorful gradients.
- Inconsistent status badges.

### Desired feel

- Premium
- Calm
- Sharp
- Fast
- Creator-first
- Launch-oriented

## TESKEL current UI/UX guardrails

Bagian ini wajib dipakai sebagai pengingat saat implementasi agar BuilderOS tidak keluar dari style TESKEL yang sekarang.

### Design tokens yang harus dipakai

Gunakan token yang sudah ada, bukan membuat palet baru.

```txt
Background:
- bg-night
- bg-night-surface
- bg-night-raised
- bg-paper
- bg-paper-soft
- bg-paper-muted

Text:
- text-chalk
- text-chalk-muted
- text-chalk-subtle
- text-chalk-dim
- text-ink
- text-ink-muted

Accent:
- bg-lime
- text-lime
- border-lime/20
- bg-lime/10
- lime-shadow
- lime-ring-glow

Border/surface:
- border-white/[0.06]
- border-white/[0.08]
- border-white/[0.12]
- bg-white/[0.025]
- bg-white/[0.035]
- bg-white/[0.04]
- surface-night
- surface-night-soft
- surface-glass-dark
```

### Tokens yang harus dihindari untuk builder baru

```txt
Hindari sebagai warna dominan:
- bg-background
- bg-paper jika dipakai dengan asumsi light card
- indigo sebagai primary
- violet sebagai primary
- blue/cyan/orange/pink gradients untuk theme utama
- bg-white sebagai page/card utama
- text-gray-* yang membuat kontras tidak konsisten
```

Violet boleh dipakai sangat subtil sebagai secondary ambient glow, seperti dashboard/landing sekarang, tetapi primary action tetap lime.

### Layout language

BuilderOS harus memakai layout yang terasa seperti "creator command workspace":

```txt
Full-screen workspace
  Sticky top builder header
  Left rail: section navigation + readiness summary
  Center canvas: editable cards/sections
  Right rail: live preview / inspector / launch hints
```

Rules:

- Header height ringkas, sticky, glass/dark, tidak terasa seperti navbar marketing.
- Left rail boleh compact, tetapi section state harus jelas: active, complete, needs attention.
- Center canvas tidak boleh berupa form panjang tanpa struktur. Gunakan card per section.
- Right rail harus memberi preview atau actionable hints, bukan panel kosong.
- Pada viewport kecil, right rail collapse menjadi drawer/tab preview.
- Canvas width harus nyaman untuk editing copy: tidak terlalu lebar, tidak terlalu sempit.
- Preview card boleh lebih visual dan device-like, tapi tetap dark/lime TESKEL.

### Component style

#### Cards

- Gunakan `rounded-2xl` sampai `rounded-[28px]`.
- Gunakan background translucent/dark surface.
- Border tipis white opacity.
- Shadow boleh dalam/soft, jangan terlalu colorful.
- Section cards harus punya header jelas, microcopy, dan status kecil.

#### Buttons

Primary:

```txt
bg-lime text-night lime-shadow hover:bg-lime-bright
```

Secondary:

```txt
border border-white/15 bg-white/[0.04] text-chalk hover:bg-white/[0.08]
```

Ghost:

```txt
text-chalk-muted hover:text-chalk hover:bg-white/[0.04]
```

Danger:

```txt
border-red-500/20 bg-red-500/10 text-red-300
```

Jangan memakai tombol primary biru/indigo/violet di builder baru.

#### Badges/status

Gunakan pola dashboard:

```txt
rounded-full border border-lime/20 bg-lime/10 text-lime
dot lime dengan glow untuk online/saved/published
```

Status mapping:

- Saved/Published/Complete: lime
- Saving/In progress: chalk-muted + subtle pulse
- Warning/Needs work: amber
- Error/Blocked: red
- Draft/Neutral: white opacity

#### Inputs

Input builder harus terasa native dark:

- dark/translucent background
- border white opacity
- focus ring lime
- placeholder chalk-dim/subtle
- label small, confident, bukan admin-form berat
- helper text singkat dan actionable

### Typography

Gunakan bahasa typography yang sama dengan dashboard/landing:

- Eyebrow: `text-eyebrow uppercase tracking`
- Page title/header: bold/black, tight tracking
- Section title: 15-18px semibold/bold
- Body/helper: 12-14px muted
- Checklist/metadata: 10-12px uppercase atau compact

Jangan membuat builder terasa seperti form admin enterprise dengan label besar dan spacing kaku.

### Interaction UX

BuilderOS harus terasa cepat dan aman:

- Autosave harus visible tetapi tidak mengganggu.
- Manual save tetap ada untuk rasa kontrol.
- Dirty state harus jelas per section atau global.
- Undo/redo ada di header jika state engine siap.
- Publish harus gated oleh readiness required checks.
- Launch button tidak boleh destructive; publish/unpublish butuh confirmation jika berisiko.
- Navigation away harus warning jika ada unsaved changes.
- Keyboard shortcuts mengikuti plan global.
- Empty states harus memberi next action yang jelas.

### Readiness UX

Readiness bukan sekadar checklist pasif.

Setiap readiness item wajib punya:

- label singkat
- alasan kenapa penting
- severity
- action target section
- status complete/incomplete

Readiness panel harus:

- menampilkan score/progress
- memisahkan required dan recommended
- punya CTA "Fix next"
- bisa scroll/focus ke section terkait
- menjadi gate untuk publish required items

### Preview UX

Preview harus credible dan langsung membantu creator mengambil keputusan.

Rules:

- Preview selalu memakai data terbaru dari state lokal, tidak menunggu save selesai.
- Preview menunjukkan public-facing result, bukan ulang form.
- Harus ada desktop/mobile toggle minimal di builder yang sudah matang.
- Jika data kosong, preview memakai starter placeholder yang elegan.
- Preview tidak boleh terang/white-dominant kecuali domain public page memang punya mode khusus. Default BuilderOS preview tetap dark premium.

### Loading/error/empty states

Loading:

- dark full-screen atau panel skeleton
- spinner/breathing state dengan lime accent
- copy singkat: "Preparing your workspace..."

Error:

- dark card
- pesan jelas
- tombol retry/back
- jangan console-only error

Empty:

- starter content atau guided prompt
- CTA langsung: add package, add ticket, add lesson, add FAQ
- microcopy creator-first, bukan "No data"

### Accessibility and responsive

Minimum:

- contrast cukup di dark background
- focus visible dengan lime ring
- button punya accessible label jika icon-only
- keyboard navigation untuk section/sidebar
- no motion critical path; animation subtle
- responsive laptop/tablet/mobile preview
- scroll area jelas, tidak nested scroll membingungkan

### Copywriting tone

Gunakan tone TESKEL:

- direct
- creator-first
- launch-oriented
- confident
- tidak terlalu enterprise/admin

Contoh yang diinginkan:

```txt
"Ready to launch"
"Fix next"
"Your offer is almost ready"
"Add a package buyers can understand"
"Preview what customers will see"
```

Hindari:

```txt
"Submit form"
"Entity details"
"No records found"
"Invalid payload"
```

### UI acceptance checklist per builder

Sebelum builder dianggap sesuai TESKEL current UI/UX:

- Tidak ada dominasi light card/white background.
- Primary CTA selalu lime.
- Header/sidebar/cards memakai border white opacity dan dark glass/night surfaces.
- Tidak ada gradient colorful random untuk theme utama.
- Save/publish/readiness state terlihat tanpa membuka devtools.
- Preview ada di atas fold pada desktop.
- Empty state punya starter content/next action.
- Required readiness bisa membawa user ke section terkait.
- Mobile/tablet tidak broken; minimal build/preview dapat dipakai.
- Semua loading/error states mengikuti dark premium pattern.


## Builder-specific plan

## 1. Service Builder rebuild

Service Builder menjadi migration pertama karena domain paling kecil dan cocok untuk membuktikan BuilderOS.

### New structure

```txt
app/(dashboard)/dashboard/services/[slug]/builder/page.tsx
app/(dashboard)/dashboard/services/[slug]/builder/_components/
  service-builder-provider.tsx
  service-basics-section.tsx
  service-packages-section.tsx
  service-delivery-section.tsx
  service-proof-section.tsx
  service-faq-section.tsx
  service-settings-section.tsx
  service-preview.tsx
  service-launch-center.tsx
```

### UX flow

```txt
1. Define offer
2. Package pricing
3. Delivery & scope
4. Proof / FAQ
5. Preview
6. Launch
```

### Features

- Package cards, bukan sekadar price input.
- Delivery timeline visual.
- Scope boundaries.
- Revision policy.
- FAQ builder.
- Live service page preview.
- Readiness score.
- Launch checklist.
- Share flow setelah publish.

### Service readiness

Required:

- title
- category
- clear service promise
- description
- package/pricing
- delivery days
- revision policy

Recommended:

- FAQ
- scope boundaries
- outcomes
- cover/proof
- SEO title/description

## 2. Event Builder rebuild

Event Builder diubah menjadi event launch studio.

### New structure

```txt
app/(dashboard)/dashboard/events/[slug]/builder/page.tsx
app/(dashboard)/dashboard/events/[slug]/builder/_components/
  event-builder-provider.tsx
  event-details-section.tsx
  event-schedule-section.tsx
  event-location-section.tsx
  event-ticket-section.tsx
  event-registration-section.tsx
  event-speakers-section.tsx
  event-agenda-section.tsx
  event-design-section.tsx
  event-preview.tsx
  event-launch-center.tsx
```

### UX flow

```txt
1. Event identity
2. Schedule & location
3. Tickets
4. Registration
5. Speakers / agenda
6. Design
7. Preview
8. Launch
```

### Features

- Ticket tier builder.
- Capacity warning.
- Timezone clarity.
- Online/offline location logic.
- Registration form preview.
- Speaker cards.
- Agenda timeline.
- Mobile event preview.
- Dark/lime theme presets.
- Readiness-based launch.

### Event readiness

Required:

- title
- description
- date/time
- timezone
- location or online URL
- at least one ticket

Recommended:

- registration questions reviewed
- speaker/host
- agenda
- cover/theme
- SEO/share preview

## 3. Product Builder upgrade

Product Studio sudah paling kuat, jadi tidak perlu dibuang seluruhnya. Product menjadi flagship BuilderOS.

### Keep

- product-specific blocks
- build/preview/launch idea
- autosave/undo/redo behavior
- launch center concept
- copilot idea

### Change

- migrate shell ke `components/builder`.
- convert visual ke dark premium.
- move readiness logic ke shared readiness engine.
- improve preview mode.
- improve block ordering and section navigation.
- add command menu.
- strengthen publish/share flow.

### Product flow

```txt
1. Positioning
2. Media
3. Pricing
4. Assets
5. Trust
6. SEO
7. Preview
8. Launch
```

### Product readiness

Required:

- title
- tagline
- description
- pricing/license
- cover image
- downloadable asset or delivery logic

Recommended:

- FAQ
- SEO
- tags
- demo/video
- social proof
- changelog/tech stack if relevant

## 4. Course Builder rebuild

Course Builder paling kompleks, jadi dikerjakan setelah pattern BuilderOS stabil.

### New structure

```txt
app/(dashboard)/dashboard/courses/[slug]/builder/page.tsx
app/(dashboard)/dashboard/courses/[slug]/builder/_components/
  course-builder-provider.tsx
  course-curriculum-sidebar.tsx
  course-lesson-canvas.tsx
  course-lesson-inspector.tsx
  course-overview-section.tsx
  course-design-section.tsx
  course-pricing-section.tsx
  course-preview.tsx
  course-launch-center.tsx
```

### UX flow

```txt
1. Course overview
2. Curriculum
3. Lesson content
4. Design
5. Pricing
6. Preview as student
7. Launch
```

### Features

- Module/lesson drag reorder.
- Lesson block editor.
- Lesson type templates:
  - video
  - text
  - quiz
  - assignment
  - resource
  - embed
  - live session
- Student preview.
- Sales page preview.
- Free preview lesson.
- Drip settings.
- Lesson completion estimate.
- Launch checklist.

### Course readiness

Required:

- title/subtitle
- target audience
- learning outcomes
- at least one module
- at least three lessons
- non-empty lesson content
- pricing

Recommended:

- course cover
- trailer
- FAQ
- SEO
- free preview lesson
- requirements

## Unified create flow

Saat ini create flow berbeda-beda. Targetnya disatukan.

### New create entry

Optional route:

```txt
/dashboard/create
```

Tetap boleh punya route domain:

```txt
/dashboard/products/new
/dashboard/courses/new
/dashboard/events/new
/dashboard/services/new
```

Tetapi UI dan konsep wizard harus sama.

### Create wizard

```txt
Step 1: What are you creating?
Step 2: Name + goal
Step 3: Template
Step 4: Generate draft
Step 5: Open builder
```

### Templates

Product:

- Digital download
- SaaS kit
- Template
- Bundle
- Ebook
- License-based product

Course:

- Mini course
- Self-paced course
- Cohort course
- Workshop replay
- Certification

Event:

- Webinar
- Workshop
- Conference
- Masterclass
- Community meetup

Service:

- Consultation
- Design package
- Development package
- Coaching
- Audit

## Starter content

Builder tidak boleh terasa kosong. Setiap domain perlu starter content.

### Product starter

- hero copy placeholder
- pricing placeholder
- FAQ sample
- asset checklist

### Course starter

- module outline
- first lesson draft
- outcome examples
- audience examples

### Event starter

- event description framework
- default ticket
- default registration questions
- speaker placeholder

### Service starter

- package examples
- scope checklist
- FAQ examples
- delivery timeline

## AI/Copilot plan

AI harus contextual, bukan hanya chat sidebar.

### Product AI actions

- improve product copy
- generate FAQ
- suggest pricing tiers
- write SEO meta
- suggest launch checklist fixes

### Course AI actions

- generate curriculum
- expand lesson
- create quiz
- write learning outcomes
- summarize module

### Event AI actions

- write event description
- generate agenda
- create speaker bio
- suggest registration questions
- improve ticket copy

### Service AI actions

- create service packages
- define scope
- write FAQ
- improve sales copy
- suggest delivery timeline

### AI placement

- command menu
- inline section action
- right rail copilot
- launch readiness recommendation

## Preview system

Preview harus credible dan domain-specific.

### Product preview

- desktop product page
- mobile product page
- checkout preview
- public URL preview

### Course preview

- course sales page
- student dashboard
- lesson view
- mobile lesson view

### Event preview

- event landing page
- registration form
- ticket selection
- mobile event card

### Service preview

- service page
- package selector
- inquiry/order form
- mobile preview

## Launch flow

Semua builder harus mengikuti:

```txt
Build → Preview → Launch Checklist → Publish → Share Kit
```

### Share Kit

Setelah publish:

- public URL
- copy link
- suggested social copy
- view live page
- back to dashboard
- optional QR code
- optional embed/button snippet

## Route strategy

### Preferred future routes

```txt
/dashboard/products/[slug]/builder
/dashboard/courses/[slug]/builder
/dashboard/events/[slug]/builder
/dashboard/services/[slug]/builder
```

### Compatibility

Existing routes can redirect or remain temporarily:

```txt
/dashboard/studio?slug=...
/dashboard/events/builder?slug=...
/dashboard/services/[slug]
/dashboard/courses/[slug]
```

During migration, avoid breaking existing dashboard links unless corresponding redirects are added.

## Implementation order

Recommended sequence:

```txt
1. BuilderOS foundation components
2. Shared builder state + readiness engine
3. Rebuild Service Builder as first full pro builder
4. Rebuild Event Builder
5. Upgrade Product Studio into BuilderOS
6. Rebuild Course Studio
7. Unified create wizard/templates
8. Final polish + consistency pass
```

## Implementation strategy yang disarankan

Implementasi harus incremental. Jangan membongkar semua builder sekaligus.

### Golden path

```txt
Foundation → Service POC → Event migration → Product shell migration → Course migration → Create flow → Polish
```

### Prinsip migrasi aman

1. Tambah route/komponen baru lebih dulu, jangan langsung hapus route lama.
2. Pertahankan backend/action yang sudah jalan selama model datanya masih cukup.
3. Jangan migrasi Product Studio sampai shared shell terbukti stabil di Service/Event.
4. Jangan migrasi Course sebelum pattern nested state untuk lesson/curriculum jelas.
5. Setiap fase harus selesai dengan typecheck dan lint.
6. Setiap fase harus punya rollback path: route lama masih bisa dipakai sementara.
7. Setiap builder harus tetap bisa edit, save, preview, publish sebelum dianggap migrated.

### Phase 0: UI/UX alignment audit

Dilakukan sebelum coding fase besar.

Deliverables:

- identifikasi komponen existing yang sudah sesuai TESKEL dark/lime
- daftar komponen lama yang masih light/admin
- daftar route lama yang perlu compatibility
- daftar fields schema yang kurang untuk readiness/preview
- keputusan apakah perlu migration schema per domain

Checklist:

- landing/dashboard token sudah dipakai sebagai referensi
- tidak ada design system baru yang bertabrakan
- route lama yang dipakai dashboard diketahui
- data model tiap builder dipetakan

### Phase 1A: BuilderOS visual foundation only

Tujuan fase ini adalah membuat foundation UI tanpa mengubah domain behavior besar.

Deliverables:

- `components/builder/builder-shell.tsx`
- `components/builder/builder-header.tsx`
- `components/builder/builder-sidebar.tsx`
- `components/builder/builder-canvas.tsx`
- `components/builder/builder-inspector.tsx`
- `components/builder/builder-preview-rail.tsx`
- `components/builder/builder-mode-tabs.tsx`
- `components/builder/builder-section-card.tsx`
- `components/builder/builder-save-indicator.tsx`
- `components/builder/builder-status-badge.tsx`
- `components/builder/builder-readiness-panel.tsx`
- `components/builder/builder-launch-center.tsx`
- `components/builder/builder-empty-state.tsx`
- `components/builder/builder-field.tsx`
- `components/builder/builder-toolbar.tsx`

Non-goals:

- belum membuat semua domain builder
- belum memindahkan Product Studio
- belum membuat AI command menu penuh
- belum menghapus file lama

Acceptance:

- semua komponen memakai TESKEL current UI tokens
- dapat dipakai oleh Service Builder POC
- tidak mengubah behavior route existing
- typecheck/lint tidak rusak

### Phase 1B: Readiness foundation

Deliverables:

- `lib/builder/readiness/types.ts`
- `lib/builder/readiness/score.ts`
- `lib/builder/readiness/service.ts`
- readiness UI dapat menerima item generic
- action target dapat scroll/focus ke section

Non-goals:

- readiness Product/Course/Event boleh menyusul
- publish gating cukup untuk Service dulu

Acceptance:

- required/recommended/optional terbaca jelas
- score/progress akurat
- incomplete item punya action
- publish Service bisa dicegah jika required belum lengkap

### Phase 2A: Service Builder POC tanpa schema migration

Jika ingin cepat dan minim risiko, mulai dari fields yang sudah ada.

Fields existing:

- title
- description
- category
- priceCents
- currency
- deliveryDays
- revisions
- coverImage
- status

Deliverables:

- route baru `/dashboard/services/[slug]/builder`
- Service builder provider lokal/domain hook
- BuilderOS shell dipakai penuh
- basics section
- pricing/package presentation dari existing price
- delivery section
- description/proof section dari existing fields
- settings section
- live preview
- readiness service basic
- publish/unpublish
- manual save + autosave
- legacy route tetap aman

Limitasi yang diterima:

- FAQ belum persistent kecuali memakai field existing
- scope/outcomes/proof belum persistent kecuali dimasukkan ke description
- package cards masih presentational, belum multi-package real

Acceptance:

- Service bisa dibuka dari route baru
- perubahan field existing tersimpan
- readiness required bekerja
- preview mengikuti state lokal
- publish flow jelas
- UI tidak terasa seperti form admin lama

### Phase 2B: Service Builder full schema upgrade

Jika targetnya sesuai plan penuh, lakukan setelah POC stabil.

Schema fields yang disarankan:

```txt
Service:
  promise          String?
  packagesJson     String?
  scopeJson        String?
  outcomesJson     String?
  faqJson          String?
  proofJson        String?
  metaTitle        String?
  metaDescription  String?
```

Deliverables:

- Prisma schema update
- API/action update
- service package cards persistent
- FAQ builder persistent
- scope boundaries persistent
- outcomes/proof persistent
- SEO readiness persistent

Acceptance:

- existing services tetap bisa dibuka
- null/empty states aman
- all new JSON fields parse safely
- Prisma generate/typecheck sukses

### Phase 3A: Event Builder route compatibility

Sebelum rebuild penuh, buat route baru dan bridge ke data lama.

Deliverables:

- route baru `/dashboard/events/[slug]/builder`
- route lama `/dashboard/events/builder?slug=...` tetap jalan atau redirect aman
- data loading by slug
- BuilderOS shell dipakai
- theme presets diganti dark/lime premium

Acceptance:

- link lama tidak broken
- event existing bisa diedit
- tickets/questions/speakers tetap bekerja

### Phase 3B: Event Builder full migration

Deliverables:

- split components sesuai plan
- event details/schedule/location/tickets/registration/speakers/agenda/design
- event readiness
- event preview
- launch center
- undo/redo jika state engine sudah siap

Acceptance:

- nested CRUD tickets/questions/speakers tidak regress
- timezone/location clarity jelas
- publish gated by required readiness
- no random colorful gradients as default theme

### Phase 4: Product Studio migration

Product hanya dimigrasi setelah BuilderOS shell stabil.

Deliverables:

- Product Studio menggunakan shared BuilderOS shell
- readiness dipindah ke `lib/builder/readiness/product.ts`
- visual dark premium diselaraskan
- preview/launch/share ditingkatkan
- command menu optional

Acceptance:

- semua behavior lama tetap ada
- autosave/undo/redo tidak regress
- route lama `/dashboard/studio?slug=...` tetap aman
- optional route baru `/dashboard/products/[slug]/builder`

### Phase 5: Course Studio migration

Course dikerjakan paling akhir.

Deliverables:

- shell BuilderOS
- readiness course
- curriculum sidebar tetap kuat
- lesson canvas/inspector dark premium
- student preview
- launch center
- undo/redo cleanup

Acceptance:

- chapter/lesson CRUD tetap aman
- reorder tetap aman
- lesson content tidak hilang
- sales/student preview jelas
- publish gated by required readiness

### Phase 6: Unified create flow

Deliverables:

- `/dashboard/create`
- unified wizard
- templates per domain
- starter content per domain
- redirect ke builder route baru

Acceptance:

- route domain lama tetap aman
- creator bisa membuat draft cepat
- starter content membuat builder tidak kosong

### Phase 7: Final consistency pass

Deliverables:

- hapus komponen lama yang benar-benar tidak dipakai
- route redirect final
- accessibility pass
- responsive pass
- copywriting pass
- visual consistency pass
- lint/typecheck/build

Acceptance:

- semua builder pakai BuilderOS foundation
- tidak ada builder monolithic besar yang tersisa untuk UI utama
- old routes aman/redirected
- UI konsisten dengan TESKEL current dark/lime

## Phase details

### Phase 1: BuilderOS foundation

Deliverables:

- shared shell
- shared header
- shared sidebar
- shared preview rail
- shared section cards
- shared status/save indicators
- shared launch/readiness UI
- dark premium base styles

### Phase 2: Shared state + readiness

Deliverables:

- `use-builder-state`
- domain adapters
- readiness definitions
- keyboard shortcuts
- save retry/error UI
- undo/redo foundation

### Phase 3: Service migration

Deliverables:

- new service builder route/components
- service provider/hook
- service readiness
- service live preview
- publish/share flow
- legacy route compatibility

### Phase 4: Event migration

Deliverables:

- new event builder route/components
- event provider/hook
- ticket/registration/speaker sections
- event readiness
- event live preview
- dark event theme presets
- legacy route compatibility

### Phase 5: Product migration

Deliverables:

- product uses shared BuilderOS shell
- product readiness moved to shared engine
- product dark premium visual pass
- improved preview/launch/share

### Phase 6: Course migration

Deliverables:

- course uses shared BuilderOS shell
- course readiness
- curriculum/lesson workflow preserved but visually upgraded
- student preview
- launch center
- undo/redo cleanup

### Phase 7: Create flow/templates

Deliverables:

- unified create wizard
- domain templates
- starter content generation
- route consistency

### Phase 8: Final polish

Deliverables:

- remove old unused builder components/pages where safe
- consistency pass across all builders
- accessibility pass
- responsive pass
- lint/typecheck/build verification

## Quality bar

Each builder is considered complete only if:

### Functional

- autosave works
- manual save works
- publish/unpublish works
- preview works
- readiness works
- no data loss on navigation
- loading/error states are polished
- destructive actions use modal confirmation

### UX

- no old admin feel
- no inconsistent primary colors
- dark premium visual language
- helpful empty states
- guided workflow
- preview-first
- launch-oriented
- responsive enough for laptop/tablet/mobile preview

### Code

- no monolithic builder pages
- shared shell is used
- repeated header/sidebar/save code removed
- domain sections are split
- state is not duplicated per page
- types are clean
- `pnpm typecheck` passes
- `pnpm lint` passes

## Definition of done

BuilderOS redesign is done when:

1. Product, Course, Event, and Service builders all use the shared BuilderOS foundation.
2. All builders have Build/Preview/Launch or equivalent workflow.
3. All builders have readiness score/checklist.
4. All builders have dark premium landing-aligned UI.
5. All builders have live preview.
6. All builders support reliable autosave and publish flow.
7. Old builder routes are either migrated or safely redirected.
8. Typecheck and lint pass.
