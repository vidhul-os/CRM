import { z } from 'zod'

export const leadSchema = z.object({
  name:    z.string().min(2, 'Name is required (min 2 chars)'),
  email:   z.string().email('Invalid email address'),
  phone:   z.string().optional(),
  company: z.string().min(2, 'Company name is required'),
  status:  z.string().default('New'),
  source:  z.string().optional(),
  owner:   z.string().default('Admin'),
})

export const dealSchema = z.object({
  name:      z.string().min(2, 'Deal name is required'),
  contact:   z.string().min(2, 'Primary contact is required'),
  company:   z.string().min(2, 'Company is required'),
  value:     z.coerce.number().min(0, 'Value must be positive'),
  stage:     z.string().default('Qualification'),
  closeDate: z.string(),
  owner:     z.string().default('Admin'),
})
export const companySchema = z.object({
  name:     z.string().min(2, 'Company name is required'),
  domain:   z.string().optional(),
  industry: z.string().optional(),
  size:     z.string().optional(),
  country:  z.string().optional(),
  city:     z.string().optional(),
  phone:    z.string().optional(),
  website:  z.string().optional(),
  revenue:  z.coerce.number().optional(),
})
