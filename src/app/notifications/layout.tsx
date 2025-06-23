import Layout from "@/components/layout"
import Section from "@/components/section"

const NotifcationsLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Layout>
      <Section>{children}</Section>
    </Layout>
  )
}

export default NotifcationsLayout
