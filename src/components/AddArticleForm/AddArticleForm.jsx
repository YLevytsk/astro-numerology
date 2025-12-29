import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { addArticle } from "../../redux/articles/operations";
import IconUploadFoto from "../../assets/img/icons/media.svg?react";
import css from "./AddArticleForm.module.css";
import toast from "react-hot-toast";
import { selectLoading } from "../../redux/articles/selectors.js";
import Loader from "../Loader/Loader.jsx";

/* ================== НАСТРОЙКИ ================== */

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

/* ================== IMAGE RESIZE ================== */

const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target.result;
    };

    reader.onerror = reject;
    img.onerror = reject;

    img.onload = () => {
      let { width, height } = img;

      const scale = Math.min(
        maxWidth / width,
        maxHeight / height,
        1
      );

      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (!blob) {
            reject("Canvas error");
            return;
          }

          const webpFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, ".webp"),
            { type: "image/webp" }
          );

          resolve(webpFile);
        },
        "image/webp",
        0.8
      );
    };

    reader.readAsDataURL(file);
  });
};

/* ================== VALIDATION ================== */

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(48, "Title must be under 48 characters")
    .required("Title is required"),

  text: Yup.string()
    .min(100, "Text must be at least 100 characters")
    .max(4000, "Text must be at most 4000 characters")
    .required("Text is required"),

  image: Yup.mixed()
    .required("Image is required")
    .test(
      "fileSize",
      "File is too large (max 2MB)",
      value => value && value.size <= MAX_FILE_SIZE
    )
    .test(
      "fileFormat",
      "Only JPG, PNG or WEBP allowed",
      value => value && SUPPORTED_FORMATS.includes(value.type)
    ),
});

/* ================== COMPONENT ================== */

export const CreateArticleForm = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const textRef = useRef();
  const isLoading = useSelector(selectLoading);

  const initialValues = {
    title: "",
    text: "",
    image: null,
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.text);
    formData.append("img", values.image);
    formData.append("desc", values.text.slice(0, 200));
    formData.append("date", new Date().toISOString()); // добавлено обязательное поле

    try {
      const response = await dispatch(addArticle(formData)).unwrap();
      resetForm();
      setPreviewUrl(null);
      navigate(`/articles/${response.data._id}`);
      toast.success("Article successfully created!");
    } catch (error) {
      toast.error(error?.message || "Failed to create article");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => {
            const handleImageChange = async (event) => {
              const file = event.currentTarget.files[0];
              if (!file) return;

              setIsImageLoading(true);

              try {
                const resizedFile = await resizeImage(
                  file,
                  MAX_WIDTH,
                  MAX_HEIGHT
                );

                if (resizedFile.size > MAX_FILE_SIZE) {
                  toast.error("Image is too large even after resize");
                  setIsImageLoading(false);
                  return;
                }

                const preview = URL.createObjectURL(resizedFile);
                setFieldValue("image", resizedFile);
                setPreviewUrl(preview);
              } catch {
                toast.error("Failed to process image");
              } finally {
                setIsImageLoading(false);
              }
            };

            const handleInput = (event) => {
              const textarea = event.target;
              textarea.style.height = "auto";
              textarea.style.height = textarea.scrollHeight + "px";
              setFieldValue("text", textarea.value);
            };

            return (
              <Form className={css.form}>
                <h2 className={css.heading}>Create an article</h2>

                <div className={css.wrapper}>
                  <div className={css.imageWrapper}>
                    <label className={css.imageLabel}>
                      <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className={css.imageInput}
                      />

                      <div className={css.imagePreview}>
                        {isImageLoading ? (
                          <Loader />
                        ) : previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className={css.previewImage}
                          />
                        ) : (
                          <IconUploadFoto className={css.cameraIcon} />
                        )}
                      </div>
                    </label>

                    <p className={css.hint}>
                      JPG / PNG / WEBP · auto resize · max 2MB
                    </p>

                    <ErrorMessage
                      name="image"
                      component="div"
                      className={css.error}
                    />
                  </div>

                  <div className={css.inputsWrapper}>
                    <label className={css.label}>
                      Title
                      <Field
                        name="title"
                        placeholder="Enter the title"
                        className={css.input}
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className={css.error}
                      />
                    </label>
                  </div>

                  <label className={css.label}>
                    <textarea
                      name="text"
                      placeholder="Enter a text"
                      className={css.textarea}
                      ref={textRef}
                      value={values.text}
                      onInput={handleInput}
                    />
                    <ErrorMessage
                      name="text"
                      component="div"
                      className={css.error}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className={css.submitButton}
                  disabled={isLoading}
                >
                  Publish Article
                </button>
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
};
