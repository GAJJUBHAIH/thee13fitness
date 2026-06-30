import PocketBase from 'pocketbase'
import { ENV } from '../constants/index.js'

export const isPocketBaseEnabled = Boolean(ENV.pocketbase.url)

export const pb = isPocketBaseEnabled ? new PocketBase(ENV.pocketbase.url) : null
