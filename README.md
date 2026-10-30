# Desofec AI Studio

Desofec AI Studio is a beginner-first platform built to help people discover the right AI tools, learning paths, and starter resources for their goals.

## Purpose

The product solves a real problem:
- many people do not know what tools to use
- many people do not know what to learn first
- many people feel overwhelmed by the speed of technology

The platform gives people:
- a simple onboarding flow
- recommended paths based on their goal
- a curated list of tools by purpose and skill level
- starter packs and practical resources
- a clearer way to move from confusion to action

## Current MVP direction

This repository contains a working prototype of the early product experience:
- homepage
- onboarding flow
- results page
- tools directory
- learning paths page
- starter pack page
- structured data layer for goals, tools, and starter resources

## Tech stack used in the MVP

- HTML, CSS, JavaScript
- No backend yet
- data-driven UI layer using structured front-end data
- designed to evolve into a Next.js + Supabase product later

## Recommended product direction

The product is intended to evolve into a hybrid platform that combines:
- guided onboarding
- curated tool discovery
- beginner-friendly learning paths
- practical starter resources
- optional AI assistance in future versions

## Future evolution

Planned improvements:
- custom data model and database layer
- user progress tracking
- real personalization
- better AI recommendation logic
- stronger learning path detail pages
- real downloadable resources and templates

## Run locally

The pages load the content files with `fetch`, so run the site through an HTTP server rather than opening the HTML files directly.

Example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

## Content data

The browser loads the product catalog from JSON files in `data/`:
- `goals.json` — onboarding goals
- `tools.json` — recommended tools
- `paths.json` — learning paths and steps
- `starter-packs.json` — starter resources
- `recommendations.json` — goal-to-tools, paths, and packs mapping

Update these files to change product content; `script.js` loads and renders them.
