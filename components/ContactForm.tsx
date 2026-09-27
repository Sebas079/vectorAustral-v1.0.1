"use client";

import { type FormEvent, useState } from "react";
import { z } from "zod";

import TurnstileWidget from "@/components/TurnstileWidget";
import {
  leadLookupSchema,
  leadSubmissionSchema,
  type LeadInput,
} from "@/lib/validators/leadSchema";

type FormValues = LeadInput;
type FormErrors = Partial<Record<keyof FormValues | "captchaToken", string>>;
type FormStatus = "idle" | "loading" | "success" | "error";

const initialValues: FormValues = {
  fullName: "",
  phone: "",
  email: "",
  reason: "",
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

async function readResponse(response: Response): Promise<unknown> {
  const payload: unknown = await response.json();
  return payload;
}

const apiResponseSchema = z.object({
  error: z.string().optional(),
  match: z.boolean().optional(),
  fullName: z.string().optional(),
  retryAfterSeconds: z.number().optional(),
});

async function readApiResponse(response: Response) {
  const payload = await readResponse(response);
  const parsed = apiResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Respuesta inválida del servidor.");
  }
  return parsed.data;
}

function ContactAlternatives() {
  return (
    <p>
      También podés escribirnos por{" "}
      {whatsappNumber ? (
        <a
          className="font-semibold underline"
          href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
        >
          WhatsApp
        </a>
      ) : null}{" "}
      {contactEmail ? (
        <>
          o por{" "}
          <a
            className="font-semibold underline"
            href={`mailto:${contactEmail}`}
          >
            email
          </a>
        </>
      ) : null}
      .
    </p>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [captchaRetryKey, setCaptchaRetryKey] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [recognizedLead, setRecognizedLead] = useState(false);
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "found" | "not_found" | "error"
  >("idle");

  const resetCaptcha = () => {
    setCaptchaToken("");
    setCaptchaResetKey((key) => key + 1);
  };

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(recognizedLead && (field === "email" || field === "phone")
        ? { fullName: "" }
        : {}),
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
    setErrorMessage("");

    if (field === "email" || field === "phone") {
      setLookupStatus("idle");
      setRecognizedLead(false);
    }
  };

  const handleLookup = async () => {
    const validation = leadLookupSchema.safeParse({
      email: values.email,
      phone: values.phone,
      captchaToken,
    });

    if (!validation.success) {
      setErrors(
        validation.error.issues.reduce<FormErrors>((current, issue) => {
          const field = issue.path[0];
          if (
            field === "email" ||
            field === "phone" ||
            field === "captchaToken"
          ) {
            current[field] ??= issue.message;
          }
          return current;
        }, {}),
      );
      return;
    }

    setErrors({});
    setLookupStatus("loading");
    try {
      const response = await fetch("/api/leads/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const payload = await readApiResponse(response);

      if (!response.ok) {
        setLookupStatus("error");
        setErrorMessage(
          payload.error === "verification_unavailable"
            ? "No pudimos validar la verificación. Volvé a intentarlo."
            : "No pudimos buscar tus datos. Volvé a intentarlo.",
        );
        return;
      }

      const matchedFullName = payload.fullName;
      if (payload.match === true && typeof matchedFullName === "string") {
        setValues((current) => ({ ...current, fullName: matchedFullName }));
        setRecognizedLead(true);
        setLookupStatus("found");
      } else {
        setRecognizedLead(false);
        setLookupStatus("not_found");
      }
    } catch {
      setLookupStatus("error");
      setErrorMessage("No pudimos buscar tus datos. Volvé a intentarlo.");
    } finally {
      resetCaptcha();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    if (lookupStatus === "loading") {
      return;
    }

    if (honeypot.trim()) {
      setStatus("error");
      setErrorMessage("No se pudo validar el envío. Volvé a intentar.");
      return;
    }

    const validation = leadSubmissionSchema.safeParse({
      ...values,
      captchaToken,
      honeypot,
    });

    if (!validation.success) {
      setErrors(
        validation.error.issues.reduce<FormErrors>((current, issue) => {
          const field = issue.path[0];
          if (
            typeof field === "string" &&
            ["fullName", "phone", "email", "reason", "captchaToken"].includes(
              field,
            )
          ) {
            current[field as keyof FormErrors] ??= issue.message;
          }
          return current;
        }, {}),
      );
      return;
    }

    setErrors({});
    setStatus("loading");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const payload = await readApiResponse(response);

      if (response.status === 429) {
        setStatus("error");
        setErrorMessage(
          `Esperá ${payload.retryAfterSeconds ?? 10} segundos antes de volver a enviar.`,
        );
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          payload.error === "contact_conflict"
            ? "El email y el teléfono corresponden a consultas distintas. Contactanos para revisar tus datos."
            : payload.error === "verification_unavailable" ||
                payload.error === "verification_failed"
              ? "No pudimos validar la verificación. Volvé a intentarlo."
              : "Tuvimos un problema, volvé a intentar más tarde.",
        );
        if (
          payload.error === "verification_unavailable" ||
          payload.error === "verification_failed"
        ) {
          setErrors((current) => ({
            ...current,
            captchaToken:
              "La verificación no se pudo validar. Volvé a intentarlo.",
          }));
        }
        return;
      }

      setStatus("success");
      setValues(initialValues);
      setRecognizedLead(false);
      setHoneypot("");
      setLookupStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Tuvimos un problema, volvé a intentar más tarde.");
    } finally {
      resetCaptcha();
    }
  };

  return (
    <section
      id="contacto"
      aria-labelledby="contact-form-title"
      className="w-full border-t border-white/10 bg-abyss px-6 py-20 text-slate-100"
    >
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="mb-4 text-sm font-semibold text-volt">
            Diagnóstico Inicial
          </p>
          <h2
            id="contact-form-title"
            className="max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            El primer paso es entender si realmente lo necesitás.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-slate-300">
            Contanos qué proceso querés mejorar. Un especialista revisará el
            contexto y te responderá con una hoja de ruta clara.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-white/10 bg-graphite/40 p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="fullName"
              label="Nombre"
              value={values.fullName}
              error={errors.fullName}
              onChange={(value) => updateValue("fullName", value)}
            />
            <Field
              id="phone"
              label="Teléfono"
              type="tel"
              value={values.phone}
              error={errors.phone}
              disabled={lookupStatus === "loading"}
              onChange={(value) => updateValue("phone", value)}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={values.email}
              error={errors.email}
              disabled={lookupStatus === "loading"}
              onChange={(value) => updateValue("email", value)}
            />
            <div className="sm:col-span-2">
              <label
                htmlFor="reason"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                ¿Qué necesitás mejorar?
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={4}
                value={values.reason}
                onChange={(event) => updateValue("reason", event.target.value)}
                aria-invalid={Boolean(errors.reason)}
                aria-describedby={errors.reason ? "reason-error" : undefined}
                className="w-full resize-y rounded-xl border border-white/15 bg-navy px-4 py-3 text-sm text-white outline-none transition focus:border-volt focus:ring-2 focus:ring-volt/30"
              />
              {errors.reason ? (
                <p id="reason-error" className="mt-2 text-sm text-rose-300">
                  {errors.reason}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <TurnstileWidget
              resetKey={captchaResetKey}
              retryKey={captchaRetryKey}
              onToken={(token) => {
                setCaptchaToken(token);
                setStatus("idle");
                setErrorMessage("");
                setErrors((current) => ({
                  ...current,
                  captchaToken: undefined,
                }));
              }}
              onError={() => {
                setCaptchaToken("");
                setStatus("error");
                setErrorMessage(
                  "La verificación venció o no está disponible. Volvé a intentarlo.",
                );
                setErrors((current) => ({
                  ...current,
                  captchaToken: "La verificación venció o no está disponible.",
                }));
              }}
            />
            {errors.captchaToken ? (
              <div role="alert" className="space-y-2 text-sm text-rose-300">
                <p>{errors.captchaToken}</p>
                <button
                  type="button"
                  onClick={() => {
                    setErrors((current) => ({
                      ...current,
                      captchaToken: undefined,
                    }));
                    setStatus("idle");
                    setErrorMessage("");
                    setCaptchaRetryKey((key) => key + 1);
                    resetCaptcha();
                  }}
                  className="font-semibold underline focus:outline-none focus:ring-2 focus:ring-volt"
                >
                  Volver a verificar
                </button>
                <ContactAlternatives />
              </div>
            ) : null}
            <button
              type="button"
              disabled={!captchaToken || lookupStatus === "loading"}
              onClick={handleLookup}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-volt/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-volt disabled:cursor-not-allowed disabled:opacity-50"
            >
              {lookupStatus === "loading"
                ? "Buscando..."
                : "¿Ya enviaste una consulta? Buscar mis datos"}
            </button>
            {lookupStatus === "found" ? (
              <p role="status" className="text-sm text-emerald-300">
                Encontramos tus datos. Revisalos y completá la nueva consulta.
              </p>
            ) : null}
            {lookupStatus === "not_found" ? (
              <p role="status" className="text-sm text-slate-300">
                No encontramos una consulta anterior con esos datos.
              </p>
            ) : null}
            {lookupStatus === "error" ? (
              <div role="alert" className="space-y-2 text-sm text-rose-300">
                <p>{errorMessage}</p>
                <ContactAlternatives />
              </div>
            ) : null}
          </div>

          <label
            htmlFor="website"
            aria-hidden="true"
            className="absolute -left-[9999px] h-px w-px overflow-hidden"
          >
            Sitio web
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </label>

          {status === "success" ? (
            <p role="status" className="mt-5 text-sm text-emerald-300">
              Recibimos tu consulta. En breve nos pondremos en contacto.
            </p>
          ) : null}
          {status === "error" ? (
            <div role="alert" className="mt-5 space-y-2 text-sm text-rose-300">
              <p>{errorMessage}</p>
              <ContactAlternatives />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading" || lookupStatus === "loading"}
            className="mt-7 w-full rounded-xl bg-volt px-5 py-3.5 font-semibold text-navy transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-volt focus:ring-offset-2 focus:ring-offset-graphite disabled:cursor-wait disabled:opacity-60"
          >
            {status === "loading"
              ? "Enviando consulta..."
              : "Solicitar Diagnóstico Inicial"}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Sin compromiso. Analizamos la viabilidad técnica de tu proyecto.
          </p>
        </form>
      </div>
    </section>
  );
}

interface FieldProps {
  id: keyof FormValues;
  label: string;
  type?: "text" | "tel" | "email";
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function Field({
  id,
  label,
  type = "text",
  value,
  error,
  disabled = false,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-200"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border border-white/15 bg-navy px-4 py-3 text-sm text-white outline-none transition focus:border-volt focus:ring-2 focus:ring-volt/30"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
