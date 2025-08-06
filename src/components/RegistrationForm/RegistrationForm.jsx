import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./RegistrationForm.module.scss";
import { fetchPositions, registerUser, fetchToken } from "../../services/api";

export default function RegistrationForm({ onUserRegistered }) {
  const [positions, setPositions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    async function loadPositions() {
      try {
        const pos = await fetchPositions();
        setPositions(pos);
      } catch (e) {
        console.error(e);
      }
    }
    loadPositions();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Minimum 2 characters")
      .max(60, "Maximum 60 characters")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string()
      .matches(
        /^\+?380\d{9}$/,
        "Phone number must start with +380 and contain 9 digits"
      )
      .required("Required"),
    position_id: Yup.number().required("Required"),
    photo: Yup.mixed()
      .required("Photo is required")
      .test(
        "fileSize",
        "File too large (max 5MB)",
        (value) => !value || value.size <= 5242880
      )
      .test(
        "fileType",
        "Unsupported file format",
        (value) => !value || ["image/jpeg", "image/jpg"].includes(value.type)
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      position_id: "",
      photo: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setSuccess(false);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("position_id", values.position_id);
        formData.append("photo", values.photo);

        const token = await fetchToken(); // ОТРИМУЄМО ТОКЕН
        await registerUser(formData, token); // РЕЄСТРУЄМО КОРИСТУВАЧА З ТОКЕНОМ

        setSuccess(true);
        resetForm();
        setPhotoPreview(null);

        if (onUserRegistered) onUserRegistered();
      } catch (error) {
        console.error(error);
        alert("Registration failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const onPhotoChange = (e) => {
    const file = e.currentTarget.files[0];
    formik.setFieldValue("photo", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  return (
    <section id="registration" className={styles.registrationForm}>
      <div className={`container ${styles.container}`}>
        <h2 className={styles.title}>Working with POST request</h2>
        {success && (
          <p className={styles.successMsg}>User successfully registered!</p>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            aria-label="Name"
            {...formik.getFieldProps("name")}
            className={
              formik.touched.name && formik.errors.name ? styles.inputError : ""
            }
          />
          {formik.touched.name && formik.errors.name && (
            <div className={styles.error}>{formik.errors.name}</div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            {...formik.getFieldProps("email")}
            className={
              formik.touched.email && formik.errors.email
                ? styles.inputError
                : ""
            }
          />
          {formik.touched.email && formik.errors.email && (
            <div className={styles.error}>{formik.errors.email}</div>
          )}

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            aria-label="Phone"
            {...formik.getFieldProps("phone")}
            className={
              formik.touched.phone && formik.errors.phone
                ? styles.inputError
                : ""
            }
          />
          <div className={styles.hint}>+38 (XXX) XXX - XX - XX</div>
          {formik.touched.phone && formik.errors.phone && (
            <div className={styles.error}>{formik.errors.phone}</div>
          )}

          <fieldset className={styles.positionFieldset}>
            <legend className={styles.legend}>Select your position</legend>
            {positions.map((pos) => (
              <label
                key={pos.id}
                htmlFor={`position-${pos.id}`}
                className={styles.positionLabel}
              >
                <input
                  id={`position-${pos.id}`}
                  type="radio"
                  name="position_id"
                  value={pos.id}
                  checked={formik.values.position_id === String(pos.id)}
                  onChange={() =>
                    formik.setFieldValue("position_id", String(pos.id))
                  }
                />
                {pos.name}
              </label>
            ))}
            {formik.touched.position_id && formik.errors.position_id && (
              <div className={styles.error}>{formik.errors.position_id}</div>
            )}
          </fieldset>

          <input
            id="photo"
            type="file"
            name="photo"
            accept="image/jpeg, image/jpg"
            onChange={onPhotoChange}
            aria-label="Photo"
            className={
              formik.touched.photo && formik.errors.photo
                ? styles.inputError
                : ""
            }
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className={styles.photoPreview}
            />
          )}
          {formik.touched.photo && formik.errors.photo && (
            <div className={styles.error}>{formik.errors.photo}</div>
          )}

          <button
            className={`button ${styles.formButton}`}
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Registering..." : "Sign up"}
          </button>
        </form>
      </div>
    </section>
  );
}
