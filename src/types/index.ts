export type View = 'landing' | 'presentation' | 'experiences' | 'contact'
export type Theme = 'light' | 'dark'

export interface NavItem {
  id: View
  label: string
}
