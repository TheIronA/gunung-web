"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Contact() {
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      organization: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      organization: Yup.string(),
      message: Yup.string()
        .min(25, "Must be at least 25 characters")
        .required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        // Send to our API route
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setShowMessage(true);
          resetForm();
          setTimeout(() => {
            setShowMessage(false);
          }, 5000);
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <section id="contact" className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <span className="font-mono text-xs tracking-wider text-accent font-medium mb-4 block">GET IN TOUCH</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 leading-tight">
              Let's build something together
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Interested in collaborating, connecting with Malaysia's climbing community, or just want to chat about the scene? Reach out and let's connect.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent border border-primary rounded flex items-center justify-center flex-shrink-0 shadow-brutal-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold font-heading mb-1">Email</h3>
                  <a href="mailto:admin@gunungclimbing.my" className="text-accent hover:text-accent-dark transition-colors font-mono">
                    admin@gunungclimbing.my
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-dark border border-primary rounded flex items-center justify-center flex-shrink-0 shadow-brutal-sm">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold font-heading mb-1">Instagram</h3>
                  <a href="https://instagram.com/gunungclimbing" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-dark transition-colors font-mono">
                    @gunungclimbing
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-dark border border-primary rounded flex items-center justify-center flex-shrink-0 shadow-brutal-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold font-heading mb-1">Based in</h3>
                  <p className="text-gray-600">Malaysia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg border border-border rounded p-8 lg:p-10 shadow-brutal-lg">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary mb-2 font-heading">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...formik.getFieldProps("name")}
                  className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition-all duration-200 bg-white ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-border focus:border-accent focus:ring-accent/50"
                  }`}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary mb-2 font-heading">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...formik.getFieldProps("email")}
                  className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition-all duration-200 bg-white ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-border focus:border-accent focus:ring-accent/50"
                  }`}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-primary mb-2 font-heading">
                  Organization (Optional)
                </label>
                <input
                  type="text"
                  id="organization"
                  {...formik.getFieldProps("organization")}
                  className="w-full px-4 py-3 border border-border rounded focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary mb-2 font-heading">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...formik.getFieldProps("message")}
                  className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 transition-all duration-200 resize-none bg-white ${
                    formik.touched.message && formik.errors.message
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-border focus:border-accent focus:ring-accent/50"
                  }`}
                ></textarea>
                {formik.touched.message && formik.errors.message ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent text-white px-6 py-3 border border-accent rounded shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold font-heading text-lg btn-hover disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>

            {showMessage && (
              <div className="mt-4 p-4 rounded border border-accent-dark bg-accent-dark/10 text-accent-dark">
                Thanks for reaching out! We'll get back to you soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
