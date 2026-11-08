# Database Notes — Supabase

Project ID: emlokjzwawjaxhfndded

## Current verification status
The live schema has not yet been inspected in this development pass. Do not treat the following as a verified schema.

## Known existing object (reported)
- Table: wedding_admins
- A prior attempt to create it again returned PostgreSQL error 42P07 (relation already exists).

## Required inspection before any migration
1. Enumerate existing tables, columns, primary keys and foreign keys.
2. Inspect indexes, constraints, triggers and functions.
3. Inspect RLS enabled state and all policies.
4. Identify existing RSVP, wishes, gift and slip tables if present.
5. Check whether service-role credentials are used only server-side; never expose them in browser code.
6. Confirm whether the Apps Script writes to Supabase and inspect its exact payload/response contract.

## Safety rule
Never run CREATE TABLE blindly. Prefer additive, idempotent migrations only after comparing against the live schema. Never commit Supabase secrets, service-role keys or private tokens.
