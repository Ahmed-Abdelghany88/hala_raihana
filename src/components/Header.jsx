import React from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header
      style={{
        padding: "1rem",
        backgroundColor: "#f3f4f6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{t("welcome")}</h1>
    </header>
  );
}
