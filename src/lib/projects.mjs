/* ===========================================================================
   Barrel for project case studies. Kept so existing imports
   (`../lib/projects.mjs`) stay stable after the split:
     ./projects/data.mjs    — content/data only
     ./projects/render.mjs  — HTML renderer + JSON-LD + head helpers
   =========================================================================== */

export { projects } from "./projects/data.mjs";
export { projectHead, renderProjectMain } from "./projects/render.mjs";
