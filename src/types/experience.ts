export type SortDir = 'desc' | 'asc'

export interface ExpLink {
  label: string
  url:   string
}

export interface DescriptionSection {
  titre: string
  texte: string
}

export interface Experience {
  id:                   string
  nom:                  string
  detailed_date:        [string, string]
  type:                 string
  domaine:              string[]
  employeur_collab:     string
  description:          DescriptionSection[] | string
  metiers_lies:         string[]
  competences_obtenir:  string[]
  soft_skills_utilises: string[]
  links?:               ExpLink[]
}
