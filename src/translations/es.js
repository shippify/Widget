import { messageIds } from './messages'

export const translations = {
  [messageIds.DROPOFF_ADDRESS_PLACEHOLDER]: 'Dirección de entrega',
  [messageIds.CLIENT_NAME_PLACEHOLDER]: 'Nombre y apellido',
  [messageIds.CLIENT_EMAIL_PLACEHOLDER]: 'Dirección de correo (opcional)',
  [messageIds.CLIENT_PHONE_PLACEHOLDER]: 'Número de teléfono',
  [messageIds.SPECIAL_INSTRUCTIONS_PLACEHOLDER]: 'Información adicional',
  [messageIds.INVALID_DROPOFF_ADDRESS_PROMPT]: 'Ingrese la dirección de entrega.',
  [messageIds.INVALID_CLIENT_NAME_PROMPT]: 'Campo es obligatorio.',
  [messageIds.INVALID_CLIENT_EMAIL_PROMPT]: 'Ingrese una dirección de correo valida.',
  [messageIds.INVALID_CLIENT_PHONE_PROMPT]: 'Ingrese un número telefónico valido',
  [messageIds.VEHICLE_TYPES_LABEL]: '¿Dónde puede caber tu paquete?',
  [messageIds.ORDER_BUTTON_TITLE]: 'Ordenar',
  [messageIds.DELIVERY_TIME_WINDOW_TITLE]: 'Entregar entre:',
}
