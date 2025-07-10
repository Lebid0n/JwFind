import styles from './authorization-page.module.scss'
import Authorization from '@/widgets/authorizationPanel/Authorization';

function AuthorizationPage() {
  return(
    <body className={styles.body}>
      <Authorization />
    </body>
  )
}

export default AuthorizationPage;