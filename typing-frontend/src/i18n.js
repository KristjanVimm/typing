import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "cart-empty": "Cart is empty",
      "nav": {
        "login": "Login",
        "logout": "Log out",
        "signup": "Sign up",
        "signout": "Sign out",
        "profile": "Profile",
        "preference": "Preferences",
        "typing": "Type",
        "lesson-text": "Choose text",
        "prev-lessons": "Previous lessons",
        "email": "Email",
        "password": "Password",
        "firstname": "First name",
        "lastname": "Last name",
        "textsize": "Text size",
        "wordsonpage": "Words on page",
        "overallspeed": "Overall speed",
        "overallaccuracy": "Overall accuracy",
        "lessontext": "Lesson text",
        "bookmark": "Bookmark (characters)",
        "continuethis": "Continue this lesson",
        "title": "Title",
        "author": "Author",
        "difficutly": "Difficulty",
        "startnewlesson": "Start a new lesson",
        "typerandom": "Type random words",
        "choosebook": "Choose a book to type",
        "enteryourtext": "Enter your custom text"
      }
    }
  },
  et: {
    translation: {
      "cart-empty": "Ostukorv on tühi",
      "nav": {
        "login": "Logi sisse",
        "logout": "Logi välja",
        "signup": "Loo konto",
        "signout": "Logi välja",
        "profile": "Konto",
        "preference": "Seaded",
        "typing": "Trüki",
        "lesson-text": "Vali tekst",
        "prev-lessons": "Eelmised harjutused",
        "email": "Email",
        "password": "Parool",
        "firstname": "Eesnimi",
        "lastname": "Perekonnanimi",
        "textsize": "Teksti suurus",
        "wordsonpage": "Sõnu igal lehel",
        "overallspeed": "Keskmine kiirus",
        "overallaccuracy": "Keskmine täpsus",
        "lessontext": "Harjutuse tekst",
        "bookmark": "Järjehoidja (sümbolit)",
        "continuethis": "Jätka seda harjutust",
        "title": "Pealkiri",
        "author": "Autor",
        "difficutly": "Raskustase",
        "startnewlesson": "Alusta uut harjutust",
        "typerandom": "Trüki suvalisi sõnu",
        "choosebook": "Vali raamatute vahel",
        "enteryourtext": "Sisesta enda tekst"
      }
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("language") || "et", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;