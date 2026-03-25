import RegisterForm from './RegisterForm';
import styles from './Register.module.css';

export const metadata = {
  title: 'Fiók Létrehozása | TorqueLab',
  description: 'Csatlakozz a TorqueLab Ford tuning közösségéhez',
};

export default function RegisterPage() {
  return (
    <div className={styles.authWrapper}>
      <RegisterForm />
    </div>
  );
}