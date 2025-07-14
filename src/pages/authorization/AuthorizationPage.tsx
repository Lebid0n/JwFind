import styles from './authorization-page.module.scss'
import Authorization from '@/widgets/authorization-panel/Authorization';

function AuthorizationPage() {
  return(
    <div className={styles.content}>
      <Authorization />
    </div>
  )
}

export default AuthorizationPage;