import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import numberZero from '../../assets/img/number-zero.png';
import numberFour from '../../assets/img/number-four.png';
import vector from '../../assets/img/Vector.png';
import vector1 from '../../assets/img/Vector-1.png';
import vector2 from '../../assets/img/Vector-2.png';
import vector3 from '../../assets/img/Vector-3.png';
import vector4 from '../../assets/img/Vector-4.png';

import styles from './notFound.module.scss';

import 'bootstrap/dist/css/bootstrap.min.css';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className={styles['error-container']}>
      <h1 className={styles['error-heading']}>
        {t('pageNotFound.errorHeading')}
      </h1>
      <p className={styles['error-description']}>
        {t('pageNotFound.errorDescription')}
      </p>
      <div className={styles['number-display']}>
        <img
          src={numberFour}
          className={styles['number-image']}
          alt="Number Four"
          loading="lazy"
        />
        <img
          src={numberZero}
          className={styles['number-image']}
          alt="Number Zero"
          loading="lazy"
        />
        <img
          src={vector4}
          className={styles['ghost-body']}
          alt="Ghost body"
          loading="lazy"
        />
        <img
          src={vector1}
          className={styles['ghost-right-leg']}
          alt="Ghost right leg"
          loading="lazy"
        />
        <img
          src={vector}
          className={styles['ghost-left-leg']}
          alt="Ghost left leg"
          loading="lazy"
        />
        <img
          src={vector2}
          className={styles['ghost-right-eye']}
          alt="Ghost right eye"
          loading="lazy"
        />
        <img
          src={vector3}
          className={styles['ghost-left-eye']}
          alt="Ghost left eye"
          loading="lazy"
        />
        <img
          src={numberFour}
          className={styles['number-image']}
          alt="Number Four"
          loading="lazy"
        />
        <Link to="/" className={styles['back-to-safety']}>
          <button type="button" className={styles['error-button']}>
            {t('pageNotFound.backToSafetyButton')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
