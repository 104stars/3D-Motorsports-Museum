import { getTranslations } from "next-intl/server"
import AuthPage from "@/components/AuthPage"

export async function generateMetadata() {
  const t = await getTranslations("meta")
  return { title: t("loginTitle") }
}

export default function LoginPage() {
  return <AuthPage />
}
