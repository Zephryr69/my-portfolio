"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { FaWhatsapp, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import styles from "./page.module.css";
import { contact } from "@/lib/siteConfig";

interface FaqItem {
  question: string;
  answer: string;
}

export default function ContactView({ faqItems }: { faqItems: FaqItem[] }) {
  const t = useTranslations("ContactPage");
  const tFaq = useTranslations("ContactPage.faq");
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = {
    name: formData.name.trim() === "" ? t("errorRequired") : null,
    phone: formData.phone.trim() === "" ? t("errorRequired") : null,
    message: formData.message.trim() === "" ? t("errorRequired") : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // « Envoyer un autre message » : repart d'un formulaire vide (avant, les
  // anciennes valeurs restaient dans les champs).
  const handleSendAnother = () => {
    setFormData({ name: "", phone: "", message: "" });
    setTouched({});
    setStatus("idle");
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
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    // On ne peut pas savoir si l'utilisateur a réellement envoyé depuis son
    // client mail (mailto ne le confirme jamais) — on affiche quand même un
    // état de confirmation après un court délai, plus honnête qu'un silence total.
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <>
      <section className={styles.contactPage}>
      <div className={styles.infoPanel}>
        <h1 id="contact-title" className={styles.contactTitle}>
          {t("title")}
        </h1>
        <p className={styles.contactIntro}>{t("intro")}</p>

        <div className={styles.methodsList}>
          <a
            href={contact.whatsappUrl}
            className={styles.methodRow}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("whatsappLabel")}
          >
            <span className={`${styles.methodIcon} ${styles.whatsapp}`}>
              <FaWhatsapp aria-hidden="true" />
            </span>
            {t("whatsappLabel")}
          </a>
          <a href={contact.telHref} className={styles.methodRow}>
            <span className={`${styles.methodIcon} ${styles.phone}`}>
              <FaPhoneAlt aria-hidden="true" />
            </span>
            {contact.phoneDisplay}
          </a>
          <a href={`mailto:${contact.email}`} className={styles.methodRow}>
            <span className={`${styles.methodIcon} ${styles.email}`}>
              <FaEnvelope aria-hidden="true" />
            </span>
            {contact.email}
          </a>
        </div>

        <p className={styles.responseTime}>{t("responseTime")}</p>
      </div>

      <div className={styles.formPanel}>
        {status === "sent" ? (
          <div className={styles.sentPanel} role="status">
            <h3>{t("sentTitle")}</h3>
            <p>{t("sentText")}</p>
            <button type="button" className={styles.heroBtnSecondary} onClick={handleSendAnother}>
              {t("sendAnother")}
            </button>
          </div>
        ) : (
          <form
            className={styles.contactForm}
            aria-labelledby="contact-title"
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
              aria-describedby={touched.name && errors.name ? "name-error" : undefined}
            />
            {touched.name && errors.name && (
              <span id="name-error" className={styles.fieldError}>
                {errors.name}
              </span>
            )}

            <label htmlFor="phone">{t("phoneFieldLabel")}</label>
            <input
              id="phone"
              type="tel"
              placeholder="+229 XX XX XX XX"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, phone: true })}
              aria-invalid={touched.phone && !!errors.phone}
              aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
            />
            {touched.phone && errors.phone && (
              <span id="phone-error" className={styles.fieldError}>
                {errors.phone}
              </span>
            )}

            <label htmlFor="message">{t("messageLabel")}</label>
            <textarea
              id="message"
              placeholder={t("messagePlaceholder")}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, message: true })}
              aria-invalid={touched.message && !!errors.message}
              aria-describedby={touched.message && errors.message ? "message-error" : undefined}
            />
            {touched.message && errors.message && (
              <span id="message-error" className={styles.fieldError}>
                {errors.message}
              </span>
            )}

            <button type="submit" className={styles.heroBtnSecondary} disabled={status === "sending"}>
              {status === "sending" ? t("sendingLabel") : t("submitLabel")}
            </button>
          </form>
        )}
      </div>
      </section>

      {/* <details>/<summary> natif plutôt qu'un accordéon fait main :
          accessible et navigable au clavier par défaut, sans state React
          ni gestion ARIA à écrire — le navigateur s'en charge. */}
      <section className={styles.faqSection} aria-labelledby="faq-title">
        <h2 id="faq-title" className={styles.faqTitle}>
          {tFaq("title")}
        </h2>
        <div className={styles.faqList}>
          {faqItems.map((item, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{item.question}</summary>
              <p className={styles.faqAnswer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
