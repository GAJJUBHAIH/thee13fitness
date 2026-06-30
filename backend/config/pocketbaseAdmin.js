import PocketBase from 'pocketbase'
import { config } from './env.js'

export const pb = new PocketBase(config.pocketbase.url)

// Authenticate as admin to bypass standard collection rules
if (config.pocketbase.adminEmail && config.pocketbase.adminPassword) {
  pb.admins.authWithPassword(config.pocketbase.adminEmail, config.pocketbase.adminPassword)
    .then(() => {
      console.log('PocketBase Admin initialized successfully.')
    })
    .catch((error) => {
      console.error('PocketBase Admin initialization error:', error)
    })
} else {
  console.warn('PocketBase Admin NOT initialized: Missing credentials in ENV.')
}
