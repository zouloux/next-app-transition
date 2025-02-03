import { MainTemplate } from "@/components/MainTemplate"

export default async function page({ params }: any) {
	const { slug } = await params
	return <MainTemplate title={`/${slug}`} />
}
