import ProductDetailShell from '@/components/ProductDetailShell';

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetailShell slug={params.slug} />;
}
