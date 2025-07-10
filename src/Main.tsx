// react
  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
// app
  import App from '@/app/App'
// i18n
  import { I18nextProvider } from 'react-i18next';
  import i18n from 'i18next'
// css
  import '@/shared/styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
