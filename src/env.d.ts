/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    /** Breadcrumb trail read from the page's BreadcrumbList (Base.astro → PageHero). */
    crumbs?: { name: string; url: string }[];
  }
}
