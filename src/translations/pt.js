import { messageIds } from './messages'

export const translations = {
  [messageIds.DROPOFF_ADDRESS_PLACEHOLDER]: 'Endereço de entrega',
  [messageIds.CLIENT_NAME_PLACEHOLDER]: 'Nome',
  [messageIds.CLIENT_EMAIL_PLACEHOLDER]: 'E-mail (opcional)',
  [messageIds.CLIENT_PHONE_PLACEHOLDER]: 'Número de telefone',
  [messageIds.SPECIAL_INSTRUCTIONS_PLACEHOLDER]: 'Informação adicional',
  [messageIds.INVALID_DROPOFF_ADDRESS_PROMPT]: 'Precisa um endereço de entrega.',
  [messageIds.INVALID_CLIENT_NAME_PROMPT]: 'Campo é obrigatorio.',
  [messageIds.INVALID_CLIENT_EMAIL_PROMPT]: 'Deve ser um endereço de e-mail válido.',
  [messageIds.INVALID_CLIENT_PHONE_PROMPT]: 'Deve ser um número de telefone válido.',
  [messageIds.VEHICLE_TYPES_LABEL]: 'Escolha um veículo para o seu pacote',
  [messageIds.ORDER_BUTTON_TITLE]: 'Encomende',
  [messageIds.DELIVERY_TIME_WINDOW_TITLE]: 'Entregar entre:',
}
