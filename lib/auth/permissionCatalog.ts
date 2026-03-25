export const PERMISSION_CATALOG = [
  { name: 'manage_users', label: 'Manage users and roles' },
  { name: 'edit_home', label: 'Edit Home page' },
  { name: 'edit_about', label: 'Edit About page' },
  { name: 'edit_services', label: 'Edit Services page' },
  { name: 'edit_projects', label: 'Create/update/delete projects' },
  { name: 'edit_blog', label: 'Create/update/delete blog posts' },
  { name: 'edit_news', label: 'Create/update/delete news items' },
  { name: 'reply_messages', label: 'Reply to contact and appointment messages' },
  { name: 'view_contact_submissions', label: 'View contact submissions' },
  { name: 'view_appointments', label: 'View appointments' },
  { name: 'view_project_submissions', label: 'View project submissions' },
  { name: 'manage_settings', label: 'Manage settings' },
] as const

export const LEGACY_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    'manage_users',
    'edit_home',
    'edit_about',
    'edit_services',
    'edit_projects',
    'edit_blog',
    'edit_news',
    'view_contact_submissions',
    'view_project_submissions',
    'view_appointments',
    'reply_messages',
    'manage_settings',
  ],
  content_manager: [
    'edit_home',
    'edit_about',
    'edit_services',
    'edit_projects',
    'edit_blog',
    'edit_news',
  ],
  communications: [
    'view_contact_submissions',
    'view_appointments',
    'reply_messages',
  ],
}

export type Permission = string