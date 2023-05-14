export interface VuedocNavLink {
  title: string
  to?: string
  href?: string
}

export interface VuedocNavGroup {
  title: string
  items: VuedocNavLink[]
}

export type VuedocNav = Array<VuedocNavLink | VuedocNavGroup>

export interface ModuleOptions {
  nav: VuedocNav
  github?: string
  docsDir: string,
  docsBaseUrl: string
}

export interface MdFileInfo {
  srcPath: string
  tmplPath: string
  url: string
  routeName: string
  hash: string
  template: string
  frontmatter: Record<string, string>
}
