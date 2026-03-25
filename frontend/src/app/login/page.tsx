import LoginForm from './LoginForm';
import styles from './Login.module.css';

export const metadata = {
  title: 'Bejelentkezés | TorqueLab',
  description: 'Jelentkezz be a TorqueLab fiókodba',
};

export default function LoginPage() {
  return (
    <div className={styles.authWrapper}>
      <LoginForm />
    </div>
  );
}