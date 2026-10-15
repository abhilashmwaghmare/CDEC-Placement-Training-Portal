# CloudBlitz CDEC Placement Training Classroom 2026

A static, trainer-ready placement training classroom built from the supplied CDEC workbook.

## Source of truth
The application content is extracted from:
`source/CloudBlitz_Placement_Training_Material_CDEC-2026_Final(1).xlsx`

The workbook's 17 worksheets are preserved in `src/data/content.js` and are available through the Workbook Explorer.

## Included source material
- 12-day CDEC syllabus and roadmap
- Introduction SOP
- Resume SOP
- Actual fresher/intern resume content
- Actual experienced resume content
- Naukri Profile SOP
- 11 actual Naukri profile snapshots extracted from the workbook
- LinkedIn Profile SOP
- Job Roles & Responsibilities
- Linux & System R&R
- AWS & Cloud R&R
- DevOps R&R
- Documents
- Recruitment Workflow
- Recruitment workflow visual
- Communication Training
- Quick Reference Card

## Trainer features
- Day-wise classroom navigation
- Trainer Mode
- Previous/Next navigation
- Keyboard navigation: Left / Right / Esc
- Topic completion tracking with localStorage
- Actual screenshot lightbox
- Resume viewer and print view
- Workbook Explorer
- Global source-content search
- Responsive classroom UI
- GitHub Pages compatible relative asset paths

## Run
This project has no runtime backend and no third-party runtime dependency.

Build the deployable static site:

```bash
npm run build
```

The result is in `dist/`.

For local testing, serve `dist/` with any static HTTP server.

## GitHub Pages
Publish the contents of `dist/` to GitHub Pages, or configure the repository to deploy the `dist` folder. The application uses relative asset paths (`./`) so it is suitable for repository subpaths.

## Content integrity
No dummy training records or invented source examples are used. Where the workbook contains structured source rows rather than a separate asset file, the application presents those exact source rows in its viewer.
