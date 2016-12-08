import { messageIds } from './messages'

export const translations = {
  [messageIds.DROPOFF_ADDRESS_PLACEHOLDER]: 'Dropoff address',
  [messageIds.CLIENT_NAME_PLACEHOLDER]: 'Full name',
  [messageIds.CLIENT_EMAIL_PLACEHOLDER]: 'Email address (optional)',
  [messageIds.CLIENT_PHONE_PLACEHOLDER]: 'Phone number',
  [messageIds.SPECIAL_INSTRUCTIONS_PLACEHOLDER]: 'Additional information',
  [messageIds.INVALID_DROPOFF_ADDRESS_PROMPT]: 'Needs a valid dropoff location.',
  [messageIds.INVALID_CLIENT_NAME_PROMPT]: 'Field is required.',
  [messageIds.INVALID_CLIENT_EMAIL_PROMPT]: 'Field must be a valid email address.',
  [messageIds.INVALID_CLIENT_PHONE_PROMPT]: 'Field must be a valid phone number.',
  [messageIds.VEHICLE_TYPES_LABEL]: 'Pick a ride for your package',
  [messageIds.ORDER_BUTTON_TITLE]: 'Order',
  [messageIds.DELIVERY_TIME_WINDOW_TITLE]: 'Deliver between',
}
