export type View = 'landing' | 'presentation' | 'experiences' | 'contact' | 'privacy' | 'legal'
export type Theme = 'light' | 'dark'

export interface NavItem {
  id: View
  label: string
}
