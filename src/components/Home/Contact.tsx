"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { FaWhatsapp, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import styles from "./page.module.css";

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = {
    name: formData.name.trim() === "" ? t("errorRequired") : null,
    phone: formData.phone.trim() === "" ? t("errorRequired") : null,
    message: formData.message.trim() === "" ? t("errorRequired") : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, message: true });
    if (hasErrors) return;

    setStatus("sending");
    const subject = encodeURIComponent(t("mailSubject"));
    const body = encodeURIComponent(
      `${t("mailName")}: ${formData.name}\n${t("mailWhatsapp")}: ${formData.phone}\n\n${t("mailMessage")}:\n${formData.message}`
    );
    window.location.href = `mailto:amandinoaiminasso@gmail.com?subject=${subject}&body=${body}`;

    // On ne peut pas savoir si l'utilisateur a réellement envoyé depuis son
    // client mail (mailto ne le confirme jamais) — on affiche quand même un
    // état de confirmation après un court délai, plus honnête qu'un silence total.
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <section className={styles.contactPage} aria-labelledby="contact-title">
      <header className={styles.contactHeader}>
        <h1 id="contact-title" className={styles.contactTitle}>
          <FaEnvelope aria-hidden="true" />
          {t("title")}
        </h1>
        <p className={styles.contactIntro}>{t("intro")}</p>
      </header>

      <div className={styles.contactMethods}>
        <a
          href="https://wa.me/2290169118745"
          className={`${styles.contactCard} ${styles.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("whatsappLabel")}
        >
          <FaWhatsapp className={styles.icon} aria-hidden="true" /> {t("whatsappLabel")}
        </a>
        <a href="tel:+2290169118745" className={`${styles.contactCard} ${styles.phone}`}>
          <FaPhoneAlt className={styles.icon} aria-hidden="true" /> +229 01 69 11 87 45
        </a>
        <a href="mailto:amandinoaiminasso@gmail.com" className={`${styles.contactCard} ${styles.email}`}>
          <FaEnvelope className={styles.icon} aria-hidden="true" /> amandinoaiminasso@gmail.com
        </a>
      </div>

      {status === "sent" ? (
        <div className={`${styles.contactForm} ${styles.glassmorphic} ${styles.sentPanel}`} role="status">
          <h3>{t("sentTitle")}</h3>
          <p>{t("sentText")}</p>
          <button type="button" className={styles.heroBtnSecondary} onClick={() => setStatus("idle")}>
            {t("sendAnother")}
          </button>
        </div>
      ) : (
        <form
          className={`${styles.contactForm} ${styles.glassmorphic}`}
          aria-label={t("formAriaLabel")}
          onSubmit={handleSubmit}
          noValidate
        >
          <label htmlFor="name">{t("nameLabel")}</label>
          <input
            id="name"
            type="text"
            placeholder={t("namePlaceholder")}
            value={formData.name}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, name: true })}
            aria-invalid={touched.name && !!errors.name}
          />
          {touched.name && errors.name && <span className={styles.fieldError}>{errors.name}</span>}

          <label htmlFor="phone">{t("phoneFieldLabel")}</label>
          <input
            id="phone"
            type="tel"
            placeholder="+229 XX XX XX XX"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, phone: true })}
            aria-invalid={touched.phone && !!errors.phone}
          />
          {touched.phone && errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}

          <label htmlFor="message">{t("messageLabel")}</label>
          <textarea
            id="message"
            placeholder={t("messagePlaceholder")}
            rows={5}
            value={formData.message}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, message: true })}
            aria-invalid={touched.message && !!errors.message}
          />
          {touched.message && errors.message && <span className={styles.fieldError}>{errors.message}</span>}

          <button type="submit" className={styles.heroBtnSecondary} disabled={status === "sending"}>
            {status === "sending" ? t("sendingLabel") : t("submitLabel")}
          </button>
        </form>
      )}
    </section>
  );
}
