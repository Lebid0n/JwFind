import ProfileNav from "@/widgets/profile-nav/ProfileNav";
import EmployeeProfile from "@/widgets/employee-profile/EmployeeProfile";
import styles from "./profile-page.module.scss"

function ProfilePage() {
  return(
    <div className={styles.profilePage}>
      <ProfileNav />
      <EmployeeProfile />
    </div>
  )
}

export default ProfilePage;