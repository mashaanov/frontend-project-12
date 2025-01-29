import { Link } from "react-router-dom";
import styles from "./notFound.module.scss";
import numberZero from "../../assets/img/number-zero.png";
import numberFour from "../../assets/img/number-four.png";
import "bootstrap/dist/css/bootstrap.min.css";

const NotFound = () => {
  return (
    <div className={styles["error-container"]}>
      <h1 className={styles["error-heading"]}>Boo! You mustn't be here!</h1>
      <p className={styles["error-description"]}>
        It seems you&apos;ve wandered into a haunted part of the site.
        Let&apos;s guide you back to safety!
      </p>
      <div className={styles["number-display"]}>
        <img
          src={numberFour}
          className={styles["number-image"]}
          alt="Number Four"
        />
        <img
          src={numberZero}
          className={styles["number-image"]}
          alt="Number Zero"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="232"
          height="329"
          viewBox="0 0 232 329"
          fill="none"
          className={styles["ghost-body"]}
        >
          <path
            d="M62.7413 107.637V54.8185C62.7413 25.7683 86.5097 2 115.56 2C144.61 2 168.378 25.7683 168.378 54.8185V107.637C189.066 178.062 209.313 248.927 230 319.351C226.479 321.552 215.915 328.154 200.95 326.834C190.386 325.954 183.344 321.552 179.822 319.351C177.181 321.112 169.259 326.834 157.375 326.834C145.05 326.834 136.687 321.112 134.486 319.351C131.846 321.552 123.483 327.274 111.158 326.834C100.154 326.834 92.2317 321.992 89.5907 319.791C86.9498 321.552 79.027 326.834 67.583 326.834C56.5792 326.834 48.6564 321.992 46.0154 319.791C43.3745 321.552 35.4517 326.834 24.4479 326.834C12.5637 326.834 4.64093 321.112 2 319.351C21.3668 248.927 42.0541 178.062 62.7413 107.637Z"
            stroke="black"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="61"
          height="61"
          viewBox="0 0 61 61"
          fill="none"
          className={styles["ghost-right-leg"]}
        >
          <path
            d="M36.7332 2.00391H1.52087V54.8224C1.52087 57.4634 3.28149 59.224 5.92242 59.224H54.3394C56.9803 59.224 58.7409 57.4634 58.7409 54.8224V41.6178C58.7409 35.4556 54.3394 29.7337 48.1772 28.8534L36.7332 28.4132V2.00391Z"
            stroke="black"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="52"
          height="61"
          viewBox="0 0 52 61"
          fill="none"
          className={styles["ghost-left-leg"]}
        >
          <path
            d="M15.1421 2.00391H50.3545V50.4209L45.9529 59.224H6.33904C3.69812 59.224 1.9375 57.4634 1.9375 54.8224V41.6178C1.9375 35.4556 6.33905 29.7337 12.5012 28.8534L15.1421 28.4132V2.00391Z"
            stroke="black"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="12"
          viewBox="0 0 11 12"
          fill="none"
          className={styles["ghost-right-eye"]}
        >
          <path
            d="M10.6445 6.01574C10.6445 9.09682 8.00359 11.2976 5.36267 11.2976C2.28159 11.2976 0.0808105 8.65667 0.0808105 6.01574C0.0808105 2.93466 2.72174 0.733887 5.36267 0.733887C8.44375 0.733887 10.6445 3.37481 10.6445 6.01574Z"
            fill="black"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={styles["ghost-left-eye"]}
        >
          <path
            d="M11.5322 6.01574C11.5322 9.09682 8.89129 11.2976 6.25036 11.2976C3.16928 11.2976 0.968506 8.65667 0.968506 6.01574C0.968506 2.93466 3.60944 0.733887 6.25036 0.733887C8.89129 0.733887 11.5322 3.37481 11.5322 6.01574Z"
            fill="black"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="42"
          height="16"
          viewBox="0 0 42 16"
          fill="none"
          className={styles["ghost-part-of-leg"]}
        >
          <path
            d="M0.740845 2.41309H29.3509C35.513 2.41309 40.3547 5.05401 40.3547 11.2162V15.6177"
            stroke="black"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
        </svg>
        <img
          src={numberFour}
          className={styles["number-image"]}
          alt="Number Four"
        />
        <Link to="/" className={styles["back-to-safety"]}>
          <button className={styles["error-button"]}>
            Return to the homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
