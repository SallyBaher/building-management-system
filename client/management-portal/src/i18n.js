import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      brandName: "Smart Block Management",
      adminSetup: "Admin Setup",

      initialSetup: "Initial Setup",
      stepOf: "Step {{current}} of {{total}}",
      secureSetup: "Secure Setup",

      createYourBuilding: "Create Your Building",
      createBuildingSubtitle:
        "Set up your building and create your Super Admin account to get started.",

      buildingInformation: "Building Information",
      buildingInformationDescription:
        "Enter the physical and capacity details of the property.",

      buildingName: "Building Name",
      city: "City",
      address: "Address",
      numberOfFloors: "Number of Floors",
      numberOfApartments: "Number of Apartments",

      buildingNamePlaceholder: "e.g., Oceanview Tower",
      cityPlaceholder: "e.g., Cairo",
      addressPlaceholder: "e.g., 14 El-Tahrir St., Zamalek",
      floorsPlaceholder: "e.g., 12",
      apartmentsPlaceholder: "e.g., 48",

      floorsNote: "Can be set to 0 initially if configuring later.",
      apartmentsNote: "Can be set to 0 initially if units are unassigned.",

      optionalBuildingContactInformation:
        "Optional Building Contact Information",
      optional: "Optional",

      contactPhone: "Contact Phone",
      email: "Email",

      contactPhonePlaceholder: "e.g., +20 100 123 4567",
      emailPlaceholder: "e.g., management@oceanview.com",

      createSuperAdminAccount: "Create Super Admin Account",
      superAdminDescription:
        "Your account will have Super Admin access to manage the building.",

      fullName: "Full Name",
      idNumber: "ID Number",
      mobileNumber: "Mobile Number",
      username: "Username",
      password: "Password",

      fullNamePlaceholder: "e.g., Tamer Mansour",
      idNumberPlaceholder: "e.g., 29001011234567",
      mobileNumberPlaceholder: "e.g., +20 10 1234 5678",
      usernamePlaceholder: "Choose a username",
      passwordPlaceholder: "Enter a password",

      requiredFieldsNote: "Indicates mandatory fields.",

      createBuilding: "Create Building",

invalidFloors: "Number of floors must be 0 or greater.",
invalidApartments: "Number of apartments must be 0 or greater.",

creating: "Creating...",
setupAlreadyCompleted:
  "Initial building setup has already been completed.",

complianceNote:
  "Compliance verified for local condominium & HOA registries",
encryptedSetup: "256-bit Encrypted Setup",

footer: "© 2026 SBM. All rights reserved.",

      english: "EN",
      arabic: "AR"
    }
  },

  ar: {
    translation: {
      brandName: "إدارة المباني الذكية",
      adminSetup: "إعداد المسؤول",

      initialSetup: "الإعداد الأولي",
      stepOf: "الخطوة {{current}} من {{total}}",
      secureSetup: "إعداد آمن",

      createYourBuilding: "إنشاء المبنى",
      createBuildingSubtitle:
        "قم بإعداد المبنى وإنشاء حساب المسؤول الرئيسي للبدء.",

      buildingInformation: "معلومات المبنى",
      buildingInformationDescription:
        "أدخل البيانات الأساسية وتفاصيل سعة العقار.",

      buildingName: "اسم المبنى",
      city: "المدينة",
      address: "العنوان",
      numberOfFloors: "عدد الطوابق",
      numberOfApartments: "عدد الشقق",

      buildingNamePlaceholder: "مثال: برج أوشن فيو",
      cityPlaceholder: "مثال: القاهرة",
      addressPlaceholder: "مثال: 14 شارع التحرير، الزمالك",
      floorsPlaceholder: "مثال: 12",
      apartmentsPlaceholder: "مثال: 48",

      floorsNote: "يمكن إدخاله كـ 0 مبدئيًا إذا كنت ستقوم بالإعداد لاحقًا.",
      apartmentsNote:
        "يمكن إدخاله كـ 0 مبدئيًا إذا لم يتم تخصيص الوحدات بعد.",

      optionalBuildingContactInformation:
        "معلومات الاتصال الاختيارية بالمبنى",
      optional: "اختياري",

      contactPhone: "هاتف الاتصال",
      email: "البريد الإلكتروني",

      contactPhonePlaceholder: "مثال: ‎+20 100 123 4567‎",
      emailPlaceholder: "مثال: management@oceanview.com",

      createSuperAdminAccount: "إنشاء حساب المسؤول الرئيسي",
      superAdminDescription:
        "سيحصل حسابك على صلاحيات المسؤول الرئيسي لإدارة المبنى.",

      fullName: "الاسم الكامل",
      idNumber: "رقم الهوية",
      mobileNumber: "رقم الهاتف المحمول",
      username: "اسم المستخدم",
      password: "كلمة المرور",

      fullNamePlaceholder: "مثال: تامر منصور",
      idNumberPlaceholder: "مثال: 29001011234567",
     mobileNumberPlaceholder: "مثال: ‎+20 10 1234 5678‎",
      usernamePlaceholder: "اختر اسم مستخدم",
      passwordPlaceholder: "أدخل كلمة المرور",

      requiredFieldsNote: "تشير إلى الحقول الإلزامية.",

      createBuilding: "إنشاء المبنى",

invalidFloors: "يجب أن يكون عدد الطوابق صفرًا أو أكثر.",
invalidApartments: "يجب أن يكون عدد الشقق صفرًا أو أكثر.",

creating: "جارٍ الإنشاء...",
setupAlreadyCompleted:
  "تم إكمال الإعداد الأولي للمبنى بالفعل.",

complianceNote:
  "متوافق مع متطلبات سجلات الكمبوند واتحاد الملاك المحلية",
encryptedSetup: "إعداد مشفر بتقنية 256 بت",

footer: "© 2026 إس بي إم. جميع الحقوق محفوظة.",

      english: "الإنجليزية",
arabic: "العربية",
    }
  }
};

const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });

i18n.on("languageChanged", (language) => {
  localStorage.setItem("language", language);
});
export default i18n;
